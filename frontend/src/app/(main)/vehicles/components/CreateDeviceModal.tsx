import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { CreateDeviceModalProps } from '@/types/types';

export function CreateDeviceModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  isLoading,
}: CreateDeviceModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Device">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Device ID"
          type="text"
          value={formData.deviceId}
          onChange={(e) => onChange({ deviceId: e.target.value })}
          placeholder="GPS-0002"
          required
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary" fullWidth>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} variant="secondary" fullWidth className="bg-gray-600 hover:bg-gray-700 text-white">
            {isLoading ? 'Creating...' : 'Create Device'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
