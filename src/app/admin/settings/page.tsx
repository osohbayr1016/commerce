'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Setting {
  key: string;
  value: string;
}

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['site_name', 'site_description']);

      if (error) throw error;

      data?.forEach((setting: Setting) => {
        if (setting.key === 'site_name') setSiteName(setting.value);
        if (setting.key === 'site_description') setSiteDescription(setting.value);
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updates = [
        { key: 'site_name', value: siteName },
        { key: 'site_description', value: siteDescription },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      setMessage('Тохиргоо амжилттай хадгалагдлаа!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-600">Ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Вэбсайтын тохиргоо
        </h1>
        <p className="text-base text-gray-600">
          Вэбсайтын үндсэн мэдээллийг засах
        </p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div>
              <label
                htmlFor="siteName"
                className="block text-base font-semibold text-black mb-2"
              >
                Вэбсайтын нэр
              </label>
              <input
                type="text"
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Жишээ: shoez.mn"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Вэбсайтын толгойд харагдах нэр
              </p>
            </div>

            <div>
              <label
                htmlFor="siteDescription"
                className="block text-base font-semibold text-black mb-2"
              >
                Вэбсайтын тайлбар
              </label>
              <textarea
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Вэбсайтын тухай богино тайлбар"
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes('амжилттай')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-colors ${
                saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {saving ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
            <button
              type="button"
              onClick={fetchSettings}
              className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Цуцлах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
