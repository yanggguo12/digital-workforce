import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Mic2,
  Upload,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreVertical,
  Paperclip,
  ArrowLeft,
  Calendar,
  Building2,
  Tag,
  CreditCard,
  Package,
  User,
  MapPin,
  Trash2,
  RefreshCcw,
  AlertCircle,
  Plus,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "../../ui/Button";

interface OrderItem {
  pos: string;
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
}

interface OrderRecord {
  id: string;
  contractNumber: string;
  customerName: string;
  customerTaxId: string;
  source: "Upload" | "Email" | "Voice";
  attachments: string[];
  orderDate: string;
  paymentTerms: string;
  totalAmount: number;
  currency: string;
  createdAtDate?: string;
  createdAtTime?: string;
  shippingAddress: string;
  contactPerson: string;
  contactPhone: string;
  plannedDeliveryDate: string;
  status: "synced" | "draft";
  sapOrderNumber?: string;
  items: OrderItem[];
}

import { getDemoOrders, deleteDemoOrders } from "../../../lib/mockData";
import { createLog } from "@/src/services/logService";

const calculateItemTotals = (
  quantity: number,
  priceNet: number,
  taxRate: number = 0.13,
) => {
  const netAmount = quantity * priceNet;
  const taxAmount = netAmount * taxRate;
  const total = netAmount + taxAmount;
  return {
    netAmount: parseFloat(netAmount.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

// removed local MOCK_ORDERS

import { AttachmentViewer } from "../../ui/AttachmentViewer";

export function OrdersModule({
  onResumeDraft,
  initialTab = "全部条目",
}: {
  onResumeDraft?: (data: any) => void;
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<any>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteResultMessage, setDeleteResultMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>(getDemoOrders());
  const [loading, setLoading] = useState(true);
  const [attachmentViewerOpen, setAttachmentViewerOpen] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState<string[]>([]);
  const [currentAttachmentOrderId, setCurrentAttachmentOrderId] = useState<string>("");

  const handleOpenAttachments = (
    e: React.MouseEvent,
    orderId: string,
    attachments?: string[],
  ) => {
    e.stopPropagation();
    const atts =
      attachments && attachments.length > 0
        ? attachments
        : ["mock:未命名附件.pdf"];
    setCurrentAttachmentOrderId(orderId);
    setCurrentAttachments(atts);
    setAttachmentViewerOpen(true);
  };

  useEffect(() => {
    let unsubscribe: any;
    const fetchOrders = async () => {
      const path = "orders";
      try {
        const {
          auth,
          db,
          collection,
          onSnapshot,
          query,
          where,
          orderBy,
          handleFirestoreError,
          OperationType,
        } = await import("@/src/lib/firebase");
        
        const user = auth.currentUser;
        if (!user) {
          setOrders(getDemoOrders());
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, path), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setOrders(fetchedOrders);
            setLoading(false);
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, path);
            setOrders(getDemoOrders()); // Fallback to mock for UI dev
            setLoading(false);
          },
        );
      } catch (e) {
        console.error("Fetch orders failed", e);
        setOrders(getDemoOrders()); // Fallback to mock for UI dev
        setLoading(false);
      }
    };
    fetchOrders();

    const handleUpdate = () => {
      setOrders(getDemoOrders());
    };
    window.addEventListener("demoOrdersUpdated", handleUpdate);

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener("demoOrdersUpdated", handleUpdate);
    };
  }, []);

  const selectedOrder =
    orders.find((o) => o.id === selectedOrderId) ||
    getDemoOrders().find((o) => o.id === selectedOrderId);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Upload":
        return <Upload size={14} className="text-sap-blue" />;
      case "Email":
        return <Mail size={14} className="text-orange-500" />;
      case "Voice":
        return <Mic2 size={14} className="text-red-500" />;
      default:
        return <FileText size={14} className="text-gray-400" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "Upload":
        return "文档/图片上传";
      case "Email":
        return "邮件识别";
      case "Voice":
        return "语音识别";
      default:
        return "未知来源";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
      case "Pushed":
      case "已同步SAP":
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-[2px] border border-emerald-100 text-[10px] font-bold uppercase tracking-tighter">
            <CheckCircle2 size={10} />
            已推送 SAP
          </div>
        );
      case "Pending":
      case "待处理":
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-[2px] border border-amber-100 text-[10px] font-bold uppercase tracking-tighter">
            <Clock size={10} />
            待处理
          </div>
        );
      case "draft":
      case "Draft":
      case "暂存中":
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 text-gray-500 rounded-[2px] border border-gray-200 text-[10px] font-bold uppercase tracking-tighter">
            <FileText size={10} />
            暂存中
          </div>
        );
      case "同步SAP失败":
      case "推送失败":
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-600 rounded-[2px] border border-red-100 text-[10px] font-bold uppercase tracking-tighter">
            <AlertCircle size={10} />
            {status}
          </div>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null) return "0.00 CNY";
    return (
      val.toLocaleString("zh-CN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " CNY"
    );
  };

  // CRITICAL: DO NOT MODIFY START - 永久锁定：删除权限判定逻辑
  const isDraft = (status: string | undefined | null) => 
    !status || 
    status === "暂存中" ||
    status === "草稿";
  // CRITICAL: DO NOT MODIFY END

  const isPushed = (status: string | undefined | null) => 
    status === "synced" || 
    status === "Pushed" || 
    status === "已同步SAP" ||
    status === "已推送 SAP";

  const handleToggleSelectAll = () => {
    const currentOrders = orders.length > 0 ? orders : getDemoOrders();
    if (selectedOrderIds.size === currentOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(currentOrders.map((o) => o.id)));
    }
  };

  const handleToggleSelectId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(selectedOrderIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedOrderIds(next);
  };

  const handleDeleteClick = () => {
    const currentOrders = orders.length > 0 ? orders : getDemoOrders();
    const selectedOrders = currentOrders.filter((o) =>
      selectedOrderIds.has(o.id),
    );

    if (selectedOrders.length === 0) {
      return;
    }

    const uneligibleCount = selectedOrders.filter((o) => !isDraft(o.status)).length;
    const eligibleToDelete = selectedOrders.filter((o) => isDraft(o.status));

    if (eligibleToDelete.length === 0) {
      setDeleteResultMessage({
        type: "error",
        text: "只能删除【暂存状态】或未同步的合同订单。",
      });
      return;
    }

    if (uneligibleCount > 0) {
      setDeleteResultMessage({
        type: "error",
        text: `您选中的记录中包含 ${uneligibleCount} 个已推送状态的订单，这些订单将不能被删除。`,
      });
      return;
    }

    setShowDeleteModal(true);
  };

  const confirmDeleteAction = async () => {
    const currentOrders = orders.length > 0 ? orders : getDemoOrders();
    const selectedOrders = currentOrders.filter((o) =>
      selectedOrderIds.has(o.id),
    );
    const eligibleToDelete = selectedOrders.filter((o) => isDraft(o.status));

    const path = "orders";
    try {
      setLoading(true);
      const { db, doc, deleteDoc, handleFirestoreError, OperationType, auth } =
        await import("@/src/lib/firebase");

      const realEligible = eligibleToDelete.filter(
        (o) => !o.id.startsWith("ORD-"),
      );
      const mockEligible = eligibleToDelete.filter((o) =>
        o.id.startsWith("ORD-"),
      );

      if (realEligible.length > 0 && auth.currentUser) {
        const deletePromises = realEligible.map((o) =>
          deleteDoc(doc(db, path, o.id)).catch((err) =>
            handleFirestoreError(err, OperationType.DELETE, `${path}/${o.id}`),
          ),
        );
        await Promise.all(deletePromises);
      }

      if (mockEligible.length > 0) {
        deleteDemoOrders(mockEligible.map((o) => o.id));
      }

      // Clean up attachment db
      try {
        const { AttachmentStore } = await import("@/src/lib/attachmentDb");
        for (const o of eligibleToDelete) {
          await AttachmentStore.delete(o.id);
        }
      } catch (err) {
        console.warn("IndexedDB delete failed:", err);
      }

      setOrders(
        currentOrders.filter(
          (o) => !eligibleToDelete.some((e) => e.id === o.id),
        ),
      );

      setShowDeleteModal(false);
      setSelectedOrderIds(new Set());
      setDeleteResultMessage({ type: "success", text: "勾选数据已成功删除" });

      createLog({
        module: "合同管理中心",
        action: "批量删除",
        status: "success",
        details: `成功删除了 ${eligibleToDelete.length} 条合同订单记录`
      }).catch(() => {});
    } catch (e: any) {
      console.error("Delete failed:", e);
      setShowDeleteModal(false);
      setDeleteResultMessage({
        type: "error",
        text: e?.message || "删除出错，请稍候重试",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatOrderDate = (dateStr: string) => {
    if (!dateStr) return "--";
    if (dateStr.includes('年')) {
      const parts = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (parts) {
        const [_, y, m, d] = parts;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }
    return dateStr;
  };

  const formatCurrencyCode = (currency: string) => {
    const map: Record<string, string> = {
      'CNY': '人民币/CNY',
      '元': '人民币/CNY',
      'USD': '美元/USD',
      'EUR': '欧元/EUR',
      'HKD': '港币/HKD',
      'JPY': '日元/JPY'
    };
    return map[currency] || (currency ? `其他/${currency}` : '人民币/CNY');
  };

  const generateDocNumber = (order: any) => {
    if (order.docNumber) return order.docNumber;
    
    const typeMap: Record<string, string> = {
      'Upload': 'UP',
      'Email': 'EM',
      'Voice': 'VO'
    };
    const prefix = typeMap[order.source as string] || 'SO';
    
    // Use createdAt if available, otherwise orderDate
    const dateStr = order.createdAtDate?.replace(/-/g, '') || order.orderDate?.replace(/-/g, '') || '20260511';
    const timeStr = (order.createdAtTime?.replace(/:/g, '') || '0900').padEnd(6, '0');
    
    // Stable sequence from ID
    const hash = order.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const sequence = (hash % 1000000).toString().padStart(6, '0');
    
    return `${prefix}${dateStr}${timeStr}${sequence}`;
  };

  const handleSaveEditedOrder = async () => {
    if (!editedOrder) return;
    try {
      setLoading(true);
      const user = (await import("@/src/lib/firebase")).auth.currentUser;
      if (user && !editedOrder.id.startsWith('ORD-')) {
         const { db, doc, updateDoc, handleFirestoreError, OperationType } = await import("@/src/lib/firebase");
         try {
            await updateDoc(doc(db, "orders", editedOrder.id), editedOrder);
         } catch(e) {
            handleFirestoreError(e, OperationType.UPDATE, "orders");
         }
      } else {
         const updated = orders.map(o => o.id === editedOrder.id ? { ...editedOrder } : o);
         setOrders(updated);
         localStorage.setItem('demo_orders', JSON.stringify(updated));
      }
      setIsEditing(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleSyncSAP = async (e: React.MouseEvent, order: any) => {
    e.stopPropagation();
    if (isPushed(order.status)) return;
    
    // Mock sync logic
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSapNo = "45" + Math.floor(Math.random() * 90000000 + 10000000).toString();
      
      const user = (await import("@/src/lib/firebase")).auth.currentUser;
      if (user && !order.id.startsWith('ORD-')) {
         const { db, doc, updateDoc } = await import("@/src/lib/firebase");
         await updateDoc(doc(db, "orders", order.id), {
           status: '已同步SAP',
           sapOrderNumber: newSapNo
         });
      } else {
        // Mock update
        const updated = orders.map(o => o.id === order.id ? { ...o, status: '已同步SAP', sapOrderNumber: newSapNo } : o);
        setOrders(updated);
        // Also update localStorage for mock persistence
        const demoOrders = getDemoOrders().map(o => o.id === order.id ? { ...o, status: '已同步SAP', sapOrderNumber: newSapNo } : o);
        localStorage.setItem('demo_orders', JSON.stringify(demoOrders));
      }

      createLog({
        module: "合同管理中心",
        action: "同步SAP",
        status: "success",
        details: `订单 ${order.contractNumber} 已成功同步至 SAP (单据号: ${newSapNo})`,
        sapDoc: newSapNo
      }).catch(() => {});
      
      setDeleteResultMessage({ type: 'success', text: `订单 ${order.contractNumber} 已成功同步至 SAP S/4HANA (单据号: ${newSapNo})` });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (e: React.MouseEvent, order: any) => {
    e.stopPropagation();
    if (!isDraft(order.status)) {
      setDeleteResultMessage({ type: "error", text: "只能删除【暂存状态】或空的订单" });
      return;
    }
    
    setSelectedOrderIds(new Set([order.id]));
    setShowDeleteModal(true);
  };

  const getFilteredOrders = () => {
    let result = orders.length > 0 ? orders : getDemoOrders();
    
    // Search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(o => 
        (o.contractNumber?.toLowerCase()?.includes(lower)) || 
        (o.customerName?.toLowerCase()?.includes(lower)) ||
        (o.id?.toLowerCase()?.includes(lower))
      );
    }

    // Tab filter
    if (activeTab === "SAP 已同步") {
      result = result.filter(o => isPushed(o.status));
    } else if (activeTab === "暂存中") {
      result = result.filter(o => isDraft(o.status));
    } else if (activeTab === "邮件来源") {
      result = result.filter(o => o.source === "Email");
    }

    return result;
  };

  const filteredOrders = getFilteredOrders();

  if (selectedOrder) {
    const viewOrder = isEditing && editedOrder ? editedOrder : selectedOrder;
    const totalOrderAmount =
      viewOrder.totalAmount ||
      (viewOrder.items || []).reduce(
        (acc: number, item: any) => acc + (item.totalAmount || 0),
        0,
      );

    const InfoField = ({
      label,
      value,
      highlight,
      isLink,
      onLinkClick,
      editable,
      onChange,
    }: {
      label: string;
      value: React.ReactNode;
      highlight?: boolean;
      isLink?: boolean;
      onLinkClick?: (e: any) => void;
      editable?: boolean;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="text-[11px] font-bold text-gray-500 truncate">
          {label}
        </span>
        {isLink ? (
          <button
            onClick={onLinkClick}
            className="text-left w-full h-[32px] px-2 flex items-center bg-[#FAFAFA] border border-[#E8E8E8] rounded-[2px] text-[12px] font-bold text-sap-blue hover:underline cursor-pointer overflow-hidden"
          >
            <Paperclip size={12} className="mr-1 shrink-0" />{" "}
            <span className="truncate">{value}</span>
          </button>
        ) : (
          editable && isEditing ? (
            <input
              type="text"
              value={typeof value === 'string' || typeof value === 'number' ? value : ""}
              onChange={onChange}
              className="w-full h-[32px] px-2 border border-[#1677FF] rounded-[2px] text-[12px] font-bold text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1677FF]"
            />
          ) : (
            <div
              className={
                "w-full h-[32px] px-2 flex items-center bg-[#FAFAFA] border border-[#E8E8E8] rounded-[2px] text-[12px] font-bold truncate " +
                (highlight ? "text-[#FF4D4F]" : "text-[#333333]")
              }
            >
              <span className="truncate">{value}</span>
            </div>
          )
        )}
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col bg-[#F5F7FA] overflow-hidden h-full"
      >
        {/* CRITICAL: DO NOT MODIFY START - UI 屏蔽保护 */}
        {/* Detail Header */}
        <div className="bg-white border-b border-[#E2E8F0] px-4 py-2 shrink-0 h-[48px] flex items-center justify-between shadow-sm z-10 w-full relative">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="p-1 hover:bg-gray-100 rounded-[2px] transition-colors text-gray-500"
            >
              <ArrowLeft size={16} />
            </button>
            <h3 className="text-[14px] font-bold text-sap-gray-900 tracking-tight flex items-center gap-2">
              合同订单详情: {viewOrder.contractNumber || viewOrder.id}
              <span className="text-[10px] text-gray-400 font-normal ml-2">
                日期: {viewOrder.orderDate}
              </span>
              <span className="ml-2">{getStatusBadge(viewOrder.status)}</span>
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {viewOrder.accuracy && (
              <div className="text-right flex items-center gap-2 mr-2 animate-in fade-in duration-500">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                  识别准确度
                </span>
                <span className="text-[15px] font-black text-sap-success leading-none">
                  {viewOrder.accuracy}
                </span>
              </div>
            )}
            <div className="text-right flex items-center gap-2 mr-2">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                订单总值
              </span>
              <span className="text-[16px] font-black text-sap-blue leading-none">
                {totalOrderAmount.toLocaleString("zh-CN", {
                  minimumFractionDigits: 2,
                })}
                <span className="text-[11px] ml-1 font-bold opacity-60">
                  CNY
                </span>
              </span>
            </div>
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[28px] text-[12px] px-4 font-bold"
                  onClick={() => { setIsEditing(false); setEditedOrder(null); }}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="h-[28px] text-[12px] px-4 font-bold bg-[#1677FF] border-[#1677FF]"
                  onClick={handleSaveEditedOrder}
                >
                  保存修改
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[28px] text-[12px] px-3 font-bold border-[#1677FF]/40 text-[#1677FF] hover:text-[#0050B3] hover:border-[#1677FF] hover:bg-[#1677FF]/5 bg-white shadow-xs"
                  leftIcon={<Paperclip size={14} />}
                  onClick={(e) => handleOpenAttachments(e, viewOrder.id, viewOrder.attachments)}
                >
                  附件预览
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[28px] text-[12px] px-3 font-bold"
                  leftIcon={<Download size={14} />}
                >
                  下载 PDF
                </Button>
                {(!viewOrder.sapOrderNumber ||
                  viewOrder.status === "暂存中") && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-[28px] text-[12px] px-4 font-bold bg-[#1677FF] border-[#1677FF]"
                    onClick={(e) => handleSyncSAP(e, viewOrder)}
                  >
                    同步 SAP
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {/* CRITICAL: DO NOT MODIFY END */}

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-wide h-0 relative">
          <div className="max-w-[1400px] mx-auto space-y-4 pb-12">
            
            {/* Header Info */}
            <div className="bg-white border border-[#E2E8F0] rounded-[4px] shadow-sm">
               <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <h4 className="border-l-4 border-[#1677FF] pl-2 text-[13px] font-bold text-[#333333] leading-none flex items-center">
                    合同抬头信息
                  </h4>
               </div>
               <div className="p-4 grid grid-cols-4 gap-3">
                  <InfoField label="单据号" value={selectedOrder.id} />
                  <InfoField label="单据创建日期" value={selectedOrder.createdAtDate || selectedOrder.orderDate} />
                  <InfoField label="单据创建时间" value={selectedOrder.createdAtTime || "09:00:00"} />
                  <InfoField label="合同编号" value={selectedOrder.contractNumber} />
                  
                  <InfoField label="客户名称" value={selectedOrder.customerName} />
                  <InfoField label="客户税号" value={selectedOrder.customerTaxId || "未录入"} />
                  <InfoField label="订单日期" value={selectedOrder.orderDate} />
                  <InfoField label="付款条件" value={selectedOrder.paymentTerms} />
                  
                  <InfoField label="计划交期" value={selectedOrder.plannedDeliveryDate} />
                  <InfoField label="送货地址" value={selectedOrder.shippingAddress} />
                  <InfoField label="送货联系人" value={selectedOrder.contactPerson} />
                  <InfoField label="送货联系电话" value={selectedOrder.contactPhone} />
                  
                  <InfoField label="合同不含税总金额" value={selectedOrder.currency === "CNY" ? (selectedOrder.items || []).reduce((s, i) => s + (i.amountNet || 0), 0)?.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) : (selectedOrder.items || []).reduce((s, i) => s + (i.amountNet || 0), 0)?.toFixed(2)} />
                  <InfoField label="合同税额总金额" value={selectedOrder.currency === "CNY" ? (selectedOrder.items || []).reduce((s, i) => s + (i.taxAmount || 0), 0)?.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) : (selectedOrder.items || []).reduce((s, i) => s + (i.taxAmount || 0), 0)?.toFixed(2)} />
                  <InfoField label="合同总金额" value={selectedOrder.currency === "CNY" ? totalOrderAmount?.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) : totalOrderAmount?.toFixed(2)} />
                  
                  <InfoField label="币种" value={selectedOrder.currency || "CNY"} />
                  <InfoField label="SAP订单号" value={selectedOrder.sapOrderNumber || "尚未同步"} highlight={!!selectedOrder.sapOrderNumber} />
               </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-[4px] shadow-sm overflow-hidden flex flex-col">
               <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <h4 className="border-l-4 border-[#1677FF] pl-2 text-[13px] font-bold text-[#333333] leading-none flex items-center">
                    合同行明细信息
                  </h4>
               </div>
               <div className="overflow-x-auto custom-scrollbar-wide pb-2">
                 <table className="w-full text-left min-w-[1200px] border-collapse">
                   <thead className="bg-[#F8FAFC]">
                     <tr className="border-b border-[#E2E8F0] h-[36px]">
                        <th className="px-4 text-[12px] font-bold text-gray-500 w-12 text-center whitespace-nowrap">行号</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500">物料编码</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500">物料描述/规格</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500">计划交期</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500 text-right">数量</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500">单位</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500 text-right">不含税单价</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500 text-center">币种</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500 text-right">不含税金额</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500 text-right">税额</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500 text-right">税率</th>
                        <th className="px-4 text-[12px] font-bold text-gray-500 text-right">总金额</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#F0F0F0]">
                     {(viewOrder.items || []).map((item: any, idx: number) => {
                       const taxRateStr = (item.taxRate !== undefined && item.taxRate !== null && !isNaN(item.taxRate)) ? `${(item.taxRate * 100).toFixed(0)}%` : `${((item.taxAmount || 0) / (item.amountNet || 1) * 100).toFixed(0)}%`;
                       const cur = viewOrder.currency || "CNY";
                       const netPriceStr = cur === "CNY" ? item.unitPriceNet?.toLocaleString('zh-CN', { minimumFractionDigits: 2}) : item.unitPriceNet?.toFixed(2);
                       const netAmountStr = cur === "CNY" ? item.amountNet?.toLocaleString('zh-CN', { minimumFractionDigits: 2}) : item.amountNet?.toFixed(2);
                       const taxAmountStr = cur === "CNY" ? item.taxAmount?.toLocaleString('zh-CN', { minimumFractionDigits: 2}) : item.taxAmount?.toFixed(2);
                       const totalStr = cur === "CNY" ? item.totalAmount?.toLocaleString('zh-CN', { minimumFractionDigits: 2}) : item.totalAmount?.toFixed(2);

                       return (
                         <tr key={idx} className="h-[36px] hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 text-[12px] text-gray-400 font-mono text-center">{(idx + 1).toString().padStart(2, '0')}</td>
                            <td className="px-4 text-[12px] font-bold text-[#1677FF] hover:underline cursor-pointer">{item.materialNumber}</td>
                            <td className="px-4 text-[12px] font-bold text-[#333333] table-cell max-w-[200px] truncate" title={item.name}>{item.name}</td>
                            <td className="px-4 text-[12px] text-gray-500">{viewOrder.plannedDeliveryDate}</td>
                            <td className="px-4 text-[12px] font-black text-[#333333] text-right">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={item.quantity || 0} 
                                  className="w-16 text-right border border-[#1677FF] rounded px-1"
                                  onChange={(e) => {
                                      const newItems = [...viewOrder.items];
                                      newItems[idx] = { ...newItems[idx], quantity: Number(e.target.value) };
                                      setEditedOrder({...viewOrder, items: newItems});
                                  }}
                                />
                              ) : item.quantity}
                            </td>
                            <td className="px-4 text-[12px] text-gray-500">{item.unit}</td>
                            <td className="px-4 text-[12px] text-gray-500 text-right">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={item.unitPriceNet || 0} 
                                  className="w-20 text-right border border-[#1677FF] rounded px-1"
                                  onChange={(e) => {
                                      const newItems = [...viewOrder.items];
                                      newItems[idx] = { ...newItems[idx], unitPriceNet: Number(e.target.value) };
                                      setEditedOrder({...viewOrder, items: newItems});
                                  }}
                                />
                              ) : netPriceStr}
                            </td>
                            <td className="px-4 text-[12px] text-gray-400 font-bold text-center">{cur}</td>
                            <td className="px-4 text-[12px] font-black text-[#333333] text-right">{netAmountStr}</td>
                            <td className="px-4 text-[12px] text-gray-500 text-right">{taxAmountStr}</td>
                            <td className="px-4 text-[12px] text-gray-500 text-right">{taxRateStr}</td>
                            <td className="px-4 text-[12px] font-black text-[#333333] text-right">{totalStr}</td>
                         </tr>
                       );
                     })}
                     
                     {/* 合计行 - Summary Row */}
                     <tr className="h-[36px] bg-white border-t border-[#E2E8F0]">
                        <td className="px-4 text-[13px] font-bold text-[#333333] text-center whitespace-nowrap">合计</td>
                        <td colSpan={7}></td>
                        <td className="px-4 text-[13px] font-bold text-[#333333] text-right">{viewOrder.currency === "CNY" ? (viewOrder.items || []).reduce((s: any, i: any) => s + (i.amountNet || 0), 0)?.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) : (viewOrder.items || []).reduce((s: any, i: any) => s + (i.amountNet || 0), 0)?.toFixed(2)}</td>
                        <td className="px-4 text-[13px] font-bold text-[#333333] text-right">{viewOrder.currency === "CNY" ? (viewOrder.items || []).reduce((s: any, i: any) => s + (i.taxAmount || 0), 0)?.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) : (viewOrder.items || []).reduce((s: any, i: any) => s + (i.taxAmount || 0), 0)?.toFixed(2)}</td>
                        <td className="px-4"></td>
                        <td className="px-4 text-[13px] font-black text-[#1677FF] text-right">{viewOrder.currency === "CNY" ? (viewOrder.totalAmount || (viewOrder.items || []).reduce((s: any, i: any) => s + (i.totalAmount || 0), 0))?.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) : (viewOrder.totalAmount || (viewOrder.items || []).reduce((s: any, i: any) => s + (i.totalAmount || 0), 0))?.toFixed(2)}</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
            
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F1F5F9] overflow-hidden h-full">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 h-[40px] flex items-center justify-between shrink-0 shadow-sm z-10 w-full relative">
        <div className="flex items-center">
          <h2 className="text-[14px] font-bold tracking-tight text-sap-gray-900 leading-none">
            合同管理中心
          </h2>
          <div className="ml-3 h-3 w-[1px] bg-gray-200 hidden md:block" />
          <span className="text-[10px] text-gray-400 font-bold ml-3 tracking-tight hidden md:inline">
            效能监控 / SAP 集成
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {selectedOrderIds.size > 0 && (
            <button
              onClick={handleDeleteClick}
              className="flex items-center justify-center gap-1 px-2 h-7 border border-red-200 rounded-[2px] text-[11px] font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all shrink-0"
            >
              <Trash2 size={12} /> <span>删除选中</span>
            </button>
          )}
          <button className="flex items-center justify-center gap-1 px-2 h-7 border border-[#E2E8F0] rounded-[2px] text-[11px] font-bold text-sap-gray-900 bg-white hover:bg-gray-50 transition-all shrink-0">
            <Download size={12} /> <span>导出报表</span>
          </button>
          <button className="flex items-center justify-center gap-1 bg-sap-gray-900 text-white px-3 h-7 rounded-[2px] text-[11px] font-bold hover:bg-sap-blue transition-all shrink-0">
            <Plus size={12} /> <span>新增合同</span>
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-[#E2E8F0] px-4 py-1.5 flex items-center justify-between shrink-0 z-0 relative">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <div className="relative flex-1 max-w-[240px]">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={12}
            />
            <input
              type="text"
              placeholder="搜索客户、单号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2 h-7 bg-gray-50 border border-[#E2E8F0] rounded-[2px] text-[12px] text-sap-gray-900 focus:bg-white focus:border-sap-blue outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {([ "全部条目", "暂存中", "SAP 已同步", "邮件来源" ] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 h-7 rounded-[2px] text-[11px] font-bold transition-all whitespace-nowrap border",
                    activeTab === tab
                      ? "bg-sap-gray-900 text-white border-sap-gray-900 shadow-sm"
                      : "bg-white text-gray-500 border-[#E2E8F0] hover:bg-gray-50",
                  )}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar h-0">
        <div className="w-full">
          <div className="bg-white border border-[#E2E8F0] rounded-[2px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1500px] border-collapse whitespace-nowrap table-fixed">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-sap-blue/[0.03] border-b border-[#F0F0F0] text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                    <th className="w-12 px-3 h-9 text-center">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded-[2px] border-gray-300 text-sap-blue focus:ring-sap-blue cursor-pointer bg-white"
                        checked={
                          filteredOrders.length > 0 &&
                          selectedOrderIds.size === filteredOrders.length
                        }
                        onChange={handleToggleSelectAll}
                      />
                    </th>
                    <th className="px-3 h-9 w-[180px]">单据号</th>
                    <th className="px-3 h-9 w-32 text-center">单据创建日期</th>
                    <th className="px-3 h-9 w-28 text-center">单据创建时间</th>
                    <th className="px-3 h-9 w-40">合同编号</th>
                    <th className="px-3 h-9 w-[300px]">客户名称</th>
                    <th className="px-3 h-9 w-32 text-center">订单日期</th>
                    <th className="px-3 h-9 w-32 text-right">总金额</th>
                    <th className="px-3 h-9 w-20 text-center">币种</th>
                    <th className="px-3 h-9 w-28 text-center">渠道来源</th>
                    <th className="px-3 h-9 w-24 text-center">状态</th>
                    <th className="px-3 h-9 w-28 text-center">附件</th>
                    <th className="px-3 h-9 w-32 text-left">SAP 单据号</th>
                    <th className="px-3 h-9 w-52 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {loading && orders.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center h-32">
                        <RefreshCcw
                          size={14}
                          className="animate-spin text-sap-blue mx-auto mb-2"
                        />
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                          Syncing SAP Cloud Data...
                        </p>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center h-32">
                        <Package
                          size={20}
                          className="opacity-20 mx-auto mb-2"
                        />
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                          No Records Found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order: any) => (
                      <tr
                        key={order.id}
                        className={cn(
                          "group hover:bg-gray-50 transition-colors h-[36px] text-[12px]",
                          selectedOrderIds.has(order.id)
                            ? "bg-sap-blue/[0.03]"
                            : "",
                        )}
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <td
                          className="px-3 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newSelected = new Set(selectedOrderIds);
                            if (newSelected.has(order.id))
                              newSelected.delete(order.id);
                            else newSelected.add(order.id);
                            setSelectedOrderIds(newSelected);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded-[2px] border-gray-300 text-sap-blue focus:ring-sap-blue cursor-pointer"
                            checked={selectedOrderIds.has(order.id)}
                            onChange={() => {}}
                          />
                        </td>
                        <td className="px-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                          {generateDocNumber(order)}
                        </td>
                        <td className="px-3 text-gray-500 font-mono text-[11px] text-center whitespace-nowrap shrink-0">
                          {formatOrderDate(order.createdAtDate || order.orderDate)}
                        </td>
                        <td className="px-3 text-gray-400 font-mono text-[11px] text-center whitespace-nowrap">
                          {order.createdAtTime || "09:00"}
                        </td>
                        <td className="px-3 font-bold text-sap-blue whitespace-nowrap">
                          {order.contractNumber}
                        </td>
                        <td className="px-3 text-sap-gray-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis" title={order.customerName}>
                          {order.customerName}
                        </td>
                        <td className="px-3 text-gray-500 font-mono text-[11px] text-center whitespace-nowrap">
                          {formatOrderDate(order.orderDate)}
                        </td>
                        <td className="px-3 text-right font-mono font-bold text-sap-gray-900">
                          {order.totalAmount?.toLocaleString("zh-CN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-3 text-center text-[10px] text-gray-400 font-bold whitespace-nowrap">
                          {formatCurrencyCode(order.currency)}
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-1.5 opacity-80">
                            {getSourceIcon(order.source)}
                            <span className="text-gray-500 text-[11px] font-bold uppercase tracking-tighter">
                              {getSourceLabel(order.source || "").replace(
                                /识别|上传文档\/图片/g,
                                "",
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 text-center">
                          <div className="flex justify-center">
                            {getStatusBadge(order.status)}
                          </div>
                        </td>
                        <td className="px-3 text-center">
                          <button
                            onClick={(e) =>
                              handleOpenAttachments(e, order.id, order.attachments)
                            }
                            className="p-1 hover:bg-sap-blue/10 rounded-[2px] transition-colors text-gray-400 hover:text-sap-blue flex items-center justify-center mx-auto"
                          >
                            <Paperclip size={12} />
                            <span className="text-[9px] ml-0.5">{(order.attachments && order.attachments.length > 0 && !order.attachments[0].startsWith('data:')) ? order.attachments[0] : "原始文档"}</span>
                          </button>
                        </td>
                        <td className="px-3">
                          {order.sapOrderNumber ? (
                            <div className="flex items-center gap-1 text-emerald-600 font-mono font-bold text-[11px]">
                              <CheckCircle2 size={10} />
                              {order.sapOrderNumber}
                            </div>
                          ) : (
                            <span className="text-gray-300 font-mono text-[10px] italic">
                              --
                            </span>
                          )}
                        </td>
                        <td className="px-3 text-center">
                           <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}
                                className="px-1.5 py-0.5 text-[10px] font-bold text-sap-blue hover:bg-sap-blue/5 rounded-[2px]"
                              >查看</button>
                              <button 
                                disabled={!isDraft(order.status)}
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedOrderId(order.id);
                                  if (isDraft(order.status)) {
                                    setIsEditing(true);
                                    setEditedOrder({...order});
                                  } else {
                                    setIsEditing(false);
                                    setEditedOrder(null);
                                  }
                                }}
                                className={cn(
                                  "px-1.5 py-0.5 text-[10px] font-bold rounded-[2px]",
                                  !isDraft(order.status)
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-[#FF8C31] hover:bg-[#FF8C31]/5"
                                )}
                              >修改</button>
                              <button 
                                disabled={!isDraft(order.status)}
                                onClick={(e) => handleDeleteSingle(e, order)}
                                className={cn(
                                  "px-1.5 py-0.5 text-[10px] font-bold rounded-[2px]",
                                  !isDraft(order.status)
                                    ? "text-gray-300 cursor-not-allowed" 
                                    : "text-red-500 hover:bg-red-50"
                                )}
                              >删除</button>
                              <button 
                                disabled={isPushed(order.status)}
                                onClick={(e) => handleSyncSAP(e, order)}
                                className={cn(
                                  "px-1.5 py-0.5 text-[10px] font-bold rounded-[2px] border border-transparent",
                                  isPushed(order.status)
                                    ? "text-gray-300 bg-gray-50"
                                    : "text-[#1677FF] border-[#1677FF]/20 hover:bg-[#1677FF]/5 bg-[#1677FF]/5"
                                )}
                              >同步SAP</button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Footer */}
            <div className="px-4 h-9 border-t border-[#E2E8F0] bg-gray-50 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                Displaying 01-10 of 48 records
              </p>
              <div className="flex items-center gap-1">
                <button className="h-6 px-2 text-[10px] font-bold text-gray-400 border border-[#E2E8F0] rounded-[2px] bg-white hover:bg-gray-50">
                  PREV
                </button>
                <div className="flex items-center gap-1 mx-2">
                  <button className="h-6 w-6 text-[10px] font-bold bg-sap-blue text-white rounded-[2px]">
                    1
                  </button>
                  <button className="h-6 w-6 text-[10px] font-bold text-gray-400 hover:bg-gray-200 rounded-[2px]">
                    2
                  </button>
                  <button className="h-6 w-6 text-[10px] font-bold text-gray-400 hover:bg-gray-200 rounded-[2px]">
                    3
                  </button>
                </div>
                <button className="h-6 px-2 text-[10px] font-bold text-gray-400 border border-[#E2E8F0] rounded-[2px] bg-white hover:bg-gray-50">
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-[4px] shadow-2xl w-full max-w-sm p-6 flex flex-col items-center justify-center border border-[#E2E8F0]"
            >
              <div className="w-12 h-12 rounded-[4px] bg-red-50 flex items-center justify-center text-red-500 mb-4 border border-red-100">
                <Trash2 size={24} />
              </div>
              <h3 className="text-[16px] font-bold text-sap-gray-900 mb-1">
                确认删除记录
              </h3>
              <p className="text-[12px] font-bold text-gray-400 mb-6 text-center max-w-[240px] uppercase tracking-tight">
                Selected records will be permanently removed from ERP.
              </p>

              <div className="flex w-full gap-2">
                <button
                  className="flex-1 h-8 rounded-[2px] bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold transition-all"
                  onClick={confirmDeleteAction}
                >
                  确定删除
                </button>
                <button
                  className="flex-1 h-8 rounded-[2px] border border-[#E2E8F0] text-gray-500 hover:bg-gray-50 text-[12px] font-bold transition-all"
                  onClick={() => setShowDeleteModal(false)}
                >
                  放弃
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {deleteResultMessage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteResultMessage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center justify-center"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                  deleteResultMessage.type === "success"
                    ? "bg-green-50 text-green-500"
                    : "bg-red-50 text-red-500",
                )}
              >
                {deleteResultMessage.type === "success" ? (
                  <CheckCircle2 size={32} />
                ) : (
                  <AlertCircle size={32} />
                )}
              </div>
              <h3 className="text-xl font-bold text-sap-gray-900 mb-2">
                {deleteResultMessage.type === "success"
                  ? "删除成功"
                  : "删除失败"}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-8 text-center px-4">
                {deleteResultMessage.text}
              </p>

              <div className="flex w-full gap-4">
                <Button
                  variant={
                    deleteResultMessage.type === "success"
                      ? "primary"
                      : "outline"
                  }
                  className={cn(
                    "flex-1 rounded-2xl",
                    deleteResultMessage.type === "success"
                      ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-sap-gray-900",
                  )}
                  onClick={() => setDeleteResultMessage(null)}
                >
                  <span className="font-bold">知道啦</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AttachmentViewer
        isOpen={attachmentViewerOpen}
        onClose={() => setAttachmentViewerOpen(false)}
        attachments={currentAttachments}
        orderId={currentAttachmentOrderId}
      />
    </div>
  );
}
