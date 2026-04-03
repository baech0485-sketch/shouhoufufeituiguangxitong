import React from 'react';

import { STORE_PLATFORM_FILTER_OPTIONS } from '../../constants/storePlatforms';
import AppIcon from '../ui/AppIcon';
import SelectField from '../ui/SelectField';
import TextField from '../ui/TextField';
import { getStoreListResetButtonClassName } from './storeListFiltersLayout.js';

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

const STATUS_OPTIONS = [
  { label: '全部状态', value: '全部' },
  { label: '待跟进', value: '待跟进' },
  { label: '已跟进', value: '已跟进' },
  { label: '已充值', value: '已充值' },
  { label: '已在推广', value: '已在推广' },
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
    { label: '全部人员', value: '全部' },
    ...staffOptions.map((staffName) => ({
      label: staffName,
      value: staffName,
    })),
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,340px)_170px_170px_170px_auto] xl:items-end">
      <TextField
        value={searchTerm}
        placeholder="店铺名 / 商家 ID"
        onChange={onSearchTermChange}
        leadingIcon={<AppIcon name="search" size={18} />}
        label="关键词检索"
      />
      <SelectField
        value={filterPlatform}
        options={STORE_PLATFORM_FILTER_OPTIONS}
        onChange={onFilterPlatformChange}
        label="平台"
      />
      <SelectField
        value={filterStatus}
        options={STATUS_OPTIONS}
        onChange={onFilterStatusChange}
        label="状态"
      />
      <SelectField
        value={filterStaff}
        options={staffSelectOptions}
        onChange={onFilterStaffChange}
        label="售后人员"
      />
      <button
        type="button"
        onClick={() => {
          onSearchTermChange('');
          onFilterPlatformChange('全部');
          onFilterStatusChange('全部');
          onFilterStaffChange('全部');
        }}
        className={getStoreListResetButtonClassName()}
      >
        重置
      </button>
    </div>
  );
}
