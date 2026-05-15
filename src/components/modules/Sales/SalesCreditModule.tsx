import React from 'react';
import { WorkstationModule, TileProps } from '../Workstation/WorkstationModule';
import { Building2, Calculator, AlertTriangle, TrendingUp } from 'lucide-react';

const SalesCreditModule: React.FC = () => {
  const tiles: TileProps[] = [
    {
      id: 'profile',
      title: '企业动态画像 (企查查)',
      description: '全网采集工商变更、涉诉记录与舆情信息，构建 360 度企业风险画像。',
      icon: <Building2 size={24} />,
      disabled: false 
    },
    {
      id: 'credit-calc',
      title: '授信额度智能测算',
      description: '结合内部支付历史与外部信用评估模型，动态计算合理安全授信上限。',
      icon: <Calculator size={24} />,
      kpiIndicator: "¥200M 剩余额度",
      disabled: false
    },
    {
      id: 'alert',
      title: '异常交易实时预警',
      description: '运用机器学习甄别具有欺诈意向或异常模式的购买行为进行预警干预。',
      icon: <AlertTriangle size={24} />,
      kpiIndicator: "3 高危预警",
      disabled: false
    },
    {
      id: 'prediction',
      title: '回款预测驾驶舱',
      description: '根据收款周期与合同日历建模，全局掌控资金回流节奏。',
      icon: <TrendingUp size={24} />,
      kpiIndicator: "89% 准时率",
      disabled: false
    }
  ];

  return (
    <WorkstationModule 
      title="AI 智能信用与准入"
      description="贯穿交易全生命周期的风险防范网络，自动化拦截风险及测算合规额度。"
      tiles={tiles}
    />
  );
};
export default SalesCreditModule;
