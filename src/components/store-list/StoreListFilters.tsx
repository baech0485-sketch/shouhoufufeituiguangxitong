import React from 'react';
import { Filter, Search, UserRound } from 'lucide-react';
import SelectField from '../ui/SelectField';
import TextField from '../ui/TextField';

interface StoreListFiltersProps {
  searchTerm: string;
  filterPlatform: string;
  filterStatus: string;
  filterStaff: string;
  staffOptions: string[];
  onSearchTermChange: (value: string) => void;
  onFilterPlatformChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onFilterStaffChange: (value: string) => void;
}

const PLATFORM_OPTIONS = [
  { label: '全部平台', value: '全部' },
  { label: '美团餐饮', value: '美团餐饮' },
  { label: '饿了么餐饮', value: '饿了么餐饮' },
  { label: '美团外卖', value: '美团外卖' },
  { label: '淘宝闪购', value: '淘宝闪购' },
];

const STATUS_OPTIONS = [
  { label: '全部状态', value: '全部' },
  { label: '待跟进', value: '待跟进' },
  { label: '已跟进', value: '已跟进' },
  { label: '已充值', value: '已充值' },
];

export default function StoreListFilters({
  searchTerm,
  filterPlatform,
  filterStatus,
  filterStaff,
  staffOptions,
  onSearchTermChange,
  onFilterPlatformChange,
  onFilterStatusChange,
  onFilterStaffChange,
}: StoreListFiltersProps) {
  const staffSelectOptions = [
    { label: '全部售后', value: '全部' },
    ...staffOptions.map((staffName) => ({
      label: staffName,
      value: staffName,
    })),
  ];

  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50/80 p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="min-w-0 flex-1">
          <TextField
            value={searchTerm}
            placeholder="搜索店铺名称或商家ID..."
            onChange={onSearchTermChange}
            leadingIcon={<Search size={18} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">
          <SelectField
            value={filterPlatform}
            options={PLATFORM_OPTIONS}
            onChange={onFilterPlatformChange}
            leadingIcon={<Filter size={18} />}
            containerClassName="min-w-[168px]"
          />
          <SelectField
            value={filterStatus}
            options={STATUS_OPTIONS}
            onChange={onFilterStatusChange}
            containerClassName="min-w-[152px]"
          />
          <SelectField
            value={filterStaff}
            options={staffSelectOptions}
            onChange={onFilterStaffChange}
            leadingIcon={<UserRound size={18} />}
            containerClassName="min-w-[168px]"
          />
        </div>
      </div>
    </div>
  );
}
