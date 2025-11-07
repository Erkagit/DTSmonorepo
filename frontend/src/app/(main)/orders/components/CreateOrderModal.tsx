import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CreateOrderModalProps } from '@/types/types';

export function CreateOrderModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  vehicles,
  companies,
  isAdmin,
  isLoading,
}: CreateOrderModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Order Code"
          type="text"
          value={formData.code}
          onChange={(e) => onChange({ ...formData, code: e.target.value })}
          placeholder="DTS-2025-0001"
          required
        />

        <Input
          label="Origin"
          type="text"
          value={formData.origin}
          onChange={(e) => onChange({ ...formData, origin: e.target.value })}
          placeholder="Ulaanbaatar"
          required
        />

        <Input
          label="Destination"
          type="text"
          value={formData.destination}
          onChange={(e) => onChange({ ...formData, destination: e.target.value })}
          placeholder="Zamyn-Uud"
          required
        />

        <Select
          label="Vehicle"
          value={formData.vehicleId}
          onChange={(e) => onChange({ ...formData, vehicleId: e.target.value })}
        >
          <option value="">Select vehicle...</option>
          {vehicles?.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plateNo} - {vehicle.driverName}
            </option>
          ))}
        </Select>

        {isAdmin && companies && (
          <Select
            label="Company"
            value={formData.companyId}
            onChange={(e) => onChange({ ...formData, companyId: e.target.value })}
            required
          >
            <option value="">Select company...</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary" fullWidth>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
