'use client';
import { useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

const mockItems: MenuItem[] = [
  { id: 1, name: 'فراخ مشوي', price: 85, category: 'أطباق رئيسية', emoji: '🞗' },
  { id: 2, name: 'سمك مشوي', price: 95, category: 'أطباق رئيسية', emoji: '🐟' },
  { id: 3, name: 'كفتة', price: 75, category: 'أطباق رئيسية', emoji: '🞖' },
  { id: 4, name: 'بيتزا', price: 120, category: 'أطباق رئيسية', emoji: '🝕' },
];
  { id: 5, name: 'برجر', price: 60, category: 'اطباق رئيسية', emoji: '🝔' },
  { id: 6, name: 'معكرونة', price: 65, category: 'اطباق رئيسية', emoji: '🝝' },
  { id: 7, name: 'سلطة', price: 40, category: 'اطباق جانبية', emoji: '🥗' },
  { id: 8, name: 'عصير', price: 35, category: 'مشروبات', emoji: '🧳' },
  { id: 9, name: 'قهوة', price: 12, category: 'مشروبات', emoji: '☕' },
  { id: 10, name: 'كنافة', price: 45, category: 'حلويات', emoji: '🌯' },
  { id: 11, name: 'بسبوسة', price: 25, category: 'حلويات', emoji: '🌪' },
  { id: 12, name: 'ايس كريم', price: 20, category: 'حلويات', emoji: '🍨' },
];

export default function CashierPage() {
  const [cart, setCart] = useState<(MenuItem & { qty: number })[]>([]);
  const [search, setSearch] = useState('');
  const [sideOpen, setSideOpen] = useState(true);
  const filteredItems = mockItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const addItem = (item: MenuItem) => {
    const ex = cart.find(c => c.id === item.id);
    if (ex) setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { ...item, qty: 1 }]);
  };
  const removeItem = (id: number) => setCart(cart.filter(c => c.id !== id));
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = total * 0.15;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className={`${sideOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 p-4 flex flex-col transition-all`}>
        <div className="flex items-center justify-between mb-6">
          {sideOpen && <h2 className="text-xl font-bold">Foodics</h2>}
          <button onClick={() => setSideOpen(!sideOpen)} className="text-gray-400 hover:text-white">≫</button>
        </div>
        <nav className="space-y-2 flex-1">
          {['Home', 'Cashier', 'Menu', 'Settings'].map((item, i) => (
            <div key={i} className={`px-3 py-2 rounded cursor-pointer ${i === 1 ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              {sideOpen && <span>{item}</span>}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-gray-700 px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-blue-500" />
          <div className="text-sm">مرحبا, Admin</div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 p-4 group transition">
                  <div className="text-6xl text-center mb-3 group-hover:scale-110 transition">{item.emoji}</div>
                  <h3 className="font-semibold text-sm text-center">{item.name}</h3>
                  <p className="text-gray-400 text-xs mb-3 text-center">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">{item.price}ر</span>
                    <button onClick={() => addItem(item)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex-1 overflow-auto space-y-3 mb-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No items</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-gray-700 p-3 rounded">
                    <div className="flex justify-between">
                      <span className="font-semibold">{item.name}</span>
                      <button onClick={() => removeItem(item.id)} className="text-red-400">x</button>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300 mt-1">
                      <span>{item.qty}x {item.price}ر</span>
                      <span className="text-blue-400">{item.price * item.qty}ر</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-600 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>{total}ر</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax (15%):</span>
                <span>{tax.toFixed(2)}ر</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-400 border-t border-gray-600 pt-2 mt-2">
                <span>Total:</span>
                <span>{(total + tax).toFixed(2)}ر</span>
              </div>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 mt-4 py-3 rounded-lg font-bold">Confirm Order</button>
          </div>
        </main>
      </div>
    </div>
  );
}
