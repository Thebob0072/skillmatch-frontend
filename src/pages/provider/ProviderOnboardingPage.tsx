import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

interface OnboardingStep {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
}

export const ProviderOnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const steps: OnboardingStep[] = [
    { id: 1, title: t('onboarding.basicInfo'), icon: '👤', completed: false },
    { id: 2, title: t('onboarding.photos'), icon: '📸', completed: false },
    { id: 3, title: t('onboarding.services'), icon: '💼', completed: false },
    { id: 4, title: t('onboarding.schedule'), icon: '📅', completed: false },
    { id: 5, title: t('onboarding.verification'), icon: '✅', completed: false },
  ];

  // Basic Info Form State
  const [basicInfo, setBasicInfo] = useState({
    display_name: '',
    bio: '',
    gender_id: 1,
    age: 20,
    height: 160,
    weight: 50,
    body_type: 'slim',
    ethnicity: 'asian',
    languages: ['thai'],
    location_province: '',
    location_district: '',
    service_type: 'both' as 'incall' | 'outcall' | 'both',
  });

  // Photos State
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  // Services State
  const [services, setServices] = useState<{
    name: string;
    description: string;
    duration: number;
    price: number;
  }[]>([]);

  // Schedule State
  const [schedule, setSchedule] = useState({
    monday: { available: true, start: '10:00', end: '22:00' },
    tuesday: { available: true, start: '10:00', end: '22:00' },
    wednesday: { available: true, start: '10:00', end: '22:00' },
    thursday: { available: true, start: '10:00', end: '22:00' },
    friday: { available: true, start: '10:00', end: '22:00' },
    saturday: { available: true, start: '12:00', end: '00:00' },
    sunday: { available: false, start: '12:00', end: '22:00' },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos([...photos, ...newPhotos]);
      
      // Create previews
      newPhotos.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addService = () => {
    setServices([...services, {
      name: '',
      description: '',
      duration: 60,
      price: 1500,
    }]);
  };

  const updateService = (index: number, field: string, value: string | number) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Submit all data to backend
      // await providerService.completeOnboarding({ basicInfo, photos, services, schedule });
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('onboarding.basicInfoTitle')}
            </h3>
            
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('onboarding.displayName')} *
              </label>
              <input
                type="text"
                value={basicInfo.display_name}
                onChange={e => setBasicInfo({ ...basicInfo, display_name: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                placeholder={t('onboarding.displayNamePlaceholder')}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('onboarding.bio')}
              </label>
              <textarea
                value={basicInfo.bio}
                onChange={e => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none resize-none"
                placeholder={t('onboarding.bioPlaceholder')}
              />
            </div>

            {/* Physical Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('onboarding.age')}
                </label>
                <input
                  type="number"
                  min={20}
                  max={60}
                  value={basicInfo.age}
                  onChange={e => setBasicInfo({ ...basicInfo, age: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('onboarding.height')} (cm)
                </label>
                <input
                  type="number"
                  min={140}
                  max={200}
                  value={basicInfo.height}
                  onChange={e => setBasicInfo({ ...basicInfo, height: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('onboarding.weight')} (kg)
                </label>
                <input
                  type="number"
                  min={35}
                  max={120}
                  value={basicInfo.weight}
                  onChange={e => setBasicInfo({ ...basicInfo, weight: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('onboarding.bodyType')}
                </label>
                <select
                  value={basicInfo.body_type}
                  onChange={e => setBasicInfo({ ...basicInfo, body_type: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                >
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic</option>
                  <option value="average">Average</option>
                  <option value="curvy">Curvy</option>
                  <option value="muscular">Muscular</option>
                </select>
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('onboarding.serviceType')}
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['incall', 'outcall', 'both'].map(type => (
                  <label
                    key={type}
                    className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${
                      basicInfo.service_type === type
                        ? 'bg-neon-pink/20 border-neon-pink'
                        : 'bg-black/30 border-gray-700 hover:border-neon-pink/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value={type}
                      checked={basicInfo.service_type === type}
                      onChange={e => setBasicInfo({ ...basicInfo, service_type: e.target.value as 'incall' | 'outcall' | 'both' })}
                      className="sr-only"
                    />
                    <span className="text-white font-medium capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('onboarding.province')}
                </label>
                <select
                  value={basicInfo.location_province}
                  onChange={e => setBasicInfo({ ...basicInfo, location_province: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                >
                  <option value="">Select Province</option>
                  <option value="bangkok">Bangkok</option>
                  <option value="chiang_mai">Chiang Mai</option>
                  <option value="phuket">Phuket</option>
                  <option value="pattaya">Pattaya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('onboarding.district')}
                </label>
                <input
                  type="text"
                  value={basicInfo.location_district}
                  onChange={e => setBasicInfo({ ...basicInfo, location_district: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-neon-purple/30 rounded-xl text-white focus:border-neon-purple focus:outline-none"
                  placeholder={t('onboarding.districtPlaceholder')}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('onboarding.photosTitle')}
            </h3>
            
            <p className="text-gray-400 mb-4">
              {t('onboarding.photosDescription')}
            </p>

            {/* Photo Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neon-pink/50 rounded-xl cursor-pointer hover:border-neon-pink hover:bg-neon-pink/5 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="text-5xl mb-3">📸</span>
                <p className="text-gray-300">{t('onboarding.dropPhotos')}</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG (MAX. 5MB each)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />
            </label>

            {/* Photo Previews */}
            {photoPreview.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                {photoPreview.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => {
                          setPhotos(photos.filter((_, i) => i !== index));
                          setPhotoPreview(photoPreview.filter((_, i) => i !== index));
                        }}
                        className="p-2 bg-red-500 rounded-full text-white"
                      >
                        ✕
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-neon-gold text-black text-xs font-bold rounded">
                        MAIN
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-neon-purple/10 border border-neon-purple/30 rounded-xl p-4">
              <h4 className="text-white font-bold mb-2">📌 {t('onboarding.photoTips')}</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• {t('onboarding.tip1')}</li>
                <li>• {t('onboarding.tip2')}</li>
                <li>• {t('onboarding.tip3')}</li>
                <li>• {t('onboarding.tip4')}</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('onboarding.servicesTitle')}
            </h3>

            <p className="text-gray-400 mb-4">
              {t('onboarding.servicesDescription')}
            </p>

            {/* Service List */}
            {services.map((service, index) => (
              <div key={index} className="bg-black/30 border border-neon-purple/30 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neon-pink font-bold">Service #{index + 1}</span>
                  <button
                    onClick={() => removeService(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ✕ Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Service Name</label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={e => updateService(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                      placeholder="e.g., Dinner Date, Companion, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={service.description}
                      onChange={e => updateService(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                      placeholder="Brief description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Duration (minutes)</label>
                    <select
                      value={service.duration}
                      onChange={e => updateService(index, 'duration', Number(e.target.value))}
                      className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                    >
                      <option value={30}>30 min</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                      <option value={240}>4 hours</option>
                      <option value={480}>Overnight</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price (THB)</label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={e => updateService(index, 'price', Number(e.target.value))}
                      min={500}
                      step={100}
                      className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addService}
              className="w-full py-4 border-2 border-dashed border-neon-purple/50 rounded-xl text-neon-purple hover:bg-neon-purple/10 transition-all font-bold"
            >
              + Add Service Package
            </button>

            {services.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl block mb-2">💼</span>
                <p>{t('onboarding.noServices')}</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('onboarding.scheduleTitle')}
            </h3>

            <p className="text-gray-400 mb-4">
              {t('onboarding.scheduleDescription')}
            </p>

            {/* Schedule Grid */}
            <div className="space-y-3">
              {Object.entries(schedule).map(([day, config]) => (
                <div
                  key={day}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    config.available ? 'bg-neon-green/10 border border-neon-green/30' : 'bg-gray-900/50 border border-gray-700'
                  }`}
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.available}
                      onChange={e => setSchedule({
                        ...schedule,
                        [day]: { ...config, available: e.target.checked }
                      })}
                      className="w-5 h-5 rounded border-2 border-neon-green bg-black/50 text-neon-green focus:ring-neon-green"
                    />
                    <span className="text-white font-medium capitalize w-24">{day}</span>
                  </label>

                  {config.available && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={config.start}
                        onChange={e => setSchedule({
                          ...schedule,
                          [day]: { ...config, start: e.target.value }
                        })}
                        className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-green focus:outline-none"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={config.end}
                        onChange={e => setSchedule({
                          ...schedule,
                          [day]: { ...config, end: e.target.value }
                        })}
                        className="px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-green focus:outline-none"
                      />
                    </div>
                  )}

                  {!config.available && (
                    <span className="text-gray-500">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('onboarding.verificationTitle')}
            </h3>

            <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🔐</span>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    {t('onboarding.verificationInfo')}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t('onboarding.verificationDescription')}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-gray-700">
                <span className="text-3xl">📱</span>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Phone Verification</h5>
                  <p className="text-sm text-gray-400">Verify your phone number</p>
                </div>
                <button className="px-4 py-2 bg-neon-purple text-white rounded-lg font-medium hover:bg-neon-purple/80 transition-colors">
                  Verify
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-gray-700">
                <span className="text-3xl">🪪</span>
                <div className="flex-1">
                  <h5 className="text-white font-medium">ID Verification</h5>
                  <p className="text-sm text-gray-400">Upload your ID card for age verification</p>
                </div>
                <button className="px-4 py-2 bg-neon-purple text-white rounded-lg font-medium hover:bg-neon-purple/80 transition-colors">
                  Upload
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-gray-700">
                <span className="text-3xl">🤳</span>
                <div className="flex-1">
                  <h5 className="text-white font-medium">Selfie Verification</h5>
                  <p className="text-sm text-gray-400">Take a selfie to prove you're real</p>
                </div>
                <button className="px-4 py-2 bg-neon-purple text-white rounded-lg font-medium hover:bg-neon-purple/80 transition-colors">
                  Take Photo
                </button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-400 text-sm">
                ⚠️ {t('onboarding.verificationNote')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-gold bg-clip-text text-transparent">
              {t('onboarding.title')}
            </span>
          </h1>
          <p className="text-gray-400">
            {t('onboarding.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-800 -z-10" />
          <div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-neon-pink to-neon-purple -z-10 transition-all"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                step.id <= currentStep ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${
                step.id === currentStep
                  ? 'bg-gradient-to-r from-neon-pink to-neon-purple shadow-[0_0_20px_rgba(255,16,240,0.5)]'
                  : step.id < currentStep
                  ? 'bg-neon-green'
                  : 'bg-gray-800'
              }`}>
                {step.id < currentStep ? '✓' : step.icon}
              </div>
              <span className="text-xs text-gray-400 hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border-2 border-neon-purple/30 p-8 shadow-[0_0_60px_rgba(157,0,255,0.2)]">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                currentStep === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,16,240,0.5)] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : currentStep === 5 ? (
                '🚀 Complete Setup'
              ) : (
                'Next →'
              )}
            </button>
          </div>
        </div>

        {/* Skip for now */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-400 text-sm underline"
          >
            {t('onboarding.skipForNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboardingPage;
