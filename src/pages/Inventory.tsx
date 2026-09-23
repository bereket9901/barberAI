import { useState } from 'react';
import { useStore, store, InventoryMovementType } from '../store';
import { Card, Badge } from '../components/Layout';
import { Package, AlertTriangle, Plus, ArrowDown, ArrowUp } from 'lucide-react';

export function Inventory() {
  const s = useStore();
  const [showAdjust, setShowAdjust] = useState<string | null>(null);
  const [adjType, setAdjType] = useState<InventoryMovementType>('PURCHASE');
  const [adjQty, setAdjQty] = useState('');
  const [adjNotes, setAdjNotes] = useState('');

  const handleAdjust = (itemId: string) => {
    const qty = parseFloat(adjQty);
    if (!qty || qty <= 0) return;
    store.adjustInventory(itemId, qty, adjType, adjNotes || undefined);
    setShowAdjust(null);
    setAdjQty('');
    setAdjNotes('');
  };

  const lowStockItems = s.inventoryItems.filter(i => i.quantity <= i.minQuantity);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Track supplies and consumption</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="space-y-2">
          {lowStockItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle size={18} className="text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Low Stock: {item.name}</p>
                <p className="text-xs text-amber-600">
                  Current: {item.quantity} {item.unit} • Minimum: {item.minQuantity} {item.unit}
                </p>
              </div>
              <button
                onClick={() => { setShowAdjust(item.id); setAdjType('PURCHASE'); }}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700"
              >
                Restock
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {s.inventoryItems.map(item => {
          const isLow = item.quantity <= item.minQuantity;
          const percentage = Math.min(100, (item.quantity / (item.minQuantity * 3)) * 100);
          return (
            <Card key={item.id} className={`p-5 ${isLow ? 'border-amber-200' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package size={18} className={isLow ? 'text-amber-500' : 'text-primary-500'} />
                  <h3 className="font-semibold text-slate-800">{item.name}</h3>
                </div>
                {isLow && <Badge status="WARNING">Low</Badge>}
              </div>
              <p className="text-3xl font-bold text-slate-800">{item.quantity} <span className="text-lg text-slate-400">{item.unit}</span></p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Min: {item.minQuantity} {item.unit}</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => { setShowAdjust(item.id); setAdjType('PURCHASE'); }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
                >
                  <ArrowDown size={12} /> Purchase
                </button>
                <button
                  onClick={() => { setShowAdjust(item.id); setAdjType('ADJUSTMENT'); }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <ArrowUp size={12} /> Adjust
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Movements */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Recent Movements</h3>
        {s.inventoryMovements.length === 0 ? (
          <p className="text-center text-slate-400 py-6">No inventory movements recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {s.inventoryMovements.slice(0, 10).map(mov => {
              const item = s.inventoryItems.find(i => i.id === mov.inventoryItemId);
              return (
                <div key={mov.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <Badge status={mov.type === 'PURCHASE' ? 'COMPLETED' : mov.type === 'CONSUMPTION' ? 'IN_PROGRESS' : 'MANUAL_CORRECTION'}>
                    {mov.type}
                  </Badge>
                  <span className="text-sm text-slate-700 flex-1">{item?.name}</span>
                  <span className={`text-sm font-medium ${mov.type === 'PURCHASE' ? 'text-green-600' : 'text-red-600'}`}>
                    {mov.type === 'PURCHASE' ? '+' : '-'}{mov.quantity} {item?.unit}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(mov.recordedAt).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Adjustment Modal */}
      {showAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAdjust(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Adjust Inventory — {s.inventoryItems.find(i => i.id === showAdjust)?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['PURCHASE', 'ADJUSTMENT', 'WASTE', 'CORRECTION'] as InventoryMovementType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setAdjType(t)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border ${
                        adjType === t ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Quantity ({s.inventoryItems.find(i => i.id === showAdjust)?.unit})
                </label>
                <input
                  type="number"
                  value={adjQty}
                  onChange={e => setAdjQty(e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Notes (optional)</label>
                <input
                  type="text"
                  value={adjNotes}
                  onChange={e => setAdjNotes(e.target.value)}
                  placeholder="Reason for adjustment..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdjust(null)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => handleAdjust(showAdjust)} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
