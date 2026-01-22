/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CoinTransaction } from '@/types';

const COIN_PRICE_MNT = 1000;
const PRESET_AMOUNTS = [10, 50, 100, 500, 1000];

export default function CoinPurchase() {
  const { profile } = useAuth();
  const [coinAmount, setCoinAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/coins/transactions?limit=10');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const totalPrice = coinAmount * COIN_PRICE_MNT;

  const handlePurchase = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/coins/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coinAmount }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setCoinAmount(10);
        setCustomAmount('');
        
        // Reload page to refresh coin balance everywhere
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.error || 'Алдаа гарлаа');
      }
    } catch (err) {
      setError('Сүлжээний алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const num = parseInt(value);
    if (num && num > 0) {
      setCoinAmount(num);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className=" from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Миний монет</h3>
            <p className="text-sm text-gray-600 mt-1">
              1 монет = ₮{COIN_PRICE_MNT.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Үлдэгдэл</p>
            <p className="text-3xl font-bold text-yellow-600">
              {profile?.coin_balance?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Монет сонгох
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setCoinAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                    coinAmount === amount && !customAmount
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="Өөрийн дүн оруулах"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Монет:</span>
              <span className="font-semibold text-gray-900">
                {coinAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Нийт үнэ:</span>
              <span className="text-yellow-600">
                ₮{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={loading || coinAmount < 1}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Төлж байна...' : 'Монет худалдаж авах'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Гүйлгээний түүх
        </h3>
        
        {loadingTransactions ? (
          <div className="text-center py-8 text-gray-500">Уншиж байна...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Гүйлгээ байхгүй байна
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.description || transaction.transaction_type}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <div
                  className={`text-lg font-bold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
