'use client';

import Link from 'next/link';

const tables = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  status: i % 3 === 0 ? 'occupied' : 'available',
  capacity: 2 + Math.floor(i / 3),
}));

export default function TablesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الطاولات</h1>
        <div className="flex gap-4">
          <Link href="/" className="hover:bg-blue-700 px-4 py-2 rounded">الرئيسية</Link>
          <Link href="/cashier" className="hover:bg-blue-700 px-4 py-2 rounded">الكاشير</Link>
          <Link href="/menu" className="hover:bg-blue-700 px-4 py-2 rounded">المنيو</Link>
          <Link href="/reports" className="hover:bg-blue-700 px-4 py-2 rounded">التقارير</Link>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">الطاولات المتاحة</h2>
        <div className="grid grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`p-6 rounded-lg shadow-lg text-center cursor-pointer transition ${
                table.status === 'available'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">الطاولة {table.id}</h3>
              <p className="text-sm mb-2">{table.status === 'available' ? 'متاحة' : 'مشغولة'}</p>
              <p className="text-sm">السعة: {table.capacity} أشخاص</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
