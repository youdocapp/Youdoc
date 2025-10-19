from rest_framework import serializers
from .models import Article, ArticleCategory, Author, ArticleBookmark, ArticleView, ArticleLike, ArticleComment, CommentLike


class ArticleCategorySerializer(serializers.ModelSerializer):
    """Serializer for article categories"""
    count = serializers.SerializerMethodField()
    
    class Meta:
        model = ArticleCategory
        fields = ['id', 'name', 'description', 'color', 'count']
    
    def get_count(self, obj):
        return obj.articles.count()


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for authors"""
    
    class Meta:
        model = Author
        fields = ['id', 'name', 'title', 'bio', 'avatar']


class ArticleListSerializer(serializers.ModelSerializer):
    """Optimized serializer for article listing"""
    category = ArticleCategorySerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    is_bookmarked = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'description', 'category', 'author', 
            'image', 'featured', 'published_date', 'read_time', 
            'is_bookmarked', 'is_liked', 'like_count', 'comment_count'
        ]
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_comment_count(self, obj):
        return obj.comments.count()


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Full serializer for article details"""
    category = ArticleCategorySerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    is_bookmarked = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'description', 'category', 'author', 'content',
            'image', 'featured', 'published_date', 'read_time', 'slug',
            'created_at', 'updated_at', 'is_bookmarked', 'is_liked', 
            'like_count', 'comment_count', 'view_count'
        ]
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_comment_count(self, obj):
        return obj.comments.count()
    
    def get_view_count(self, obj):
        return obj.views.count()


class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating articles"""
    
    class Meta:
        model = Article
        fields = [
            'title', 'description', 'category', 'author', 'content',
            'image', 'featured', 'published_date', 'read_time'
        ]
    
    def create(self, validated_data):
        # Set the author to the current user if not specified
        request = self.context.get('request')
        if request and request.user.is_authenticated and 'author' not in validated_data:
            author, created = Author.objects.get_or_create(
                user=request.user,
                defaults={'name': request.user.get_full_name() or request.user.username}
            )
            validated_data['author'] = author
        
        return super().create(validated_data)


class ArticleBookmarkSerializer(serializers.ModelSerializer):
    """Serializer for article bookmarks"""
    article = ArticleListSerializer(read_only=True)
    
    class Meta:
        model = ArticleBookmark
        fields = ['id', 'article', 'created_at']


class ArticleSearchSerializer(serializers.Serializer):
    """Serializer for article search parameters"""
    query = serializers.CharField(max_length=200, required=False)
    category = serializers.CharField(max_length=100, required=False)
    author = serializers.CharField(max_length=200, required=False)
    featured = serializers.BooleanField(required=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    ordering = serializers.ChoiceField(
        choices=['-published_date', 'published_date', '-created_at', 'created_at', 'title'],
        default='-published_date',
        required=False
    )


class CommentLikeSerializer(serializers.ModelSerializer):
    """Serializer for comment likes"""
    
    class Meta:
        model = CommentLike
        fields = ['id', 'created_at']


class ArticleCommentSerializer(serializers.ModelSerializer):
    """Serializer for article comments"""
    user = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ArticleComment
        fields = [
            'id', 'text', 'user', 'created_at', 'updated_at', 
            'is_liked', 'like_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'name': obj.user.get_full_name() or obj.user.username,
            'avatar': None  # Add avatar field if you have user avatars
        }
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_like_count(self, obj):
        return obj.likes.count()


class ArticleCommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating article comments"""
    
    class Meta:
        model = ArticleComment
        fields = ['text']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['article'] = self.context['article']
        return super().create(validated_data)


class ArticleLikeSerializer(serializers.ModelSerializer):
    """Serializer for article likes"""
    
    class Meta:
        model = ArticleLike
        fields = ['id', 'created_at']
