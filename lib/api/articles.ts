import { apiClient } from './client'

export interface ArticleCategory {
  id: number
  name: string
  description?: string
  color?: string
  count?: number
}

export interface ArticleAuthor {
  id: number
  name: string
  title?: string
  bio?: string
  avatar?: string
}

export interface Article {
  id: string
  title: string
  description: string
  content?: string
  category: ArticleCategory
  author: ArticleAuthor
  image?: string
  featured: boolean
  published_date: string
  read_time?: string
  slug?: string
  is_bookmarked?: boolean
  is_liked?: boolean
  like_count: number
  comment_count: number
  view_count?: number
  created_at: string
  updated_at: string
}

export interface ArticleComment {
  id: string
  text: string
  user: {
    id: number
    username?: string
    name: string
    avatar?: string
  }
  created_at: string
  updated_at: string
  is_liked?: boolean
  like_count: number
}

export interface CreateArticleRequest {
  title: string
  description: string
  category: number
  content: string
  author?: number
  image?: any
  featured?: boolean
  read_time?: string
  published_date?: string
}

export interface CreateCommentRequest {
  text: string
}

export interface BookmarkResponse {
  bookmarked: boolean
}

export interface LikeResponse {
  liked: boolean
  like_count: number
}

export class ArticlesService {
  async getArticles(filters?: {
    category?: string
    author?: string
    featured?: boolean
    date_from?: string
    date_to?: string
    search?: string
    ordering?: string
  }): Promise<Article[]> {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.author) params.append('author', filters.author)
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured))
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.ordering) params.append('ordering', filters.ordering)
    
    const query = params.toString()
    return apiClient.get<Article[]>(`/articles/${query ? `?${query}` : ''}`, false)
  }

  async getArticle(id: string): Promise<Article> {
    return apiClient.get<Article>(`/articles/${id}/`, false)
  }

  async createArticle(data: CreateArticleRequest, image?: any): Promise<Article> {
    const formData = new FormData()
    
    Object.keys(data).forEach(key => {
      if (key !== 'image' && data[key as keyof CreateArticleRequest] !== undefined) {
        formData.append(key, String(data[key as keyof CreateArticleRequest]))
      }
    })
    
    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || 'image.jpg',
      } as any)
    }
    
    return apiClient.post<Article>('/articles/', formData, true, true)
  }

  async updateArticle(id: string, data: Partial<CreateArticleRequest>, image?: any): Promise<Article> {
    const formData = new FormData()
    
    Object.keys(data).forEach(key => {
      if (key !== 'image' && data[key as keyof CreateArticleRequest] !== undefined) {
        formData.append(key, String(data[key as keyof CreateArticleRequest]))
      }
    })
    
    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || 'image.jpg',
      } as any)
    }
    
    return apiClient.patch<Article>(`/articles/${id}/`, formData, true, true)
  }

  async deleteArticle(id: string): Promise<void> {
    return apiClient.delete<void>(`/articles/${id}/`)
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return apiClient.get<Article[]>('/articles/featured/', false)
  }

  async getCategories(): Promise<ArticleCategory[]> {
    return apiClient.get<ArticleCategory[]>('/articles/categories/', false)
  }

  async getAuthors(): Promise<ArticleAuthor[]> {
    return apiClient.get<ArticleAuthor[]>('/articles/authors/', false)
  }

  async searchArticles(params: {
    query?: string
    category?: string
    author?: string
    featured?: boolean
    date_from?: string
    date_to?: string
    ordering?: string
  }): Promise<Article[]> {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        searchParams.append(key, String(params[key as keyof typeof params]))
      }
    })
    
    const query = searchParams.toString()
    return apiClient.get<Article[]>(`/articles/search/${query ? `?${query}` : ''}`, false)
  }

  async toggleBookmark(articleId: string): Promise<BookmarkResponse> {
    return apiClient.post<BookmarkResponse>(`/articles/${articleId}/bookmark/`)
  }

  async removeBookmark(articleId: string): Promise<BookmarkResponse> {
    return apiClient.delete<BookmarkResponse>(`/articles/${articleId}/bookmark/`)
  }

  async toggleLike(articleId: string): Promise<LikeResponse> {
    return apiClient.post<LikeResponse>(`/articles/${articleId}/like/`)
  }

  async removeLike(articleId: string): Promise<LikeResponse> {
    return apiClient.delete<LikeResponse>(`/articles/${articleId}/like/`)
  }

  async getBookmarkedArticles(): Promise<Article[]> {
    return apiClient.get<Article[]>('/articles/bookmarked/')
  }

  // Comments
  async getArticleComments(articleId: string): Promise<ArticleComment[]> {
    return apiClient.get<ArticleComment[]>(`/articles/${articleId}/comments/`, false)
  }

  async createComment(articleId: string, data: CreateCommentRequest): Promise<ArticleComment> {
    return apiClient.post<ArticleComment>(`/articles/${articleId}/comments/`, data)
  }

  async updateComment(articleId: string, commentId: string, data: CreateCommentRequest): Promise<ArticleComment> {
    return apiClient.patch<ArticleComment>(`/articles/${articleId}/comments/${commentId}/`, data)
  }

  async deleteComment(articleId: string, commentId: string): Promise<void> {
    return apiClient.delete<void>(`/articles/${articleId}/comments/${commentId}/`)
  }

  async toggleCommentLike(articleId: string, commentId: string): Promise<LikeResponse> {
    return apiClient.post<LikeResponse>(`/articles/${articleId}/comments/${commentId}/like/`)
  }
}

export const articlesService = new ArticlesService()

