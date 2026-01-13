export enum Module {
  DASHBOARD = 'DASHBOARD',
  PATIENTS = 'PATIENTS',
  APPOINTMENTS = 'APPOINTMENTS',
  CONSULTATION = 'CONSULTATION',
  PHARMACY = 'PHARMACY',
  BILLING = 'BILLING',
  AI_CLINIC = 'AI_CLINIC',
  SETTINGS = 'SETTINGS'
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  lastVisit: string;
  history: string[];
  allergies: string[];
  philhealthId?: string;
  isSeniorCitizen: boolean;
  isPWD: boolean;
  hmoProvider?: string;
  address: {
    barangay: string;
    city: string;
    province: string;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  time: string;
  date: string;
  type: 'Checkup' | 'Follow-up' | 'Procedure' | 'Consultation' | 'Vaccination';
  status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Medicine {
  id: string;
  name: string;
  stock: number;
  expiry: string;
  price: number;
  isGeneric: boolean;
}

export interface Consultation {
  id?: string;
  patientId: string;
  patientName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  transcript?: string;
  date?: string;
}

export interface Invoice {
  id: string;
  patient: string;
  total: number;
  disc: number;
  ph: number;
  net: number;
  status: 'Paid' | 'Pending' | 'Partial' | 'Unpaid';
  method: string;
  date: string;
}
