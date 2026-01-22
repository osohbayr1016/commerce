/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { Top6Member } from '@/types';

export default function Top6Manager() {
  const [top6Members, setTop6Members] = useState<Top6Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTop6();
  }, []);

  const fetchTop6 = async () => {
    try {
      const response = await fetch('/api/admin/top6');
      if (response.ok) {
        const data = await response.json();
        setTop6Members(data.top6 || []);
      }
    } catch (err) {
      console.error('Failed to fetch Top 6:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setSearchResults([]);
    
    try {
      // Search by promo code or email (simplified - you might want a dedicated endpoint)
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddToTop6 = async (userId: string) => {
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/admin/top6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        await fetchTop6();
        setSearchQuery('');
        setSearchResults([]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Алдаа гарлаа');
    }
  };

  const handleRemoveFromTop6 = async (userId: string) => {
    if (!confirm('Top 6-с хасах уу?')) return;
    
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/admin/top6?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        await fetchTop6();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Алдаа гарлаа');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Уншиж байна...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Top 6 Members ({top6Members.length}/6)
        </h2>

        {top6Members.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Top 6 гишүүд байхгүй байна
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {top6Members.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-4 from-yellow-50 to-amber-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {member.full_name || 'Хэрэглэгч'}
                    </h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    {member.promo_code && (
                      <p className="text-xs font-mono text-gray-500 mt-1">
                        {member.promo_code}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFromTop6(member.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Хасах
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-500">Referrals</p>
                    <p className="text-lg font-bold text-gray-900">
                      {member.stats?.total_referrals || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {member.accumulated_discount_percent}%
                    </p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-500">Network</p>
                    <p className="text-lg font-bold text-gray-900">
                      {member.stats?.network_size || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {top6Members.length < 6 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 6-д хүн нэмэх
          </h3>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Promo код, и-мэйл, нэр хайх..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
            >
              {searching ? 'Хайж байна...' : 'Хайх'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.full_name || 'Хэрэглэгч'}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.promo_code && (
                      <p className="text-xs font-mono text-gray-500">
                        {user.promo_code}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToTop6(user.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition"
                  >
                    Top 6-д нэмэх
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
