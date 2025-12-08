import api from './api';

// ============================================
// TYPES
// ============================================

export interface FaceVerificationSubmission {
  document_type: 'thai_national_id' | 'passport';
  document_image_key: string;
  selfie_image_key: string;
  passport_number?: string; // Required for passport verification
  passport_country?: string; // Required for passport (default: 'THA')
}

export interface FaceVerificationStatus {
  verification_id?: number;
  user_id: number;
  document_type: 'thai_national_id' | 'passport' | null;
  verification_status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  document_image_url?: string;
  selfie_image_url?: string;
  similarity_score?: number;
  face_match_result?: boolean;
  passport_number?: string;
  rejection_reason?: string;
  submitted_at?: string;
  verified_at?: string;
  verified_by?: number;
}

export interface UploadUrlResponse {
  upload_urls: string[];
  file_keys: string[];
}

// ============================================
// FACE VERIFICATION SERVICE
// ============================================

export const faceVerificationService = {
  /**
   * Submit Thai National ID verification (POST /face-verification/submit)
   * @param documentKey - GCS key of National ID image
   * @param selfieKey - GCS key of selfie image
   */
  submitThaiID: async (documentKey: string, selfieKey: string) => {
    const response = await api.post('/face-verification/submit', {
      document_type: 'thai_national_id',
      document_image_key: documentKey,
      selfie_image_key: selfieKey,
    });
    return response.data;
  },

  /**
   * Submit Passport verification (POST /face-verification/submit)
   * @param documentKey - GCS key of Passport image
   * @param selfieKey - GCS key of selfie image
   * @param passportNumber - Passport number (e.g., "AB1234567")
   * @param passportCountry - Country code (default: "THA")
   */
  submitPassport: async (
    documentKey: string,
    selfieKey: string,
    passportNumber: string,
    passportCountry: string = 'THA'
  ) => {
    const response = await api.post('/face-verification/submit', {
      document_type: 'passport',
      document_image_key: documentKey,
      selfie_image_key: selfieKey,
      passport_number: passportNumber,
      passport_country: passportCountry,
    });
    return response.data;
  },

  /**
   * Check face verification status (GET /face-verification/status)
   */
  getStatus: async (): Promise<FaceVerificationStatus> => {
    const response = await api.get<FaceVerificationStatus>(
      '/face-verification/status'
    );
    return response.data;
  },

  /**
   * Get signed upload URLs for GCS (POST /face-verification/upload-urls)
   * @param fileNames - Array of filenames (e.g., ['id_card.jpg', 'selfie.jpg'])
   * @returns Object with upload_urls and file_keys arrays
   */
  getUploadUrls: async (fileNames: string[]): Promise<UploadUrlResponse> => {
    const response = await api.post<UploadUrlResponse>(
      '/face-verification/upload-urls',
      { file_names: fileNames }
    );
    return response.data;
  },

  /**
   * Upload file directly to GCS using signed URL
   * @param uploadUrl - Signed GCS upload URL
   * @param file - File object to upload
   */
  uploadToGCS: async (uploadUrl: string, file: File) => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`GCS upload failed: ${response.statusText}`);
    }

    return response;
  },

  /**
   * Complete face verification flow
   * Step 1: Get upload URLs
   * Step 2: Upload files to GCS
   * Step 3: Submit verification
   *
   * @example
   * await faceVerificationService.completeThaiIDVerification(
   *   idCardFile,
   *   selfieFile
   * );
   */
  completeThaiIDVerification: async (
    idCardFile: File,
    selfieFile: File
  ): Promise<void> => {
    // Step 1: Get signed URLs
    const { upload_urls, file_keys } = await faceVerificationService.getUploadUrls([
      idCardFile.name,
      selfieFile.name,
    ]);

    // Step 2: Upload files to GCS
    await Promise.all([
      faceVerificationService.uploadToGCS(upload_urls[0], idCardFile),
      faceVerificationService.uploadToGCS(upload_urls[1], selfieFile),
    ]);

    // Step 3: Submit for verification
    await faceVerificationService.submitThaiID(file_keys[0], file_keys[1]);
  },

  /**
   * Complete passport verification flow
   *
   * @example
   * await faceVerificationService.completePassportVerification(
   *   passportFile,
   *   selfieFile,
   *   'AB1234567',
   *   'THA'
   * );
   */
  completePassportVerification: async (
    passportFile: File,
    selfieFile: File,
    passportNumber: string,
    passportCountry: string = 'THA'
  ): Promise<void> => {
    // Step 1: Get signed URLs
    const { upload_urls, file_keys } = await faceVerificationService.getUploadUrls([
      passportFile.name,
      selfieFile.name,
    ]);

    // Step 2: Upload files to GCS
    await Promise.all([
      faceVerificationService.uploadToGCS(upload_urls[0], passportFile),
      faceVerificationService.uploadToGCS(upload_urls[1], selfieFile),
    ]);

    // Step 3: Submit for verification
    await faceVerificationService.submitPassport(
      file_keys[0],
      file_keys[1],
      passportNumber,
      passportCountry
    );
  },
};

export default faceVerificationService;

// Legacy exports for backward compatibility
export const submitFaceVerification = faceVerificationService.submitThaiID;
export const getVerificationStatus = faceVerificationService.getStatus;
