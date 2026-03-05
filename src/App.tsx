import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import StoreEntry from './components/StoreEntry';
import StoreList from './components/StoreList';
import StoreDetailModal from './components/StoreDetailModal';
import Dashboard from './components/Dashboard';
import { Store, FollowUp, Recharge, ViewState } from './types';
import { followUpApi, rechargeApi, storeApi } from './api';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeListRefreshKey, setStoreListRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const [followUpData, rechargeData] = await Promise.all([
          followUpApi.list(),
          rechargeApi.list(),
        ]);
        setFollowUps(followUpData);
        setRecharges(rechargeData);
      } catch (error) {
        const message = error instanceof Error ? error.message : '初始化数据失败';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeData();
  }, []);

  const handleAddStore = (newStore: Omit<Store, 'id' | 'status'>) => {
    setErrorMessage('');
    void (async () => {
      try {
        await storeApi.create(newStore);
        setStoreListRefreshKey((prevKey) => prevKey + 1);
      } catch (error) {
        const message = error instanceof Error ? error.message : '新增店铺失败';
        setErrorMessage(message);
      }
    })();
  };

  const handleAddFollowUp = (newFollowUp: Omit<FollowUp, 'id'>) => {
    setErrorMessage('');
    void (async () => {
      try {
        const createdFollowUp = await followUpApi.create(newFollowUp);
        setFollowUps((prevFollowUps) => [createdFollowUp, ...prevFollowUps]);
        setStoreListRefreshKey((prevKey) => prevKey + 1);
        setSelectedStore((prevStore) =>
          prevStore && prevStore.id === newFollowUp.storeId && prevStore.status === '待跟进'
            ? { ...prevStore, status: '已跟进' }
            : prevStore,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : '新增跟进记录失败';
        setErrorMessage(message);
      }
    })();
  };

  const handleAddRecharge = (newRecharge: Omit<Recharge, 'id'>) => {
    setErrorMessage('');
    void (async () => {
      try {
        const createdRecharge = await rechargeApi.create(newRecharge);
        setRecharges((prevRecharges) => [createdRecharge, ...prevRecharges]);
        setStoreListRefreshKey((prevKey) => prevKey + 1);
        setSelectedStore((prevStore) =>
          prevStore && prevStore.id === newRecharge.storeId
            ? { ...prevStore, status: '已充值' }
            : prevStore,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : '新增充值记录失败';
        setErrorMessage(message);
      }
    })();
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 overflow-y-auto p-8">
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
          <Dashboard recharges={recharges} followUps={followUps} />
        )}
        {currentView === 'entry' && (
          <StoreEntry onAddStore={handleAddStore} />
        )}
        {currentView === 'list' && (
          <StoreList
            onSelectStore={setSelectedStore}
            refreshKey={storeListRefreshKey}
          />
        )}
      </main>

      {selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          followUps={followUps.filter(f => f.storeId === selectedStore.id)}
          recharges={recharges.filter(r => r.storeId === selectedStore.id)}
          onClose={() => setSelectedStore(null)}
          onAddFollowUp={handleAddFollowUp}
          onAddRecharge={handleAddRecharge}
        />
      )}
    </div>
  );
}
