// app/components/OrderManagement.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrderStatus = "all" | "pending" | "completed" | "cancelled";

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  table: string;
  status: Exclude<OrderStatus, "all">;
  items: OrderItem[];
};

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

const TAX_RATE = 0.08;

// -------------------- Mock Data --------------------
const initialOrders: Order[] = [
  {
    id: "o1",
    table: "Table 1",
    status: "pending",
    items: [
      { id: "i1", name: "Margherita Pizza", qty: 1, price: 12 },
      { id: "i2", name: "Caesar Salad", qty: 2, price: 7 },
    ],
  },
  {
    id: "o2",
    table: "Table 2",
    status: "pending",
    items: [{ id: "i3", name: "Cheeseburger", qty: 2, price: 10 }],
  },
  {
    id: "o3",
    table: "Table 3",
    status: "completed",
    items: [{ id: "i4", name: "Pasta Alfredo", qty: 1, price: 14 }],
  },
];

const menuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Margherita Pizza",
    price: 12,
    image: "/images/pizza.jpg",
    category: "Pizza",
  },
  {
    id: "m2",
    name: "Pepperoni Pizza",
    price: 14,
    image: "/images/pepperoni.jpg",
    category: "Pizza",
  },
  {
    id: "m3",
    name: "Cheeseburger",
    price: 10,
    image: "/images/burger.jpg",
    category: "Burgers",
  },
  {
    id: "m4",
    name: "Caesar Salad",
    price: 7,
    image: "/images/salad.jpg",
    category: "Salads",
  },
  {
    id: "m5",
    name: "Pasta Alfredo",
    price: 14,
    image: "/images/pasta.jpg",
    category: "Pasta",
  },
];

// -------------------- Component --------------------
export default function OrderManagement() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeOrderId, setActiveOrderId] = useState<string>(initialOrders[0]?.id);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const activeOrder = orders.find((o) => o.id === activeOrderId);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const subtotal = useMemo(() => {
    if (!activeOrder) return 0;
    return activeOrder.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  }, [activeOrder]);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const addItemToOrder = (item: MenuItem) => {
    if (!activeOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === activeOrder.id
          ? {
              ...o,
              items: o.items.some((i) => i.name === item.name)
                ? o.items.map((i) =>
                    i.name === item.name ? { ...i, qty: i.qty + 1 } : i
                  )
                : [
                    ...o.items,
                    { id: crypto.randomUUID(), name: item.name, qty: 1, price: item.price },
                  ],
            }
          : o
      )
    );
  };

  const updateStatus = (status: Exclude<OrderStatus, "all">) => {
    if (!activeOrder) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, status } : o))
    );
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-1rem)] bg-zinc-950 text-zinc-100">
      {/* Left Sidebar */}
      <aside className="w-[200px] border-r border-zinc-800 p-4">
        <h2 className="mb-4 text-lg font-semibold">Orders</h2>
        <div className="space-y-2">
          {(
            [
              ["all", "All Orders"],
              ["pending", "Pending"],
              ["completed", "Completed"],
              ["cancelled", "Cancelled"],
            ] as [OrderStatus, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition",
                statusFilter === key
                  ? "bg-emerald-600/20 text-emerald-400"
                  : "hover:bg-zinc-900"
              )}
            >
              <span>{label}</span>
              <Badge
                variant="secondary"
                className={cn(
                  "bg-zinc-800",
                  key === "cancelled" && "bg-red-600/20 text-red-400"
                )}
              >
                {counts[key]}
              </Badge>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col gap-4 p-4">
        <Tabs
          value={activeOrderId}
          onValueChange={setActiveOrderId}
          className="flex flex-1 flex-col"
        >
          <TabsList className="mb-3 w-fit bg-zinc-900">
            {filteredOrders.map((o) => (
              <TabsTrigger
                key={o.id}
                value={o.id}
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                {o.table}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredOrders.map((o) => (
            <TabsContent key={o.id} value={o.id} className="flex-1">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {o.items.map((item) => (
                  <Card key={item.id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Qty: {item.qty}</span>
                      <span className="font-semibold">
                        ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom Payment Summary */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-6">
                <span className="text-zinc-400">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-zinc-400">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6 font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="bg-zinc-800 hover:bg-zinc-700"
              >
                Print Receipt
              </Button>
              <Button
                onClick={() => updateStatus("cancelled")}
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel Order
              </Button>
              <Button
                onClick={() => updateStatus("completed")}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Complete Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Right Panel - Menu */}
      <aside className="w-full max-w-[360px] border-l border-zinc-800 p-4">
        <h2 className="mb-4 text-lg font-semibold">Menu</h2>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer bg-zinc-900 border-zinc-800 hover:border-emerald-600/50"
              onClick={() => addItemToOrder(item)}
            >
              <CardContent className="p-3">
                <div className="relative mb-2 h-20 w-full overflow-hidden rounded">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-emerald-400">${item.price}</span>
                </div>
                <Button
                  size="sm"
                  className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Add Item
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </aside>
    </div>
  );
}
