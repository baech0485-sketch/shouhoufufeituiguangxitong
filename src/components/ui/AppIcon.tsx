import React from 'react';
import {
  CircleCheckBig,
  ImagePlus,
  LayoutDashboard,
  List,
  LucideProps,
  MessageSquareMore,
  PanelsTopLeft,
  Percent,
  RefreshCw,
  Search,
  Sparkles,
  Store,
  Upload,
  WalletCards,
  WandSparkles,
  X,
  ChevronDown,
} from 'lucide-react';

export type AppIconName =
  | 'dashboard'
  | 'list'
  | 'detail'
  | 'sync'
  | 'store'
  | 'wallet'
  | 'check'
  | 'percent'
  | 'search'
  | 'message'
  | 'image'
  | 'spark'
  | 'upload'
  | 'close'
  | 'chevron';

const ICONS: Record<AppIconName, React.ComponentType<LucideProps>> = {
  dashboard: LayoutDashboard,
  list: List,
  detail: PanelsTopLeft,
  sync: RefreshCw,
  store: Store,
  wallet: WalletCards,
  check: CircleCheckBig,
  percent: Percent,
  search: Search,
  message: MessageSquareMore,
  image: ImagePlus,
  spark: WandSparkles,
  upload: Upload,
  close: X,
  chevron: ChevronDown,
};

interface AppIconProps extends LucideProps {
  name: AppIconName;
}

export default function AppIcon({ name, ...props }: AppIconProps) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon strokeWidth={2} {...props} />;
}
