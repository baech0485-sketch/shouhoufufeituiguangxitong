export const APP_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: '数据看板',
    description: '经营总览与重点提醒',
    icon: 'LayoutDashboard',
    actionable: true,
  },
  {
    id: 'list',
    label: '店铺列表',
    description: '筛选、录入与批量操作',
    icon: 'List',
    actionable: true,
  },
  {
    id: 'detail',
    label: '详情弹窗',
    description: '跟进与充值工作台',
    icon: 'PanelsTopLeft',
    actionable: false,
  },
  {
    id: 'sync',
    label: '导入同步',
    description: '表格入库与状态修复',
    icon: 'RefreshCw',
    actionable: false,
  },
];

const VIEW_META = {
  dashboard: {
    eyebrow: 'APRIL 2026 / DATA OVERVIEW',
    title: '经营总览',
    description: '统一查看当月跟进、充值和推广潜力，重点信息集中在一屏内完成决策。',
  },
  list: {
    eyebrow: 'STORE MANAGEMENT / FILTER & ACT',
    title: '店铺列表',
    description: '围绕搜索、平台、状态和售后维度快速筛选，把高频操作集中到同一层级完成。',
  },
  detail: {
    eyebrow: 'STORE DETAIL / FOLLOW-UP WORKBENCH',
    title: '详情弹窗',
    description: '跟进记录、充值记录和表单工作台放在一个上下文中处理。',
  },
  sync: {
    eyebrow: 'IMPORT PIPELINE / DATA SYNC',
    title: '导入同步',
    description: '同步最新表格并对店铺状态进行批量校验。',
  },
};

export function getViewMeta(view) {
  return VIEW_META[view] || VIEW_META.dashboard;
}
