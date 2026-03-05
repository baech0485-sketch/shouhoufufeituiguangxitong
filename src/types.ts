export type Platform = '美团外卖' | '淘宝闪购';
export type CommunicationType = '未沟通' | '私聊' | '群聊';
export type Intention = '高' | '中' | '低' | '未知';

export interface Store {
  id: string;
  name: string;
  platform: Platform;
  openDate: string;
  status: '待跟进' | '已跟进' | '已充值';
}

export interface FollowUp {
  id: string;
  storeId: string;
  date: string;
  communicationType: CommunicationType;
  intention: Intention;
  notes: string;
  staffName: string;
}

export interface Recharge {
  id: string;
  storeId: string;
  amount: number;
  date: string;
  screenshotUrl: string;
  staffName: string;
}

export type ViewState = 'dashboard' | 'entry' | 'list';
