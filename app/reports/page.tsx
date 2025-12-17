'use client';

import Link from 'next/link';
import { useState } from 'react';

const salesReports = [
  { id: 1, name: 'مبيعات اليوم', value: 'ر.س. 1,250' },
  { id: 2, name: 'مبيعات الأسبوع', value: 'ر.س. 8,500' },
  { id: 3, name: 'مبيعات الشهر', value: 'ر.س. 35,000' },
  { id: 4, name: 'معدل الربح', value: '28%' },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">التقارير</h1>
        <div className="flex gap-4">
          <Link href="/" className="hover:bg-blue-700 px-4 py-2 rounded">الرئيسية</Link>
          <Link href="/cashier" className="hover:bg-blue-700 px-4 py-2 rounded">الكاشير</Link>
          <Link href="/menu" className="hover:bg-blue-700 px-4 py-2 rounded">القائمة</Link>
          <Link href="/tables" className="hover:bg-blue-700 px-4 py-2 rounded">الطاولات</Link>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">المبيعات والإحصائيات</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {salesReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{report.name}</h3>
              <p className="text-2xl font-bold text-blue-600">{report.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
