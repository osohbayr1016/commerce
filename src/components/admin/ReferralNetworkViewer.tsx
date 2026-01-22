'use client';

import { useState, useEffect } from 'react';
import { ReferralNetworkNode } from '@/types';

interface NetworkNodeProps {
  node: ReferralNetworkNode;
  onNodeClick: (node: ReferralNetworkNode) => void;
}

function NetworkNode({ node, onNodeClick }: NetworkNodeProps) {
  const [expanded, setExpanded] = useState(node.level < 2);

  const hasChildren = node.children && node.children.length > 0;
  const indent = node.level * 24;

  return (
    <div style={{ marginLeft: `${indent}px` }} className="mb-2">
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
          node.is_top6
            ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
            : 'border-gray-200 bg-white hover:bg-gray-50'
        }`}
        onClick={() => onNodeClick(node)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{node.name}</span>
            {node.is_top6 && (
              <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                Top 6
              </span>
            )}
          </div>
          
          {node.promo_code && (
            <p className="text-xs font-mono text-gray-500 mt-1">
              {node.promo_code}
            </p>
          )}
          
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-gray-600">
              Referrals: <span className="font-semibold">{node.referral_count}</span>
            </span>
            <span className="text-yellow-600">
              Discount: <span className="font-semibold">{node.discount_percent}%</span>
            </span>
            <span className="text-gray-400">
              Level: {node.level}
            </span>
          </div>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="mt-2">
          {node.children.map((child) => (
            <NetworkNode
              key={child.id}
              node={child}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReferralNetworkViewer() {
  const [networks, setNetworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<ReferralNetworkNode | null>(null);
  const [viewMode, setViewMode] = useState<'top6' | 'user'>('top6');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchNetworks();
  }, [viewMode]);

  const fetchNetworks = async () => {
    setLoading(true);
    try {
      const url = viewMode === 'top6' 
        ? '/api/admin/referral-network?top6Only=true'
        : userId 
          ? `/api/admin/referral-network?userId=${userId}`
          : '/api/admin/referral-network';

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNetworks(viewMode === 'top6' ? data.top6_networks || [] : [data.network]);
      }
    } catch (err) {
      console.error('Failed to fetch networks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: ReferralNetworkNode) => {
    setSelectedNode(node);
  };

  if (loading) {
    return <div className="text-center py-8">Уншиж байна...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Referral Network Viewer
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('top6')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'top6'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Top 6 Networks
            </button>
            <button
              onClick={() => setViewMode('user')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Specific User
            </button>
          </div>
        </div>

        {viewMode === 'user' && (
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID оруулна уу..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchNetworks}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Хайх
            </button>
          </div>
        )}

        <div className="text-xs text-gray-500 mb-4">
          💡 Node дээр дарж дэлгэрэнгүй харах. ▶/▼ дарж задлах/хураах
        </div>
      </div>

      {networks.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          Мэдээлэл олдсонгүй
        </div>
      ) : (
        <div className="space-y-4">
          {viewMode === 'top6' ? (
            networks.map((item: any) => (
              <div key={item.top6Member.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.top6Member.full_name || 'Хэрэглэгч'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.top6Member.promo_code} • {item.top6Member.total_referrals} referrals
                  </p>
                </div>
                {item.network ? (
                  <NetworkNode node={item.network} onNodeClick={handleNodeClick} />
                ) : (
                  <p className="text-gray-500 text-sm">Referral байхгүй</p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {networks[0] ? (
                <NetworkNode node={networks[0]} onNodeClick={handleNodeClick} />
              ) : (
                <p className="text-gray-500 text-center py-8">Мэдээлэл байхгүй</p>
              )}
            </div>
          )}
        </div>
      )}

      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Node Details
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Нэр</p>
                <p className="font-semibold text-gray-900">{selectedNode.name}</p>
              </div>

              {selectedNode.promo_code && (
                <div>
                  <p className="text-sm text-gray-500">Promo Code</p>
                  <p className="font-mono font-semibold text-gray-900">
                    {selectedNode.promo_code}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Referrals</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedNode.referral_count}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Discount</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {selectedNode.discount_percent}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedNode.level}
                  </p>
                </div>
              </div>

              {selectedNode.is_top6 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-yellow-800">
                    ⭐ Top 6 Member
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Children</p>
                <p className="font-semibold text-gray-900">
                  {selectedNode.children?.length || 0} direct referrals
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Хаах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
