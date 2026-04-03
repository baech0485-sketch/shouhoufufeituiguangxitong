import React, { useMemo, useState } from 'react';

import { getAppShellClassNames } from './components/app-shell/layout.js';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import StoreDetailModal from './components/StoreDetailModal';
import StoreList from './components/StoreList';
import { useAppStoreData } from './hooks/useAppStoreData';
import { ViewState } from './types';
import { buildAfterSalesStaffOptions } from './utils/afterSalesStaff.js';

export default function App() {
  const shellClassNames = getAppShellClassNames();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const {
    storePlatforms,
    followUps,
    recharges,
    selectedStore,
    storeListRefreshKey,
    isLoading,
    errorMessage,
    isUpdatingStoreStatus,
    setSelectedStore,
    handleAddStore,
    handleAddFollowUp,
    handleAddRecharge,
    handleDeleteFollowUp,
    handleDeleteRecharge,
    handleMarkStoreAsPromoting,
    handleRestoreStoreAutoStatus,
  } = useAppStoreData();

  const staffOptions = useMemo(
    () =>
      buildAfterSalesStaffOptions([
        ...followUps.map((item) => item.staffName),
        ...recharges.map((item) => item.staffName),
      ]),
    [followUps, recharges],
  );

  return (
    <div className={shellClassNames.root}>
      <div className={shellClassNames.shell}>
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
        <main className={shellClassNames.main}>
          <div className={shellClassNames.surface}>
            {errorMessage && (
              <div className="rounded-[var(--radius-lg)] border border-red-200 bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            {isLoading && (
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-white px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                正在加载云端数据...
              </div>
            )}
            {currentView === 'dashboard' ? (
              <Dashboard
                storePlatforms={storePlatforms}
                recharges={recharges}
                followUps={followUps}
              />
            ) : (
              <StoreList
                onSelectStore={setSelectedStore}
                onAddStore={handleAddStore}
                refreshKey={storeListRefreshKey}
                followUps={followUps}
                recharges={recharges}
                staffOptions={staffOptions}
              />
            )}
          </div>
        </main>
      </div>
      {selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          followUps={followUps.filter((item) => item.storeId === selectedStore.id)}
          recharges={recharges.filter((item) => item.storeId === selectedStore.id)}
          onClose={() => setSelectedStore(null)}
          onAddFollowUp={handleAddFollowUp}
          onAddRecharge={handleAddRecharge}
          onDeleteFollowUp={handleDeleteFollowUp}
          onDeleteRecharge={handleDeleteRecharge}
          onMarkStoreAsPromoting={handleMarkStoreAsPromoting}
          onRestoreStoreAutoStatus={handleRestoreStoreAutoStatus}
          isUpdatingStoreStatus={isUpdatingStoreStatus}
          staffOptions={staffOptions}
        />
      )}
    </div>
  );
}
