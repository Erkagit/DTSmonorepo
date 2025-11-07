import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Vehicle, Device } from '@/types/types';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  vehicle: Vehicle | null;
  formData: {
    plateNo: string;
    driverName: string;
    driverPhone: string;
    deviceId: string;
  };
  onChange: (data: any) => void;
  devices: Device[];
  isLoading: boolean;
}

export function EditVehicleModal({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  formData,
  onChange,
  devices,
  isLoading,
}: EditVehicleModalProps) {
  if (!vehicle) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Vehicle">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Plate Number"
          value={formData.plateNo}
          onChange={(e) => onChange({ ...formData, plateNo: e.target.value })}
          required
          placeholder="Enter plate number"
        />

        <Input
          label="Driver Name"
          value={formData.driverName}
          onChange={(e) => onChange({ ...formData, driverName: e.target.value })}
          required
          placeholder="Enter driver name"
        />

        <Input
          label="Driver Phone"
          value={formData.driverPhone}
          onChange={(e) => onChange({ ...formData, driverPhone: e.target.value })}
          required
          placeholder="Enter driver phone"
        />

        <Select
          label="GPS Device (Optional)"
          value={formData.deviceId}
          onChange={(e) => onChange({ ...formData, deviceId: e.target.value })}
        >
          <option value="">No Device</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.deviceId}
            </option>
          ))}
        </Select>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
