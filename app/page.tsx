'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-950 relative overflow-hidden">
      <div className="relative z-10">
        <header className="border-b-4 border-yellow-600 bg-gradient-to-b from-amber-800 to-amber-900 py-12 mb-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-center mb-6">
              <div className="text-6xl text-yellow-400 drop-shadow-lg">🔺</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-center text-yellow-300 mb-4 drop-shadow-lg">
              نظام إدارة المطاعم الملكي
            </h1>
            <p className="text-center text-yellow-200 text-lg md:text-xl drop-shadow-lg">
              منصة بيع متقدمة بالطابع الفرعوني الأصيل
            </p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-b from-yellow-600 to-amber-700 rounded-lg shadow-2xl p-8 border-4 border-yellow-500 hover:shadow-3xl transition transform hover:scale-105">
              <div className="text-5xl mb-4 text-center">💳</div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">واجهة الكاشير</h3>
              <p className="text-yellow-100 text-center mb-4">إدارة المبيعات والدفع بسهولة</p>
              <Link href="/cashier" className="block bg-white text-amber-900 font-bold py-2 px-4 rounded-lg text-center hover:bg-yellow-100">
                افتح الآن
              </Link>
            </div>

            <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg shadow-2xl p-8 border-4 border-blue-400 hover:shadow-3xl transition transform hover:scale-105">
              <div className="text-5xl mb-4 text-center">🍽️</div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">قائمة المنيو</h3>
              <p className="text-blue-100 text-center mb-4">عرض وإدارة المنتجات</p>
              <Link href="/menu" className="block bg-white text-blue-700 font-bold py-2 px-4 rounded-lg text-center hover:bg-blue-100">
                افتح الآن
              </Link>
            </div>

            <div className="bg-gradient-to-b from-purple-600 to-purple-700 rounded-lg shadow-2xl p-8 border-4 border-purple-400 hover:shadow-3xl transition transform hover:scale-105">
              <div className="text-5xl mb-4 text-center">🪑</div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">إدارة الطاولات</h3>
              <p className="text-purple-100 text-center mb-4">تنظيم الجلسات</p>
              <Link href="/tables" className="block bg-white text-purple-700 font-bold py-2 px-4 rounded-lg text-center hover:bg-purple-100">
                افتح الآن
              </Link>
            </div>
          </div>

          <section className="bg-gradient-to-r from-amber-800 via-yellow-800 to-amber-800 rounded-xl border-4 border-yellow-500 p-12 shadow-2xl mb-12">
            <h2 className="text-4xl font-black text-yellow-300 mb-8 text-center">✨ الميزات الرئيسية ✨</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <li className="flex items-center text-white text-lg font-semibold"><span className="text-yellow-300 text-2xl ml-4">✓</span>واجهة الكاشير المتقدمة</li>
              <li className="flex items-center text-white text-lg font-semibold"><span className="text-yellow-300 text-2xl ml-4">✓</span>إدارة الطاولات والجلسات</li>
              <li className="flex items-center text-white text-lg font-semibold"><span className="text-yellow-300 text-2xl ml-4">✓</span>نظام المنيو الديناميكي</li>
              <li className="flex items-center text-white text-lg font-semibold"><span className="text-yellow-300 text-2xl ml-4">✓</span>تتبع المخزون</li>
              <li className="flex items-center text-white text-lg font-semibold"><span className="text-yellow-300 text-2xl ml-4">✓</span>إدارة الموردين</li>
              <li className="flex items-center text-white text-lg font-semibold"><span className="text-yellow-300 text-2xl ml-4">✓</span>تقارير مالية</li>
            </ul>
          </section>

          <footer className="text-center text-yellow-200 text-sm">
            <p>🏺 تم تطويره بتقنيات حديثة وتصميم فرعوني عريق 🏺</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
