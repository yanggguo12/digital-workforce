import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  Sparkles, 
  User, 
  MessageSquare,
  Terminal,
  Search,
  FileText,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
  Paperclip,
  Reply,
  Quote,
  Loader2,
  Library,
  Mail,
  FilePlus,
  ShieldAlert,
  LineChart,
  Users
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { createLog } from '@/src/services/logService';
import { auth, db, collection, addDoc, query, where, orderBy, getDocs, limit, serverTimestamp, Timestamp, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { GoogleGenAI } from "@google/genai";
import { useModel } from '@/src/contexts/ModelContext';

interface ActionCard {
  title: string;
  status: string;
  documentId?: string | null;
  details?: string[] | null;
  kpis?: { label: string; value: string }[] | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: string;
  file?: { name: string; type: string; base64?: string };
  quote?: { id: string; content: string; role: string };
  actionCard?: ActionCard | null;
  suggestions?: string[];
}

const SUB_AGENTS = [
  { id: 'sales-entry', name: '智能录单中心', icon: FilePlus, color: 'text-blue-500', mention: '@智能录单中心' },
  { id: 'sales-credit', name: '智能信用与准入', icon: ShieldAlert, color: 'text-red-500', mention: '@智能信用与准入' },
  { id: 'sales-inquiry', name: '智能查询助手', icon: Search, color: 'text-indigo-500', mention: '@智能查询助手' },
  { id: 'sales-prospecting', name: '潜客拓客与营销', icon: LineChart, color: 'text-emerald-500', mention: '@潜客拓客与营销' },
  { id: 'sales-operations', name: '销售运营与协作', icon: Users, color: 'text-orange-500', mention: '@销售运营与协作' },
  { id: 'general', name: '全局智能助手', icon: Sparkles, color: 'text-sap-success', mention: '@全局助手' },
];

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export function AIChat({ user: propUser, onNavigate }: { user: any; onNavigate?: (module: string) => void }) {
  const { activeModel } = useModel();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isButtonDraggingRef = useRef(false);
  const [typingState, setTypingState] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeQuote, setActiveQuote] = useState<Message | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Standard Welcome Message Builder
  const getWelcomeMessage = (): Message => ({
    id: 'welcome', 
    role: 'assistant', 
    content: '**您可以这样指令我：**\n\n- **合同处理**：发送合同/订单文件，快速提取并同步至管理中心。\n- **资信查询**：查询客户信用风险及额度。\n- **数据洞察**：生成运营报表及毛利分析。\n\n直接发送文件，或输入 `@` 唤起特定 Agent。',
    timestamp: new Date(0),
    agent: 'general',
    suggestions: [
       "@智能录单中心 解析此合同",
       "@智能信用与准入 测算授信额度",
       "@销售运营与协作 生成本月报表"
    ]
  });

  // Initial History Load
  useEffect(() => {
    if (propUser?.uid) {
      fetchInitialHistory(propUser.uid);
    } else {
      // Mock environment or unauthenticated - Ensure fallback
      setMessages(prev => prev.length === 0 ? [getWelcomeMessage()] : prev);
    }
  }, [propUser?.uid]);

  const fetchInitialHistory = async (uid: string) => {
    setIsLoadingHistory(true);
    const path = 'chat_messages';
    try {
      // 4 hours ago
      const fourHoursAgo = new Date();
      fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
      
      let q = query(
        collection(db, path),
        where('userId', '==', uid),
        where('timestamp', '>=', Timestamp.fromDate(fourHoursAgo)),
        orderBy('timestamp', 'asc')
      );
      
      let snapshot = await getDocs(q).catch(err => handleFirestoreError(err, OperationType.LIST, path));
      if (!snapshot) {
        // Even on error, show welcome
        if (messages.length === 0) setMessages([getWelcomeMessage()]);
        return;
      }

      let history: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
          agent: data.agent,
          file: data.file,
          quote: data.quote,
          actionCard: data.actionCard
        };
      });

      // If no messages in last 4 hours, fetch last 10 messages anyway to show something
      if (history.length === 0) {
        const qRecent = query(
          collection(db, path),
          where('userId', '==', uid),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const snapshotRecent = await getDocs(qRecent).catch(err => handleFirestoreError(err, OperationType.LIST, path));
        if (snapshotRecent) {
          history = snapshotRecent.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              role: data.role,
              content: data.content,
              timestamp: data.timestamp?.toDate() || new Date(),
              agent: data.agent,
              file: data.file,
              quote: data.quote,
              actionCard: data.actionCard
            };
          }).reverse(); // Reverse back to chronological order
        }
      }

      const welcome = getWelcomeMessage();
      
      history = [welcome, ...history.filter(m => m.id !== 'welcome')];
      
      setMessages(history);
      
      // Check if there is more history
      const oldestLoaded = history.find(m => m.id !== 'welcome');
      if (oldestLoaded) {
        const qMore = query(
          collection(db, 'chat_messages'),
          where('userId', '==', uid),
          where('timestamp', '<', Timestamp.fromDate(oldestLoaded.timestamp)),
          limit(1)
        );
        const snapshotMore = await getDocs(qMore);
        setHasMoreHistory(!snapshotMore.empty);
      } else {
        setHasMoreHistory(false);
      }

    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadMoreHistory = async () => {
    if (!propUser || isLoadingHistory || !hasMoreHistory || messages.length === 0) return;
    
    // Find oldest non-welcome message
    const oldestMsg = messages.find(m => m.id !== 'welcome');
    if (!oldestMsg) {
      setHasMoreHistory(false);
      return;
    }

    setIsLoadingHistory(true);
    const path = 'chat_messages';
    const container = scrollContainerRef.current;
    const oldScrollHeight = container?.scrollHeight || 0;

    try {
      const oldestDate = oldestMsg.timestamp;
      // Target: yesterday at 00:00:00
      const targetStart = new Date(oldestDate);
      targetStart.setDate(targetStart.getDate() - 1);
      targetStart.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, path),
        where('userId', '==', propUser.uid),
        where('timestamp', '<', Timestamp.fromDate(oldestDate)),
        where('timestamp', '>=', Timestamp.fromDate(targetStart)),
        orderBy('timestamp', 'asc')
      );

      const snapshot = await getDocs(q).catch(err => handleFirestoreError(err, OperationType.LIST, path));
      if (!snapshot) return;

      const olderMessages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
          agent: data.agent,
          file: data.file,
          quote: data.quote,
          actionCard: data.actionCard
        };
      });

      if (olderMessages.length > 0) {
        setMessages(prev => [...olderMessages, ...prev]);
        
        // Restore scroll position
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - oldScrollHeight;
          }
        });
      }

      // Check if there are even older messages
      const qCheckEvenOlder = query(
        collection(db, path),
        where('userId', '==', propUser.uid),
        where('timestamp', '<', Timestamp.fromDate(targetStart)),
        limit(1)
      );
      const snapshotOlder = await getDocs(qCheckEvenOlder).catch(err => handleFirestoreError(err, OperationType.LIST, path));
      setHasMoreHistory(snapshotOlder ? !snapshotOlder.empty : false);

    } catch (error) {
      console.error("Failed to load more history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && !isLoadingHistory && hasMoreHistory) {
      loadMoreHistory();
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Only scroll to bottom on new messages, not on history load
  const lastMsgIdRef = useRef<string>('');
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.id !== lastMsgIdRef.current) {
        lastMsgIdRef.current = lastMsg.id;
        scrollToBottom();
      }
    }
  }, [messages, typingState]);

  const saveMessageToFirestore = async (msg: Message) => {
    if (!propUser) return;
    const path = 'chat_messages';
    try {
      await addDoc(collection(db, path), {
        userId: propUser.uid,
        role: msg.role,
        content: msg.content,
        timestamp: serverTimestamp(),
        agent: msg.agent || null,
        file: msg.file ? { name: msg.file.name, type: msg.file.type } : null,
        quote: msg.quote || null,
        actionCard: msg.actionCard || null
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, path));
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSend = async (textOverride?: string | React.MouseEvent | React.KeyboardEvent) => {
    const textToUse = typeof textOverride === 'string' ? textOverride : inputValue;
    if (!textToUse.trim() && !selectedFile) return;

    const userInput = textToUse.trim();
    const currentSelectedFile = selectedFile;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
      file: currentSelectedFile ? { name: currentSelectedFile.name, type: currentSelectedFile.type } : undefined,
      quote: activeQuote ? { id: activeQuote.id, content: activeQuote.content, role: activeQuote.role } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    saveMessageToFirestore(userMsg);
    
    setInputValue('');
    setShowMentions(false);
    setSelectedFile(null);
    setActiveQuote(null);
    setTypingState(currentSelectedFile ? "正在上传与解析文档..." : "正在分析您的指令...");

    let loadingInterval: NodeJS.Timeout;
    loadingInterval = setInterval(() => {
      setTypingState(prev => {
         if (prev === "正在上传与解析文档...") return "正在提取合同/单据关键信息...";
         if (prev === "正在提取合同/单据关键信息...") return "正在核对 SAP 主体信息...";
         if (prev === "正在核对 SAP 主体信息...") return "正在生成结构化单据...";
         if (prev === "正在分析您的指令...") return "正在调度对应的 Agent 专家...";
         if (prev === "正在调度对应的 Agent 专家...") return "正在模拟执行后端任务流...";
         return prev;
      });
    }, 2000);

    try {
      let response = '';
      let agent = 'general';
      let actionCard: ActionCard | null = null;
      const lowerInput = userInput.toLowerCase();
      
      const MODEL_IDS: Record<string, string> = {
        'Gemini 3.1 Pro': 'gemini-3.1-pro-preview',
        'Gemini 3.0 Flash': 'gemini-3.1-flash-preview',
        'Gemini': 'gemini-3.1-pro-preview'
      };
      
      const modelId = MODEL_IDS[activeModel] || 'gemini-3.1-flash-preview';

      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined);

      if (!apiKey) {
        response = '检测到系统的 Gemini API Key 尚未配置，部分 AI 功能可能受限。已记录您的指令。';
      } else {
        const genAI = new GoogleGenAI({ apiKey });
        
        let forcedAgent = null;
        for (const a of SUB_AGENTS) {
          if (userInput.includes(a.mention)) {
            forcedAgent = a.id;
            break;
          }
        }

        try {
          const systemPrompt = `你是一个企业级 AI 架构的核心调度器（全局智能助手）。
你的任务是识别用户的自然语言意图，并调度适宜的子助手与对应工具（磁贴），并生成执行后的“结构化状态反馈”。

你可用的辖区（子助手）与工具（磁贴）如下：

1. [sales-entry: 智能录单中心]
   - upload: 文档/图片上传（提取合同/订单信息并同步）
   - orders: 合同管理中心（管理与追踪订单）
   - email: 邮件自动化中心（监听邮箱）
   - voice: 语音自动化中心
   - srm: 客户SRM系统自动读取订单
   - batch: 手工单据批量转录

2. [sales-credit: 智能信用与准入]
   - profile: 企业动态画像（企查查等）
   - credit-calc: 授信额度智能测算
   - alert: 异常交易实时预警
   - prediction: 回款预测驾驶舱

3. [sales-inquiry: 智能查询助手]
   - search: 合同条款语义搜索
   - inventory: 物料库存预测与调拨
   - history: 历史报价与毛利回溯
   - customer: 客户画像深度透视

4. [sales-prospecting: 潜客拓客与营销]
   - tender: 招标信息自动匹配
   - email: 个性化开发信生成
   - competitor: 竞争对手动向监控
   - exhibition: 展会线索清洗

5. [sales-operations: 销售运营与协作]
   - report: 销售报表自动生成
   - knowledge: 金牌话术知识库
   - meeting: 会议访谈要点提取
   - performance: 绩效贡献实时演算
 
当用户指令（或是上传的文件描述）可以被某个工具执行时：
1. 你必须返回对应的 targetAgent 和 targetTile。
2. 同时，**必须**返回 statusCard（结构化状态卡片），通过拟真的方式模拟该工具执行的结果（比如：生成一个单据号、捏造提取出的关键字段、状态设为"已完成"或"处理中"等），绝对禁止以没有能力或做不到为理由拒绝。你要假装这是一个高度集成的系统，已经将任务顺利派遣并处理完毕。`;

          const fullPrompt = forcedAgent 
            ? `用户指令: "${userInput}"\n注意：用户指定了希望调用的 子助手 ID 为 "${forcedAgent}"，请尽量在其辖区内寻找处理工具。`
            : `用户指令: "${userInput}"`;

           const parts: any[] = [];
           let fileInstruction = "";
           if (currentSelectedFile) {
              const reader = new FileReader();
              const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(currentSelectedFile);
              });
              const base64Data = await base64Promise;
              parts.push({
                 inlineData: {
                   data: base64Data,
                   mimeType: currentSelectedFile.type
                 }
              });
              parts.push({ text: `[伴随上传文件: ${currentSelectedFile.name}] ` });
              fileInstruction = `\n\n【核心约束】检测到有上传文件（如 PDF、图片等）。若涉及提取内容与录单，必须通过调用结构化工具返回 action：指定 targetAgent: 'sales-entry', targetTile: 'upload'，并输出含有提取明细、生成单据号的 statusCard。请引导用户点击状态卡片查看结果，不要仅作纯文字聊天。`;
           }
           parts.push({ text: systemPrompt + fileInstruction + '\n\n' + fullPrompt });
           const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 30000));
           const aiPromise = genAI.models.generateContent({
               model: modelId,
               contents: [
                 { role: 'user', parts }
               ],
               config: {
                 responseMimeType: "application/json",
                 responseSchema: {
                   type: "OBJECT",
                   properties: {
                     responseText: { type: "STRING", description: "回复用户的自然语言对话文本" },
                     action: {
                       type: "OBJECT",
                       description: "当调度后台模块时返回的对象",
                      nullable: true,
                      properties: {
                         targetAgent: { type: "STRING", description: "子助手的ID，如 sales-entry, sales-credit等" },
                         targetTile: { type: "STRING", description: "磁贴/Agent的ID" },
                         statusCard: {
                            type: "OBJECT",
                            description: "结构化状态反馈卡片",
                            properties: {
                               title: { type: "STRING" },
                               status: { type: "STRING", description: "如：处理中, 已完成, 告警" },
                               documentId: { type: "STRING", description: "关联单据/任务号，若无则设为 -" },
                               details: { type: "ARRAY", items: { type: "STRING" }, description: "处理日志/细节列表" },
                               kpis: {
                                 type: "ARRAY",
                                 items: {
                                    type: "OBJECT",
                                    properties: {
                                       label: { type: "STRING" },
                                       value: { type: "STRING" }
                                    }
                                 }
                               }
                            }
                         },
                         orderPayload: {
                            type: "OBJECT",
                            nullable: true,
                            description: "如果用户上传了订单/合同文件要求录入，请将提取出的完整订单数据必须放在此处，必须包含各项",
                            properties: {
                               contractNumber: { type: "STRING" },
                               customerName: { type: "STRING" },
                               totalAmount: { type: "NUMBER" },
                               currency: { type: "STRING" },
                               items: {
                                  type: "ARRAY",
                                  items: {
                                     type: "OBJECT",
                                     properties: {
                                        name: { type: "STRING" },
                                        quantity: { type: "NUMBER" },
                                        unitPriceNet: { type: "NUMBER" },
                                        totalAmount: { type: "NUMBER" }
                                     }
                                  }
                               }
                            }
                         }
                      }
                    }
                  }
                }
              }
            }) as any;
           
           aiPromise.catch(() => { /* 静默阻断后台异常引发的全局弹窗 */ });

           const startTime = Date.now();
           const result = await Promise.race([
             aiPromise,
             timeoutPromise
           ]) as any;

          const rawText = result.text || '{}';
          let jsonText = rawText.trim();
          const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (match) {
             jsonText = match[1];
          }
          const parsed = JSON.parse(jsonText);

          response = parsed.responseText || '处理完成。';
          
          if (parsed.action) {
            agent = parsed.action.targetAgent || forcedAgent || 'general';
            actionCard = parsed.action.statusCard || null;
            
            // Execute real backend logic for Order Saving - MANDATORY REQ
            if (agent === 'sales-entry' && parsed.action.orderPayload && auth.currentUser) {
              const payload = parsed.action.orderPayload;
              try {
                // Set temporary state to show we are truly doing something
                setTypingState("正在同步至合同管理中心...");
                
                const docRef = await addDoc(collection(db, 'orders'), {
                    contractNumber: payload.contractNumber || `CONT-${Date.now()}`,
                    customerName: payload.customerName || '未知客户',
                    totalAmount: payload.totalAmount || 0,
                    currency: payload.currency || 'CNY',
                    items: payload.items || [],
                    status: 'draft', 
                    source: 'Upload', 
                    orderDate: new Date().toISOString().split('T')[0],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    createdAtDate: new Date().toISOString().split('T')[0],
                    createdAtTime: new Date().toTimeString().split(' ')[0],
                    userId: auth.currentUser.uid,
                     attachments: currentSelectedFile ? [currentSelectedFile.name] : []
                });
                
                // Real Success: Update response text to confirm entry
                response = `✅ **识别并录入成功！**\n\n单据已同步至【合同管理中心】（单号: ${payload.contractNumber || '自动生成'}）。您可以直接点击下方卡片跳转查看明细。`;
                
                // Update actionCard to show success and real document ID
                if (actionCard) {
                    actionCard.status = "已入库 (OK)";
                    actionCard.documentId = "SJ-" + docRef.id.substring(0, 6).toUpperCase();
                    actionCard.title = "销售单据录入成功";
                }

                // Trigger Global Refresh Event 
                window.dispatchEvent(new CustomEvent('demoOrdersUpdated'));
                
              } catch(e) {
                console.error("Order save failed", e);
                response = "❌ **录入失败**：虽识别出内容，但保存到数据库时发生异常。";
                if (actionCard) {
                    actionCard.status = "入库失败";
                }
              }
            } else if (agent === 'sales-entry' && parsed.action.orderPayload && !auth.currentUser) {
               // mock environment fallback
               response = "识别成功！(预览环境已模拟录入)";
               if (actionCard) {
                    actionCard.status = "已完成 (Mock)";
                    actionCard.documentId = "SJ-" + Math.floor(Math.random() * 1000000);
                }
            }
          } else {
             agent = forcedAgent || 'general';
          }
          
          const duration = (Date.now() - startTime) / 1000;
          const tokens = result?.usageMetadata?.totalTokenCount || 0;
          const extCost = (tokens / 1000000) * 0.15;
          createLog({
            module: "AI 查询",
            action: parsed?.action ? "智能调度系统" : "对话大模型",
            status: "success",
            details: "通过自然语言交互完成处理",
            isAi: true,
            question: userInput,
            model: modelId,
            mode: "在线 API",
            tokens,
            cost: extCost,
            duration: Number(duration.toFixed(2))
          }).catch(console.error);

        } catch (err) {
          console.error("Gemini routing failed:", err);
          agent = forcedAgent || 'general';
          response = '好的，我已经收到您的指令。系统正在处理后续任务。';
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        agent,
        actionCard
      };
      setMessages(prev => [...prev, aiMsg]);
      saveMessageToFirestore(aiMsg);
    } catch (error) {
      console.error("Chat handling failed:", error);
    } finally {
      clearInterval(loadingInterval);
      setTypingState(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.endsWith('@')) {
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (mention: string) => {
    setInputValue(prev => prev.slice(0, -1) + mention + ' ');
    setShowMentions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) {
          setSelectedFile(file);
          break;
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      {/* Floating Toggle Button - Bottom Right */}
      {!isOpen && (
        <motion.button
          id="ai-assistant-toggle"
          drag
          dragMomentum={false}
          dragElastic={0.1}
          whileHover={{ scale: 1.05, translateY: -5, cursor: 'grab' }}
          whileTap={{ scale: 0.95, cursor: 'grabbing' }}
          onDragStart={() => {
            isButtonDraggingRef.current = true;
          }}
          onDragEnd={() => {
            setTimeout(() => {
              isButtonDraggingRef.current = false;
            }, 100);
          }}
          onClick={() => {
            if (!isButtonDraggingRef.current) {
              setIsOpen(true);
            }
          }}
          className={cn(
            "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[80] w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-white/5 group overflow-hidden touch-none",
            "bg-[#0A1B39]"
          )}
        >
          {/* Dynamic Glow Effect */}
          {!isOpen && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
          )}
          
          <div className="relative z-10">
            <Sparkles 
              className={cn(
                "transition-all duration-300",
                isOpen ? "text-gray-400" : "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]"
              )} 
              size={isOpen ? 24 : 32} 
              strokeWidth={1.5}
            />
          </div>
          
          {/* Active state indicator */}
          {!isOpen && (
             <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0A1B39] shadow-[0_0_8px_rgba(59,130,246,1)] animate-pulse" />
          )}
        </motion.button>
      )}

      {/* Chat Sidebar Wrapper */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            id="ai-assistant-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 md:w-[450px] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[75] border-l border-gray-100 flex flex-col pt-0 pr-0 pb-0"
          >
            {/* Drag Overlay */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[100] bg-sap-blue/90 flex flex-col items-center justify-center text-white backdrop-blur-sm"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-4 border-2 border-dashed border-white/50">
                    <Paperclip size={32} />
                  </div>
                  <p className="text-xl font-black uppercase tracking-widest">松开以上传文件</p>
                  <p className="text-sm font-medium mt-2 text-white/70">支持任意文档、合同预览或图片</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-6 bg-sap-gray-900 text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0A1B39] rounded-xl flex items-center justify-center border border-white/10">
                   <Sparkles size={20} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                </div>
                <div>
                   <h3 className="text-[15px] font-bold tracking-tight">AI 智能协同中心</h3>
                   <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active System</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 size={20} className="text-white/50" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f3f3f3] custom-scrollbar"
            >
              {isLoadingHistory && (
                <div className="flex justify-center py-2">
                   <Loader2 size={16} className="text-sap-blue animate-spin" />
                </div>
              )}
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex gap-3 px-1 group",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar Styles - WeChat Style rounded square */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'user' ? "bg-sap-blue" : "bg-white"
                  )}>
                    {msg.role === 'user' ? (
                       <User size={20} className="text-white" />
                    ) : (
                       <Bot size={20} className="text-sap-blue" />
                    )}
                  </div>

                  <div className={cn(
                    "max-w-[80%] flex flex-col min-w-0",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "rounded-[10px] px-3.5 py-2.5 text-[15px] relative max-w-full",
                      msg.role === 'user' 
                        ? "bg-[#95ec69] text-[#111] after:content-[''] after:absolute after:top-3.5 after:-right-[10px] after:border-[5px] after:border-transparent after:border-l-[#95ec69]" 
                        : "bg-white text-[#111] after:content-[''] after:absolute after:top-3.5 after:-left-[10px] after:border-[5px] after:border-transparent after:border-r-white"
                    )}>
                      {/* Quote display in message */}
                      {msg.quote && (
                        <div className={cn(
                          "mb-2 p-2 rounded bg-black/5 text-[11px] leading-relaxed italic opacity-70"
                        )}>
                          <p className="line-clamp-2 break-all">{msg.quote.content}</p>
                        </div>
                      )}

                      {/* File display in message */}
                      {msg.file && (
                        <div className={cn(
                          "mb-2 flex items-center gap-2 p-2 rounded-md border bg-white/50 border-black/5 max-w-full overflow-hidden"
                        )}>
                          <div className="w-8 h-8 rounded shrink-0 bg-white border border-gray-200 flex items-center justify-center">
                            <FileText size={16} className="text-sap-blue" />
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-[12px] font-medium truncate text-gray-800">{msg.file.name}</p>
                            <p className="text-[10px] opacity-60 uppercase font-black">{msg.file.type.split('/')[1] || 'FILE'}</p>
                          </div>
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.agent && (
                        <div className="flex items-center gap-1 mb-1.5 py-0.5 px-1 bg-black/5 rounded w-fit">
                          {(() => {
                             const a = SUB_AGENTS.find(a => a.id === msg.agent);
                             const Icon = a?.icon || Sparkles;
                             return <Icon size={10} className={a?.color} />;
                          })()}
                          <span className="text-[9px] font-bold text-gray-500 ml-0.5">
                             {SUB_AGENTS.find(a => a.id === msg.agent)?.name}
                          </span>
                        </div>
                      )}
                      <div className="leading-[1.5] whitespace-pre-wrap break-words overflow-hidden min-w-0 text-inherit text-[13.5px]">
                        <ReactMarkdown 
                           remarkPlugins={[remarkGfm]} 
                           rehypePlugins={[rehypeRaw]}
                           components={{
                             p: ({node, ...props}) => <p className="mb-1.5 last:mb-0" {...props} />,
                             a: ({node, ...props}) => <a className="text-sap-blue hover:underline" {...props} />,
                             ul: ({node, ...props}) => <ul className="mb-3 flex flex-col gap-1" {...props} />,
                             ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-3 flex flex-col gap-1" {...props} />,
                             li: ({node, ...props}) => <li className="relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:top-[-1px] before:text-sap-blue/60 before:font-bold" {...props} />,
                             pre: ({node, ...props}) => <pre className="bg-gray-50/50 border border-gray-200 rounded p-2 overflow-x-auto my-2 shadow-sm font-mono text-[0.85em]" {...props} />,
                             code: ({node, className, ...props}: any) => {
                               const match = /language-(\w+)/.exec(className || '');
                               const inline = !match && !String(props.children).includes('\n');
                               return inline 
                                 ? <code className="bg-sap-blue/5 text-sap-blue rounded-[6px] px-1.5 py-0.5 text-[0.9em] font-mono border border-sap-blue/10 break-all" {...props} />
                                 : <code className={className} {...props} />;
                             },
                             table: ({node, ...props}) => <div className="overflow-x-auto my-3 border border-gray-200 rounded-lg"><table className="min-w-full text-xs" {...props} /></div>,
                             th: ({node, ...props}) => <th className="bg-gray-100 text-left px-3 py-2 font-bold text-gray-700 border-b border-gray-200" {...props} />,
                             td: ({node, ...props}) => <td className="px-3 py-2 border-b border-gray-100/50" {...props} />,
                           }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {msg.actionCard && (
                        <div 
                          onClick={() => {
                            if (msg.agent === 'sales-entry' && onNavigate) {
                              onNavigate('sales-orders');
                            }
                          }}
                          className={cn(
                            "mt-3 border-t border-gray-200/60 pt-3 flex flex-col gap-2 group/card transition-all",
                            msg.agent === 'sales-entry' && "cursor-pointer hover:bg-black/5 -mx-3.5 px-3.5 pb-2"
                          )}
                        >
                           <div className="flex items-center justify-between">
                              <span className="text-[13px] font-bold text-gray-900 group-hover/card:text-sap-blue transition-colors flex items-center gap-2">
                                {msg.agent === 'sales-entry' && <FilePlus size={14} className="text-sap-blue" />}
                                {msg.actionCard.title}
                              </span>
                              <span className={cn(
                                "text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider", 
                                msg.actionCard.status.includes('库') ? 'bg-emerald-100 text-emerald-700' : 
                                msg.actionCard.status.includes('中') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                              )}>
                                {msg.actionCard.status}
                              </span>
                           </div>
                           
                           <div className="flex items-center justify-between mt-1">
                             {msg.actionCard.documentId && msg.actionCard.documentId !== '-' && (
                                <div className="text-[10px] font-mono text-sap-blue bg-sap-blue/5 border border-sap-blue/20 px-1.5 py-0.5 rounded flex items-center justify-center gap-1 tracking-wider">
                                  <Library size={10} />
                                  {msg.actionCard.documentId}
                                </div>
                             )}
                             
                             {msg.agent === 'sales-entry' && (
                                <span className="text-[10px] text-sap-blue font-bold flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  点击跳转详情 <ChevronRight size={10} />
                                </span>
                             )}
                           </div>

                           {msg.actionCard.details && msg.actionCard.details.length > 0 && (
                              <ul className="text-[11px] text-gray-600 space-y-1 bg-gray-50/50 p-2 rounded-lg border border-gray-100 pl-4 list-disc marker:text-gray-300 pointer-events-none">
                                {msg.actionCard.details.map((detail, idx) => (
                                   <li key={idx}>{detail}</li>
                                ))}
                              </ul>
                           )}
                           {msg.actionCard.kpis && msg.actionCard.kpis.length > 0 && (
                              <div className="flex gap-2 mt-1 w-full overflow-x-auto custom-scrollbar pb-1 pointer-events-none">
                                 {msg.actionCard.kpis.map((kpi, idx) => (
                                    <div key={idx} className="bg-sap-blue/5 border border-sap-blue/10 px-2 py-1.5 rounded-md min-w-[70px] shrink-0">
                                       <span className="block text-[9px] text-gray-500 uppercase tracking-tighter mb-0.5">{kpi.label}</span>
                                       <span className="block text-[13px] font-bold text-sap-blue tracking-tight leading-none">{kpi.value}</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                      )}

                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 pt-3 flex flex-wrap gap-2 border-t border-gray-200/60">
                           {msg.suggestions.map((s, idx) => (
                             <button
                               key={idx}
                               onClick={() => handleSend(s)}
                               className="text-left text-[12px] bg-white border border-sap-blue/20 text-sap-blue hover:bg-sap-blue hover:text-white px-3 py-1.5 rounded-[12px] transition-colors font-medium shadow-sm transition-all"
                             >
                               {s}
                             </button>
                           ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] text-gray-400 font-medium">
                         {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                       <button 
                        onClick={() => setActiveQuote(msg)}
                        title="引用此信息"
                        className="p-1 rounded hover:bg-black/5 text-gray-300 hover:text-sap-blue transition-all"
                      >
                        <Reply size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {typingState && (
                <div className="flex gap-3 px-1 animate-pulse">
                   <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                      <Bot size={20} className="text-sap-blue animate-bounce" />
                   </div>
                   <div className="bg-white rounded-[10px] px-3.5 py-2.5 text-[14px] shadow-sm italic text-gray-400 after:content-[''] after:absolute after:top-3.5 after:-left-[10px] after:border-[5px] after:border-transparent after:border-r-white relative">
                      {typingState}
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Wrapper */}
            <div className="p-4 bg-[#f3f3f3] border-t border-gray-200 relative">
              {/* Active Quote Panel */}
              <AnimatePresence>
                {activeQuote && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-3 overflow-hidden"
                  >
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-start gap-3 relative">
                      <div className="w-1 h-full absolute left-0 top-0 bg-sap-blue rounded-l-2xl" />
                      <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-black uppercase text-sap-blue tracking-widest mb-1 flex items-center gap-1.5">
                            <Quote size={10} />
                            正在引用 {activeQuote.role === 'user' ? '您的信息' : '助手回复'}
                         </p>
                         <p className="text-xs text-gray-500 truncate italic grow">{activeQuote.content}</p>
                      </div>
                      <button 
                        onClick={() => setActiveQuote(null)}
                        className="p-1 hover:bg-gray-200 rounded-lg text-gray-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected File Panel */}
              <AnimatePresence>
                {selectedFile && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-3 overflow-hidden"
                  >
                    <div className="bg-sap-blue/5 border border-sap-blue/10 rounded-2xl p-3 flex items-center gap-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sap-blue shadow-sm shrink-0">
                          <FileText size={18} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-sap-gray-900 truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • 准备上传</p>
                       </div>
                       <button 
                        onClick={() => setSelectedFile(null)}
                        className="p-2 hover:bg-sap-blue/10 rounded-xl text-gray-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mention List */}
              <AnimatePresence>
                {showMentions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-[calc(100%+12px)] left-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[70] overflow-hidden"
                  >
                    <p className="text-[10px] font-black p-3 text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                      选择协作 Agent
                    </p>
                    {SUB_AGENTS.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => insertMention(agent.mention)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                      >
                        <div className={cn("w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform", agent.color)}>
                          <agent.icon size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-sap-gray-900">{agent.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium italic">{agent.mention}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入指令，使用 @ 呼唤 Agent..."
                  className="w-full pl-6 pr-32 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm focus:bg-white focus:ring-2 focus:ring-sap-blue/20 transition-all outline-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pr-1">
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-sap-blue hover:bg-sap-blue/5 rounded-lg transition-all"
                   >
                      <Paperclip size={18} />
                   </button>
                   <button className="p-2 text-gray-400 hover:text-sap-blue hover:bg-sap-blue/5 rounded-lg transition-all">
                      <Mic size={18} />
                   </button>
                   <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                   <button 
                     onClick={() => handleSend()}
                     disabled={!inputValue.trim() && !selectedFile}
                     className="p-2 text-sap-blue hover:bg-sap-blue/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                   >
                     <Send size={18} className="translate-x-0.5" />
                   </button>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4 gap-4">
                 <div className="flex items-center gap-1.5">
                    <Terminal size={10} className="text-gray-300" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Powered by SAP AI Core</span>
                 </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
