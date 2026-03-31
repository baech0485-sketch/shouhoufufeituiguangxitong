import React, { useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import StoreDetailModal from './components/StoreDetailModal';
import StoreList from './components/StoreList';
import { useAppStoreData } from './hooks/useAppStoreData';
import { getContentContainerClassName } from './layout/contentWidth.js';
import { ViewState } from './types';
import { buildAfterSalesStaffOptions } from './utils/afterSalesStaff.js';

export default function App() {
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

  const staffOptions = useMemo(() => {
    return buildAfterSalesStaffOptions([
      ...followUps.map((item) => item.staffName),
      ...recharges.map((item) => item.staffName),
    ]);
  }, [followUps, recharges]);

  return (
    <div className="flex h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 overflow-y-auto">
        <div
          className={`${getContentContainerClassName(currentView)} px-6 py-8 md:px-8 lg:py-10`}
        >
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {isLoading && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              正在加载云端数据...
            </div>
          )}
          {currentView === 'dashboard' && (
            <Dashboard
              storePlatforms={storePlatforms}
              recharges={recharges}
              followUps={followUps}
            />
          )}
          {currentView === 'list' && (
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
