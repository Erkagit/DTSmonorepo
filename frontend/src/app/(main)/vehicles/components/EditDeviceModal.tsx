import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Device } from '@/types/types';

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  device: Device | null;
  formData: { deviceId: string };
  onChange: (data: { deviceId: string }) => void;
  isLoading: boolean;
}

export function EditDeviceModal({
  isOpen,
  onClose,
  onSubmit,
  device,
  formData,
  onChange,
  isLoading,
}: EditDeviceModalProps) {
  if (!device) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit GPS Device" maxWidth="md">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Device ID"
          value={formData.deviceId}
          onChange={(e) => onChange({ deviceId: e.target.value })}
          required
          placeholder="Enter device ID"
        />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Device'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
