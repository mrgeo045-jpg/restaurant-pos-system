'use client';

import { useState, useMemo } from 'react';
import { ShoppingCart, Home, FileText, Menu as MenuIcon, Settings, LogOut, Search, User, ChevronLeft, ChevronRight, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone } from 'lucide-react';

// Types
type OrderStatus = 'all' | 'dine-in' | 'wait-list' | 'take-away' | 'saved';
type PaymentMethod = 'cash' | 'card' | 'digital';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

interface TableOrder {
  id: string;
  tableNumber: string;
  status: OrderStatus;
  items: number;
  time: string;
  image: string;
}

// Mock Data
const mockItems: MenuItem[] = [
  { id: 1, name: 'فراخ مشوي', price: 85, category: 'أطباق رئيسية', emoji: '🍗' },
  { id: 2, name: 'سمك مشوي', price: 95, category: 'أطباق رئيسية', emoji: '🐟' },
  { id: 3, name: 'كفتة', price: 75, category: 'أطباق رئيسية', emoji: '🍖' },
  { id: 4, name: 'بيتزا', price: 120, category: 'أطباق رئيسية', emoji: '🍕' },
  { id: 5, name: 'برجر', price: 60, category: 'أطباق جانبية', emoji: '🍔' },
  { id: 6, name: 'معكرونة', price: 65, category: 'أطباق جانبية', emoji: '🍝' },
  { id: 7, name: 'سلطة', price: 40, category: 'سلطات', emoji: '🥗' },
  { id: 8, name: 'عصير برتقال', price: 15, category: 'مشروبات', emoji: '🧃' },
  { id: 9, name: 'قهوة', price: 12, category: 'مشروبات', emoji: '☕' },
  { id: 10, name: 'كنافة', price: 45, category: 'حلويات', emoji: '🍮' },
  { id: 11, name: 'بسبوسة', price: 25, category: 'حلويات', emoji: '🍪' },
  { id: 12, name: 'ايس كريم', price: 20, category: 'حلويات', emoji: '🍨' },
];

const tableOrders: TableOrder[] = [
  { id: '1', tableNumber: '01', status: 'dine-in', items: 3, time: '10:35 صباحاً', image: '🍽️' },
  { id: '2', tableNumber: '05', status: 'dine-in', items: 5, time: '10:25 صباحاً', image: '🍽️' },
  { id: '3', tableNumber: '12', status: 'wait-list', items: 2, time: '10:05 صباحاً', image: '⏳' },
  { id: '4', tableNumber: '08', status: 'take-away', items: 4, time: '09:15 صباحاً', image: '📦' },
];

export default function CashierPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = useMemo(() => {
    const unique = ['all', ...new Set(mockItems.map(i => i.category))];
    return unique;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return mockItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Filter table orders
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return tableOrders;
    return tableOrders.filter(order => order.status === activeTab);
  }, [activeTab]);

  // Cart operations
  const addItem = (item: MenuItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeItem = (id: number) => setCart(cart.filter(c => c.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) removeItem(id);
    else setCart(cart.map(c => c.id === id ? { ...c, qty } : c));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  // Current time
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-950 text-white" dir="rtl">
      {/* Left Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-950 border-l border-gray-800 p-4 flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && <h1 className="text-2xl font-bold text-blue-400">نظام الكاشير</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { icon: Home, label: 'الرئيسية', color: 'text-blue-400' },
            { icon: FileText, label: 'الطلبات', color: 'text-purple-400' },
            { icon: MenuIcon, label: 'القائمة', color: 'text-green-400' },
            { icon: Settings, label: 'الإعدادات', color: 'text-orange-400' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              <item.icon size={20} className={item.color} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 transition-colors">
          <LogOut size={20} />
          {sidebarOpen && <span>تسجيل الخروج</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Search size={20} className="text-gray-400" />
            <input type="text" placeholder="ابحث عن منتج..." value={search} onChange={(e) => setSearch(e.target.value)} 
              className="bg-gray-800 px-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">{dateStr}</div>
              <div className="text-lg font-semibold">{timeStr}</div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
              <User size={18} />
              <span>أحمد محمود</span>
            </button>
          </div>
        </header>

        {/* Main Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Order Tabs */}
            <div className="border-b border-gray-800 px-6 py-4 flex space-x-2 space-x-reverse">
              {['all', 'dine-in', 'wait-list', 'take-away', 'saved'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab as OrderStatus)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}>
                  {tab === 'all' && 'الكل'}{tab === 'dine-in' && 'في المطعم'}{tab === 'wait-list' && 'قائمة الانتظار'}
                  {tab === 'take-away' && 'للحمل'}{tab === 'saved' && 'محفوظة'}
                  {filteredOrders.length > 0 && <span className="mr-2 bg-red-500 text-xs px-2 py-1 rounded">{filteredOrders.length}</span>}
                </button>
              ))}
            </div>

            {/* Table Orders */}
            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-blue-400">الطاولة {order.tableNumber}</h3>
                        <p className="text-sm text-gray-400">{order.time}</p>
                      </div>
                      <span className="text-4xl">{order.image}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">عدد الطلبات</span>
                      <span className="text-green-400 font-semibold">{order.items} عناصر</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Categories */}
            <div className="border-t border-gray-800 px-6 py-4">
              <div className="flex space-x-2 space-x-reverse overflow-x-auto">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                      selectedCategory === cat ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                    }`}>
                    {cat === 'all' ? '🔥 الكل' : `${mockItems.find(i => i.category === cat)?.emoji} ${cat}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                  <div key={item.id} onClick={() => addItem(item)}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:scale-105">
                    <div className="text-5xl text-center mb-2">{item.emoji}</div>
                    <h3 className="font-semibold text-center text-sm mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-xs text-center mb-3">{item.category}</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm font-semibold">
                      {item.price}
