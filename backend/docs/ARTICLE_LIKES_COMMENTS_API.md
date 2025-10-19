# Article Likes and Comments API Documentation

## Overview
This document describes the new API endpoints for article likes and comments functionality that has been added to the YouDoc backend.

## New Models

### ArticleLike
- `id` - Primary key
- `user` - Foreign key to User (who liked the article)
- `article` - Foreign key to Article (the liked article)
- `created_at` - When the like was created

### ArticleComment
- `id` - UUID primary key
- `article` - Foreign key to Article (the commented article)
- `user` - Foreign key to User (who wrote the comment)
- `text` - The comment content
- `created_at` - When the comment was created
- `updated_at` - When the comment was last updated

### CommentLike
- `id` - Primary key
- `user` - Foreign key to User (who liked the comment)
- `comment` - Foreign key to ArticleComment (the liked comment)
- `created_at` - When the like was created

## API Endpoints

### Article Likes

#### Toggle Article Like
```
POST/DELETE /api/articles/{article_id}/like/
```

**Authentication**: Required

**Response**:
```json
{
  "liked": true/false,
  "like_count": 42
}
```

**Example**:
```bash
# Like an article
POST /api/articles/123e4567-e89b-12d3-a456-426614174000/like/
Authorization: Bearer <token>

# Unlike an article
DELETE /api/articles/123e4567-e89b-12d3-a456-426614174000/like/
Authorization: Bearer <token>
```

### Article Comments

#### List Comments for an Article
```
GET /api/articles/{article_id}/comments/
```

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "comment-uuid",
    "text": "Great article! Very informative.",
    "user": {
      "id": 1,
      "username": "john_doe",
      "name": "John Doe",
      "avatar": null
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "is_liked": false,
    "like_count": 5
  }
]
```

#### Create a Comment
```
POST /api/articles/{article_id}/comments/
```

**Authentication**: Required

**Request Body**:
```json
{
  "text": "This is my comment on the article"
}
```

**Response**:
```json
{
  "id": "comment-uuid",
  "text": "This is my comment on the article",
  "user": {
    "id": 1,
    "username": "john_doe",
    "name": "John Doe",
    "avatar": null
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "is_liked": false,
  "like_count": 0
}
```

#### Get Comment Details
```
GET /api/articles/{article_id}/comments/{comment_id}/
```

**Authentication**: Required

**Response**: Same as comment object above

#### Update a Comment
```
PUT/PATCH /api/articles/{article_id}/comments/{comment_id}/
```

**Authentication**: Required (only comment author can update)

**Request Body**:
```json
{
  "text": "Updated comment text"
}
```

**Response**: Updated comment object

#### Delete a Comment
```
DELETE /api/articles/{article_id}/comments/{comment_id}/
```

**Authentication**: Required (only comment author can delete)

**Response**: 204 No Content

### Comment Likes

#### Toggle Comment Like
```
POST/DELETE /api/articles/{article_id}/comments/{comment_id}/like/
```

**Authentication**: Required

**Response**:
```json
{
  "liked": true/false,
  "like_count": 8
}
```

## Updated Article Endpoints

The existing article endpoints now include like and comment information:

### Article List Response (Updated)
```json
[
  {
    "id": "article-uuid",
    "title": "Article Title",
    "description": "Article description",
    "category": { /* category object */ },
    "author": { /* author object */ },
    "image": "image-url",
    "featured": true,
    "published_date": "2024-01-15T10:30:00Z",
    "read_time": "5 min read",
    "is_bookmarked": false,
    "is_liked": true,
    "like_count": 42,
    "comment_count": 15
  }
]
```

### Article Detail Response (Updated)
```json
{
  "id": "article-uuid",
  "title": "Article Title",
  "description": "Article description",
  "category": { /* category object */ },
  "author": { /* author object */ },
  "content": "Full article content...",
  "image": "image-url",
  "featured": true,
  "published_date": "2024-01-15T10:30:00Z",
  "read_time": "5 min read",
  "slug": "article-title",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "is_bookmarked": false,
  "is_liked": true,
  "like_count": 42,
  "comment_count": 15,
  "view_count": 128
}
```

## Frontend Integration

### TypeScript Interfaces

```typescript
interface ArticleLike {
  liked: boolean;
  like_count: number;
}

interface CommentUser {
  id: number;
  username: string;
  name: string;
  avatar: string | null;
}

interface ArticleComment {
  id: string;
  text: string;
  user: CommentUser;
  created_at: string;
  updated_at: string;
  is_liked: boolean;
  like_count: number;
}

interface CommentLike {
  liked: boolean;
  like_count: number;
}
```

### Example Frontend Usage

```typescript
// Like an article
const likeArticle = async (articleId: string) => {
  const response = await fetch(`/api/articles/${articleId}/like/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Unlike an article
const unlikeArticle = async (articleId: string) => {
  const response = await fetch(`/api/articles/${articleId}/like/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Get comments for an article
const getComments = async (articleId: string) => {
  const response = await fetch(`/api/articles/${articleId}/comments/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Create a comment
const createComment = async (articleId: string, text: string) => {
  const response = await fetch(`/api/articles/${articleId}/comments/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  return response.json();
};

// Like a comment
const likeComment = async (articleId: string, commentId: string) => {
  const response = await fetch(`/api/articles/${articleId}/comments/${commentId}/like/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Error Responses

### 400 Bad Request
```json
{
  "text": ["This field is required."]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "error": "You can only edit your own comments"
}
```

### 404 Not Found
```json
{
  "error": "Article not found"
}
```

## Database Migrations

The following migration has been created and applied:
- `articles/migrations/0002_articlecomment_articlelike_commentlike_and_more.py`

## Admin Interface

All new models are registered in the Django admin interface:
- ArticleLike
- ArticleComment  
- CommentLike

Access at `/admin/` with superuser credentials.

## Performance Considerations

- Database indexes are created on frequently queried fields
- Select related and prefetch related are used for efficient queries
- Unique constraints prevent duplicate likes
- Comments are ordered by creation date (newest first)

## Security Features

- User authentication required for all like/comment operations
- Users can only edit/delete their own comments
- Input validation on comment text
- SQL injection protection through Django ORM
- XSS protection through proper serialization
