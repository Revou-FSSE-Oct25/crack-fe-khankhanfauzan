import { PaginationParams } from './common';

export type ComplaintCategory = 'plumbing' | 'electrical' | 'furniture' | 'ac' | 'others';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface MaintenanceImage {
  id: string;
  complaintId: string;
  imageUrl: string;
  createdAt: string;
}

export interface MaintenanceRoom {
  id: string;
  roomNumber: string;
  building: string;
  floor: number;
}

export interface MaintenanceTenant {
  id: string;
  email: string;
  profile?: {
    fullName: string;
    whatsappNumber: string;
  };
}

export interface Maintenance {
  id: string;
  tenantId: string;
  roomId?: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  adminNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  images: string[] | MaintenanceImage[];
  room?: MaintenanceRoom;
  tenant: MaintenanceTenant;
}

export interface GetMaintenancesParams extends PaginationParams {
  search?: string;
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  startDate?: string;
  endDate?: string;
}

export interface CreateMaintenancePayload {
  roomId?: string;
  category: ComplaintCategory;
  description: string;
  images?: File[]; // Files for multipart/form-data
}

export interface UpdateMaintenancePayload {
  status: ComplaintStatus;
  adminNotes?: string;
}