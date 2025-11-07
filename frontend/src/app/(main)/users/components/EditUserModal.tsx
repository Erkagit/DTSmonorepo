import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { User, Company } from '@/types/types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  user: User | null;
  formData: {
    email: string;
    name: string;
    role: string;
    companyId: string;
  };
  onChange: (data: any) => void;
  companies: Company[];
  isLoading: boolean;
}

export function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  formData,
  onChange,
  companies,
  isLoading,
}: EditUserModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          required
          placeholder="Enter user name"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          required
          placeholder="Enter email address"
        />

        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => onChange({ ...formData, role: e.target.value })}
          required
        >
          <option value="">Select role</option>
          <option value="ADMIN">Admin</option>
          <option value="CLIENT_ADMIN">Client Admin</option>
        </Select>

        <Select
          label="Company"
          value={formData.companyId}
          onChange={(e) => onChange({ ...formData, companyId: e.target.value })}
        >
          <option value="">No Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </Select>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
