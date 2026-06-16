import type { Post, Developer, Project, Product, User, Customer, Advisory, Newsletter, Amenity } from '../data/mockData';

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

// Wrapper for fetch to handle 401 Unauthorized globally
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await window.fetch(input, init);
  if (res.status === 401 && !input.toString().includes('/auth/login')) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  }
  return res;
};

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await customFetch(`${API_BASE_URL}/auth/login`, {
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

  async loginWithGoogle(token: string): Promise<{ token: string; user: User }> {
    const res = await customFetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Đăng nhập bằng tài khoản Google thất bại');
    }
    return res.json();
  },


  // Developers
  async getDevelopers(): Promise<Developer[]> {
    const res = await customFetch(`${API_BASE_URL}/developers`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch developers');
    return res.json();
  },

  async getDeveloper(slug: string): Promise<Developer> {
    const res = await customFetch(`${API_BASE_URL}/developers/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch developer with slug ${slug}`);
    return res.json();
  },

  async createDeveloper(data: Omit<Developer, 'id'> & { id?: string }): Promise<Developer> {
    const res = await customFetch(`${API_BASE_URL}/developers`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create developer');
    return res.json();
  },

  async updateDeveloper(id: string, data: Omit<Developer, 'id'>): Promise<Developer> {
    const res = await customFetch(`${API_BASE_URL}/developers/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update developer ${id}`);
    return res.json();
  },

  async deleteDeveloper(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/developers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete developer ${id}`);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await customFetch(`${API_BASE_URL}/projects`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(slug: string): Promise<Project> {
    const res = await customFetch(`${API_BASE_URL}/projects/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch project with slug ${slug}`);
    return res.json();
  },

  async createProject(data: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
    const res = await customFetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, data: Omit<Project, 'id'>): Promise<Project> {
    const res = await customFetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update project ${id}`);
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/projects/${id}`, {
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
    const res = await customFetch(`${API_BASE_URL}/products${queryString}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(slug: string): Promise<Product> {
    const res = await customFetch(`${API_BASE_URL}/products/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch product with slug ${slug}`);
    return res.json();
  },

  async createProduct(data: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const res = await customFetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, data: Omit<Product, 'id'>): Promise<Product> {
    const res = await customFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update product ${id}`);
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete product ${id}`);
  },

  // Users (using backend API)
  async getUsers(): Promise<User[]> {
    const res = await customFetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async getUser(id: string): Promise<User> {
    const res = await customFetch(`${API_BASE_URL}/users/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch user with id ${id}`);
    return res.json();
  },

  async createUser(data: Omit<User, 'id'> & { id?: string; password?: string }): Promise<User> {
    const res = await customFetch(`${API_BASE_URL}/users`, {
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
    const res = await customFetch(`${API_BASE_URL}/users/${id}`, {
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
    const res = await customFetch(`${API_BASE_URL}/users/${id}`, {
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
    const res = await customFetch(`${API_BASE_URL}/posts`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getPost(slug: string): Promise<Post> {
    const res = await customFetch(`${API_BASE_URL}/posts/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch post with slug ${slug}`);
    return res.json();
  },

  async createPost(data: Omit<Post, 'id'> & { id?: string }): Promise<Post> {
    const res = await customFetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async updatePost(id: string, data: Omit<Post, 'id'>): Promise<Post> {
    const res = await customFetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update post ${id}`);
    return res.json();
  },

  async deletePost(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/posts/${id}`, {
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

    const res = await customFetch(`${API_BASE_URL}/upload`, {
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

  // CRM - Customers (Khách hàng)
  async getCustomers(params?: { search?: string; classification?: string; source?: string }): Promise<Customer[]> {
    const query = new URLSearchParams();
    if (params) {
      if (params.search) query.append('search', params.search);
      if (params.classification) query.append('classification', params.classification);
      if (params.source) query.append('source', params.source);
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await customFetch(`${API_BASE_URL}/crm/customers${queryString}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải danh sách khách hàng');
    return res.json();
  },

  async getCustomer(id: string): Promise<Customer> {
    const res = await customFetch(`${API_BASE_URL}/crm/customers/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Không thể tải thông tin khách hàng với ID ${id}`);
    return res.json();
  },

  async createCustomer(data: Omit<Customer, 'id' | 'createdAt'> & { id?: string }): Promise<Customer> {
    const res = await customFetch(`${API_BASE_URL}/crm/customers`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Không thể tạo khách hàng mới');
    }
    return res.json();
  },

  async updateCustomer(id: string, data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const res = await customFetch(`${API_BASE_URL}/crm/customers/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Không thể cập nhật khách hàng ${id}`);
    }
    return res.json();
  },

  async deleteCustomer(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/crm/customers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Không thể xóa khách hàng ${id}`);
  },

  // CRM - Advisories (Yêu cầu tư vấn)
  async getAdvisories(params?: { search?: string; status?: string }): Promise<Advisory[]> {
    const query = new URLSearchParams();
    if (params) {
      if (params.search) query.append('search', params.search);
      if (params.status) query.append('status_filter', params.status);
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await customFetch(`${API_BASE_URL}/crm/advisories${queryString}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải danh sách yêu cầu tư vấn');
    return res.json();
  },

  async getAdvisory(id: string): Promise<Advisory> {
    const res = await customFetch(`${API_BASE_URL}/crm/advisories/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Không thể tải yêu cầu tư vấn với ID ${id}`);
    return res.json();
  },

  // Advisory creation is public (no authentication required)
  async createAdvisory(data: Omit<Advisory, 'id' | 'createdAt' | 'status'> & { status?: string }): Promise<Advisory> {
    const res = await customFetch(`${API_BASE_URL}/crm/advisories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Không thể gửi yêu cầu tư vấn');
    return res.json();
  },

  async updateAdvisoryStatus(id: string, status: string): Promise<Advisory> {
    const res = await customFetch(`${API_BASE_URL}/crm/advisories/${id}?status_update=${encodeURIComponent(status)}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Không thể cập nhật trạng thái yêu cầu tư vấn ${id}`);
    return res.json();
  },

  async deleteAdvisory(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/crm/advisories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Không thể xóa yêu cầu tư vấn ${id}`);
  },

  // CRM - Newsletters (Đăng ký nhận tin tức)
  async getNewsletters(active?: boolean): Promise<Newsletter[]> {
    const query = new URLSearchParams();
    if (active !== undefined) query.append('active', String(active));
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await customFetch(`${API_BASE_URL}/crm/newsletters${queryString}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải danh sách đăng ký nhận tin');
    return res.json();
  },

  // Newsletter subscription is public (no authentication required)
  async subscribeNewsletter(email: string): Promise<Newsletter> {
    const res = await customFetch(`${API_BASE_URL}/crm/newsletters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Không thể đăng ký nhận tin tức');
    }
    return res.json();
  },

  async toggleNewsletterActive(id: string, active: boolean): Promise<Newsletter> {
    const res = await customFetch(`${API_BASE_URL}/crm/newsletters/${id}?active=${active}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Không thể cập nhật trạng thái đăng ký ${id}`);
    return res.json();
  },

  async deleteNewsletter(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/crm/newsletters/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Không thể xóa đăng ký ${id}`);
  },

  // Amenities
  async getAmenities(product_type?: string): Promise<Amenity[]> {
    const query = product_type ? `?product_type=${product_type}` : '';
    const res = await customFetch(`${API_BASE_URL}/amenities${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch amenities');
    return res.json();
  },

  async createAmenity(data: Omit<Amenity, 'id' | 'created_at' | 'updated_at'>): Promise<Amenity> {
    const res = await customFetch(`${API_BASE_URL}/amenities`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create amenity');
    return res.json();
  },

  async updateAmenity(id: string, data: Omit<Amenity, 'id' | 'created_at' | 'updated_at'>): Promise<Amenity> {
    const res = await customFetch(`${API_BASE_URL}/amenities/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update amenity ${id}`);
    return res.json();
  },

  async deleteAmenity(id: string): Promise<void> {
    const res = await customFetch(`${API_BASE_URL}/amenities/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete amenity ${id}`);
  },
};
