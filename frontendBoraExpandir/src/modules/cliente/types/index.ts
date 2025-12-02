export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  accessGranted: boolean;
  createdAt: Date;
}

export interface Document {
  id: string;
  clientId: string;
  name: string;
  type: string;
  status: 'pending' | 'analyzing' | 'approved' | 'rejected';
  uploadDate: Date;
  rejectionReason?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ProcessStep {
  id: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  completedAt?: Date;
  description?: string;
}

export interface Process {
  id: string;
  clientId: string;
  serviceType: string;
  currentStep: number;
  steps: ProcessStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  clientId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface RequiredDocument {
  type: string;
  name: string;
  description: string;
  required: boolean;
  examples?: string[];
}
