import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Company } from '@/types/types';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  company: Company | null;
  formData: { name: string };
  onChange: (data: { name: string }) => void;
  isLoading: boolean;
}

export function EditCompanyModal({
  isOpen,
  onClose,
  onSubmit,
  company,
  formData,
  onChange,
  isLoading,
}: EditCompanyModalProps) {
  if (!company) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Company">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Company Name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          required
          placeholder="Enter company name"
        />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Company'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
