'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { SpinProduct, SpinEligibility, SpinResult, Product } from '@/types';

export default function SpinWheel() {
  const { user, profile, refreshProfile } = useAuth();
  const [spinProducts, setSpinProducts] = useState<SpinProduct[]>([]);
  const [eligibility, setEligibility] = useState<SpinEligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, eligibilityRes] = await Promise.all([
        fetch('/api/admin/spin/products'),
        fetch('/api/spin/eligibility'),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        const active = data.filter((p: SpinProduct) => p.is_active);
        setSpinProducts(active);
      }

      if (eligibilityRes.ok) {
        const data = await eligibilityRes.json();
        setEligibility(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async () => {
    if (spinning || !eligibility?.can_spin) return;

    setSpinning(true);
    setResult(null);
    setShowResult(false);

    try {
      // Generate random session ID
      const sessionId = `spin_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const res = await fetch('/api/spin/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data: SpinResult = await res.json();

      if (data.success && data.won_product) {
        // Calculate which segment was won
        const wonIndex = spinProducts.findIndex(
          (p) => p.product_id === data.won_product!.id
        );
        
        // Calculate rotation to land on that segment
        const segmentAngle = 360 / spinProducts.length;
        const targetAngle = wonIndex * segmentAngle;
        
        // Add multiple full rotations for effect (5-8 full spins)
        const fullRotations = Math.floor(Math.random() * 3) + 5;
        const totalRotation = rotation + (fullRotations * 360) + (360 - targetAngle);
        
        // Start spinning animation
        setRotation(totalRotation);
        
        // Show result after animation completes (4 seconds)
        setTimeout(() => {
          setResult(data);
          setShowResult(true);
          setSpinning(false);
          refreshProfile(); // Update coin balance
        }, 4000);
      } else {
        setResult(data);
        setShowResult(true);
        setSpinning(false);
      }
    } catch (err) {
      console.error('Error spinning:', err);
      setSpinning(false);
      alert('Алдаа гарлаа. Дахин оролдоно уу.');
    }
  };

  const closeResultModal = () => {
    setShowResult(false);
    fetchData(); // Refresh eligibility
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-lg text-gray-600">Ачааллаж байна...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-lg font-medium text-yellow-900 mb-2">
          Нэвтрэх шаардлагатай
        </div>
        <p className="text-yellow-700">
          Spin эргүүлэхийн тулд нэвтэрнэ үү
        </p>
      </div>
    );
  }

  if (spinProducts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-lg font-medium text-gray-900 mb-2">
          Одоогоор spin боломжгүй байна
        </div>
        <p className="text-gray-600">
          Администратор бүтээгдэхүүн нэмэх хүртэл хүлээнэ үү
        </p>
      </div>
    );
  }

  const segmentAngle = 360 / spinProducts.length;

  return (
    <div className="space-y-6">
      {/* Eligibility Status */}
      <div className={`rounded-lg p-4 ${
        eligibility?.can_spin
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-medium ${
              eligibility?.can_spin ? 'text-green-900' : 'text-red-900'
            }`}>
              {eligibility?.reason}
            </div>
            {eligibility?.can_spin && (
              <div className="text-sm text-green-700 mt-1">
                Үнэ: {eligibility.cost_coins} coin (₮{(eligibility.cost_coins || 0) * 1000})
              </div>
            )}
            {eligibility?.next_spin_at && (
              <div className="text-sm text-red-700 mt-1">
                Дараагийн spin: {new Date(eligibility.next_spin_at).toLocaleString('mn-MN')}
              </div>
            )}
          </div>
          <div className="text-2xl">
            {eligibility?.can_spin ? '✅' : '❌'}
          </div>
        </div>
      </div>

      {/* User Balance */}
      <div className=" from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-yellow-700 font-medium">Таны данс</div>
            <div className="text-2xl font-bold text-yellow-900">
              {profile?.coin_balance || 0} coins
            </div>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      {/* Spin Wheel */}
      <div className="flex flex-col items-center">
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          {/* Pointer/Arrow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-2">
            <div className="w-0 h-0 border-l-transparent border-r-transparent  border-t-red-500 drop-shadow-lg" />
          </div>

          {/* Wheel Container */}
          <div
            ref={wheelRef}
            className="relative w-full h-full rounded-full shadow-2xl overflow-hidden border-8 border-gray-800"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            }}
          >
            {spinProducts.map((sp, index) => {
              const startAngle = index * segmentAngle;
              const colors = [
                'bg-red-500',
                'bg-blue-500',
                'bg-green-500',
                'bg-yellow-500',
                'bg-purple-500',
                'bg-pink-500',
                'bg-indigo-500',
                'bg-orange-500',
              ];
              const color = colors[index % colors.length];

              return (
                <div
                  key={sp.id}
                  className={`absolute w-full h-full ${color} bg-opacity-90`}
                  style={{
                    clipPath: `polygon(50% 50%, 
                      ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, 
                      ${50 + 50 * Math.cos((startAngle + segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + segmentAngle - 90) * Math.PI / 180)}%)`,
                  }}
                >
                  <div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `rotate(${startAngle + segmentAngle / 2}deg) translateY(-100px)`,
                    }}
                  >
                    <div
                      className="text-white text-center font-bold text-sm"
                      style={{ transform: 'rotate(0deg)' }}
                    >
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 max-w-[80px]">
                        <img
                          src={sp.image_url || sp.product?.image_url || '/placeholder.png'}
                          alt=""
                          className="w-12 h-12 object-cover rounded mx-auto mb-1"
                        />
                        <div className="text-xs truncate">
                          {sp.display_name || sp.product?.name_mn || 'Product'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-2xl">
              🎰
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={!eligibility?.can_spin || spinning}
          className={`mt-8 px-8 py-4 rounded-full text-xl font-bold transition-all transform ${
            eligibility?.can_spin && !spinning
              ? ' from-yellow-400 to-orange-500 text-white hover:scale-105 hover:shadow-2xl active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {spinning ? '🎰 Эргэж байна...' : '🎰 SPIN ЭРГҮҮЛЭХ'}
        </button>

        {eligibility?.can_spin && !spinning && (
          <div className="text-center text-sm text-gray-600 mt-2">
            100,000 MNT (100 coins)
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center transform animate-bounce-in">
            {result.success ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Баяр хүргэе!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Та дараах бүтээгдэхүүн хожлоо!
                </p>
                <div className=" from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
                  <img
                    src={result.won_product?.image_url || '/placeholder.png'}
                    alt={result.won_product?.name}
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                  />
                  <div className="text-xl font-bold text-gray-900">
                    {result.won_product?.name}
                  </div>
                  <div className="text-lg text-gray-700 mt-2">
                    Үнэ: ₮{(result.won_product?.price || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="text-sm text-green-700">
                    ✅ Сагсанд автоматаар нэмэгдлээ
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Шинэ данс: {result.new_coin_balance} coins
                  </div>
                </div>
                <button
                  onClick={closeResultModal}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Сайн байна уу! 👍
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Алдаа гарлаа
                </h2>
                <p className="text-gray-600 mb-6">
                  {result.error || 'Дахин оролдоно уу'}
                </p>
                <button
                  onClick={closeResultModal}
                  className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  Хаах
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
