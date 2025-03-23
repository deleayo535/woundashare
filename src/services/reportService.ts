
import { Report, Prescription } from '@/types';

// Mock data
let reports: Report[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Demo Patient',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'completed',
    title: 'Ankle wound from cycling accident',
    description: 'I fell off my bike and got a deep cut on my right ankle. It seems to be healing slowly but there is some redness around the wound.',
    imageUrl: '/placeholder.svg',
    location: 'Right ankle',
    painLevel: 3,
    prescription: {
      id: 'p1',
      reportId: '1',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      diagnosis: 'Mild infection in healing laceration',
      treatment: 'Clean the wound daily with mild soap and water. Apply antibiotic ointment and cover with a sterile bandage.',
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '7 days',
        },
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'As needed for pain',
          duration: 'Up to 5 days',
        }
      ],
      followUpDate: new Date(Date.now() + 3600000 * 168).toISOString(),
      doctorNotes: 'If redness increases or fever develops, seek immediate medical attention.',
    }
  },
  {
    id: '2',
    userId: 'user-1',
    userName: 'Demo Patient',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'pending',
    title: 'Hand burn from cooking',
    description: 'I accidentally touched a hot pan while cooking and burned my palm. The skin is red and there are small blisters forming.',
    imageUrl: '/placeholder.svg',
    location: 'Left palm',
    painLevel: 4,
  }
];

// Save report image (simulated)
export const uploadImage = async (file: File): Promise<string> => {
  // In a real app, you would upload to a server or cloud storage
  // For now, we'll just return a placeholder
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload time
  
  return '/placeholder.svg';
};

// Get all reports for a user
export const getUserReports = async (userId: string): Promise<Report[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return reports.filter(report => report.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get all reports for admin
export const getAllReports = async (): Promise<Report[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return reports.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get single report
export const getReport = async (reportId: string): Promise<Report | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return reports.find(report => report.id === reportId);
};

// Create a new report
export const createReport = async (report: Omit<Report, 'id' | 'createdAt' | 'status'>): Promise<Report> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const newReport: Report = {
    ...report,
    id: `report-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  
  reports = [newReport, ...reports];
  return newReport;
};

// Add a prescription to a report
export const addPrescription = async (
  reportId: string, 
  prescriptionData: Omit<Prescription, 'id' | 'reportId' | 'createdAt'>
): Promise<Report> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) {
    throw new Error('Report not found');
  }
  
  const prescription: Prescription = {
    ...prescriptionData,
    id: `prescription-${Date.now()}`,
    reportId,
    createdAt: new Date().toISOString(),
  };
  
  const updatedReport = { 
    ...reports[reportIndex], 
    status: 'completed' as const,
    prescription 
  };
  
  reports[reportIndex] = updatedReport;
  return updatedReport;
};
