import { auth, db, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, handleFirestoreError, OperationType } from '../lib/firebase';

export interface LogEntry {
  id: string;
  userId: string;
  userEmail?: string;
  timestamp: string;
  module: string;
  action: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  details: string;
  sapDoc?: string;
  isAi?: boolean;
  question?: string;
  model?: string;
  mode?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
}

export const createLog = async (log: Omit<LogEntry, 'id' | 'timestamp' | 'userId' | 'userEmail'>) => {
  const path = 'logs';
  try {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, path), {
      ...log,
      userId: user.uid,
      userEmail: user.email,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const subscribeToLogs = (callback: (logs: LogEntry[]) => void) => {
  const path = 'logs';
  const user = auth.currentUser;
  
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, path), 
    where('userId', '==', user.uid),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : new Date().toLocaleString()
      } as LogEntry;
    });
    callback(logs);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
    // Fallback if demo mode or error
    callback([
      { id: '1', userId: 'mock', timestamp: new Date().toLocaleString(), module: 'SalesOrder', action: '解析 PDF 订单', status: 'success', details: '从 环球物流_采购单.pdf 成功解析 2 条行项目' },
      { id: '2', userId: 'mock', timestamp: new Date(Date.now() - 3600000).toLocaleString(), module: 'SAP Gateway', action: '推送订单至 S/4HANA', status: 'success', details: '订单成功同步，获取物料凭证 4500982231', sapDoc: '4500982231' },
      { id: '3', userId: 'mock', timestamp: new Date(Date.now() - 7200000).toLocaleString(), module: 'Email Parser', action: '拉取收件箱', status: 'pending', details: '扫描 3 封未读邮件，发现 1 封包含采购合同附件' }
    ]);
  });
};
