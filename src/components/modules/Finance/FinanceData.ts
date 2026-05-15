import { 
  Inbox, Receipt, CreditCard, Wallet, LineChart, PieChart, Calendar, BarChart, Landmark, FileQuestion,
  Activity, ShoppingBag, FileText, Package, Truck, Building, TrendingUp, Cpu,
  CheckCircle, AlertTriangle, ShieldCheck, Layers, Link, Map as MapIcon, Mail, Clock, Database, GitMerge, FileDigit, ArrowRightLeft, Coins
} from 'lucide-react';

export const finTilesData: Record<string, any[]> = {
  'fin-email': [
    { id: 'e1', title: '邮件订单自动录入', desc: '基于 OCR 与 NLP 自动提取邮件正文与附件中的结构化订单数据。', icon: Inbox, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '12 封待处理', chart: 'progress', chartValue: 45 },
    { id: 'e2', title: '附件解析队列', desc: '多格式附件（PDF、Excel）自动进入解析缓冲池。', icon: FileText, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'sparkline' },
    { id: 'e3', title: '配置中心', desc: '管理邮件提取规则与供应商邮箱白名单。', icon: Layers, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' }
  ],
  'fin-receivable': [
    { id: 'r1', title: '账龄分析仪表盘', desc: '展示 30/60/90 天及以上欠款的金额占比。', icon: PieChart, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'progress', chartValue: 65 },
    { id: 'r2', title: '回款预测模型', desc: '基于历史客户付款习惯预测本月入账现金。', icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'r3', title: '自动对账中心', desc: '展示银行流水与应收账款自动核销的成功率。', icon: GitMerge, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 98 },
    { id: 'r4', title: '催款通知中心', desc: '自动发送及追踪数字化催款函的阅读状态。', icon: Mail, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'sparkline' },
    { id: 'r5', title: '信用额度监控', desc: '实时预警超出信用期限或额度的重点客户。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '违约风险', chart: 'sparkline' }
  ],
  'fin-payable': [
    { id: 'p1', title: '发票自动校验', desc: '展示真伪验真结果与采购三方匹配状态。', icon: ShieldCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'progress', chartValue: 100 },
    { id: 'p2', title: '付款排期表', desc: '根据资金水位与账期自动生成的付款建议计划。', icon: Calendar, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'sparkline' },
    { id: 'p3', title: '供应商信用对账', desc: '查看已确认待付的账项明细。', icon: FileText, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' },
    { id: 'p4', title: '重复支出拦截', desc: 'AI 识别重复报送或疑似虚假交易的记录。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '拦截 2 笔', chart: 'sparkline' }
  ],
  'fin-reimbursement': [
    { id: 'b1', title: '报销审批队列', desc: '展示待处理的员工差旅费、通讯费报销单。', icon: Inbox, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', badge: '15单待审', chart: 'sparkline' },
    { id: 'b2', title: '合规审计', desc: 'AI 自动检查报销标准（如等级超标、附件缺失）。', icon: ShieldCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'progress', chartValue: 95 },
    { id: 'b3', title: '预算占用实时看', desc: '展示报销后对应的各部门预算余额。', icon: PieChart, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' },
    { id: 'b4', title: '发票池管理', desc: '员工提交的电子发票与纸质发票扫描件存档。', icon: Database, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'sparkline' },
    { id: 'b5', title: '差旅效能报告', desc: '分析公司差旅费用分布及优化建议。', icon: Activity, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', chart: 'progress', chartValue: 70 }
  ],
  'fin-cashflow': [
    { id: 'c1', title: '实时资金池看板', desc: '全球各账户资金余额聚合展示。', icon: Landmark, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'sparkline' },
    { id: 'c2', title: '现金流缺口预警', desc: '预测未来 30 天内的资金流动性及枯竭风险。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', chart: 'progress', chartValue: 80 },
    { id: 'c3', title: '多币种转换', desc: '实时外汇牌价与账户多币种换算统计。', icon: ArrowRightLeft, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'c4', title: '投资回报追踪', desc: '短期投资理财产品的收益监控。', icon: TrendingUp, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' },
    { id: 'c5', title: '融资成本分析', desc: '各类银行贷款及债务融资成本明细。', icon: FileDigit, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'progress', chartValue: 40 },
    { id: 'c6', title: '日内头寸管理', desc: '按日统计现金净流入与净流出量。', icon: Activity, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', chart: 'sparkline' }
  ],
  'fin-analysis': [
    { id: 'a1', title: '净利润率动态看板', desc: '自动分析各事业群的实时净利与毛利表现。', icon: PieChart, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'sparkline' },
    { id: 'a2', title: '经营效率对标', desc: '对标行业基准数据，发现管理效能短板。', icon: Activity, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'progress', chartValue: 85 },
    { id: 'a3', title: '管理报表自动生成', desc: '一键生成面向高管的图文财务洞察报告。', icon: FileText, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'a4', title: '亏损节点定位', desc: 'AI 自动剥析沉没成本及异常费用项。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '异常预警', chart: 'sparkline' }
  ],
  'fin-closing': [
    { id: 'cl1', title: '损益表自动生成', desc: '月结时自动抽取流水生成当期利润表。', icon: FileText, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 100 },
    { id: 'cl2', title: '月结进度监控', desc: '各业务单元关账任务完成度追踪。', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'progress', chartValue: 60 },
    { id: 'cl3', title: '科目平衡对冲', desc: '自动校验总账与明细账的过账平衡状态。', icon: GitMerge, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'cl4', title: '凭证完整性核查', desc: '检查结账前所有草稿凭证和未结日志。', icon: ShieldCheck, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'sparkline' },
    { id: 'cl5', title: '调账建议助手', desc: '根据差异值提供自动冲销等期末调账建议。', icon: Activity, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', chart: 'sparkline' }
  ],
  'fin-budget': [
    { id: 'bu1', title: '预算执行率分析', desc: '实时对比实际花费与年度核定预算额度。', icon: PieChart, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 75 },
    { id: 'bu2', title: '超支熔断配置', desc: '设定阈值，一旦超额自动锁定采购与报销权限。', icon: ShieldCheck, color: 'text-rose-500', bgColor: 'bg-rose-50', chart: 'sparkline' },
    { id: 'bu3', title: '部门预算池分配', desc: '灵活调整及划拨各事业群的共享资源预算。', icon: Layers, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'bu4', title: '滚动预算模拟表', desc: '基于近期实际营收情况，动态重载下季度预算。', icon: TrendingUp, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' }
  ],
  'fin-assets': [
    { id: 'as1', title: '固定资产折旧明细', desc: '自动计算直线法、双倍余额法下的当期折旧额。', icon: FileDigit, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'progress', chartValue: 100 },
    { id: 'as2', title: '资产状态监控', desc: '追踪在用、闲置、报废等资产全生命周期状态。', icon: Activity, color: 'text-sap-blue', bgColor: 'bg-sap-blue/10', chart: 'sparkline' },
    { id: 'as3', title: '盘点计划管理', desc: '生成二维码扫码盘点任务流及差异报告。', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 'as4', title: '无形资产摊销', desc: '自动摊销软件版权、专利权等无形资产。', icon: PieChart, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'sparkline' },
    { id: 'as5', title: '资产减值预测', desc: '监控市场变化触发的资产减值风险评估。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '减值提示', chart: 'sparkline' }
  ],
  'fin-tax': [
    { id: 't1', title: '销项票自动开具', desc: '对接税局接口，自动生成并发送电子发票。', icon: FileText, color: 'text-sapphire-blue', bgColor: 'bg-sap-blue/10', chart: 'progress', chartValue: 92 },
    { id: 't2', title: '进项票抵扣看板', desc: '自动计算当期可用于抵扣的进项税额总数。', icon: Coins, color: 'text-emerald-500', bgColor: 'bg-emerald-50', chart: 'sparkline' },
    { id: 't3', title: '税务申报同步', desc: '将财务结果映射到纳税申报表并同步至局端。', icon: GitMerge, color: 'text-indigo-500', bgColor: 'bg-indigo-50', chart: 'progress', chartValue: 100 },
    { id: 't4', title: '合规评分模拟', desc: '通过多项风险指标模拟税务健康得分。', icon: ShieldCheck, color: 'text-amber-500', bgColor: 'bg-amber-50', chart: 'progress', chartValue: 85 },
    { id: 't5', title: '跨境税务筹划', desc: '多实体关税及跨国增值税合规提示。', icon: MapIcon, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50', chart: 'sparkline' },
    { id: 't6', title: '稽查风险阻断', desc: 'AI 检测异常发票数据或异常利润率，拦截上报。', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50', badge: '高风险', chart: 'sparkline' }
  ]
};

export const finModuleTitles: Record<string, { title: string, desc: string }> = {
  'fin-email': { title: 'AI 电子邮件审计', desc: '基于 NLP 的邮件订单自动录入、附件深度解析与白名单规则审计' },
  'fin-receivable': { title: 'AI 智能应收风控', desc: '动态账龄热力图分析、客户回款习惯预测模型与数字化催款追踪' },
  'fin-payable': { title: 'AI 智能应付校验', desc: '供应商发票 AI 真伪验真、采购合同三方匹配自动化与重复支出智能拦截' },
  'fin-reimbursement': { title: 'AI 智能费用管理', desc: '差旅报销合规性全量自动审计、预算占用实时监控与消费效能报告' },
  'fin-cashflow': { title: 'AI 智能资金头寸', desc: '全球多币种实时资金看板、现金流流动性缺口预警与融资成本追踪' },
  'fin-analysis': { title: 'AI 智能经营洞察', desc: '多维损益动态看板、行业竞争力对标分析与高管敏捷经营分析报告' },
  'fin-closing': { title: 'AI 智能自动月结', desc: '关账任务全链路进度实时监控、科目自动对冲校验与结账质量审计' },
  'fin-budget': { title: 'AI 智能预算控制', desc: '全年度预算执行率动态预警、超支权限智能熔断与部门资源精准划拨' },
  'fin-assets': { title: 'AI 智能资产管理', desc: '固定资产全生命周期状态监控、自动折旧明细生成与数字化移动盘点' },
  'fin-tax': { title: 'AI 智能税务合规', desc: '销项票自动开具推送、进项票智能抵扣引擎与税务合规评分建模' }
};
