'use client';

import Link from 'next/link';
import { useState } from 'react';

const menuCategories = [
  { id: 1, name: 'أطباق رئيسية', items: 12 },
  { id: 2, name: 'حلويات', items: 8 },
  { id: 3, name: 'المشروبات', items: 15 },
  { id: 4, name: 'المقبلات', items: 10 },
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">قائمة المنيو</h1>
        <div className="flex gap-4">
          <Link href="/" className="hover:bg-blue-700 px-4 py-2 rounded">الرئيسية</Link>
          <Link href="/cashier" className="hover:bg-blue-700 px-4 py-2 rounded">الكاشير</Link>
          <Link href="/tables" className="hover:bg-blue-700 px-4 py-2 rounded">الطاولات</Link>
          <Link href="/reports" className="hover:bg-blue-700 px-4 py-2 rounded">التقارير</Link>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">أقسام المنيو</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {menuCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-lg text-blue-600 font-semibold">{category.items} منتجات</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                عرض
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
