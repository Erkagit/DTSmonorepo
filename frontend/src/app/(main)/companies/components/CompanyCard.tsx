import { Building2, Users as UsersIcon, Package, UserPlus } from 'lucide-react';
import { Card, CardHeader, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { CompanyCardProps } from '@/types/types';

export function CompanyCard({ company, onAddUser }: CompanyCardProps) {
  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{company.name}</h3>
            <div className="space-y-2">
              {company._count && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span>{company._count.users} Users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{company._count.orders} Orders</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </CardHeader>

      <CardFooter className="pt-4 border-t border-gray-100">
        <Button
          onClick={() => onAddUser(company)}
          variant="ghost"
          fullWidth
          icon={UserPlus}
          className="bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200"
        >
          Add Client Admin
        </Button>
      </CardFooter>
    </Card>
  );
}
