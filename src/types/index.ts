
export interface Report {
  id: string;
  userId: string;
  userName: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'completed';
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  painLevel: number;
  prescription?: Prescription;
}

export interface Prescription {
  id: string;
  reportId: string;
  createdAt: string;
  diagnosis: string;
  treatment: string;
  medications: Medication[];
  followUpDate?: string;
  doctorNotes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}
