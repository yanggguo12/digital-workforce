export type ModuleType = 
  | 'home' 
  | 'sales' 
  | 'sales-entry'
  | 'sales-credit'
  | 'sales-inquiry'
  | 'sales-prospecting'
  | 'sales-operations'
  | 'sales-contract' 
  | 'sales-orders' 
  | 'sales-email' 
  | 'sales-voice' 
  | 'supply-chain' 
  | 'sc-health'
  | 'sc-procurement'
  | 'sc-outsourcing'
  | 'sc-inventory'
  | 'sc-logistics'
  | 'sc-supplier'
  | 'sc-forecast'
  | 'sc-manufacturing'
  | 'finance' 
  | 'fin-email'
  | 'fin-receivable'
  | 'fin-payable'
  | 'fin-reimbursement'
  | 'fin-cashflow'
  | 'fin-analysis'
  | 'fin-closing'
  | 'fin-budget'
  | 'fin-assets'
  | 'fin-tax'
  | 'production'
  | 'procurement'
  | 'logs' 
  | 'logs-operations'
  | 'logs-ai'
  | 'config' 
  | 'config-llm' 
  | 'config-general'
  | 'config-interfaces'
  | 'config-monitor'
  | 'system'
  | 'sys-user'
  | 'sys-biz-user'
  | 'sys-role'
  | 'sys-menu'
  | 'sys-data-auth'
  | 'sys-org'
  | 'users';

export type AppState = 'idle' | 'processing' | 'analyzed';

export interface ExtractionField {
  label: string;
  value: string;
  key: string;
  confidence: number; // 0 to 100
}

export interface SalesOrderLineItem {
  materialNumber: ExtractionField;
  name: ExtractionField;
  plannedDeliveryDate: ExtractionField; // 计划交期
  quantity: ExtractionField;
  unit: ExtractionField;
  unitPriceNet: ExtractionField; // 不含税单价
  currency: ExtractionField;     // 币种
  amountNet: ExtractionField;    // 不含税金额
  taxAmount: ExtractionField;    // 税额
  taxRate: ExtractionField;      // 税率
  totalAmount: ExtractionField;  // 总金额
}

export interface SalesOrderData {
  contractNumber: ExtractionField;
  customerName: ExtractionField;
  customerTaxId: ExtractionField; // 客户税号
  orderDate: ExtractionField;
  paymentTerms: ExtractionField;
  totalAmount: ExtractionField;
  shippingAddress: ExtractionField;
  contactPerson: ExtractionField;
  contactPhone: ExtractionField;
  plannedDeliveryDate: ExtractionField; // 计划交期
  currency: ExtractionField;
  items: SalesOrderLineItem[];
}

export type OrderStatus = 'draft' | 'synced';

export interface OrderRecord {
  id?: string;
  userId: string;
  docNumber?: string; // 单据号
  contractNumber: string;
  customerName: string;
  customerTaxId: string;
  orderDate: string;
  paymentTerms: string;
  totalAmount: number;
  shippingAddress: string;
  contactPerson: string;
  contactPhone: string;
  plannedDeliveryDate: string;
  currency: string;
  createdAtDate: string;
  createdAtTime: string;
  status: OrderStatus;
  source: 'Upload' | 'Email' | 'Voice';
  attachments?: string[];
  sapDocNo?: string;
  items: {
    materialNumber: string;
    name: string;
    plannedDeliveryDate: string;
    quantity: number;
    unit: string;
    unitPriceNet: number;
    currency: string;
    amountNet: number;
    taxAmount: number;
    taxRate: number;
    totalAmount: number;
  }[];
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}
