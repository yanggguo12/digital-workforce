import { OrderRecord } from '../types';

export const MOCK_ORDERS: OrderRecord[] = [];

export const getDemoOrders = (): OrderRecord[] => {
  if (typeof window !== 'undefined' && !localStorage.getItem('demo_orders_cleared_v3')) {
    localStorage.setItem('demo_orders', '[]');
    localStorage.setItem('demo_orders_cleared_v3', 'true');
    setTimeout(() => {
      window.dispatchEvent(new Event('demoOrdersUpdated'));
    }, 50);
    return [];
  }

  const saved = localStorage.getItem('demo_orders');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed;
    } catch(e) {}
  }
  return MOCK_ORDERS;
};

export const saveDemoOrder = (order: OrderRecord) => {
  const orders = getDemoOrders();
  const date = new Date();
  const idStr = order.id || `ORD-DEMO-${Date.now()}`;
  const newOrder = { 
    ...order, 
    id: idStr,
    createdAtDate: order.createdAtDate || date.toISOString().split('T')[0],
    createdAtTime: order.createdAtTime || date.toTimeString().substring(0, 5)
  };
  localStorage.setItem('demo_orders', JSON.stringify([newOrder, ...orders]));
  
  window.dispatchEvent(new Event('demoOrdersUpdated'));
  return idStr;
};

export const deleteDemoOrders = (ids: string[]) => {
  const orders = getDemoOrders();
  const remaining = orders.filter((o: any) => !ids.includes(o.id));
  localStorage.setItem('demo_orders', JSON.stringify(remaining));
  
  window.dispatchEvent(new Event('demoOrdersUpdated'));
  return remaining;
};
