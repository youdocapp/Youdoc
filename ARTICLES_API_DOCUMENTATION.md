# Articles API Documentation

## Overview
The backend now provides a comprehensive articles management system with full CRUD operations, search functionality, and user engagement features.

## Models

### ArticleCategory
- `id` - Primary key
- `name` - Category name (unique)
- `description` - Category description
- `color` - Hex color for UI
- `created_at` - Creation timestamp

### Author
- `id` - Primary key
- `user` - OneToOne relationship with User model
- `name` - Author name
- `title` - Professional title (Dr., MD, RN, etc.)
- `bio` - Author biography
- `avatar` - Author profile image
- `created_at` - Creation timestamp

### Article
- `id` - UUID primary key
- `title` - Article title
- `description` - Article description
- `category` - Foreign key to ArticleCategory
- `author` - Foreign key to Author
- `content` - Full article content
- `image` - Article featured image
- `featured` - Boolean for featured articles
- `published_date` - Publication date
- `read_time` - Estimated read time
- `slug` - URL-friendly slug (auto-generated)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### ArticleBookmark
- `id` - Primary key
- `user` - Foreign key to User
- `article` - Foreign key to Article
- `created_at` - Bookmark timestamp

### ArticleView
- `id` - Primary key
- `article` - Foreign key to Article
- `user` - Foreign key to User (nullable)
- `ip_address` - Viewer IP address
- `viewed_at` - View timestamp

## API Endpoints

### Articles

#### List/Create Articles
```
GET/POST /api/articles/
```

**GET Parameters:**
- `category` - Filter by category ID
- `author` - Filter by author ID
- `featured` - Filter featured articles (true/false)
- `date_from` - Filter from date (YYYY-MM-DD)
- `date_to` - Filter to date (YYYY-MM-DD)
- `search` - Search in title, description, content, author name
- `ordering` - Order by: published_date, created_at, title (prefix with - for desc)

**POST Body:**
```json
{
  "title": "Article Title",
  "description": "Article description",
  "category": "category-uuid",
  "author": "author-uuid",
  "content": "Full article content",
  "image": "image-file",
  "featured": false,
  "published_date": "2024-01-15T10:30:00Z",
  "read_time": "5 min read"
}
```

#### Article Detail
```
GET/PUT/PATCH/DELETE /api/articles/{id}/
```

**GET Response includes:**
- Full article data
- `is_bookmarked` - Boolean for current user
- `view_count` - Total view count

#### Featured Articles
```
GET /api/articles/featured/
```

#### Search Articles
```
GET /api/articles/search/
```

**Parameters:**
- `query` - Search query
- `category` - Category name filter
- `author` - Author name filter
- `featured` - Featured filter
- `date_from` - Date range start
- `date_to` - Date range end
- `ordering` - Sort order

#### Bookmark Management
```
POST/DELETE /api/articles/{article_id}/bookmark/
```

**Response:**
```json
{
  "bookmarked": true/false
}
```

#### User Bookmarks
```
GET /api/articles/bookmarked/
```

### Categories

#### List Categories
```
GET /api/articles/categories/
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Nutrition",
    "description": "Nutrition-related articles",
    "color": "#4F7FFF",
    "count": 15
  }
]
```

### Authors

#### List Authors
```
GET /api/articles/authors/
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Dr. Sarah Chen",
    "title": "MD",
    "bio": "Cardiologist with 10 years experience",
    "avatar": "avatar-url"
  }
]
```

## Authentication

All endpoints require authentication except:
- `GET /api/articles/` (public read access)
- `GET /api/articles/{id}/` (public read access)
- `GET /api/articles/featured/` (public read access)
- `GET /api/articles/search/` (public read access)
- `GET /api/articles/categories/` (public read access)
- `GET /api/articles/authors/` (public read access)

## Response Formats

### Article List Response
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "description": "Article description",
    "category": {
      "id": "uuid",
      "name": "Nutrition",
      "description": "Nutrition articles",
      "color": "#4F7FFF",
      "count": 15
    },
    "author": {
      "id": "uuid",
      "name": "Dr. Sarah Chen",
      "title": "MD",
      "bio": "Cardiologist",
      "avatar": "avatar-url"
    },
    "image": "image-url",
    "featured": true,
    "published_date": "2024-01-15T10:30:00Z",
    "read_time": "5 min read",
    "is_bookmarked": false
  }
]
```

### Article Detail Response
```json
{
  "id": "uuid",
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
  "view_count": 42
}
```

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "error": "Article not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Usage Examples

### Frontend Integration

```typescript
// Fetch articles
const articles = await fetch('/api/articles/?featured=true&ordering=-published_date');

// Search articles
const searchResults = await fetch('/api/articles/search/?query=nutrition&category=Nutrition');

// Bookmark article
await fetch('/api/articles/article-uuid/bookmark/', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token' }
});

// Get user bookmarks
const bookmarks = await fetch('/api/articles/bookmarked/', {
  headers: { 'Authorization': 'Bearer token' }
});
```

## Database Migrations

Run the following commands to set up the database:

```bash
python manage.py makemigrations articles
python manage.py migrate
```

## Admin Interface

The Django admin interface provides full management capabilities for:
- Articles
- Article Categories
- Authors
- Article Bookmarks
- Article Views

Access at `/admin/` with superuser credentials.

## File Uploads

Article images are stored in `media/articles/images/` and author avatars in `media/authors/avatars/`.

Supported image formats: JPG, JPEG, PNG, GIF

## Performance Optimizations

- Database indexes on frequently queried fields
- Select related and prefetch related for efficient queries
- Pagination support (can be added if needed)
- View tracking for analytics

## Security Features

- User authentication required for write operations
- File upload validation
- SQL injection protection through Django ORM
- XSS protection through proper serialization
