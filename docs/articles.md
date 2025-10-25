# Articles API Documentation

## Overview
The Articles API provides comprehensive functionality for managing health articles, including content management, user interactions (likes, bookmarks, comments), and advanced search capabilities. This API supports a full-featured article system with categories, authors, and social features.

## Base URL
```
https://youdoc.onrender.com/api/articles/
```

## Authentication
Most endpoints require JWT authentication for user-specific actions (bookmarks, likes, comments). Public endpoints (article listing, details) work without authentication.

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. List Articles
**GET** `/`

Get all articles with optional filtering, searching, and ordering.

#### Query Parameters
- `category` (string): Filter by category name
- `author` (string): Filter by author name
- `featured` (boolean): Filter featured articles
- `date_from` (string): Filter articles from date (YYYY-MM-DD)
- `date_to` (string): Filter articles to date (YYYY-MM-DD)
- `search` (string): Search in title, description, content, and author name
- `ordering` (string): Order by field ("published_date", "-published_date", "title", etc.)

#### Example Request
```
GET /api/articles/?category=nutrition&featured=true&search=diabetes
```

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "title": "Understanding Type 2 Diabetes",
    "description": "A comprehensive guide to managing Type 2 diabetes through lifestyle changes and medication.",
    "category": {
      "id": 1,
      "name": "Diabetes",
      "description": "Articles about diabetes management",
      "color": "#4F7FFF",
      "count": 15
    },
    "author": {
      "id": 1,
      "name": "Dr. Sarah Johnson",
      "title": "MD",
      "bio": "Endocrinologist with 15 years of experience",
      "avatar": "https://res.cloudinary.com/example/image/upload/v1234567890/avatar.jpg"
    },
    "image": "https://res.cloudinary.com/example/image/upload/v1234567890/article.jpg",
    "featured": true,
    "published_date": "2024-01-15T10:30:00Z",
    "read_time": "8 min read",
    "is_bookmarked": false,
    "is_liked": true,
    "like_count": 42,
    "comment_count": 8
  }
]
```

---

### 2. Get Article Details
**GET** `/{article_id}/`

Get detailed information about a specific article. This endpoint automatically tracks article views.

#### Success Response (200)
```json
{
  "id": "uuid-here",
  "title": "Understanding Type 2 Diabetes",
  "description": "A comprehensive guide to managing Type 2 diabetes through lifestyle changes and medication.",
  "category": {
    "id": 1,
    "name": "Diabetes",
    "description": "Articles about diabetes management",
    "color": "#4F7FFF",
    "count": 15
  },
  "author": {
    "id": 1,
    "name": "Dr. Sarah Johnson",
    "title": "MD",
    "bio": "Endocrinologist with 15 years of experience",
    "avatar": "https://res.cloudinary.com/example/image/upload/v1234567890/avatar.jpg"
  },
  "content": "<p>Type 2 diabetes is a chronic condition that affects how your body processes blood sugar...</p>",
  "image": "https://res.cloudinary.com/example/image/upload/v1234567890/article.jpg",
  "featured": true,
  "published_date": "2024-01-15T10:30:00Z",
  "read_time": "8 min read",
  "slug": "understanding-type-2-diabetes",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "is_bookmarked": false,
  "is_liked": true,
  "like_count": 42,
  "comment_count": 8,
  "view_count": 156
}
```

---

### 3. Create Article
**POST** `/`

Create a new article (admin/author access required).

#### Request Body (multipart/form-data)
```
title: "New Health Article"
description: "Brief description of the article"
category: 1
content: "Full article content in HTML format"
image: [file upload]
featured: true
read_time: "5 min read"
```

#### Required Fields
- `title` (string): Article title
- `description` (string): Article description
- `category` (integer): Category ID
- `content` (string): Article content (HTML format)

#### Optional Fields
- `author` (integer): Author ID (defaults to current user)
- `image` (file): Article image
- `featured` (boolean): Whether article is featured
- `read_time` (string): Estimated read time
- `published_date` (string): Publication date

#### Success Response (201)
```json
{
  "id": "uuid-here",
  "title": "New Health Article",
  "description": "Brief description of the article",
  "category": {
    "id": 1,
    "name": "Nutrition",
    "description": "Articles about nutrition",
    "color": "#4F7FFF",
    "count": 20
  },
  "author": {
    "id": 2,
    "name": "Dr. John Smith",
    "title": "MD",
    "bio": "Nutritionist and wellness expert",
    "avatar": null
  },
  "content": "<p>Full article content...</p>",
  "image": "https://res.cloudinary.com/example/image/upload/v1234567890/new-article.jpg",
  "featured": true,
  "published_date": "2024-01-17T14:20:00Z",
  "read_time": "5 min read",
  "slug": "new-health-article",
  "created_at": "2024-01-17T14:20:00Z",
  "updated_at": "2024-01-17T14:20:00Z"
}
```

---

### 4. Update Article
**PUT/PATCH** `/{article_id}/`

Update an existing article.

#### Request Body (PATCH - partial update)
```json
{
  "title": "Updated Article Title",
  "featured": false,
  "read_time": "10 min read"
}
```

#### Success Response (200)
```json
{
  "id": "uuid-here",
  "title": "Updated Article Title",
  "description": "Brief description of the article",
  "category": {
    "id": 1,
    "name": "Nutrition",
    "description": "Articles about nutrition",
    "color": "#4F7FFF",
    "count": 20
  },
  "author": {
    "id": 2,
    "name": "Dr. John Smith",
    "title": "MD",
    "bio": "Nutritionist and wellness expert",
    "avatar": null
  },
  "content": "<p>Full article content...</p>",
  "image": "https://res.cloudinary.com/example/image/upload/v1234567890/new-article.jpg",
  "featured": false,
  "published_date": "2024-01-17T14:20:00Z",
  "read_time": "10 min read",
  "slug": "updated-article-title",
  "created_at": "2024-01-17T14:20:00Z",
  "updated_at": "2024-01-17T15:30:00Z"
}
```

---

### 5. Delete Article
**DELETE** `/{article_id}/`

Permanently delete an article.

#### Success Response (204)
```
No Content
```

---

### 6. Get Featured Articles
**GET** `/featured/`

Get all featured articles.

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "title": "Featured Health Article",
    "description": "This is a featured article",
    "category": {
      "id": 1,
      "name": "Wellness",
      "description": "General wellness articles",
      "color": "#4F7FFF",
      "count": 25
    },
    "author": {
      "id": 1,
      "name": "Dr. Sarah Johnson",
      "title": "MD",
      "bio": "Wellness expert",
      "avatar": "https://res.cloudinary.com/example/image/upload/v1234567890/avatar.jpg"
    },
    "image": "https://res.cloudinary.com/example/image/upload/v1234567890/featured.jpg",
    "featured": true,
    "published_date": "2024-01-15T10:30:00Z",
    "read_time": "6 min read",
    "is_bookmarked": false,
    "is_liked": false,
    "like_count": 28,
    "comment_count": 5
  }
]
```

---

### 7. Get Article Categories
**GET** `/categories/`

Get all article categories.

#### Success Response (200)
```json
[
  {
    "id": 1,
    "name": "Nutrition",
    "description": "Articles about nutrition and healthy eating",
    "color": "#4F7FFF",
    "count": 15
  },
  {
    "id": 2,
    "name": "Exercise",
    "description": "Articles about physical fitness and exercise",
    "color": "#FF6B6B",
    "count": 12
  }
]
```

---

### 8. Get Authors
**GET** `/authors/`

Get all article authors.

#### Success Response (200)
```json
[
  {
    "id": 1,
    "name": "Dr. Sarah Johnson",
    "title": "MD",
    "bio": "Endocrinologist with 15 years of experience in diabetes management",
    "avatar": "https://res.cloudinary.com/example/image/upload/v1234567890/avatar.jpg"
  },
  {
    "id": 2,
    "name": "Dr. John Smith",
    "title": "PhD",
    "bio": "Nutritionist and wellness expert",
    "avatar": null
  }
]
```

---

### 9. Toggle Article Bookmark
**POST/DELETE** `/{article_id}/bookmark/`

Bookmark or remove bookmark for an article.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200)
```json
{
  "bookmarked": true
}
```

#### Success Response (200) - Unbookmarked
```json
{
  "bookmarked": false
}
```

---

### 10. Toggle Article Like
**POST/DELETE** `/{article_id}/like/`

Like or unlike an article.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200)
```json
{
  "liked": true,
  "like_count": 43
}
```

#### Success Response (200) - Unliked
```json
{
  "liked": false,
  "like_count": 42
}
```

---

### 11. Search Articles
**GET** `/search/`

Advanced article search with multiple filters.

#### Query Parameters
- `query` (string): Search term
- `category` (string): Category name
- `author` (string): Author name
- `featured` (boolean): Featured status
- `date_from` (string): Start date (YYYY-MM-DD)
- `date_to` (string): End date (YYYY-MM-DD)
- `ordering` (string): Sort order

#### Example Request
```
GET /api/articles/search/?query=diabetes&category=nutrition&featured=true&ordering=-published_date
```

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "title": "Managing Diabetes Through Nutrition",
    "description": "Learn how proper nutrition can help manage diabetes",
    "category": {
      "id": 1,
      "name": "Nutrition",
      "description": "Articles about nutrition",
      "color": "#4F7FFF",
      "count": 15
    },
    "author": {
      "id": 1,
      "name": "Dr. Sarah Johnson",
      "title": "MD",
      "bio": "Endocrinologist",
      "avatar": "https://res.cloudinary.com/example/image/upload/v1234567890/avatar.jpg"
    },
    "image": "https://res.cloudinary.com/example/image/upload/v1234567890/diabetes-nutrition.jpg",
    "featured": true,
    "published_date": "2024-01-15T10:30:00Z",
    "read_time": "7 min read",
    "is_bookmarked": false,
    "is_liked": true,
    "like_count": 35,
    "comment_count": 6
  }
]
```

---

### 12. Get User's Bookmarked Articles
**GET** `/bookmarked/`

Get articles bookmarked by the authenticated user.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "title": "Bookmarked Article",
    "description": "This article was bookmarked by the user",
    "category": {
      "id": 1,
      "name": "Wellness",
      "description": "General wellness articles",
      "color": "#4F7FFF",
      "count": 25
    },
    "author": {
      "id": 1,
      "name": "Dr. Sarah Johnson",
      "title": "MD",
      "bio": "Wellness expert",
      "avatar": "https://res.cloudinary.com/example/image/upload/v1234567890/avatar.jpg"
    },
    "image": "https://res.cloudinary.com/example/image/upload/v1234567890/bookmarked.jpg",
    "featured": false,
    "published_date": "2024-01-14T09:15:00Z",
    "read_time": "5 min read",
    "is_bookmarked": true,
    "is_liked": false,
    "like_count": 18,
    "comment_count": 3
  }
]
```

---

### 13. Article Comments

#### List Article Comments
**GET** `/{article_id}/comments/`

Get all comments for an article.

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "text": "Great article! Very informative.",
    "user": {
      "id": 1,
      "username": "john_doe",
      "name": "John Doe",
      "avatar": null
    },
    "created_at": "2024-01-16T14:30:00Z",
    "updated_at": "2024-01-16T14:30:00Z",
    "is_liked": false,
    "like_count": 2
  }
]
```

#### Create Comment
**POST** `/{article_id}/comments/`

Add a comment to an article.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```json
{
  "text": "This is a great article! Very helpful information."
}
```

#### Success Response (201)
```json
{
  "id": "uuid-here",
  "text": "This is a great article! Very helpful information.",
  "user": {
    "id": 1,
    "username": "john_doe",
    "name": "John Doe",
    "avatar": null
  },
  "created_at": "2024-01-17T16:45:00Z",
  "updated_at": "2024-01-17T16:45:00Z",
  "is_liked": false,
  "like_count": 0
}
```

#### Update Comment
**PUT/PATCH** `/{article_id}/comments/{comment_id}/`

Update a comment (only by the comment author).

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```json
{
  "text": "Updated comment text"
}
```

#### Success Response (200)
```json
{
  "id": "uuid-here",
  "text": "Updated comment text",
  "user": {
    "id": 1,
    "username": "john_doe",
    "name": "John Doe",
    "avatar": null
  },
  "created_at": "2024-01-17T16:45:00Z",
  "updated_at": "2024-01-17T17:00:00Z",
  "is_liked": false,
  "like_count": 0
}
```

#### Delete Comment
**DELETE** `/{article_id}/comments/{comment_id}/`

Delete a comment (only by the comment author).

#### Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (204)
```
No Content
```

#### Toggle Comment Like
**POST/DELETE** `/{article_id}/comments/{comment_id}/like/`

Like or unlike a comment.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200)
```json
{
  "liked": true,
  "like_count": 3
}
```

---

## React Native Integration

### 1. Articles Service
```javascript
// services/articlesService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://youdoc.onrender.com/api/articles';

class ArticlesService {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getArticles(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/?${params}`);
    return response.json();
  }

  async getArticleDetails(articleId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/`);
    return response.json();
  }

  async getFeaturedArticles() {
    const response = await fetch(`${API_BASE_URL}/featured/`);
    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    return response.json();
  }

  async getAuthors() {
    const response = await fetch(`${API_BASE_URL}/authors/`);
    return response.json();
  }

  async searchArticles(searchParams) {
    const params = new URLSearchParams(searchParams);
    const response = await fetch(`${API_BASE_URL}/search/?${params}`);
    return response.json();
  }

  async toggleBookmark(articleId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/bookmark/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async removeBookmark(articleId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/bookmark/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async toggleLike(articleId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/like/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async removeLike(articleId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/like/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getBookmarkedArticles() {
    const response = await fetch(`${API_BASE_URL}/bookmarked/`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getArticleComments(articleId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/comments/`);
    return response.json();
  }

  async createComment(articleId, text) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/comments/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    return response.json();
  }

  async updateComment(articleId, commentId, text) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/comments/${commentId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    return response.json();
  }

  async deleteComment(articleId, commentId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/comments/${commentId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.status === 204;
  }

  async toggleCommentLike(articleId, commentId) {
    const response = await fetch(`${API_BASE_URL}/${articleId}/comments/${commentId}/like/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }
}

export default new ArticlesService();
```

### 2. Articles Context
```javascript
// context/ArticlesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import ArticlesService from '../services/articlesService';

const ArticlesContext = createContext();

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
};

export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadArticles = async (filters = {}) => {
    setIsLoading(true);
    try {
      const data = await ArticlesService.getArticles(filters);
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeaturedArticles = async () => {
    try {
      const data = await ArticlesService.getFeaturedArticles();
      setFeaturedArticles(data);
    } catch (error) {
      console.error('Failed to load featured articles:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await ArticlesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadAuthors = async () => {
    try {
      const data = await ArticlesService.getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error('Failed to load authors:', error);
    }
  };

  const loadBookmarkedArticles = async () => {
    try {
      const data = await ArticlesService.getBookmarkedArticles();
      setBookmarkedArticles(data);
    } catch (error) {
      console.error('Failed to load bookmarked articles:', error);
    }
  };

  const searchArticles = async (searchParams) => {
    setIsLoading(true);
    try {
      const data = await ArticlesService.searchArticles(searchParams);
      setArticles(data);
    } catch (error) {
      console.error('Failed to search articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async (articleId) => {
    try {
      const response = await ArticlesService.toggleBookmark(articleId);
      if (response.bookmarked) {
        // Update articles list
        setArticles(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { ...article, is_bookmarked: true }
              : article
          )
        );
        // Update featured articles
        setFeaturedArticles(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { ...article, is_bookmarked: true }
              : article
          )
        );
        // Reload bookmarked articles
        await loadBookmarkedArticles();
      } else {
        // Update articles list
        setArticles(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { ...article, is_bookmarked: false }
              : article
          )
        );
        // Update featured articles
        setFeaturedArticles(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { ...article, is_bookmarked: false }
              : article
          )
        );
        // Remove from bookmarked articles
        setBookmarkedArticles(prev => 
          prev.filter(article => article.id !== articleId)
        );
      }
      return { success: true, bookmarked: response.bookmarked };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleLike = async (articleId) => {
    try {
      const response = await ArticlesService.toggleLike(articleId);
      // Update articles list
      setArticles(prev => 
        prev.map(article => 
          article.id === articleId 
            ? { ...article, is_liked: response.liked, like_count: response.like_count }
            : article
        )
      );
      // Update featured articles
      setFeaturedArticles(prev => 
        prev.map(article => 
          article.id === articleId 
            ? { ...article, is_liked: response.liked, like_count: response.like_count }
            : article
        )
      );
      return { success: true, liked: response.liked, likeCount: response.like_count };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    loadArticles();
    loadFeaturedArticles();
    loadCategories();
    loadAuthors();
  }, []);

  const value = {
    articles,
    featuredArticles,
    categories,
    authors,
    bookmarkedArticles,
    isLoading,
    loadArticles,
    loadFeaturedArticles,
    loadCategories,
    loadAuthors,
    loadBookmarkedArticles,
    searchArticles,
    toggleBookmark,
    toggleLike,
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
};
```

### 3. Article List Component
```javascript
// components/ArticleList.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useArticles } from '../context/ArticlesContext';

const ArticleList = ({ articles, onArticlePress }) => {
  const { toggleBookmark, toggleLike } = useArticles();
  const [refreshing, setRefreshing] = useState(false);

  const handleBookmark = async (articleId) => {
    const result = await toggleBookmark(articleId);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  const handleLike = async (articleId) => {
    const result = await toggleLike(articleId);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity 
      style={styles.articleCard}
      onPress={() => onArticlePress(item)}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.articleImage} />
      )}
      
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <Text style={styles.categoryText}>{item.category.name}</Text>
          {item.featured && (
            <Text style={styles.featuredBadge}>FEATURED</Text>
          )}
        </View>
        
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.articleDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.articleMeta}>
          <Text style={styles.authorText}>
            By {item.author.name}
          </Text>
          <Text style={styles.readTimeText}>
            {item.read_time}
          </Text>
        </View>
        
        <View style={styles.articleStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statText}>{item.like_count}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={styles.statText}>{item.comment_count}</Text>
          </View>
        </View>
        
        <View style={styles.articleActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              item.is_liked && styles.likedButton
            ]}
            onPress={() => handleLike(item.id)}
          >
            <Text style={[
              styles.actionButtonText,
              item.is_liked && styles.likedButtonText
            ]}>
              {item.is_liked ? '❤️' : '🤍'} {item.like_count}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              item.is_bookmarked && styles.bookmarkedButton
            ]}
            onPress={() => handleBookmark(item.id)}
          >
            <Text style={[
              styles.actionButtonText,
              item.is_bookmarked && styles.bookmarkedButtonText
            ]}>
              {item.is_bookmarked ? '🔖' : '📖'} Bookmark
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        // Refresh logic here
        setRefreshing(false);
      }}
    />
  );
};

const styles = {
  articleCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  featuredBadge: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  readTimeText: {
    fontSize: 12,
    color: '#999',
  },
  articleStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  articleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  likedButton: {
    backgroundColor: '#ffebee',
  },
  bookmarkedButton: {
    backgroundColor: '#e3f2fd',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  likedButtonText: {
    color: '#f44336',
  },
  bookmarkedButtonText: {
    color: '#2196F3',
  },
};

export default ArticleList;
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Validation failed",
  "details": {
    "title": ["This field is required"],
    "content": ["This field is required"]
  }
}
```

#### 404 Not Found
```json
{
  "error": true,
  "message": "Article not found"
}
```

#### 403 Forbidden
```json
{
  "error": true,
  "message": "You can only edit your own comments"
}
```

---

## Security Notes

1. **User Isolation**: Users can only edit/delete their own comments
2. **Data Validation**: All input is validated on the server
3. **JWT Authentication**: Required for user-specific actions
4. **HTTPS Only**: All API calls must use HTTPS in production
5. **Content Moderation**: Consider implementing content moderation for comments
6. **Rate Limiting**: Implement rate limiting for comments and likes

---

## Testing

Use the following test data for development:

```json
{
  "title": "Test Health Article",
  "description": "This is a test article for development",
  "category": 1,
  "content": "<p>Test article content</p>",
  "featured": false,
  "read_time": "3 min read"
}
```

**Note**: Replace with actual test data in your development environment.
