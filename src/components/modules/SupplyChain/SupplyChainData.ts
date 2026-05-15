import { 
  Activity, ShoppingBag, FileText, Package, Truck, Building, TrendingUp, Cpu,
  CheckCircle, AlertTriangle, ShieldCheck, PieChart, Layers, Link, Map as MapIcon, Mail, Clock, Database, GitMerge, FileDigit
} from 'lucide-react';

export const scTilesData: Record<string, any[]> = {
  'sc-health': [
    { id: 'h1', title: '主数据诊断', desc: '自动扫描物料编码、描述及单位的合规性。', icon: ShieldCheck, color: 'text-rose-500', bgColor: 'bg-rose-50', chart: 'progress', chartValue: 92 },
    { id: 'h2', title: '呆滞料预警', desc: '基于库存周转天数识别 180 天以上未变动的物料。', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50', badge: '12项风险', chart: 'sparkline' },
    { id: 'h3', title: '重复编码检测', desc: 'AI 语义识别相似物料描述，防止重复建档。', icon: Layers, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 100 },
    { id: 'h4', title: '物料完整度得分', desc: '展示关键字段填充率的百分比进度条。', icon: PieChart, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'progress', chartValue: 88 },
    { id: 'h5', title: '分类视图清理', desc: '根据 SAP Material Master 属性自动归类错误。', icon: Database, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'sparkline' },
    { id: 'h6', title: '字段自动纠错', desc: '展示 AI 建议修改的属性列表。', icon: FileDigit, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', badge: '35项建议', chart: 'sparkline' }
  ],
  'sc-procurement': [
    { id: 'p1', title: '自动补货计划', desc: '基于安全库存水位自动生成的采购申请清单。', icon: Package, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 78 },
    { id: 'p2', title: '供应商交期评分', desc: '展示供应商历史准时交付率的折线趋势图。', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'p3', title: '询价对比中心', desc: '多维度展示不同供应商的价格、质量、交期对比。', icon: PieChart, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' },
    { id: 'p4', title: '采购合同监控', desc: '实时追踪框架协议的执行进度与剩余金额。', icon: FileText, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', chart: 'progress', chartValue: 65 },
    { id: 'p5', title: '风险预警看板', desc: '监控天气、物流等外部因素对交期的潜在影响。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '红色预警', chart: 'sparkline' }
  ],
  'sc-outsourcing': [
    { id: 'o1', title: '委外进度热力图', desc: '展示不同加工商当前生产阶段的进度色彩图。', icon: MapIcon, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'sparkline' },
    { id: 'o2', title: '材料损耗核算', desc: '对比发料量与回料量，计算单据级损益率。', icon: Activity, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '超耗提醒', chart: 'progress', chartValue: 42 },
    { id: 'o3', title: '加工费对账单', desc: '自动汇总当月已核销的委外加工费用。', icon: FileText, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'progress', chartValue: 100 },
    { id: 'o4', title: '质量检控统计', desc: '记录委外回货的合格率与返工原因分析。', icon: ShieldCheck, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' }
  ],
  'sc-inventory': [
    { id: 'i1', title: '实时水位看板', desc: '全库位实时动态余额展示。', icon: Activity, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'sparkline' },
    { id: 'i2', title: '智能调拨平衡', desc: 'AI 建议从高冗余仓库向高需求仓库的调拨指令。', icon: GitMerge, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', chart: 'progress', chartValue: 75 },
    { id: 'i3', title: '虚拟库存管理', desc: '包含在途物资与已预占库存的逻辑视图。', icon: Layers, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'i4', title: '库龄分布分析', desc: '以饼图展示库存的时段分布。', icon: PieChart, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'progress', chartValue: 60 },
    { id: 'i5', title: '预占资源清理', desc: '扫描长期占用未消耗的锁定库存。', icon: Database, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '待清理', chart: 'sparkline' }
  ],
  'sc-logistics': [
    { id: 'l1', title: '在途实时地图', desc: '可视化展示主要物流节点的位置状态。', icon: MapIcon, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'sparkline' },
    { id: 'l2', title: '异常停滞警报', desc: '自动识别超过 24 小时未更新轨迹的包裹。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '12 单异常', chart: 'sparkline' },
    { id: 'l3', title: 'AI 催单助手', desc: '一键生成催单邮件或自动联系物流服务商。', icon: Mail, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 100 },
    { id: 'l4', title: '物流成本分析', desc: '展示各物流承运商的时效与成本效能比。', icon: FileDigit, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' }
  ],
  'sc-supplier': [
    { id: 's1', title: '供应商绩效画像', desc: '基于交期、质量、价格自动生成的综合评分。', icon: Activity, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 88 },
    { id: 's2', title: '合同自动审核', desc: 'AI 扫描合同条款中的合规性风险。', icon: ShieldCheck, color: 'text-rose-500', bgColor: 'bg-rose-50', chart: 'sparkline' },
    { id: 's3', title: '电子对账单', desc: '自动生成并推送给供应商的月度对账数据。', icon: FileText, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'progress', chartValue: 100 },
    { id: 's4', title: '准入资质审查', desc: '监控营业执照、ISO等资质文件的有效期。', icon: CheckCircle, color: 'text-amber-500', bgColor: 'bg-amber-50', badge: '2家过期', chart: 'sparkline' },
    { id: 's5', title: '配额动态调整', desc: '根据实时绩效动态分配采购订单份额。', icon: GitMerge, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'progress', chartValue: 70 },
    { id: 's6', title: '供应商索赔管理', desc: '跟踪因质量问题产生的扣款与索赔进度。', icon: FileDigit, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', chart: 'sparkline' }
  ],
  'sc-forecast': [
    { id: 'f1', title: '季节性销量预测', desc: '结合历史数据预测周期性需求波动。', icon: TrendingUp, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'sparkline' },
    { id: 'f2', title: '安全库存动态调整', desc: '基于预测结果自动更新安全库存水位。', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'progress', chartValue: 85 },
    { id: 'f3', title: '缺货风险预演', desc: '模拟生产和销售计划下的潜在缺货点。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '高风险', chart: 'sparkline' },
    { id: 'f4', title: '预测准确率复盘', desc: '追踪过往预测数据与实际发生的偏差。', icon: PieChart, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'progress', chartValue: 76 },
    { id: 'f5', title: '新品上市模型', desc: '使用协同过滤预测无历史记录新品销量。', icon: Layers, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' }
  ],
  'sc-manufacturing': [
    { id: 'm1', title: '排程优先级看板', desc: '自动生成最优排产计划，降低换线成本。', icon: Layers, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 92 },
    { id: 'm2', title: '设备运行监控', desc: '实时读取机台 OEE (全局设备效率) 数据。', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'm3', title: '生产异常预警', desc: '监控缺料、宕机等导致的生产进度落后。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '机台宕机', chart: 'sparkline' },
    { id: 'm4', title: '良率实时分析', desc: '自动汇总工段良率，定位导致报废的核心工序。', icon: PieChart, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'progress', chartValue: 98 }
  ]
};

export const scModuleTitles: Record<string, { title: string, desc: string }> = {
  'sc-health': { title: 'AI 智能主数据治理', desc: '基于 AI 的物料编码合规性诊断、描述治理与单位标准化校验' },
  'sc-procurement': { title: 'AI 智能采购决策', desc: '基于安全库存水位的自动补货建议、供应商交付得分与多维询价对比' },
  'sc-outsourcing': { title: 'AI 智能委外协同', desc: '委外工单加工进度实时热力图、材料超耗预警与自动对账辅助' },
  'sc-inventory': { title: 'AI 智能库存大脑', desc: '全渠道实时库存动态看板、跨库智能调拨建议与库龄分布深度分析' },
  'sc-logistics': { title: 'AI 智能物流雷达', desc: '在途物资实时轨迹监控、异常路由警报与承运商成本效能分析' },
  'sc-supplier': { title: 'AI 智能供应商云', desc: '供应商绩效全景画像、合同 AI 智能审核与电子对账协同平台' },
  'sc-forecast': { title: 'AI 智能需求预测', desc: '结合季节性销量特征的需求预测引擎、动态安全库存调整模型' },
  'sc-manufacturing': { title: 'AI 智能智造中心', desc: '生产排程优先级优先级可视化驾驶舱、设备 OEE 实时运行状态监控' }
};
