import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { AdminLayout } from './components/AdminLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

import { DeveloperList } from './pages/developers/DeveloperList';
import { DeveloperDetail } from './pages/developers/DeveloperDetail';
import { DeveloperForm } from './pages/developers/DeveloperForm';

import { ProjectList } from './pages/projects/ProjectList';
import { ProjectDetail } from './pages/projects/ProjectDetail';
import { ProjectForm } from './pages/projects/ProjectForm';

import { ProductList } from './pages/products/ProductList';
import { ProductDetail } from './pages/products/ProductDetail';
import { ProductForm } from './pages/products/ProductForm';

import { UserList } from './pages/users/UserList';
import { UserDetail } from './pages/users/UserDetail';
import { UserForm } from './pages/users/UserForm';

import { CustomerList } from './pages/crm/CustomerList';
import { CustomerForm } from './pages/crm/CustomerForm';
import { CustomerDetail } from './pages/crm/CustomerDetail';
import { AdvisoryList } from './pages/crm/AdvisoryList';
import { NewsletterList } from './pages/crm/NewsletterList';
import { AmenitiesList } from './pages/config/AmenitiesList';
import { PostList } from './pages/posts/PostList';
import { PostDetail } from './pages/posts/PostDetail';
import { PostForm } from './pages/posts/PostForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AuthGuard>
            }
          />

          {/* Developers CRUD */}
          <Route
            path="/developers"
            element={
              <AuthGuard>
                <AdminLayout>
                  <DeveloperList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/developers/new"
            element={
              <AuthGuard>
                <AdminLayout>
                  <DeveloperForm />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/developers/:slug"
            element={
              <AuthGuard>
                <AdminLayout>
                  <DeveloperDetail />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/developers/:slug/edit"
            element={
              <AuthGuard>
                <AdminLayout>
                  <DeveloperForm />
                </AdminLayout>
              </AuthGuard>
            }
          />

          {/* Projects CRUD */}
          <Route
            path="/projects"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProjectList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/projects/new"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProjectForm />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProjectDetail />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/projects/:slug/edit"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProjectForm />
                </AdminLayout>
              </AuthGuard>
            }
          />

          {/* Products CRUD */}
          <Route
            path="/products"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProductList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/products/new"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/products/:slug"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProductDetail />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/products/:slug/edit"
            element={
              <AuthGuard>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </AuthGuard>
            }
          />

          {/* Posts CRUD */}
          <Route
            path="/posts"
            element={
              <AuthGuard>
                <AdminLayout>
                  <PostList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/posts/new"
            element={
              <AuthGuard>
                <AdminLayout>
                  <PostForm />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/posts/:slug"
            element={
              <AuthGuard>
                <AdminLayout>
                  <PostDetail />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/posts/:slug/edit"
            element={
              <AuthGuard>
                <AdminLayout>
                  <PostForm />
                </AdminLayout>
              </AuthGuard>
            }
          />

          {/* Users CRUD */}
          <Route
            path="/users"
            element={
              <AuthGuard>
                <AdminLayout>
                  <UserList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/users/new"
            element={
              <AuthGuard>
                <AdminLayout>
                  <UserForm />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/users/:id"
            element={
              <AuthGuard>
                <AdminLayout>
                  <UserDetail />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <AuthGuard>
                <AdminLayout>
                  <UserForm />
                </AdminLayout>
              </AuthGuard>
            }
          />

          {/* CRM CRUD */}
          <Route
            path="/crm/customers"
            element={
              <AuthGuard>
                <AdminLayout>
                  <CustomerList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/crm/customers/new"
            element={
              <AuthGuard>
                <AdminLayout>
                  <CustomerForm />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/crm/customers/:id"
            element={
              <AuthGuard>
                <AdminLayout>
                  <CustomerDetail />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/crm/customers/:id/edit"
            element={
              <AuthGuard>
                <AdminLayout>
                  <CustomerForm />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/crm/advisories"
            element={
              <AuthGuard>
                <AdminLayout>
                  <AdvisoryList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/crm/newsletters"
            element={
              <AuthGuard>
                <AdminLayout>
                  <NewsletterList />
                </AdminLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/config/amenities"
            element={
              <AuthGuard>
                <AdminLayout>
                  <AmenitiesList />
                </AdminLayout>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
