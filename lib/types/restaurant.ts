// نموذج الأصناف (Menu Item)
export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  price: number;
  description?: string;
}

// نموذج الطلب (Order Item)
export interface OrderItem {
  id: string;
  itemId: string;
  nameAr: string;
  nameEn: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
}

// نموذج الشخص في تقسيم الشيك (Bill Split Person)
export interface BillSplitPerson {
  id: string;
  personName: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
}

// نموذج الترابيزة (Table)
export interface Table {
  id: string;
  numberAr: string;
  numberEn: string;
  capacity: number;
  status: 'empty' | 'occupied' | 'pending_payment';
  numberOfGuests?: number;
  currentOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// نموذج الفاتورة/الطلب (Order/Bill)
export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  splitDetails?: BillSplitPerson[];
  status: 'open' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// نموذج استجابة API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
