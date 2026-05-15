import React from 'react';
import { WorkstationModule, TileProps } from '../Workstation/WorkstationModule';
import { FileBarChart, BookOpenText, Mic, Pocket } from 'lucide-react';

const SalesOperationsModule: React.FC = () => {
  const tiles: TileProps[] = [
    {
      id: 'report',
      title: '销售报表自动生成',
      description: '多维度聚合各产品线、业务组数据，并以自然语言解析销售异动原因。',
      icon: <FileBarChart size={24} />,
      kpiIndicator: "5 报表已生成",
      disabled: false
    },
    {
      id: 'knowledge',
      title: '金牌话术知识库',
      description: '汇总销冠沟通套路并结构化存储，新人可随时调取标准应答支持。',
      icon: <BookOpenText size={24} />,
      kpiIndicator: "135 话术节点",
      disabled: false
    },
    {
      id: 'meeting',
      title: '会议访谈要点提取',
      description: '录音一键转写摘要，智能提炼客户核心诉求、关键决策人与 Action Item。',
      icon: <Mic size={24} />,
      kpiIndicator: "4 待处理会议",
      disabled: false
    },
    {
      id: 'performance',
      title: '绩效贡献实时演算',
      description: '根据复杂提成机制与即时进账，自动核算当月奖金预期与团队排名。',
      icon: <Pocket size={24} />,
      kpiIndicator: "Top3 团队排名",
      disabled: false
    }
  ];

  return (
    <WorkstationModule 
      title="AI 销售运营与协作"
      description="连接前线与后台的数字化引擎，通过知识管理与效能分析加速团队成长。"
      tiles={tiles}
    />
  );
};
export default SalesOperationsModule;
