'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface InventoryItem {
  id: string;
  product_name: string;
  product_code: string;
  quantity_on_hand: number;
  reorder_level: number;
  unit_price: number;
  warehouse: string;
  last_updated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>جاري تحميل المخزون...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">إدارة المخزون</h1>
          <button
            onClick={() => router.push('/inventory/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            إضافة منتج جديد
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث عن المنتج أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">إجمالي المنتجات</p>
            <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">متوفرة</p>
            <p className="text-3xl font-bold text-green-600">
              {inventory.filter(i => i.status === 'in_stock').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">مخزون منخفض</p>
            <p className="text-3xl font-bold text-yellow-600">
              {inventory.filter(i => i.status === 'low_stock').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">غير متوفرة</p>
            <p className="text-3xl font-bold text-red-600">
              {inventory.filter(i => i.status === 'out_of_stock').length}
            </p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">اسم المنتج</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الكود</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الكمية</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">مستوى التنبيه</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">السعر</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المستودع</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.product_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.product_code}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.quantity_on_hand}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.reorder_level}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.unit_price.toFixed(2)} جنيه</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.warehouse}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status === 'in_stock' ? 'متوفر'}
                      {item.status === 'low_stock' ? 'مخزون منخفض'}
                      {item.status === 'out_of_stock' ? 'غير متوفر'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => router.push(`/inventory/products/${item.id}/edit`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
