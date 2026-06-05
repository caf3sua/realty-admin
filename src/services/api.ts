import type { Developer, Project, Product, User, Post } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper to strip ID from data for API requests
const stripId = (data: any): any => {
  const { id, ...rest } = data;
  return rest;
};

// Helper to generate headers with Auth token if present
const getHeaders = (hasBody = false): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Tài khoản hoặc mật khẩu không chính xác');
    }
    return res.json();
  },

  // Developers
  async getDevelopers(): Promise<Developer[]> {
    const res = await fetch(`${API_BASE_URL}/developers`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch developers');
    return res.json();
  },

  async getDeveloper(slug: string): Promise<Developer> {
    const res = await fetch(`${API_BASE_URL}/developers/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch developer with slug ${slug}`);
    return res.json();
  },

  async createDeveloper(data: Omit<Developer, 'id'> & { id?: string }): Promise<Developer> {
    const res = await fetch(`${API_BASE_URL}/developers`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create developer');
    return res.json();
  },

  async updateDeveloper(id: string, data: Omit<Developer, 'id'>): Promise<Developer> {
    const res = await fetch(`${API_BASE_URL}/developers/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update developer ${id}`);
    return res.json();
  },

  async deleteDeveloper(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/developers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete developer ${id}`);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE_URL}/projects`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(slug: string): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch project with slug ${slug}`);
    return res.json();
  },

  async createProject(data: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, data: Omit<Project, 'id'>): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update project ${id}`);
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete project ${id}`);
  },

  // Products
  async getProducts(params?: {
    product_type?: string;
    developer?: string;
    is_premium?: boolean;
    project_slug?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params) {
      if (params.product_type) query.append('product_type', params.product_type);
      if (params.developer) query.append('developer', params.developer);
      if (params.is_premium !== undefined) query.append('is_premium', String(params.is_premium));
      if (params.project_slug) query.append('project_slug', params.project_slug);
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/products${queryString}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch product with slug ${slug}`);
    return res.json();
  },

  async createProduct(data: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, data: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update product ${id}`);
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete product ${id}`);
  },

  // Users (using backend API)
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async getUser(id: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch user with id ${id}`);
    return res.json();
  },

  async createUser(data: Omit<User, 'id'> & { id?: string; password?: string }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to create user');
    }
    return res.json();
  },

  async updateUser(id: string, data: Omit<User, 'id'> & { password?: string }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to update user ${id}`);
    }
    return res.json();
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to delete user ${id}`);
    }
  },

  // Posts
  async getPosts(): Promise<Post[]> {
    const res = await fetch(`${API_BASE_URL}/posts`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getPost(slug: string): Promise<Post> {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch post with slug ${slug}`);
    return res.json();
  },

  async createPost(data: Omit<Post, 'id'> & { id?: string }): Promise<Post> {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async updatePost(id: string, data: Omit<Post, 'id'>): Promise<Post> {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update post ${id}`);
    return res.json();
  },

  async deletePost(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete post ${id}`);
  },

  // File Upload
  async uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const headers: Record<string, string> = {};
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to upload file');
    }
    return res.json();
  },
};
