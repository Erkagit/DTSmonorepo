'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi } from '@/services/api';
import api from '@/services/api';
import { Package, Building2, UserPlus, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { PageHeader, Button, EmptyState } from '@/components/ui';
import { CreateCompanyModal, CreateUserModal, CompanyCard } from './components';

export default function CompaniesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
  });

  const [userFormData, setUserFormData] = useState({
    email: '',
    name: '',
    password: '',
  });

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await companiesApi.getAll();
      return res.data;
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/api/companies', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setShowCreateForm(false);
      setFormData({ name: '' });
      alert('Company created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create company');
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/api/users', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setShowCreateUserModal(false);
      setSelectedCompany(null);
      setUserFormData({ email: '', name: '', password: '' });
      alert('✅ Client Admin user created successfully!');
    },
    onError: (error: any) => {
      alert('❌ ' + (error.response?.data?.error || 'Failed to create user'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompanyMutation.mutate(formData);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    
    createUserMutation.mutate({
      ...userFormData,
      role: 'CLIENT_ADMIN',
      companyId: selectedCompany.id
    });
  };

  const openCreateUserModal = (company: any) => {
    setSelectedCompany(company);
    setShowCreateUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowCreateUserModal(false);
    setSelectedCompany(null);
    setUserFormData({ email: '', name: '', password: '' });
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={<Building2 className="w-8 h-8 text-purple-600" />}
        title="Companies"
        action={
          <Button icon={Plus} onClick={() => setShowCreateForm(true)}>
            New Company
          </Button>
        }
      />

      <CreateCompanyModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={setFormData}
        isLoading={createCompanyMutation.isPending}
      />

      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={handleCloseUserModal}
        onSubmit={handleUserSubmit}
        company={selectedCompany}
        formData={userFormData}
        onChange={setUserFormData}
        isLoading={createUserMutation.isPending}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : companies && companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onAddUser={openCreateUserModal}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No companies yet"
            description="Create your first company"
            actionLabel="Create Company"
            onAction={() => setShowCreateForm(true)}
          />
        )}
      </main>
    </div>
  );
}
