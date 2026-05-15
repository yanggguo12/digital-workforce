import React, { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { subscribeToLogs, LogEntry } from "@/src/services/logService";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  ArrowRight,
  Filter,
  Download,
  Search,
  Calendar,
  User,
  ShieldCheck,
  Bot,
  Cpu,
  Globe,
  Zap,
  TrendingDown,
  Monitor,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "../../ui/Button";
import { ModuleType } from "@/src/types";

interface LogsModuleProps {
  activeSubModule: ModuleType;
}

// Mock Data for Operations Logs
const mockOpLogs = [
  {
    id: "op1",
    timestamp: "2026-05-09 10:22:45",
    user: "张伟 (ZW001)",
    module: "智能供应链",
    action: "数据导出",
    details: "导出了3月份库存呆滞料分析报表",
    ip: "192.168.1.102",
    status: "success",
  },
  {
    id: "op2",
    timestamp: "2026-05-09 10:15:20",
    user: "李娜 (LN002)",
    module: "智能财务",
    action: "数据修改",
    details: "修改了物料编码 [MAT-001] 的安全库存水位：100 -> 150",
    ip: "10.0.0.45",
    status: "success",
  },
  {
    id: "op3",
    timestamp: "2026-05-09 09:45:11",
    user: "王超 (WC003)",
    module: "权限管理",
    action: "权限变更",
    details: '为用户 [赵铁柱] 分配了 "财务审计" 角色权限',
    ip: "192.168.1.55",
    status: "success",
  },
  {
    id: "op4",
    timestamp: "2026-05-09 09:12:05",
    user: "刘芳 (LF004)",
    module: "打卡中心",
    action: "拜访打卡",
    details: "在 [上海中心大厦] 完成客户拜访签到",
    ip: "4G/LTE (GPS: 31.23, 121.50)",
    status: "success",
  },
  {
    id: "op5",
    timestamp: "2026-05-09 08:30:59",
    user: "陈杰 (CJ005)",
    module: "系统管理",
    action: "数据删除",
    details: "删除了 2023 年度的过期备份数据记录",
    ip: "127.0.0.1",
    status: "error",
  },
  {
    id: "op6",
    timestamp: "2026-05-09 08:15:33",
    user: "张伟 (ZW001)",
    module: "AI 查询",
    action: "AI查询",
    details: '执行了关于 "第二季度销售趋势预测" 的深度语义查询',
    ip: "192.168.1.102",
    status: "success",
  },
  {
    id: "op7",
    timestamp: "2026-05-09 07:45:00",
    user: "李娜 (LN002)",
    module: "智能财务",
    action: "数据导出",
    details: "导出了 4 月份增值税进项抵扣清单",
    ip: "10.0.0.45",
    status: "success",
  },
  {
    id: "op8",
    timestamp: "2026-05-08 23:55:12",
    user: "系统机器人 (SYS)",
    module: "智能供应链",
    action: "数据新增",
    details: "自动生成了跨库调拨单 [TO-20260509-001]",
    ip: "Server-Side",
    status: "success",
  },
];

// Mock Data for AI Logs
const mockAiLogs = [
  {
    id: "ai1",
    timestamp: "2026-05-09 10:45:22",
    user: "张伟",
    question: "请分析一下上个月供应链中交付延迟率最高的三个供应商。",
    model: "Gemini 1.5 Pro",
    mode: "在线 API",
    tokens: 1250,
    cost: 0.045,
    duration: 2.4,
  },
  {
    id: "ai2",
    timestamp: "2026-05-09 10:30:15",
    user: "李娜",
    question: "对比 MAT-001 和 MAT-002 的历史库龄分布，并给出呆滞处理建议。",
    model: "Llama 3 (70B)",
    mode: "本地部署",
    tokens: 840,
    cost: 0,
    duration: 1.8,
  },
  {
    id: "ai3",
    timestamp: "2026-05-09 09:55:40",
    user: "陈杰",
    question: "自动解析这封包含 5 个物料行项目的 PDF 采购订单。",
    model: "Gemini 1.5 Flash",
    mode: "在线 API",
    tokens: 3200,
    cost: 0.12,
    duration: 4.5,
  },
  {
    id: "ai4",
    timestamp: "2026-05-09 09:20:11",
    user: "王超",
    question: "当前现金流状况是否存在下个月支付风险？",
    model: "GPT-4o",
    mode: "在线 API",
    tokens: 1100,
    cost: 0.033,
    duration: 3.1,
  },
  {
    id: "ai5",
    timestamp: "2026-05-09 08:45:55",
    user: "刘芳",
    question: "生成一份针对华东区客户的第二季度营销活动方案。",
    model: "Qwen-Max",
    mode: "本地部署",
    tokens: 2100,
    cost: 0,
    duration: 3.8,
  },
  {
    id: "ai6",
    timestamp: "2026-05-09 08:10:02",
    user: "系统",
    question: "扫描收件箱并识别所有潜在采购意向。",
    model: "Llama 3 (8B)",
    mode: "本地部署",
    tokens: 450,
    cost: 0,
    duration: 0.9,
  },
];

export function LogsModule({ activeSubModule }: LogsModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isAiLog = activeSubModule === "logs-ai";
  
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToLogs((fetchedLogs) => {
      setLogs(fetchedLogs);
    });
    return () => unsubscribe();
  }, []);

  const opLogs = useMemo(() => {
    const rawOps = logs.filter(l => !l.isAi);
    if (rawOps.length === 0) return mockOpLogs; // Fallback to mock if empty for demo
    
    // Map LogEntry to the expected shape
    return rawOps.map(l => ({
       id: l.id,
       timestamp: l.timestamp,
       user: l.userEmail || "当前用户",
       module: l.module,
       action: l.action,
       details: l.details,
       ip: "Client-Side",
       status: l.status,
    }));
  }, [logs]);

  const aiLogs = useMemo(() => {
    const rawAis = logs.filter(l => l.isAi);
    if (rawAis.length === 0) return mockAiLogs; // Fallback to mock
    
    return rawAis.map(l => ({
       id: l.id,
       timestamp: l.timestamp,
       user: l.userEmail || "当前用户",
       question: l.question || "未记录交互内容",
       model: l.model || "Gemini 1.5",
       mode: l.mode || "在线 API",
       tokens: l.tokens || 0,
       cost: l.cost || 0,
       duration: l.duration || 0,
    }));
  }, [logs]);

  const filteredOpLogs = useMemo(() => {
    return opLogs.filter(
      (log) =>
        log.user.includes(searchTerm) ||
        log.details.includes(searchTerm) ||
        log.module.includes(searchTerm) ||
        log.action.includes(searchTerm),
    );
  }, [searchTerm, opLogs]);

  const filteredAiLogs = useMemo(() => {
    return aiLogs.filter(
      (log) =>
        log.user.includes(searchTerm) ||
        log.question.includes(searchTerm) ||
        log.model.includes(searchTerm),
    );
  }, [searchTerm, aiLogs]);

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* Header Area */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#32363a] tracking-tight mb-1">
              {isAiLog ? "AI 调度监控与效能审计" : "全域业务安全日志监控"}
            </h1>
            <p className="text-[#6a6d70] text-[12px]">
              {isAiLog
                ? "全量追踪大语言模型交互链路，精准核算 Token 消耗与模型部署 ROI。"
                : "数字化记录系统核心业务行为，构建不可篡改的企业级数据安全审计链路。"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white rounded border border-gray-200 shadow-sm flex items-center px-3 py-1.5 focus-within:ring-2 focus-within:ring-sap-blue/20 transition-all w-[240px]">
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="键入关键字搜索..."
                className="bg-transparent border-none outline-none text-[12px] w-full font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-500 shadow-sm">
              <Filter size={16} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-sap-blue text-white font-bold rounded text-[12px] hover:bg-sap-blue-dark shadow-sm transition-all active:scale-95">
              <Download size={14} />
              <span>导出审计报告</span>
            </button>
          </div>
        </div>

        {/* Filters/Stats Bar */}
        <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded shadow-sm whitespace-nowrap">
            <Calendar size={13} className="text-sap-blue" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
              周期: 2026-05-01 / 今日
            </span>
          </div>
          {!isAiLog && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded shadow-sm whitespace-nowrap">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                合规级别: LEVEL 4 (SECURE)
              </span>
            </div>
          )}
          {isAiLog && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded shadow-sm whitespace-nowrap">
                <Zap size={13} className="text-amber-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  月累计支出: ￥42.15
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded shadow-sm whitespace-nowrap">
                <Cpu size={13} className="text-indigo-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  RTT 均值: 2.1s
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 px-4 pb-4 flex flex-col min-h-0">
        <div className="bg-white rounded border border-[#E2E8F0] shadow-sm flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto !overflow-y-auto custom-scrollbar relative"
            style={{ height: "calc(100vh - 180px)" }}
          >
            <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-sap-blue/[0.03] border-b border-[#F0F0F0]">
                  {isAiLog ? (
                    <>
                      <th className="h-9 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[160px]">
                        调用时间
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[110px]">
                        提问用户
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                        自然语言交互细节
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[150px]">
                        LLM 模型
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[100px] text-center">
                        部署
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[100px] text-right">
                        TOKENS
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[100px] text-right">
                        预估成本
                      </th>
                      <th className="h-9 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[90px] text-right">
                        耗时(S)
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="h-9 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[160px]">
                        时间戳
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[120px]">
                        操作账户
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[130px]">
                        归属模块
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[100px] text-center">
                        动作
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                        审计详情
                      </th>
                      <th className="h-9 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[160px]">
                        终端指纹 / IP
                      </th>
                      <th className="h-9 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-tight w-[90px] text-right">
                        状态
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {(isAiLog ? filteredAiLogs : filteredOpLogs).map((log, idx) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.01 }}
                    key={log.id}
                    className="group hover:bg-gray-50 transition-colors h-[36px]"
                  >
                    {isAiLog ? (
                      // AI Log Rows
                      <>
                        <td className="px-4 text-[12px] font-mono text-gray-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-gray-400" />
                            <span className="text-[12px] font-bold text-sap-gray-900">
                              {(log as any).user}
                            </span>
                          </div>
                        </td>
                        <td className="px-3">
                          <p
                            className="text-[12px] text-gray-600 truncate"
                            title={(log as any).question}
                          >
                            {(log as any).question}
                          </p>
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-1.5 font-mono text-sap-blue font-bold text-[11px]">
                            <Bot size={12} />
                            <span>{(log as any).model}</span>
                          </div>
                        </td>
                        <td className="px-3 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border uppercase tracking-tighter",
                              (log as any).mode === "本地部署"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-blue-50 text-blue-600 border-blue-100",
                            )}
                          >
                            {(log as any).mode.replace('模式', '')}
                          </span>
                        </td>
                        <td className="px-3 text-right font-mono font-bold text-gray-500 text-[11px]">
                          {(log as any).tokens}
                        </td>
                        <td className="px-3 text-right">
                          <span
                            className={cn(
                              "text-[11px] font-mono font-bold",
                              (log as any).cost > 0
                                ? "text-amber-600"
                                : "text-gray-400",
                            )}
                          >
                            {(log as any).cost > 0
                              ? `￥${(log as any).cost.toFixed(3)}`
                              : "--"}
                          </span>
                        </td>
                        <td className="px-4 text-right">
                          <div className="flex items-center justify-end gap-0.5 text-[11px] font-mono font-bold text-gray-600">
                            <span>{(log as any).duration}</span>
                            <span className="text-[10px] text-gray-300">s</span>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Operation Log Rows
                      <>
                        <td className="px-4 text-[12px] font-mono text-gray-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-[20%] bg-gray-100 flex items-center justify-center text-gray-500">
                              <User size={10} strokeWidth={2.5}/>
                            </div>
                            <span className="text-[12px] font-bold text-sap-gray-900 truncate">
                              {(log as any).user}
                            </span>
                          </div>
                        </td>
                        <td className="px-3">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                            {(log as any).module}
                          </span>
                        </td>
                        <td className="px-3 text-center">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase tracking-tighter border",
                              (log as any).action === "数据删除" ||
                                (log as any).action === "数据导出"
                                ? "text-rose-600 bg-rose-50 border-rose-100"
                                : "text-sap-blue bg-sap-blue/5 border-sap-blue/20",
                            )}
                          >
                            {(log as any).action}
                          </span>
                        </td>
                        <td className="px-3">
                          <p
                            className={cn(
                              "text-[12px] transition-colors truncate max-w-[400px]",
                              (log as any).action === "数据删除"
                                ? "text-rose-600 font-bold"
                                : "text-gray-600",
                            )}
                            title={(log as any).details}
                          >
                            {(log as any).details}
                          </p>
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Monitor size={10} />
                            <span className="text-[11px] font-mono font-medium">
                              {(log as any).ip}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 text-right">
                          {log.status === "success" ? (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                              成功
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-tighter">
                              异常
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>

          {/* Footer / Pagination Mock */}
          <div className="p-4 px-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between text-[11px] font-bold text-gray-400">
            <div className="flex items-center gap-6">
              <span>
                共计 {(isAiLog ? filteredAiLogs : filteredOpLogs).length} 条记录
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 uppercase tracking-widest">
                  实时监听中
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="hover:text-sap-blue transition-colors outline-none px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-100">
                上一页
              </button>
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 bg-sap-blue text-white rounded flex items-center justify-center">
                  1
                </span>
                <span className="w-6 h-6 hover:bg-white rounded flex items-center justify-center transition-colors">
                  2
                </span>
                <span className="w-6 h-6 hover:bg-white rounded flex items-center justify-center transition-colors">
                  3
                </span>
              </div>
              <button className="hover:text-sap-blue transition-colors outline-none px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-100">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
