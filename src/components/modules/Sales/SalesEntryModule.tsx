import React from 'react';
import { WorkstationModule, TileProps } from '../Workstation/WorkstationModule';
import { FileUp, Mail, Mic2, Database, FileSpreadsheet, Library } from 'lucide-react';
import { SalesOrderModule } from '../SalesOrder/SalesOrderModule';
import { OrdersModule } from '../Orders/OrdersModule';

interface SalesEntryModuleProps {
  onViewOrders?: () => void;
  initialData?: any;
  onClearInitial?: () => void;
  onResumeDraft?: (data: any) => void;
  onNavigate?: (module: string) => void;
}

const SalesEntryModule: React.FC<SalesEntryModuleProps> = ({ onViewOrders, initialData, onClearInitial, onResumeDraft, onNavigate }) => {
  const [orderCount, setOrderCount] = React.useState(28);

  React.useEffect(() => {
    const handleUpdate = () => {
      setOrderCount(prev => prev + 1);
    };
    window.addEventListener('demoOrdersUpdated', handleUpdate);
    return () => window.removeEventListener('demoOrdersUpdated', handleUpdate);
  }, []);

  const tiles: TileProps[] = [
    {
      id: 'upload',
      title: '文档/图片上传',
      description: '上传 PDF/图片合同文件，通过 AI 智能解析一键生成并同步至系统。',
      icon: <FileUp size={24} />,
      kpiIndicator: "3 份新文档",
      onClick: () => onNavigate?.('sales-contract')
    },
    {
      id: 'email',
      title: '邮件自动化中心',
      description: '自动监听指定邮箱，通过 AI 提取带附件及正文意图的订单。',
      icon: <Mail size={24} />,
      kpiIndicator: "12 封未读",
      disabled: false,
      onClick: () => onNavigate?.('sales-email')
    },
    {
      id: 'voice',
      title: '语音自动化中心',
      description: '通过语音直接创建、查询并操作订单流转，极大解放双手。',
      icon: <Mic2 size={24} />,
      disabled: false 
    },
    {
      id: 'srm',
      title: '客户 SRM 系统自动读取订单',
      description: '通过 API 对接客户侧 SRM 系统拉取最新订单进入录单池。',
      icon: <Database size={24} />,
      kpiIndicator: "5 异常同步",
      disabled: false
    },
    {
      id: 'batch',
      title: '手工单据批量转录',
      description: '批量导入未结构化的 Excel/文本订单，AI 转录为标准模板。',
      icon: <FileSpreadsheet size={24} />,
      disabled: false
    },
    {
      id: 'orders',
      title: '合同管理中心',
      description: '统一管理各渠道进入的订单数据流，提供修改、发布及异常追踪。',
      icon: <Library size={24} />,
      kpiIndicator: `${orderCount} 笔处理中`,
      onClick: () => onNavigate?.('sales-orders')
    }
  ];

  return (
    <WorkstationModule 
      title="AI 智能录单中心"
      description="多渠道的数据智能数据流入口平台。通过多模态 AI 降低人工录入成本，提升流转率。"
      tiles={tiles}
      defaultActiveTileId={initialData ? 'upload' : undefined}
    />
  );
};
export default SalesEntryModule;
