from django.urls import path
from . import views

urlpatterns = [
    # Article endpoints
    path('', views.ArticleListCreateView.as_view(), name='article-list-create'),
    path('<uuid:id>/', views.ArticleDetailView.as_view(), name='article-detail'),
    path('featured/', views.FeaturedArticlesView.as_view(), name='featured-articles'),
    path('search/', views.search_articles, name='article-search'),
    path('<uuid:article_id>/bookmark/', views.toggle_article_bookmark, name='toggle-article-bookmark'),
    path('bookmarked/', views.user_bookmarked_articles, name='user-bookmarked-articles'),
    
    # Category and author endpoints
    path('categories/', views.ArticleCategoriesView.as_view(), name='article-categories'),
    path('authors/', views.AuthorsView.as_view(), name='authors'),
]
