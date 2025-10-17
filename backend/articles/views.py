from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import Article, ArticleCategory, Author, ArticleBookmark, ArticleView
from .serializers import (
    ArticleListSerializer, ArticleDetailSerializer, ArticleCreateUpdateSerializer,
    ArticleCategorySerializer, AuthorSerializer, ArticleBookmarkSerializer,
    ArticleSearchSerializer
)


class ArticleListCreateView(generics.ListCreateAPIView):
    """List and create articles"""
    queryset = Article.objects.select_related('category', 'author').prefetch_related('bookmarks')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'author', 'featured']
    search_fields = ['title', 'description', 'content', 'author__name']
    ordering_fields = ['published_date', 'created_at', 'title']
    ordering = ['-published_date']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ArticleCreateUpdateSerializer
        return ArticleListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date range if provided
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(published_date__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(published_date__date__lte=date_to)
        
        return queryset


class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an article"""
    queryset = Article.objects.select_related('category', 'author').prefetch_related('bookmarks', 'views')
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ArticleCreateUpdateSerializer
        return ArticleDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Track article view when retrieving"""
        instance = self.get_object()
        
        # Track view
        ArticleView.objects.create(
            article=instance,
            user=request.user if request.user.is_authenticated else None,
            ip_address=self.get_client_ip(request)
        )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class FeaturedArticlesView(generics.ListAPIView):
    """Get featured articles"""
    serializer_class = ArticleListSerializer
    queryset = Article.objects.filter(featured=True).select_related('category', 'author').prefetch_related('bookmarks')
    ordering = ['-published_date']


class ArticleCategoriesView(generics.ListAPIView):
    """Get all article categories"""
    serializer_class = ArticleCategorySerializer
    queryset = ArticleCategory.objects.all()


class AuthorsView(generics.ListAPIView):
    """Get all authors"""
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_article_bookmark(request, article_id):
    """Toggle bookmark for an article"""
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)
    
    bookmark, created = ArticleBookmark.objects.get_or_create(
        user=request.user,
        article=article
    )
    
    if request.method == 'DELETE' or not created:
        bookmark.delete()
        return Response({'bookmarked': False})
    
    return Response({'bookmarked': True})


@api_view(['GET'])
def search_articles(request):
    """Advanced article search"""
    serializer = ArticleSearchSerializer(data=request.query_params)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    queryset = Article.objects.select_related('category', 'author').prefetch_related('bookmarks')
    
    # Apply filters
    if data.get('query'):
        query = data['query']
        queryset = queryset.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(content__icontains=query) |
            Q(author__name__icontains=query)
        )
    
    if data.get('category'):
        queryset = queryset.filter(category__name__icontains=data['category'])
    
    if data.get('author'):
        queryset = queryset.filter(author__name__icontains=data['author'])
    
    if data.get('featured') is not None:
        queryset = queryset.filter(featured=data['featured'])
    
    if data.get('date_from'):
        queryset = queryset.filter(published_date__date__gte=data['date_from'])
    
    if data.get('date_to'):
        queryset = queryset.filter(published_date__date__lte=data['date_to'])
    
    # Apply ordering
    ordering = data.get('ordering', '-published_date')
    queryset = queryset.order_by(ordering)
    
    serializer = ArticleListSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookmarked_articles(request):
    """Get user's bookmarked articles"""
    bookmarks = ArticleBookmark.objects.filter(user=request.user).select_related('article__category', 'article__author')
    articles = [bookmark.article for bookmark in bookmarks]
    serializer = ArticleListSerializer(articles, many=True, context={'request': request})
    return Response(serializer.data)