'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LowStockAlert {
  id: string;
  product_id: string;
  product_name: string;
  current_quantity: number;
  minimum_threshold: number;
  reorder_quantity: number;
  supplier_id: string | null;
  supplier_name: string | null;
  alert_level: 'critical' | 'warning' | 'info';
  created_at: string;
  dismissed: boolean;
}

export default function LowStockAlertsPage() {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  useEffect(() => {
    fetchAlerts();
  }, [activeFilter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = activeFilter !== 'all' ? `?level=${activeFilter}` : '';
      const response = await fetch(`/api/inventory/low-stock-alerts${params}`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
        setError('');
      } else {
        setError('Failed to load alerts');
      }
    } catch (err) {
      setError('Error fetching alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      const response = await fetch(`/api/inventory/low-stock-alerts/${alertId}/dismiss`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId));
      }
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 border-red-200 border-l-4 border-l-red-600';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-600';
      case 'info':
        return 'bg-blue-50 border-blue-200 border-l-4 border-l-blue-600';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getAlertBadgeColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => !alert.dismissed);
  const criticalCount = filteredAlerts.filter(a => a.alert_level === 'critical').length;
  const warningCount = filteredAlerts.filter(a => a.alert_level === 'warning').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Low Stock Alerts</h1>
          <p className="mt-2 text-gray-600">Monitor products that are running low on inventory</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-red-600 text-3xl font-bold">{criticalCount}</div>
            <p className="text-gray-600 text-sm mt-2">Critical Alerts</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-yellow-600 text-3xl font-bold">{warningCount}</div>
            <p className="text-gray-600 text-sm mt-2">Warning Alerts</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-3xl font-bold">{filteredAlerts.length}</div>
            <p className="text-gray-600 text-sm mt-2">Total Alerts</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'critical', 'warning', 'info'] as const).map(level => (
              <button
                key={level}
                onClick={() => setActiveFilter(level)}
                className={`px-4 py-2 rounded-lg transition capitalize ${
                  activeFilter === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-600">Loading alerts...</div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No stock alerts at this time. Great job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className={`rounded-lg shadow p-6 ${getAlertColor(alert.alert_level)} flex justify-between items-start`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAlertBadgeColor(alert.alert_level)}`}>
                      {alert.alert_level.toUpperCase()}
                    </span>
                    <Link href={`/inventory/products/${alert.product_id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                      {alert.product_name}
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Stock:</span>
                      <p className="font-medium text-gray-900">{alert.current_quantity} units</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Minimum Threshold:</span>
                      <p className="font-medium text-gray-900">{alert.minimum_threshold} units</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Reorder Quantity:</span>
                      <p className="font-medium text-gray-900">{alert.reorder_quantity} units</p>
                    </div>
                    {alert.supplier_name && (
                      <div>
                        <span className="text-gray-600">Supplier:</span>
                        <p className="font-medium text-gray-900">{alert.supplier_name}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
