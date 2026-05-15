import React from 'react';
import { WorkstationModule, TileProps } from '../Workstation/WorkstationModule';
import { Target, MailOpen, LineChart, Filter } from 'lucide-react';

const SalesProspectingModule: React.FC = () => {
  const tiles: TileProps[] = [
    {
      id: 'tender',
      title: '招标信息自动匹配',
      description: '全网抓取行业招标及采购公告，智能匹配企业资质与核心能力推荐打单。',
      icon: <Target size={24} />,
      kpiIndicator: "51 推荐商机",
      disabled: false
    },
    {
      id: 'email',
      title: '个性化开发信生成',
      description: '结合目标客户业务痛点，AIGC 一键生成具有高回复率的多语种开发信。',
      icon: <MailOpen size={24} />,
      kpiIndicator: "18% 平均回复率",
      disabled: false
    },
    {
      id: 'competitor',
      title: '竞争对手动向监控',
      description: '长期监测竞品动态、价格调整与舆情变化，辅助即时响应营销策略。',
      icon: <LineChart size={24} />,
      kpiIndicator: "12 竞品动态",
      disabled: false
    },
    {
      id: 'exhibition',
      title: '展会线索清洗',
      description: '批量导入名片机或展台登记数据，AI提取信息并自动打分分发。',
      icon: <Filter size={24} />,
      kpiIndicator: "0 待清洗",
      disabled: false
    }
  ];

  return (
    <WorkstationModule 
      title="AI 潜客拓客与营销"
      description="由 AI 驱动的全渠道自动化获客矩阵，将数据线索高效转化为商机。"
      tiles={tiles}
    />
  );
};
export default SalesProspectingModule;
