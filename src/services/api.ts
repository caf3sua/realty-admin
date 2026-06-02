import type { Developer, Project, Product, User } from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper to strip ID from data for API requests
const stripId = (data: any): any => {
  const { id, ...rest } = data;
  return rest;
};

export const api = {
  // Developers
  async getDevelopers(): Promise<Developer[]> {
    const res = await fetch(`${API_BASE_URL}/developers`);
    if (!res.ok) throw new Error('Failed to fetch developers');
    return res.json();
  },

  async getDeveloper(slug: string): Promise<Developer> {
    const res = await fetch(`${API_BASE_URL}/developers/${slug}`);
    if (!res.ok) throw new Error(`Failed to fetch developer with slug ${slug}`);
    return res.json();
  },

  async createDeveloper(data: Omit<Developer, 'id'> & { id?: string }): Promise<Developer> {
    const res = await fetch(`${API_BASE_URL}/developers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create developer');
    return res.json();
  },

  async updateDeveloper(id: string, data: Omit<Developer, 'id'>): Promise<Developer> {
    const res = await fetch(`${API_BASE_URL}/developers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update developer ${id}`);
    return res.json();
  },

  async deleteDeveloper(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/developers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete developer ${id}`);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(slug: string): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`);
    if (!res.ok) throw new Error(`Failed to fetch project with slug ${slug}`);
    return res.json();
  },

  async createProject(data: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, data: Omit<Project, 'id'>): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update project ${id}`);
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
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
    const res = await fetch(`${API_BASE_URL}/products${queryString}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!res.ok) throw new Error(`Failed to fetch product with slug ${slug}`);
    return res.json();
  },

  async createProduct(data: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, data: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stripId(data)),
    });
    if (!res.ok) throw new Error(`Failed to update product ${id}`);
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete product ${id}`);
  },

  // Users (using local storage mock)
  initUsers() {
    if (!localStorage.getItem('admin_users')) {
      const mockUsers: User[] = [
        {
          id: 'user-1',
          name: 'Nguyễn Văn Admin',
          email: 'admin@realty.com',
          role: 'admin',
          status: 'active',
          createdAt: '2026-01-15',
        },
        {
          id: 'user-2',
          name: 'Trần Thị Nhân Viên',
          email: 'staff@realty.com',
          role: 'staff',
          status: 'active',
          createdAt: '2026-02-20',
        },
        {
          id: 'user-3',
          name: 'Lê Văn Khóa',
          email: 'locked@realty.com',
          role: 'staff',
          status: 'inactive',
          createdAt: '2026-03-10',
        },
      ];
      localStorage.setItem('admin_users', JSON.stringify(mockUsers));
    }
  },

  async getUsers(): Promise<User[]> {
    this.initUsers();
    return JSON.parse(localStorage.getItem('admin_users') || '[]');
  },

  async getUser(id: string): Promise<User> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error(`User ${id} not found`);
    return user;
  },

  async createUser(data: Omit<User, 'id'> & { id?: string }): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      ...data,
      id: data.id || `user-${Date.now()}`,
    };
    users.push(newUser);
    localStorage.setItem('admin_users', JSON.stringify(users));
    return newUser;
  },

  async updateUser(id: string, data: Omit<User, 'id'>): Promise<User> {
    const users = await this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User ${id} not found`);
    const updatedUser = { ...data, id };
    users[index] = updatedUser;
    localStorage.setItem('admin_users', JSON.stringify(users));
    return updatedUser;
  },

  async deleteUser(id: string): Promise<void> {
    const users = await this.getUsers();
    const updated = users.filter((u) => u.id !== id);
    localStorage.setItem('admin_users', JSON.stringify(updated));
  },

  async uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to upload file');
    }
    return res.json();
  },
};
