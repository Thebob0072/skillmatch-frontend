import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface Photo {
  photo_id: number;
  photo_url: string;
  sort_order: number;
}

export function ManagePhotosPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await api.get('/photos/me');
      setPhotos(response.data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load photos');
      }
      setPhotos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 10) {
      alert('คุณสามารถอัปโหลดได้สูงสุด 10 รูป');
      return;
    }

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 10 * 1024 * 1024) {
          alert(`ไฟล์ ${file.name} ใหญ่เกิน 10MB`);
          continue;
        }

        try {
          // Convert file to base64
          const base64String = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              // Remove data:image/xxx;base64, prefix
              const base64 = result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          // Step 1: Get photo_key from backend
          const startResponse = await api.post('/photos/start');
          const { upload_url, photo_key } = startResponse.data;

          // Check if we should use new base64 flow
          if (upload_url && upload_url.includes('DEPRECATED')) {
            // New flow: Send base64 to /photos/submit
            await api.post('/photos/submit', {
              photo_key,
              image_base64: base64String
            });
          } else {
            // Legacy flow: Upload to GCS using pre-signed URL
            await fetch(upload_url, {
              method: 'PUT',
              body: file,
              headers: {
                'Content-Type': file.type,
              },
            });

            // Submit photo key to backend
            await api.post('/photos/submit', { photo_key });
          }
        } catch (fileError: any) {
          if (fileError.response?.status === 503) {
            alert('ระบบอัปโหลดรูปภาพยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ\n\n(File upload service is not configured)');
          } else {
            alert(`ไม่สามารถอัปโหลด ${file.name}: ${fileError.response?.data?.error || fileError.message}`);
          }
          throw fileError; // Stop further uploads
        }
      }
      
      alert('อัปโหลดรูปภาพสำเร็จ!');
      loadPhotos(); // Reload photos
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Upload error');
      }
      let errorMsg = 'เกิดข้อผิดพลาด';
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        const data = error.response as { error?: string };
        errorMsg = `เกิดข้อผิดพลาด: ${data.error || ''}`.trim();
      } else if (error instanceof Error) {
        errorMsg = `เกิดข้อผิดพลาด: ${error.message}`;
      }
      alert(errorMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('คุณต้องการลบรูปนี้หรือไม่?')) return;

    try {
      await api.delete(`/photos/${photoId}`);
      setPhotos(prev => prev.filter(p => p.photo_id !== photoId));
      alert('ลบรูปสำเร็จ');
    } catch (error: unknown) {
      alert(`ลบรูปไม่สำเร็จ: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 sm:mb-8 neon-text-effect animate-pulse-slow">
        {t('manage_photos_title') || 'Manage Photos'}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-glow-purple animate-float mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
              disabled={uploading}
            />
            <label
              htmlFor="photo-upload"
              className={`block border-2 border-dashed border-purple-500 border-opacity-30 rounded-lg p-6 sm:p-8 lg:p-12 text-center hover:border-purple-400 hover:border-opacity-100 transition-all ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover-lift'} glass-dark`}
            >
              <div className="text-5xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4 animate-pulse-slow">📸</div>
              <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-2 font-semibold">
                {uploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่อเลือกรูปภาพ'}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">สูงสุด 10 รูป, ขนาดไม่เกิน 10MB ต่อรูป</p>
              <p className="text-gray-500 text-xs mt-2">รูปภาพปัจจุบัน: {photos.length}/10</p>
            </label>
          </div>

          {/* Photo Grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.photo_id} className="relative group">
                  <img
                    src={photo.photo_url}
                    alt={`Photo ${photo.photo_id}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeletePhoto(photo.photo_id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    #{photo.sort_order}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">ยังไม่มีรูปภาพ</p>
              <p className="text-sm">คลิกปุ่มด้านบนเพื่ออัปโหลดรูปภาพของคุณ</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManagePhotosPage;
