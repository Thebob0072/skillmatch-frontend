import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AgeVerificationModal = ({ isOpen, onConfirm, onCancel }: AgeVerificationModalProps) => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (checked) {
      onConfirm();
    }
  };

  const handleDecline = () => {
    localStorage.removeItem('authToken');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-pink-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔞</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Age Verification Required
          </h2>
          <p className="text-gray-400 text-sm">
            ยืนยันอายุก่อนเข้าใช้งาน
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-white text-center mb-4">
            You must be <span className="text-pink-500 font-bold">18 years or older</span> to access this platform.
          </p>
          <p className="text-gray-400 text-sm text-center">
            คุณต้องมีอายุ <span className="text-pink-500">18 ปีขึ้นไป</span> เพื่อเข้าใช้งานแพลตฟอร์มนี้
          </p>
        </div>

        <label className="flex items-start space-x-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 w-5 h-5 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
          />
          <span className="text-sm text-gray-300">
            I confirm that I am 18 years of age or older and agree to the Terms of Service and Privacy Policy.
            <br />
            <span className="text-gray-500 text-xs">
              ฉันยืนยันว่าอายุ 18 ปีขึ้นไป และยอมรับเงื่อนไขการใช้งาน
            </span>
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Decline / ปฏิเสธ
          </button>
          <button
            onClick={handleConfirm}
            disabled={!checked}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              checked
                ? 'bg-pink-500 hover:bg-pink-600 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm / ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
