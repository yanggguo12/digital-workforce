import React from 'react';
import { WorkstationModule, TileProps } from '../Workstation/WorkstationModule';
import { Search, PackageOpen, History, Users2 } from 'lucide-react';

const SalesInquiryModule: React.FC = () => {
  const tiles: TileProps[] = [
    {
      id: 'search',
      title: '合同条款语义搜索',
      description: '基于自然语言语义匹配，精准检索历史合同条款、规避细则及争议点。',
      icon: <Search size={24} />,
      kpiIndicator: "2K+ 结构化条款",
      disabled: false
    },
    {
      id: 'inventory',
      title: '物料库存预测与调拨',
      description: '预估长交期订单对物料的影响，自动生成安全库存建议和调拨计划。',
      icon: <PackageOpen size={24} />,
      kpiIndicator: "98% 齐套率",
      disabled: false
    },
    {
      id: 'history',
      title: '历史报价与毛利回溯',
      description: '交叉对比相似订单历史报价底线，推演本次成单预测毛利率。',
      icon: <History size={24} />,
      kpiIndicator: "24.5% 均毛利",
      disabled: false
    },
    {
      id: 'customer',
      title: '客户画像深度透视',
      description: '全景呈现业务行为及交易习惯，提供客户流失风险指数。',
      icon: <Users2 size={24} />,
      kpiIndicator: "115 重点监控",
      disabled: false
    }
  ];

  return (
    <WorkstationModule 
      title="AI 智能查询助手"
      description="基于大规模语言模型的决策中枢，实现跨业务域数据深层交互与洞察。"
      tiles={tiles}
    />
  );
};
export default SalesInquiryModule;
