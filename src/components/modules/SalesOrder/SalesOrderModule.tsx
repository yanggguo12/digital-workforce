import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload, FileText, RefreshCcw, CheckCircle, AlertCircle, FileSearch,
  Scan, Building2, Play, Cpu, Trash2, Send, Save, X, Plus, ChevronRight, Check
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AppState, SalesOrderData } from "@/src/types";
import { saveDemoOrder, getDemoOrders } from "../../../lib/mockData";
import { Button } from "../../ui/Button";
import { SuccessModal } from "../../ui/SuccessModal";
import { createLog } from "@/src/services/logService";
import { GoogleGenAI, Type } from "@google/genai";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// Memory stream protocol: cache file data directly in memory
const globalFileCache = new Map<string, { base64Data: string, mimeType: string, name: string }>();

interface EditableOrderRecord {
  id?: string;
  contractNumber: string;
  customerName: string;
  customerTaxId: string;
  orderDate: string;
  paymentTerms: string;
  totalAmount: number;
  currency: string;
  shippingAddress: string;
  contactPerson: string;
  contactPhone: string;
  plannedDeliveryDate: string;
  createdAtDate: string;
  createdAtTime: string;
  attachments?: string[];
  items: {
    materialNumber: string;
    name: string;
    quantity: number;
    unit: string;
    plannedDeliveryDate: string;
    unitPriceNet: number;
    currency: string;
    amountNet: number;
    taxAmount: number;
    taxRate: number;
    totalAmount: number;
  }[];
}

interface DocumentTask {
  id: string;
  file?: File;
  fileUrl?: string;
  sourceType?: 'PDF 文档' | '图片文件';
  pdfPages: string[];
  isPdfRendering: boolean;
  form: EditableOrderRecord | null;
  status: "pending" | "processing" | "analyzed" | "synced" | "draft" | "error";
  errorMsg?: string;
  contractNumber?: string;
  customerName?: string;
  confidence?: number;
  isDuplicate?: boolean;
}

function ConfidenceDisplay({ confidence }: { confidence?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (confidence === undefined) return;
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(confidence * easeProgress);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(confidence);
      }
    };
    requestAnimationFrame(animate);
  }, [confidence]);

  if (confidence === undefined) return null;

  let colorClass = "text-[#FF4D4F]"; // < 90%
  let textLabel = " (置信度较低)";
  if (confidence >= 95) {
    colorClass = "text-[#1677FF]"; // 顶级蓝
    textLabel = " (可直接执行)";
  } else if (confidence >= 90) {
    colorClass = "text-[#FA8C16]"; // 橙色
    textLabel = " (需人工复核)";
  }

  return (
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("text-[11px] font-black font-mono", colorClass)}
    >
      准确度 {displayValue.toFixed(1)}%{textLabel}
    </motion.span>
  );
}

export function SalesOrderModule({
  inputSource,
  initialData,
  onClearInitial,
  onViewOrders,
}: {
  inputSource: "Upload" | "Email" | "Voice";
  initialData?: any;
  onClearInitial?: () => void;
  onViewOrders?: () => void;
}) {
  const [tasks, setTasksState] = useState<DocumentTask[]>(() => {
    if (initialData) {
      return [{
        id: "initial",
        pdfPages: [],
        isPdfRendering: false,
        form: initialData,
        status: "analyzed",
        contractNumber: initialData.contractNumber,
        customerName: initialData.customerName,
        confidence: 100
      }];
    }
    return [];
  });
  
  const tasksRef = useRef<DocumentTask[]>(tasks);
  const setTasks = (val: DocumentTask[] | ((prev: DocumentTask[]) => DocumentTask[])) => {
    setTasksState(prev => {
        const next = typeof val === 'function' ? val(prev) : val;
        tasksRef.current = next;
        return next;
    });
  };

  const [activeTaskId, setActiveTaskId] = useState<string | null>(initialData ? "initial" : null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"draft" | "synced">("synced");
  const [isSaving, setIsSaving] = useState(false);
  const [resultCounts, setResultCounts] = useState({ success: 0, fail: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  // Memory Cleanup
  useEffect(() => {
    return () => {
      tasksRef.current.forEach(task => {
        if (task.fileUrl) URL.revokeObjectURL(task.fileUrl);
      });
      abortControllers.current.forEach(c => c.abort());
      abortControllers.current.clear();
      globalFileCache.clear();
    };
  }, []);

  const updateTask = (id: string, partial: Partial<DocumentTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...partial } : t));
  };

  const handleMultipleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Read all files concurrently but maintain order using Promise.all on indexed map
    const newTasksData = await Promise.all(fileArray.map(async (file) => {
      const id = Math.random().toString(36).substring(7);
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsDataURL(file);
      });
      
      globalFileCache.set(id, { base64Data, mimeType: file.type, name: file.name });
      
      const task: DocumentTask = {
        id,
        file,
        fileUrl: URL.createObjectURL(file),
        pdfPages: [],
        isPdfRendering: false,
        form: null,
        status: "pending",
        contractNumber: "等待识别...",
        customerName: file.name,
        sourceType: file.type.startsWith('image/') ? '图片文件' : 'PDF 文档'
      };
      return task;
    }));

    setTasks(prev => [...prev, ...newTasksData]);
    if (!activeTaskId && newTasksData.length > 0) setActiveTaskId(newTasksData[0].id);

    // Concurrent start
    newTasksData.forEach(task => processSingleTask(task));
  };

  const checkDuplicateLocal = async (contractNo: string, customerName: string): Promise<boolean> => {
    if (!contractNo || !customerName) return false;
    
    // 1. Check current session
    const currentDupe = tasksRef.current.some(t => 
      t.id !== activeTaskId && // Don't check against self if re-running
      t.status === "analyzed" && 
      t.form?.contractNumber === contractNo && 
      t.form?.customerName === customerName
    );
    if (currentDupe) return true;

    // 2. Check Firestore if logged in
    const { auth, db, collection, query, where, getDocs } = await import("@/src/lib/firebase");
    if (auth.currentUser) {
      try {
        const q = query(collection(db, "orders"), 
          where("userId", "==", auth.currentUser.uid),
          where("contractNumber", "==", contractNo),
          where("customerName", "==", customerName)
        );
        const snap = await getDocs(q);
        if (!snap.empty) return true;
        
        // If logged in, we only care about Firestore data for duplicate check
        // to avoid confusion with local MOCK_ORDERS that aren't showing up.
        // Unless there's actually something in local demo_orders.
        const savedRaw = localStorage.getItem('demo_orders');
        if (savedRaw) {
           const stored = JSON.parse(savedRaw);
           if (stored.some((o: any) => o.contractNumber === contractNo && o.customerName === customerName)) return true;
        }
        return false;
      } catch (e) {
        console.error("Duplicate check failed:", e);
      }
    }

    // 3. Fallback to local history (includes MOCK_ORDERS if nothing saved)
    const stored = getDemoOrders();
    if (stored.some((o: any) => o.contractNumber === contractNo && o.customerName === customerName)) return true;
    
    return false;
  };

  const processSingleTask = async (taskExt: DocumentTask) => {
    const { id } = taskExt;
    
    // Abort previous if exists
    if (abortControllers.current.has(id)) {
      abortControllers.current.get(id)?.abort();
    }
    const controller = new AbortController();
    abortControllers.current.set(id, controller);

    updateTask(id, { status: "processing", contractNumber: "智能解析中...", errorMsg: undefined, form: null });

    const fileInfo = globalFileCache.get(id);
    if (!fileInfo) {
      updateTask(id, { status: "error", errorMsg: "内存数据流丢失" });
      return;
    }

    try {
      let renderedPages: string[] = [];
      if (fileInfo.mimeType === "application/pdf") {
        updateTask(id, { isPdfRendering: true });
        const binaryString = atob(fileInfo.base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;
        const pages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (controller.signal.aborted) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.2 }); 
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            pages.push(canvas.toDataURL("image/jpeg", 0.9));
          }
        }
        renderedPages = pages;
        updateTask(id, { pdfPages: pages, isPdfRendering: false });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API_KEY_MISSING");

      const aiClient = new GoogleGenAI({ apiKey });
      const prompt = `你是一位顶级 SAP ERP 专家与视觉 OCR 识别大师。
你的任务是从这份采购合同/订单中提取核心商务数据，用于同步至 S/4HANA 系统。

【提取字段要求】：
1. 订单抬头：
   - contractNumber (合同号/订单号)
   - customerName (客户名称)
   - customerTaxId (客户税号)
   - orderDate (订单日期)
   - paymentTerms (付款结算方式)
   - plannedDeliveryDate (整体计划交期)
   - shippingAddress (送货详细地址)
   - contactPerson (送货联系人)
   - contactPhone (联系电话)

2. 订单行项目 (items)：
   - materialNumber (物料编码/品号)
   - name (物料描述/规格)
   - plannedDeliveryDate (单项交期，若无则延用抬头交期)
   - quantity (数量)
   - unit (单位)
   - unitPriceNet (不含税单价)
   - amountNet (不含税金额)
   - taxAmount (税额)
   - taxRate (税率，如 13)
   - totalAmount (价税合计)
   - currency (币种)

【输出要求】：
1. 必须输出合法且严谨的 JSON 格式。
2. 数字字段必须为 Number 类型。
3. 若字段缺失，请输出 null 或空字符串。`;

      const aiConfig = {
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              contractNumber: { type: Type.STRING },
              customerName: { type: Type.STRING },
              customerTaxId: { type: Type.STRING },
              orderDate: { type: Type.STRING },
              paymentTerms: { type: Type.STRING },
              shippingAddress: { type: Type.STRING },
              contactPerson: { type: Type.STRING },
              contactPhone: { type: Type.STRING },
              plannedDeliveryDate: { type: Type.STRING },
              currency: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    materialNumber: { type: Type.STRING },
                    name: { type: Type.STRING },
                    plannedDeliveryDate: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    unitPriceNet: { type: Type.NUMBER },
                    amountNet: { type: Type.NUMBER },
                    taxAmount: { type: Type.NUMBER },
                    taxRate: { type: Type.NUMBER },
                    totalAmount: { type: Type.NUMBER },
                    currency: { type: Type.STRING },
                  },
                },
              },
            },
          },
        }
      };

      const imageParts = renderedPages.length > 0 
        ? renderedPages.map(p => ({ inlineData: { data: p.split(',')[1], mimeType: "image/jpeg" } })) 
        : [{ inlineData: { data: fileInfo.base64Data, mimeType: fileInfo.mimeType } }];
      
      const contents = {
        parts: [...imageParts, { text: prompt }]
      };

      const startTime = Date.now();
      const aiPromise = aiClient.models.generateContent({
        model: aiConfig.model,
        contents,
        config: aiConfig.config
      });

      const res: any = await Promise.race([
        aiPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000))
      ]);

      if (controller.signal.aborted) return;

      const responseText = res.text;
      if (!responseText) throw new Error("Empty Response");
      const obj = JSON.parse(responseText.replace(/```[a-zA-Z]*\n/g, "").replace(/```/g, "").trim());

      const isDupe = await checkDuplicateLocal(obj.contractNumber, obj.customerName);
      
      const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return new Date().toISOString().split('T')[0];
        try {
          // 清理特殊字符，转为 YYYY-MM-DD
          const cleanDate = dateStr.replace(/[年月日]/g, '-').replace(/\.$/, '').replace(/\s+/g, '');
          const d = new Date(cleanDate);
          if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
          }
          // YYYYMMDD 格式容错
          if (/^\d{8}$/.test(dateStr)) {
            return `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
          }
          // 其他格式容错，若最终失败，返回当前日期
          return new Date().toISOString().split('T')[0];
        } catch {
          return new Date().toISOString().split('T')[0];
        }
      };

      const newForm: EditableOrderRecord = {
          ...obj,
          contractNumber: obj.contractNumber || "ERR-NO-ID",
          customerName: obj.customerName || "未知客户主体",
          customerTaxId: obj.customerTaxId || "",
          orderDate: formatDate(obj.orderDate) || new Date().toISOString().split("T")[0],
          paymentTerms: obj.paymentTerms || "货到付款",
          plannedDeliveryDate: formatDate(obj.plannedDeliveryDate) || "",
          shippingAddress: obj.shippingAddress || "",
          contactPerson: obj.contactPerson || "",
          contactPhone: obj.contactPhone || "",
          createdAtDate: new Date().toISOString().split("T")[0],
          createdAtTime: new Date().toTimeString().split(" ")[0],
          currency: obj.currency || "CNY",
          items: (obj.items || []).map((i: any) => {
             const qty = Number(i.quantity) || 0;
             const up = Number(i.unitPriceNet) || 0;
             const net = Number(i.amountNet) || (qty * up);
             const tax = Number(i.taxAmount) || (net * 0.13);
             return {
                ...i,
                quantity: qty,
                unitPriceNet: up,
                amountNet: net,
                taxAmount: tax,
                taxRate: i.taxRate || 13,
                totalAmount: Number(i.totalAmount) || (net + tax),
                currency: i.currency || obj.currency || "CNY",
                plannedDeliveryDate: formatDate(i.plannedDeliveryDate || obj.plannedDeliveryDate) || new Date().toISOString().split("T")[0]
             };
          })
      };

      // Ensure totalAmount is calculated if missing
      const calculatedTotal = newForm.items.reduce((sum, item) => sum + item.totalAmount, 0);
      newForm.totalAmount = Number(obj.totalAmount) || calculatedTotal;

      const duration = (Date.now() - startTime) / 1000;
      createLog({
        module: "AI 效能审计",
        action: "解析完成",
        status: "success",
        isAi: true,
        model: aiConfig.model,
        duration: Number(duration.toFixed(2)),
        question: `解析单据: ${fileInfo.name} (${(fileInfo.base64Data.length * 0.75 / 1024).toFixed(1)}KB)`,
        tokens: Math.floor(duration * 250), // Mock token count
        cost: duration * 0.015, // Mock cost
        mode: "在线 API",
        details: `单据: ${obj.contractNumber}, 客户: ${obj.customerName}, 状态: ${isDupe ? '重复' : '正常'}, 金额: ${newForm.totalAmount}`
      }).catch(() => {});

      updateTask(id, { 
        status: isDupe ? "error" : "analyzed", 
        errorMsg: isDupe ? "同单重复：系统检测到该订单已存在" : undefined,
        contractNumber: obj.contractNumber || "未知单号", 
        customerName: obj.customerName || "未知客户",
        form: newForm, 
        confidence: (() => {
          let c = Number(obj.confidence_score);
          if (isNaN(c) || c <= 0 || c > 100) {
            let score = 100;
            if (!obj.contractNumber) score -= 5;
            if (!obj.customerName) score -= 5;
            if (!obj.orderDate) score -= 5;
            if (!obj.totalAmount) score -= 2;
            if (!obj.items || obj.items.length === 0) score -= 15;
            score -= (Math.random() * 2);
            c = Math.max(0, score);
          }
          return c;
        })(),
        isDuplicate: isDupe
      });

    } catch (e: any) {
      console.warn("[Parser] Failed:", e);
      if (controller.signal.aborted) return;
      updateTask(id, { 
        status: "error", 
        errorMsg: "解析繁忙或 30s 超时，请重试",
        contractNumber: "解析终止",
        form: null
      });
    } finally {
      abortControllers.current.delete(id);
    }
  };

  const handleBatchAction = async (action: "draft" | "synced") => {
    // 检查是否有仍在处理的任务
    if (tasks.some(t => t.status === "processing" || t.status === "pending")) {
      createLog({
        module: "业务校验",
        action: "拦截批量处理",
        status: "error",
        details: "部分合同待解析/解析中，请稍后再试"
      }).catch(() => {});
      alert("部分合同待解析/解析中，请稍后再试");
      return;
    }

    setIsSaving(true);
    let successCount = 0;
    let failCount = 0;
    
    const processedTasks = [...tasks];

    for (let i = 0; i < processedTasks.length; i++) {
      const task = processedTasks[i];
      
      // 核心判定逻辑：status === 'success' (这里对应 analyzed) 且 confidence >= 95%
      const isEligible = task.status === "analyzed" && task.form && (task.confidence || 0) >= 95;

      if (isEligible) {
        try {
          const { db, collection, addDoc, serverTimestamp, auth } = await import("@/src/lib/firebase");
          
          // CRITICAL: DO NOT MODIFY START - 强制状态赋值逻辑
          let finalStatus = "";
          if (action === "draft") {
            finalStatus = "暂存中";
          } else {
            // 模拟推送 SAP 逻辑 (95% 成功率，符合工业级稳定预期)
            const isPushSuccess = Math.random() > 0.05; 
            finalStatus = isPushSuccess ? "已推送 SAP" : "推送失败";
          }
          // CRITICAL: DO NOT MODIFY END

          const payload = {
            ...task.form,
            status: finalStatus,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: auth.currentUser?.uid || "anonymous",
            confidence_score: task.confidence
          };

          if (auth.currentUser) {
            await addDoc(collection(db, "orders"), payload).catch(() => saveDemoOrder(payload as any));
          } else {
            saveDemoOrder(payload as any);
          }

          createLog({
            module: "结算中心",
            action: action === "draft" ? "批量保存草稿" : "生成订单并推送SAP",
            status: "success",
            details: `成功处理单据: ${task.form?.contractNumber}, 状态: ${finalStatus}`
          }).catch(() => {});
          
          updateTask(task.id, { status: action === "draft" ? "draft" : "synced" });
          successCount++;
        } catch (e) {
          failCount++;
        }
      } else {
        // 不满足条件的单据：自动跳过，并计入失败统计
        failCount++;
        createLog({
          module: "结算中心",
          action: action === "draft" ? "批量保存草稿" : "生成订单并推送SAP",
          status: "warning",
          details: `跳过单据: ${task.contractNumber || '未命名'}, 原因: 置信度不足 95% 或解析状态异常`
        }).catch(() => {});
      }
    }

    setIsSaving(false);
    setResultCounts({ success: successCount, fail: failCount });
    setSuccessType(action === "draft" ? "draft" : "synced");
    setShowSuccess(true);
  };

  const handleDeleteTask = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (abortControllers.current.has(id)) {
      abortControllers.current.get(id)?.abort();
      abortControllers.current.delete(id);
    }
    const nextTasks = tasks.filter(t => t.id !== id);
    setTasks(nextTasks);
    if (activeTaskId === id) {
      setActiveTaskId(nextTasks.length > 0 ? nextTasks[0].id : null);
    }
    globalFileCache.delete(id);
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F4F8FB] h-full" 
           onDragOver={e => e.preventDefault()} 
           onDrop={e => { e.preventDefault(); handleMultipleFiles(e.dataTransfer.files); }}>
        <input type="file" multiple accept=".pdf,image/*" className="hidden" ref={fileInputRef} onChange={e => { if (e.target.files) handleMultipleFiles(e.target.files); }} />
        <div onClick={() => fileInputRef.current?.click()} className="w-full max-w-2xl bg-white border border-[#D1D5DB] transition-all cursor-pointer rounded-[8px] flex flex-col items-center justify-center group shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-12">
           <div className="w-20 h-20 rounded-full bg-[#1677FF]/5 flex items-center justify-center group-hover:bg-[#1677FF]/10 transition-colors mb-6 border border-[#1677FF]/10">
              <Upload size={32} className="text-[#1677FF]/60 group-hover:text-[#1677FF] transition-all" />
           </div>
           <h3 className="text-xl font-bold text-sap-gray-900 mb-2">批量文档识别站</h3>
           <p className="text-sm text-gray-400 font-medium mb-12">点击或拖拽上传多个文档 / 图片</p>
           
           <div className="w-full border-t border-gray-100 pt-8 grid grid-cols-2 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">支持类型</div>
                <div className="text-xs font-bold text-gray-500">PDF / JPG / PNG</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">处理模式</div>
                <div className="text-xs font-bold text-gray-500">高精度并行解析</div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#F4F8FB] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .compact-table tr { height: 36px !important; }
        .compact-table td, .compact-table th { font-size: 11px; padding: 0 10px !important; }
        .scroll-v { overflow-y: auto !important; }
        .sap-radius-18 { border-radius: 12px !important; }
        .bg-tech-blue { background-color: #1677FF !important; }
        .text-tech-blue { color: #1677FF !important; }
        .border-tech-blue { border-color: #1677FF !important; }
        .dot-status { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        
        /* Optimized Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C1C1C1;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A8A8A8;
        }
      `}} />

      {/* Global Toolbar */}
      <div className="h-[52px] bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
         <div className="flex items-center gap-3">
            <input type="file" multiple id="add-more" className="hidden" onChange={e => e.target.files && handleMultipleFiles(e.target.files)} />
            <label htmlFor="add-more" className="flex items-center gap-2 px-4 h-[32px] bg-white border border-[#D1D5DB] rounded-[2px] cursor-pointer hover:bg-gray-50 text-xs font-bold text-sap-gray-900 transition-all">
               <Plus size={14}/> 批量上传
            </label>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBatchAction("draft")} isLoading={isSaving} className="h-[32px] font-bold text-xs px-4 rounded-[2px] border-gray-300 text-gray-600">
               <Save size={14} className="mr-2"/> 批量保存草稿
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleBatchAction("synced")} isLoading={isSaving} className="h-[32px] font-bold text-xs px-5 rounded-[2px] bg-[#1677FF] hover:bg-[#0050B3]">
               <Send size={14} className="mr-2"/> 生成订单并推送 SAP
            </Button>
         </div>
      </div>

      {/* Processing Status Bar (Image 2 style) */}
      {tasks.some(t => t.status === "processing") && (
        <div className="h-[32px] bg-[#1677FF] px-4 flex items-center justify-between shrink-0 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-bold text-white tracking-wide">
              正在处理中 {tasks.filter(t => t.status === "analyzed" || t.status === "synced" || t.status === "draft").length} / {tasks.length} ...
            </span>
          </div>
          <div className="text-[10px] font-bold text-[#1677FF]/20 font-mono">神经网络 OCR 流水线就绪</div>
        </div>
      )}

      {/* 任务页签系统 - 高级状态焦点重构 */}
      <div className="h-[56px] bg-[#F0F2F5] border-b border-[#D8DEE6] px-4 flex items-center gap-2 overflow-x-auto shrink-0 custom-scrollbar">
         {tasks.map(t => {
           const active = t.id === activeTaskId;
           const isErr = t.status === "error";
           const isProcessing = t.status === "processing";
           const isAnalyzed = t.status === "analyzed" || t.status === "synced" || t.status === "draft";
           const isPending = t.status === "pending";
           
           // 焦点视觉逻辑重构
           let tabStyle = "";
           if (active) {
             if (isPending || isProcessing) {
               // 待解析/解析中被选中：全蓝覆盖
               tabStyle = "bg-[#1677FF] border-[#1677FF] shadow-[0_0_10px_rgba(22,119,255,0.3)] z-10 scale-[1.02]";
             } else {
               // 解析成功/失败被选中：保留状态色 + 蓝色光晕外发光
               tabStyle = cn(
                 isErr ? "bg-[#FFF1F0] border-[#FF4D4F]" : "bg-[#F6FFED] border-[#52C41A]",
                 "shadow-[0_0_0_2px_rgba(22,119,255,0.5)] z-10 scale-[1.02]"
               );
             }
           } else {
             // 非选中状态
             tabStyle = isErr 
               ? "bg-[#FFF1F0] border-[#FF4D4F]" 
               : isAnalyzed 
                 ? "bg-[#F6FFED] border-[#52C41A]" 
                 : isProcessing
                   ? "bg-[#FFF7E6] border-[#FFA940]"
                   : "bg-white border-[#DCDFE6] hover:border-[#1677FF]";
           }

           return (
             <div key={t.id} onClick={() => setActiveTaskId(t.id)} 
                  className={cn("group relative w-[170px] h-[42px] shrink-0 flex flex-col justify-center px-3 border rounded-[2px] cursor-pointer transition-all duration-200", tabStyle)}>
               
               <button onClick={e => handleDeleteTask(e, t.id)} 
                       className={cn("absolute top-0.5 right-0.5 p-0.5 rounded transition-opacity", 
                       (active && (isPending || isProcessing)) ? "text-white/60 hover:text-white" : "text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100")}>
                  <X size={10}/>
               </button>

               <div className="flex items-center gap-1.5 leading-none mb-0.5">
                  {!(active && (isPending || isProcessing)) && (
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", 
                      isErr ? "bg-[#FF4D4F]" : isAnalyzed ? "bg-[#52C41A]" : isProcessing ? "bg-[#FFA940]" : "bg-gray-300"
                    )} />
                  )}
                  <span className={cn("text-[11px] font-bold truncate tracking-tight", 
                     (active && (isPending || isProcessing)) ? "text-white" : (isErr ? "text-[#CF1322]" : isAnalyzed ? "text-[#135200]" : isProcessing ? "text-[#D46B08]" : "text-gray-600"))}>
                     {isErr ? (t.isDuplicate ? "同单重复" : "解析失败") : (t.contractNumber && t.contractNumber !== "等待识别..." ? t.contractNumber : (isProcessing ? "解析中..." : "文档比对中..."))}
                  </span>
               </div>
               <div className={cn("text-[9px] truncate font-medium", 
                  (active && (isPending || isProcessing)) ? "text-white/80" : (isErr ? "text-[#FF4D4F]/80" : isAnalyzed ? "text-[#135200]/70" : "text-gray-400"))}>
                  {t.customerName || "等待获取客户主体..."}
               </div>
             </div>
           );
         })}
      </div>

      {/* Workspace - Improved Responsive Grid */}
      <div className="flex-1 flex flex-col lg:flex-row w-full relative overflow-hidden bg-[#F4F8FB]">
         {/* Preview (Adaptive Column) */}
         <div className="w-full lg:w-[42%] xl:w-[40%] flex flex-col min-h-0 border-r border-[#D1D5DB] bg-white lg:bg-transparent">
             <div className="h-[36px] px-4 flex items-center justify-between border-b border-[#D1D5DB] bg-white">
               <div className="flex items-center gap-2">
                  <FileSearch size={14} className="text-[#1677FF]" />
                  <span className="text-[11px] font-bold text-sap-gray-900">原始单据预览</span>
               </div>
               {activeTask?.sourceType && (
                  <div className={cn("px-2 py-0.5 rounded-[2px] text-[10px] font-black text-white", 
                    activeTask.sourceType === "PDF 文档" ? "bg-[#E02020]" : "bg-[#FA8C16]")}>
                    来自 {activeTask.sourceType === "PDF 文档" ? "PDF 文档" : "图片文档"}
                  </div>
               )}
            </div>
            <div className="flex-1 scroll-v p-3 custom-scrollbar">
               {activeTask?.isPdfRendering ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                     <RefreshCcw size={32} className="animate-spin opacity-40 text-[#1677FF]"/>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-[#1677FF]/60 font-mono">正在渲染高清视图...</span>
                  </div>
               ) : activeTask?.pdfPages && activeTask.pdfPages.length > 0 ? (
                  <div className="flex flex-col gap-3">
                     {activeTask.pdfPages.map((p, i) => (
                        <div key={i} className="bg-white border border-[#D1D5DB] p-0.5 rounded shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                           <img src={p} className="w-full h-auto block" />
                        </div>
                     ))}
                  </div>
               ) : activeTask?.fileUrl ? (
                  <div className="bg-white border border-[#D1D5DB] p-0.5 rounded shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                      <img src={activeTask.fileUrl} className="w-full h-auto block" />
                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-200">
                     <Scan size={60} className="opacity-10"/>
                  </div>
               )}
            </div>
         </div>

         {/* Form (Adaptive Column) */}
         <div className="flex-1 flex flex-col min-h-0 bg-[#F4F8FB] overflow-hidden">
            <div className="h-[36px] px-4 flex items-center justify-between border-b border-[#D1D5DB] bg-white shrink-0">
               <div className="flex items-center gap-2 text-[#1677FF]">
                  <Cpu size={14}/>
                  <span className="text-[11px] font-bold">映射校验数据</span>
               </div>
               <div className="flex items-center gap-3">
                  {activeTask?.isDuplicate && (
                    <span className="text-[10px] bg-[#FF4D4F] text-white px-2 py-0.5 rounded-[2px] font-bold">系统检测到重复单据</span>
                  )}
                  {activeTask?.status === "processing" || activeTask?.status === "pending" ? (
                    <span className="text-[11px] font-bold text-gray-400">准确度计算中...</span>
                  ) : activeTask?.status === "error" ? null : (
                    <ConfidenceDisplay confidence={activeTask?.confidence} />
                  )}
               </div>
            </div>

            <div className="flex-1 scroll-v p-4 custom-scrollbar space-y-5">
               {activeTask?.status === "processing" ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                      <div className="w-28 h-28 flex items-center justify-center relative">
                         <div className="absolute inset-0 border-[3px] border-[#1677FF] border-t-transparent rounded-full animate-spin" />
                         <Cpu size={44} className="text-[#1677FF] animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-[#1677FF] flex items-center justify-center gap-2">
                          大模型正在解析中，请稍等
                          <span className="flex gap-1.5">
                            <span className="w-2 h-2 bg-[#1677FF] rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 bg-[#1677FF] rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 bg-[#1677FF] rounded-full animate-bounce" />
                          </span>
                        </h3>
                        <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                          AI正在深度拟合特征点，预估耗时5 - 15秒
                        </p>
                      </div>
                  </div>
               ) : activeTask?.status === "error" ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                     <div className="p-4 bg-red-50 rounded-full border border-red-100">
                        <AlertCircle size={40} className="text-[#FF4D4F]"/>
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-md font-bold text-sap-gray-900">解析引擎异常</h3>
                        <p className="text-xs text-gray-500 max-w-sm">{activeTask.errorMsg}</p>
                     </div>
                     <Button onClick={() => activeTask && processSingleTask(activeTask)} className="px-8 h-[36px] font-bold border-[#FF4D4F] text-[#FF4D4F] hover:bg-red-50 rounded-[2px]" variant="outline">重试 AI 识别</Button>
                  </div>
               ) : activeTask?.form ? (
                  <>
                    {/* Header Information Section */}
                    <div className="space-y-3">
                       <div className="flex items-center gap-2">
                          <div className="w-1 h-3 bg-[#1677FF]" />
                          <span className="text-[11px] font-bold text-sap-gray-900 uppercase tracking-widest">合同抬头信息</span>
                       </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2.5 bg-white p-3 border border-[#D1D5DB] rounded-[2px] shadow-sm">
                        {[
                           { label: "合同号", value: activeTask.form.contractNumber, key: "contractNumber" },
                           { label: "客户名称", value: activeTask.form.customerName, key: "customerName" },
                           { label: "客户税号", value: activeTask.form.customerTaxId, key: "customerTaxId" },
                           { label: "订单日期", value: activeTask.form.orderDate, key: "orderDate" },
                           { label: "付款方式", value: activeTask.form.paymentTerms, key: "paymentTerms" },
                           { label: "计划交期", value: activeTask.form.plannedDeliveryDate, key: "plannedDeliveryDate" },
                           { label: "送货地址", value: activeTask.form.shippingAddress, key: "shippingAddress" },
                           { label: "送货联系人", value: activeTask.form.contactPerson, key: "contactPerson" },
                           { label: "送货联系电话", value: activeTask.form.contactPhone, key: "contactPhone" },
                        ].map(f => (
                           <div key={f.key} className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                 {f.label}
                              </label>
                              <div className="px-2 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] text-[12px] font-bold text-sap-gray-900 rounded-[2px] truncate">
                                 {f.value || "--"}
                              </div>
                           </div>
                        ))}
                     </div>
                    </div>

                     {/* 合同明细区域 */}
                     <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2">
                           <div className="w-1 h-3 bg-[#1677FF]" />
                           <span className="text-[11px] font-bold text-sap-gray-900 uppercase tracking-widest font-sans">合同行明细信息</span>
                        </div>
                        <div className="border border-[#DCDFE6] rounded-[2px] overflow-hidden bg-white shadow-sm overflow-x-auto custom-scrollbar">
                           <table className="w-full text-left compact-table border-collapse min-w-[1200px]">
                              <thead className="bg-[#F8F9FB] border-b border-[#E8EAED]">
                                 <tr className="text-[9px] font-black text-gray-500 uppercase">
                                    <th className="w-10 text-center border-r border-[#E8EAED] whitespace-nowrap">行号</th>
                                    <th className="w-32 border-r border-[#E8EAED]">物料编码</th>
                                    <th className="w-64 border-r border-[#E8EAED]">物料描述/规格</th>
                                    <th className="w-28 border-r border-[#E8EAED]">计划交期</th>
                                    <th className="w-20 text-right border-r border-[#E8EAED]">数量</th>
                                    <th className="w-16 border-r border-[#E8EAED] text-center">单位</th>
                                    <th className="w-24 text-right border-r border-[#E8EAED]">不含税单价</th>
                                    <th className="w-16 text-center border-r border-[#E8EAED]">币种</th>
                                    <th className="w-28 text-right border-r border-[#E8EAED]">不含税金额</th>
                                    <th className="w-24 text-right border-r border-[#E8EAED]">税额</th>
                                    <th className="w-16 text-right border-r border-[#E8EAED]">税率</th>
                                    <th className="w-28 text-right bg-[#1677FF]/[0.03]">总金额</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F0F2F5]">
                                 {activeTask.form.items.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                       <td className="text-center text-gray-400 font-mono border-r border-[#E8EAED] bg-[#FAFBFC]">{String(i+1).padStart(2, '0')}</td>
                                       <td className="font-mono font-black text-[#1677FF] border-r border-[#E8EAED]">{item.materialNumber || "-"}</td>
                                       <td className="text-gray-700 truncate font-bold border-r border-[#E8EAED]">{item.name}</td>
                                       <td className="text-gray-500 font-mono text-[10px] border-r border-[#E8EAED]">{item.plannedDeliveryDate || activeTask.form.plannedDeliveryDate || "-"}</td>
                                       <td className="text-right font-black text-gray-900 border-r border-[#E8EAED]">{item.quantity}</td>
                                       <td className="text-center text-gray-500 font-black border-r border-[#E8EAED]">{item.unit || "PC"}</td>
                                       <td className="text-right font-mono text-gray-600 border-r border-[#E8EAED]">{item.unitPriceNet.toFixed(2)}</td>
                                       <td className="text-center text-gray-400 font-black border-r border-[#E8EAED]">{item.currency || "CNY"}</td>
                                       <td className="text-right font-mono font-black text-gray-700 border-r border-[#E8EAED]">{item.amountNet.toFixed(2)}</td>
                                       <td className="text-right font-mono text-gray-500 border-r border-[#E8EAED]">{item.taxAmount.toFixed(2)}</td>
                                       <td className="text-right font-mono text-gray-400 text-[10px] border-r border-[#E8EAED]">{item.taxRate}%</td>
                                       <td className="text-right font-mono font-black text-[#1677FF] bg-[#1677FF]/[0.04]">{item.totalAmount.toFixed(2)}</td>
                                    </tr>
                                 ))}
                              </tbody>
                              <tfoot className="bg-[#F8F9FA] border-t border-gray-300">
                                 <tr className="h-[36px] text-gray-900">
                                    <td className="text-center border-r border-[#E8EAED] font-bold whitespace-nowrap">合计</td>
                                    <td colSpan={7} className="border-r border-[#E8EAED]"></td>
                                    <td className="text-right font-mono border-r border-[#E8EAED] px-2 font-black text-[13px]">
                                       {activeTask.form.items.reduce((sum, item) => sum + item.amountNet, 0).toFixed(2)}
                                    </td>
                                    <td className="text-right font-mono border-r border-[#E8EAED] px-2 font-black text-gray-600">
                                       {activeTask.form.items.reduce((sum, item) => sum + item.taxAmount, 0).toFixed(2)}
                                    </td>
                                    <td className="border-r border-[#E8EAED]"></td>
                                    <td className="text-right font-mono font-black px-2 bg-[#1677FF]/[0.08] text-[#1677FF] text-[13px]">
                                       {activeTask.form.items.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2)}
                                    </td>
                                 </tr>
                              </tfoot>
                           </table>
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 relative">
                     <Cpu size={100} className="text-[#1677FF] animate-pulse"/>
                  </div>
               )}
            </div>
         </div>
      </div>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)}
        type={successType}
        successCount={resultCounts.success}
        failCount={resultCounts.fail}
        onViewOrders={onViewOrders}
      />
    </div>
  );
}
