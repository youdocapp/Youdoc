from django.contrib import admin
from .models import Article, ArticleCategory, Author, ArticleBookmark, ArticleView, ArticleLike, ArticleComment, CommentLike


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'user', 'created_at']
    list_filter = ['title', 'created_at']
    search_fields = ['name', 'title', 'bio']
    ordering = ['name']


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'featured', 'published_date', 'created_at']
    list_filter = ['category', 'featured', 'published_date', 'created_at']
    search_fields = ['title', 'description', 'content', 'author__name']
    ordering = ['-published_date']
    date_hierarchy = 'published_date'
    filter_horizontal = []
    readonly_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'author')
        }),
        ('Content', {
            'fields': ('content', 'image', 'read_time')
        }),
        ('Publishing', {
            'fields': ('featured', 'published_date')
        }),
        ('Metadata', {
            'fields': ('id', 'slug', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ArticleBookmark)
class ArticleBookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'article', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'article__title']
    ordering = ['-created_at']


@admin.register(ArticleView)
class ArticleViewAdmin(admin.ModelAdmin):
    list_display = ['article', 'user', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['article__title', 'user__username', 'ip_address']
    ordering = ['-viewed_at']
    date_hierarchy = 'viewed_at'


@admin.register(ArticleLike)
class ArticleLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'article', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'article__title']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'


@admin.register(ArticleComment)
class ArticleCommentAdmin(admin.ModelAdmin):
    list_display = ['article', 'user', 'text_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['article__title', 'user__username', 'text']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Text Preview'


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'comment', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'comment__text']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'