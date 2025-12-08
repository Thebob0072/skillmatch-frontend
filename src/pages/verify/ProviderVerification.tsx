import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface ProfilePhoto {
  file: File;
  preview: string;
  id: string;
}

/**
 * ProviderVerification Component
 * 
 * For providers: Full identity verification
 * 1. Enter birth date (must be 20+)
 * 2. Upload ID document (1 clear photo) + check clarity
 * 3. Upload profile photos (minimum 3)
 * 4. Face scan to verify matches profile photos
 * 5. Submit for review
 */
export function ProviderVerification() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState<'birthdate' | 'id_document' | 'profile_photos' | 'face_scan' | 'submitting' | 'success'>('birthdate');
  const [birthDate, setBirthDate] = useState('');
  
  // ID Document
  const [idDocument, setIdDocument] = useState<{ file: File; preview: string } | null>(null);
  const [idClarity, setIdClarity] = useState<'checking' | 'clear' | 'unclear' | null>(null);
  
  // Profile Photos (minimum 3)
  const [profilePhotos, setProfilePhotos] = useState<ProfilePhoto[]>([]);
  
  // Face Scan
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check image clarity (simple check based on file size and dimensions)
  const checkImageClarity = useCallback(async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Check minimum dimensions (at least 500x300)
        const isLargeEnough = img.width >= 500 && img.height >= 300;
        // Check file size (at least 100KB for a clear ID photo)
        const hasGoodSize = file.size >= 100 * 1024;
        resolve(isLargeEnough && hasGoodSize);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Validate birth date
  const handleBirthDateSubmit = () => {
    if (!birthDate) {
      setError(t('verification.error_birthdate', 'Please enter your birth date'));
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 20) {
      setError(t('verification.error_age', 'You must be at least 20 years old'));
      return;
    }

    setError(null);
    setStep('id_document');
  };

  // Handle ID document upload
  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError(t('verification.error_image_only', 'Please upload image files only'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t('verification.error_file_size', 'File size must be less than 10MB'));
      return;
    }

    setIdClarity('checking');
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const preview = reader.result as string;
      setIdDocument({ file, preview });
      
      // Check clarity
      const isClear = await checkImageClarity(file);
      setIdClarity(isClear ? 'clear' : 'unclear');
      
      if (!isClear) {
        setError(t('verification.error_unclear', 'Image is not clear enough. Please upload a higher quality photo.'));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle profile photo upload (multiple)
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setProfilePhotos(prev => [...prev, { file, preview, id }]);
      };
      reader.readAsDataURL(file);
    });
    setError(null);
  };

  // Remove profile photo
  const removeProfilePhoto = (id: string) => {
    setProfilePhotos(prev => prev.filter(p => p.id !== id));
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setError(null);
    } catch (err) {
      setError(t('verification.error_camera', 'Could not access camera. Please allow camera permissions.'));
    }
  };

  // Capture face photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'face_scan.jpg', { type: 'image/jpeg' });
          setFaceImage(file);
          setFacePreview(canvas.toDataURL('image/jpeg', 0.8));
        }
      }, 'image/jpeg', 0.8);
      
      stopCamera();
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Retake face photo
  const retakePhoto = () => {
    setFaceImage(null);
    setFacePreview(null);
    startCamera();
  };

  // Submit verification
  const handleSubmit = async () => {
    if (!idDocument || profilePhotos.length < 3 || !faceImage) {
      setError(t('verification.error_incomplete', 'Please complete all verification steps'));
      return;
    }

    setLoading(true);
    setError(null);
    setStep('submitting');

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('birth_date', birthDate);
      formData.append('id_document', idDocument.file);
      formData.append('face_scan', faceImage);
      
      // Add all profile photos
      profilePhotos.forEach((photo, index) => {
        formData.append(`profile_photo_${index}`, photo.file);
      });
      formData.append('profile_photo_count', profilePhotos.length.toString());

      // Submit to backend
      await api.post('/verification/provider-submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update user status
      const updatedUser = { ...user!, verification_status: 'pending' as const };
      updateUser(updatedUser);

      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.error || t('verification.error_submit', 'Failed to submit verification'));
      setStep('face_scan');
    } finally {
      setLoading(false);
    }
  };

  const hasEnoughPhotos = profilePhotos.length >= 3;
  
  // Store step for comparison (avoid TS narrowing issues)
  const currentStep = step;
  const isBirthDateDone = birthDate && currentStep !== 'birthdate';
  const isIdDocDone = idDocument && idClarity === 'clear' && currentStep !== 'id_document';
  const isPhotosDone = hasEnoughPhotos && currentStep !== 'profile_photos';
  const isFaceDone = faceImage && currentStep !== 'face_scan';

  // Success state
  if (step === 'success') {
    return (
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-8 border border-green-500/30 text-center">
        <span className="text-6xl mb-4 block">📨</span>
        <h2 className="text-2xl font-bold text-green-400 mb-4">
          {t('verification.submitted_title', 'Verification Submitted!')}
        </h2>
        <p className="text-gray-300 mb-6">
          {t('verification.submitted_desc', 'Your documents have been submitted for review. This usually takes 24-48 hours. We will notify you once your verification is complete.')}
        </p>
        <a 
          href="/dashboard"
          className="inline-block px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          {t('verification.go_dashboard', 'Go to Dashboard')}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 flex-wrap">
        {/* Step 1: Birth Date */}
        <div className={`flex items-center gap-1 ${currentStep === 'birthdate' ? 'text-neon-pink' : birthDate ? 'text-green-400' : 'text-gray-500'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            currentStep === 'birthdate' ? 'bg-neon-pink text-black' : isBirthDateDone ? 'bg-green-500 text-black' : 'bg-gray-700'
          }`}>
            {isBirthDateDone ? '✓' : '1'}
          </span>
          <span className="hidden lg:inline text-xs">{t('verification.step_age', 'Age')}</span>
        </div>
        
        <div className="w-4 sm:w-8 h-0.5 bg-gray-700" />
        
        {/* Step 2: ID Document */}
        <div className={`flex items-center gap-1 ${currentStep === 'id_document' ? 'text-neon-pink' : idDocument && idClarity === 'clear' ? 'text-green-400' : 'text-gray-500'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            currentStep === 'id_document' ? 'bg-neon-pink text-black' : isIdDocDone ? 'bg-green-500 text-black' : 'bg-gray-700'
          }`}>
            {isIdDocDone ? '✓' : '2'}
          </span>
          <span className="hidden lg:inline text-xs">{t('verification.step_id', 'ID')}</span>
        </div>
        
        <div className="w-4 sm:w-8 h-0.5 bg-gray-700" />
        
        {/* Step 3: Profile Photos */}
        <div className={`flex items-center gap-1 ${currentStep === 'profile_photos' ? 'text-neon-pink' : hasEnoughPhotos ? 'text-green-400' : 'text-gray-500'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            currentStep === 'profile_photos' ? 'bg-neon-pink text-black' : isPhotosDone ? 'bg-green-500 text-black' : 'bg-gray-700'
          }`}>
            {isPhotosDone ? '✓' : '3'}
          </span>
          <span className="hidden lg:inline text-xs">{t('verification.step_photos', 'Photos')}</span>
        </div>
        
        <div className="w-4 sm:w-8 h-0.5 bg-gray-700" />
        
        {/* Step 4: Face Scan */}
        <div className={`flex items-center gap-1 ${currentStep === 'face_scan' ? 'text-neon-pink' : faceImage ? 'text-green-400' : 'text-gray-500'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            currentStep === 'face_scan' ? 'bg-neon-pink text-black' : isFaceDone ? 'bg-green-500 text-black' : 'bg-gray-700'
          }`}>
            {isFaceDone ? '✓' : '4'}
          </span>
          <span className="hidden lg:inline text-xs">{t('verification.step_face', 'Face')}</span>
        </div>
        
        <div className="w-4 sm:w-8 h-0.5 bg-gray-700" />
        
        {/* Step 5: Submit */}
        <div className={`flex items-center gap-1 ${['submitting', 'success'].includes(currentStep) ? 'text-neon-pink' : 'text-gray-500'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            ['submitting', 'success'].includes(currentStep) ? 'bg-neon-pink text-black' : 'bg-gray-700'
          }`}>
            5
          </span>
          <span className="hidden lg:inline text-xs">{t('verification.step_submit', 'Submit')}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Step 1: Birth Date */}
      {step === 'birthdate' && (
        <div className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-neon-pink/20">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            🎂 {t('verification.birthdate_title', 'Enter Your Birth Date')}
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            {t('verification.birthdate_desc', 'You must be at least 20 years old to become a verified provider.')}
          </p>

          <div className="max-w-xs mx-auto">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white text-center text-lg focus:border-neon-pink focus:outline-none"
            />
          </div>

          <button
            onClick={handleBirthDateSubmit}
            disabled={!birthDate}
            className="w-full mt-6 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('verification.next', 'Next')} →
          </button>
        </div>
      )}

      {/* Step 2: ID Document Upload */}
      {step === 'id_document' && (
        <div className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-neon-pink/20">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            🪪 {t('verification.id_title', 'Upload ID Document')}
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            {t('verification.id_desc', 'Upload a clear photo of your ID card or passport. We will check the image quality.')}
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleIdUpload}
            className="hidden"
            id="id-upload"
          />

          {idDocument ? (
            <div className="relative">
              <img 
                src={idDocument.preview} 
                alt="ID Document"
                className="w-full max-h-64 object-contain rounded-xl border border-gray-600"
              />
              
              {/* Clarity indicator */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {idClarity === 'checking' && (
                  <span className="text-yellow-400 animate-pulse">⏳ {t('verification.checking_clarity', 'Checking image quality...')}</span>
                )}
                {idClarity === 'clear' && (
                  <span className="text-green-400">✅ {t('verification.clarity_ok', 'Image is clear!')}</span>
                )}
                {idClarity === 'unclear' && (
                  <span className="text-red-400">❌ {t('verification.clarity_bad', 'Image is not clear enough')}</span>
                )}
              </div>

              <label
                htmlFor="id-upload"
                className="block mt-4 py-3 text-center text-gray-400 hover:text-white cursor-pointer"
              >
                🔄 {t('verification.change_photo', 'Change photo')}
              </label>
            </div>
          ) : (
            <label
              htmlFor="id-upload"
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-xl hover:border-neon-pink/50 transition-colors cursor-pointer"
            >
              <span className="text-5xl mb-4">🪪</span>
              <p className="text-white font-medium">{t('verification.id_card_passport', 'ID Card or Passport')}</p>
              <p className="text-gray-500 text-sm mt-2">{t('verification.click_upload', 'Click to upload')}</p>
            </label>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep('birthdate')}
              className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
            >
              ← {t('common.back', 'Back')}
            </button>
            <button
              onClick={() => setStep('profile_photos')}
              disabled={!idDocument || idClarity !== 'clear'}
              className="flex-1 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('verification.next', 'Next')} →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Profile Photos */}
      {step === 'profile_photos' && (
        <div className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-neon-blue/20">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            📸 {t('verification.photos_title', 'Upload Profile Photos')}
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            {t('verification.photos_desc', 'Upload at least 3 photos of yourself. These will be used to verify your identity against the face scan.')}
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleProfilePhotoUpload}
            className="hidden"
            id="profile-upload"
          />

          {/* Photo grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
            {profilePhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group">
                <img 
                  src={photo.preview} 
                  alt="Profile"
                  className="w-full h-full object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => removeProfilePhoto(photo.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {/* Add more button */}
            <label
              htmlFor="profile-upload"
              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg hover:border-neon-pink/50 transition-colors cursor-pointer"
            >
              <span className="text-2xl">➕</span>
              <span className="text-xs text-gray-500 mt-1">{t('common.add', 'Add')}</span>
            </label>
          </div>

          {/* Counter */}
          <div className={`text-center mb-6 ${hasEnoughPhotos ? 'text-green-400' : 'text-yellow-400'}`}>
            {profilePhotos.length}/3 {t('verification.photos_minimum', 'photos (minimum 3)')}
            {hasEnoughPhotos && ' ✓'}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('id_document')}
              className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
            >
              ← {t('common.back', 'Back')}
            </button>
            <button
              onClick={() => setStep('face_scan')}
              disabled={!hasEnoughPhotos}
              className="flex-1 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('verification.next', 'Next')} →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Face Scan */}
      {step === 'face_scan' && (
        <div className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-neon-purple/20">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            🤳 {t('verification.face_title', 'Face Verification')}
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            {t('verification.face_desc_match', 'Take a clear photo of your face. We will verify it matches your profile photos.')}
          </p>

          {/* Profile photos preview */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">{t('verification.your_photos', 'Your profile photos:')}</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {profilePhotos.slice(0, 5).map((photo) => (
                <img 
                  key={photo.id}
                  src={photo.preview} 
                  alt="Profile"
                  className="w-12 h-12 object-cover rounded-lg border border-gray-600 flex-shrink-0"
                />
              ))}
              {profilePhotos.length > 5 && (
                <span className="w-12 h-12 flex items-center justify-center text-gray-500 text-sm">
                  +{profilePhotos.length - 5}
                </span>
              )}
            </div>
          </div>

          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
            {facePreview ? (
              <img 
                src={facePreview} 
                alt="Face capture"
                className="w-full h-full object-cover"
              />
            ) : cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <span className="text-6xl mb-4">📷</span>
                <p>{t('verification.camera_placeholder', 'Camera will appear here')}</p>
              </div>
            )}

            {/* Face guide overlay */}
            {cameraActive && !facePreview && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-52 border-4 border-dashed border-neon-blue/50 rounded-full" />
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Camera controls */}
          <div className="flex gap-4">
            {!cameraActive && !facePreview && (
              <>
                <button
                  onClick={() => setStep('profile_photos')}
                  className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
                >
                  ← {t('common.back', 'Back')}
                </button>
                <button
                  onClick={startCamera}
                  className="flex-1 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  📷 {t('verification.start_camera', 'Start Camera')}
                </button>
              </>
            )}

            {cameraActive && !facePreview && (
              <>
                <button
                  onClick={() => { stopCamera(); }}
                  className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  📸 {t('verification.capture', 'Capture Photo')}
                </button>
              </>
            )}

            {facePreview && (
              <>
                <button
                  onClick={retakePhoto}
                  className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
                >
                  🔄 {t('verification.retake', 'Retake')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? t('common.loading', 'Loading...') : `✓ ${t('verification.submit', 'Submit Verification')}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Submitting state */}
      {step === 'submitting' && (
        <div className="bg-black/40 rounded-2xl p-8 border border-neon-purple/20 text-center">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h3 className="text-xl font-bold text-white mb-4">
            {t('verification.submitting', 'Submitting Verification...')}
          </h3>
          <p className="text-gray-400 mb-2">
            {t('verification.please_wait', 'Please wait while we upload your documents.')}
          </p>
          <p className="text-gray-500 text-sm">
            {t('verification.analyzing', 'Analyzing face match with profile photos...')}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProviderVerification;
