
export interface FileUploadData {
  file: File;
  onSuccess: (url: string) => void;
  onError: (error: Error) => void;
}

export interface UploadReportData {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  painLevel: number;
}
