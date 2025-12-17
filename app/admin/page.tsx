'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier' | 'kitchen';
  status: 'active' | 'inactive';
}

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'cashier' });
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const mockUsers: User[] = [
      { id: '1', name: 'أحمد محمد', email: 'ahmed@restaurant.com', role: 'manager', status: 'active' },
      { id: '2', name: 'علي حسن', email: 'ali@restaurant.com', role: 'cashier', status: 'active' },
      { id: '3', name: 'فاطمة علي', email: 'fatima@restaurant.com', role: 'kitchen', status: 'active' },
      { id: '4', name: 'محمود خالد', email: 'mahmoud@restaurant.com', role: 'cashier', status: 'inactive' },
    ];
    setUsers(mockUsers);
    setStats({ totalUsers: 4, totalOrders: 245, totalRevenue: 15750, activeOrders: 12 });
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = { id: String(users.length + 1), name: newUser.name, email: newUser.email, role: newUser.role as 'admin' | 'manager' | 'cashier' | 'kitchen', status: 'active' };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'cashier' });
    setShowUserForm(false);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/auth/login');
  };

  const t = language === 'en' ? {
    title: 'Admin Dashboard',
    userManagement: 'User Management',
    addUser: 'Add New User',
    users: 'Users',
    orders: 'Orders',
    revenue: 'Revenue',
    active: 'Active Orders',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    actions: 'Actions',
    toggle: 'Toggle',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout',
    manager: 'Manager',
    cashier: 'Cashier',
    kitchen: 'Kitchen',
  } : {
    title: 'لوحة التحكم',
    userManagement: 'إدارة الموظفين',
    addUser: 'إضافة موظف',
    users: 'الموظفين',
    orders: 'الطلبات',
    revenue: 'الإيرادات',
    active: 'الطلبات النشطة',
    name: 'الاسم',
    email: 'البريد',
    role: 'الدور',
    status: 'الحالة',
    actions: 'الإجراءات',
    toggle: 'تغيير',
    save: 'حفظ',
    cancel: 'إلغاء',
    logout: 'تسجيل الخروج',
    manager: 'مدير',
    cashier: 'كاشير',
    kitchen: 'مطبخ',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <div className="flex gap-4">
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
              {language === 'en' ? 'عربي' : 'English'}
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium">
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">{t.users}</p>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">{t.orders}</p>
            <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">{t.revenue}</p>
            <p className="text-3xl font-bold mt-2">{stats.totalRevenue.toLocaleString()} SR</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">{t.active}</p>
            <p className="text-3xl font-bold mt-2">{stats.activeOrders}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{t.userManagement}</h2>
            <button onClick={() => setShowUserForm(!showUserForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
              {t.addUser}
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleAddUser} className="mb-6 p-4 bg-slate-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder={t.name} value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 outline-none" required />
                <input type="email" placeholder={t.email} value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 outline-none" required />
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 outline-none">
                  <option value="cashier">{t.cashier}</option>
                  <option value="manager">{t.manager}</option>
                  <option value="kitchen">{t.kitchen}</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition font-medium">{t.save}</button>
                <button type="button" onClick={() => setShowUserForm(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition font-medium">{t.cancel}</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-white font-semibold">{t.name}</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">{t.email}</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">{t.role}</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">{t.status}</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700 transition">
                    <td className="py-3 px-4 text-gray-300">{user.name}</td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4 text-gray-300"><span className="px-3 py-1 bg-slate-600 rounded text-sm">{user.role === 'cashier' ? (language === 'en' ? t.cashier : 'كاشير') : user.role === 'manager' ? (language === 'en' ? t.manager : 'مدير') : language === 'en' ? t.kitchen : 'مطبخ'}</span></td>
                    <td className="py-3 px-4"><span className={`px-3 py-1 rounded text-sm font-medium ${user.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>{user.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                    <td className="py-3 px-4"><button onClick={() => toggleUserStatus(user.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition">{t.toggle}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
