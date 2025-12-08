import api from './api';

export interface ProviderDocument {
  document_id: number;
  user_id: number;
  document_type: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

export interface UploadDocumentRequest {
  document_type: 'national_id' | 'health_certificate' | 'business_license' | 'portfolio' | 'certification';
  file_url: string;
  file_name: string;
}

export interface DocumentsResponse {
  documents: ProviderDocument[];
}

export const uploadDocument = async (data: UploadDocumentRequest): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/provider/documents', data);
  return response.data;
};

export const getMyDocuments = async (): Promise<DocumentsResponse> => {
  const response = await api.get<DocumentsResponse>('/provider/documents');
  return response.data;
};

export const deleteDocument = async (documentId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/provider/documents/${documentId}`);
  return response.data;
};
