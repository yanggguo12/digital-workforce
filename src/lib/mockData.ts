import { OrderRecord } from '../types';

export const MOCK_ORDERS: OrderRecord[] = [
  { 
    id: 'ORD-1001', 
    contractNumber: 'CON-2026-0422-01',
    customerName: '环球物流有限公司', 
    customerTaxId: '91310115MA1H8LXGXX',
    orderDate: '2026-04-22',
    paymentTerms: '月结30天',
    totalAmount: 1850000.00,
    shippingAddress: '上海市浦东新区张江高科园区100号',
    contactPerson: '张三',
    contactPhone: '13812345678',
    plannedDeliveryDate: '2026-05-15',
    currency: 'CNY',
    createdAtDate: '2026-04-22',
    createdAtTime: '10:30',
    status: 'synced', 
    source: 'Upload', 
    sapDocNo: '4500982231',
    items: [
       { materialNumber: 'MAT-101', name: '重型卡车轮胎', plannedDeliveryDate: '2026-05-15', quantity: 100, unit: '条', unitPriceNet: 1500, currency: 'CNY', amountNet: 150000, taxAmount: 19500, taxRate: 0.13, totalAmount: 169500 }
    ],
    createdAt: new Date('2026-04-22T10:30:00').toISOString(),
    updatedAt: new Date('2026-04-22T10:30:00').toISOString()
  },
  { 
    id: 'ORD-1002', 
    contractNumber: 'CON-2026-0421-05',
    customerName: '南方制造集团', 
    customerTaxId: '91440300MA5DXXYZZ',
    orderDate: '2026-04-21',
    paymentTerms: '先款后货',
    totalAmount: 560000.00,
    shippingAddress: '广州市天河区工业园A区3栋',
    contactPerson: '李四',
    contactPhone: '13987654321',
    plannedDeliveryDate: '2026-04-30',
    currency: 'CNY',
    createdAtDate: '2026-04-21',
    createdAtTime: '14:20',
    status: 'draft', 
    source: 'Email', 
    items: [],
    createdAt: new Date('2026-04-21T14:20:00').toISOString(),
    updatedAt: new Date('2026-04-21T14:20:00').toISOString()
  },
  { 
    id: 'ORD-1003', 
    contractNumber: 'CON-2026-0420-12',
    customerName: '北方能源科技股份有限公司', 
    customerTaxId: '91110108MA0XXYYZZ',
    orderDate: '2026-04-20',
    paymentTerms: '货到付款',
    totalAmount: 3200000.00,
    shippingAddress: '北京市海淀区科技园C座11层',
    contactPerson: '王五',
    contactPhone: '13700001111',
    plannedDeliveryDate: '2026-06-01',
    currency: 'CNY',
    createdAtDate: '2026-04-20',
    createdAtTime: '09:15',
    status: 'synced', 
    source: 'Voice', 
    sapDocNo: '4500982542',
    items: [],
    createdAt: new Date('2026-04-20T09:15:00').toISOString(),
    updatedAt: new Date('2026-04-20T09:15:00').toISOString()
  }
] as any;

export const getDemoOrders = (): OrderRecord[] => {
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
  const idStr = `ORD-DEMO-${Date.now()}`;
  const newOrder = { 
    ...order, 
    id: idStr,
    createdAtDate: date.toISOString().split('T')[0],
    createdAtTime: date.toTimeString().substring(0, 5)
  };
  localStorage.setItem('demo_orders', JSON.stringify([newOrder, ...orders]));
  
  window.dispatchEvent(new Event('demoOrdersUpdated'));
};

export const deleteDemoOrders = (ids: string[]) => {
  const orders = getDemoOrders();
  const remaining = orders.filter((o: any) => !ids.includes(o.id));
  localStorage.setItem('demo_orders', JSON.stringify(remaining));
  
  window.dispatchEvent(new Event('demoOrdersUpdated'));
  return remaining;
};
