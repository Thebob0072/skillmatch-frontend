import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getTrustedContacts, 
  addTrustedContact, 
  deleteTrustedContact,
  TrustedContact 
} from '../../services/safetyService';

interface TrustedContactsManagerProps {
  maxContacts?: number;
}

export const TrustedContactsManager: React.FC<TrustedContactsManagerProps> = ({ 
  maxContacts = 3 
}) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    relationship: 'friend'
  });

  const relationships = [
    { value: 'friend', label: t('safety.contacts.relationships.friend') },
    { value: 'family', label: t('safety.contacts.relationships.family') },
    { value: 'partner', label: t('safety.contacts.relationships.partner') },
    { value: 'other', label: t('safety.contacts.relationships.other') }
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await getTrustedContacts();
      setContacts(data);
    } catch (err) {
      setError(t('safety.contacts.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone_number) return;

    try {
      setIsAdding(true);
      await addTrustedContact(formData);
      await fetchContacts();
      setShowAddForm(false);
      setFormData({ name: '', phone_number: '', relationship: 'friend' });
    } catch (err) {
      setError(t('safety.contacts.addError'));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm(t('safety.contacts.confirmDelete'))) return;

    try {
      await deleteTrustedContact(contactId);
      setContacts(contacts.filter(c => c.contact_id !== contactId));
    } catch (err) {
      setError(t('safety.contacts.deleteError'));
    }
  };

  const getRelationshipEmoji = (relationship: string) => {
    switch (relationship) {
      case 'family': return '👨‍👩‍👧';
      case 'friend': return '👫';
      case 'partner': return '💑';
      default: return '👤';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('safety.contacts.title')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('safety.contacts.description')}
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {contacts.length}/{maxContacts}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Contact List */}
        <div className="space-y-3 mb-6">
          {contacts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-gray-500">{t('safety.contacts.noContacts')}</p>
            </div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact.contact_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {getRelationshipEmoji(contact.relationship)}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.phone_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {relationships.find(r => r.value === contact.relationship)?.label}
                  </span>
                  <button
                    onClick={() => handleDeleteContact(contact.contact_id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title={t('common.delete')}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Button or Form */}
        {!showAddForm && contacts.length < maxContacts && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            + {t('safety.contacts.addContact')}
          </button>
        )}

        {showAddForm && (
          <form onSubmit={handleAddContact} className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('safety.contacts.form.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('safety.contacts.form.namePlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('safety.contacts.form.phone')}
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0812345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('safety.contacts.form.relationship')}
              </label>
              <select
                value={formData.relationship}
                onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {relationships.map(rel => (
                  <option key={rel.value} value={rel.value}>{rel.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isAdding ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TrustedContactsManager;
