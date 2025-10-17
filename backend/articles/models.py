from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class ArticleCategory(models.Model):
    """Categories for health articles"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#4F7FFF')  # Hex color for UI
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Article Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Author(models.Model):
    """Authors for health articles"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=100, blank=True)  # e.g., "Dr.", "MD", "RN"
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='authors/avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.title} {self.name}" if self.title else self.name


class Article(models.Model):
    """Health articles model matching frontend expectations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    description = models.TextField()
    category = models.ForeignKey(ArticleCategory, on_delete=models.CASCADE, related_name='articles')
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='articles')
    content = models.TextField()
    image = models.ImageField(upload_to='articles/images/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    published_date = models.DateTimeField(default=timezone.now)
    read_time = models.CharField(max_length=20, default='5 min read')  # Estimated read time
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_date']
        indexes = [
            models.Index(fields=['featured', '-published_date']),
            models.Index(fields=['category', '-published_date']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ArticleBookmark(models.Model):
    """User bookmarks for articles"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='article_bookmarks')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'article']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.article.title}"


class ArticleView(models.Model):
    """Track article views for analytics"""
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-viewed_at']
        indexes = [
            models.Index(fields=['article', '-viewed_at']),
        ]
    
    def __str__(self):
        return f"View of {self.article.title} at {self.viewed_at}"