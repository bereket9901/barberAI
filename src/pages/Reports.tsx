import { useState } from 'react';
import { useStore } from '../store';
import { Card, StatCard } from '../components/Layout';
import { BarChart3, Calendar, Scissors, CreditCard, Package } from 'lucide-react';

export function Reports() {
  const s = useStore();
  const [tab, setTab] = useState<'daily' | 'services' | 'payments' | 'inventory'>('daily');
  const recon = s.getReconciliationData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Business analytics and control reports</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: 'daily' as const, label: 'Daily Control', icon: Calendar },
          { id: 'services' as const, label: 'Services', icon: Scissors },
          { id: 'payments' as const, label: 'Payments', icon: CreditCard },
          { id: 'inventory' as const, label: 'Inventory', icon: Package },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary-500" />
              Daily Control Report — {new Date().toLocaleDateString()}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 mb-1">Customers Observed</p>
                <p className="text-2xl font-bold text-blue-800">{recon.aiObserved}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-purple-600 mb-1">Services Observed</p>
                <p className="text-2xl font-bold text-purple-800">{recon.aiObserved}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-green-600 mb-1">Transactions Recorded</p>
                <p className="text-2xl font-bold text-green-800">{recon.recorded}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-xs text-red-600 mb-1">Unreconciled Services</p>
                <p className="text-2xl font-bold text-red-800">{recon.difference}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 mb-1">Expected Amount</p>
                <p className="text-2xl font-bold text-blue-800">{recon.expectedValue.toLocaleString()} ETB</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-green-600 mb-1">Recorded Amount</p>
                <p className="text-2xl font-bold text-green-800">{recon.recordedValue.toLocaleString()} ETB</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-xs text-red-600 mb-1">Amount Discrepancy</p>
                <p className="text-2xl font-bold text-red-800">{Math.abs(recon.amountDifference).toLocaleString()} ETB</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-xs text-amber-600 mb-1">Manual Corrections</p>
                <p className="text-2xl font-bold text-amber-800">{s.auditLogs.filter(l => l.action.includes('CORRECTION')).length}</p>
              </div>
            </div>
          </Card>

          {/* Camera Downtime */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-3">Camera Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {s.cameras.map(cam => (
                <div key={cam.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">{cam.name}</span>
                  <span className={`text-sm font-medium ${cam.status === 'ONLINE' ? 'text-green-600' : 'text-red-600'}`}>
                    {cam.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'services' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Service Report</h3>
            <div className="space-y-3">
              {s.services.map(service => {
                const count = s.sessions.filter(sess => sess.serviceId === service.id && sess.state === 'COMPLETED').length;
                const revenue = count * service.price;
                const avgDuration = s.sessions
                  .filter(sess => sess.serviceId === service.id && sess.endedAt)
                  .reduce((sum, sess) => sum + (new Date(sess.endedAt!).getTime() - new Date(sess.startedAt).getTime()) / 60000, 0) / (count || 1);
                return (
                  <div key={service.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-700">{service.name}</p>
                      <p className="text-xs text-slate-400">{service.price} ETB • {service.duration} min</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">{count}</p>
                      <p className="text-xs text-slate-400">services</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{revenue.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">ETB revenue</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">{Math.round(avgDuration)}</p>
                      <p className="text-xs text-slate-400">avg min</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* By Chair */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Services by Chair</h3>
            <div className="space-y-2">
              {s.chairs.map(chair => {
                const count = s.sessions.filter(sess => sess.chairId === chair.id && sess.state === 'COMPLETED').length;
                return (
                  <div key={chair.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-20">{chair.name}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(100, (count / 20) * 100)}%` }}
                      >
                        <span className="text-xs text-white font-medium">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* By Barber */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Services by Barber</h3>
            <div className="space-y-2">
              {s.barbers.map(barber => {
                const count = s.sessions.filter(sess => sess.barberId === barber.id && sess.state === 'COMPLETED').length;
                return (
                  <div key={barber.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-32">{barber.name}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(100, (count / 20) * 100)}%` }}
                      >
                        <span className="text-xs text-white font-medium">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Payment Report</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['CASH', 'TELEBIRR', 'CBE_BIRR', 'BANK_TRANSFER', 'CARD', 'OTHER'].map(method => {
                const payments = s.payments.filter(p => p.method === method);
                const total = payments.reduce((sum, p) => sum + p.amount, 0);
                return (
                  <div key={method} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">{method.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-slate-800">{total.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">ETB • {payments.length} payments</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab === 'inventory' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Inventory Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">Item</th>
                    <th className="text-right py-2 px-3 text-slate-500 font-medium">Current Qty</th>
                    <th className="text-right py-2 px-3 text-slate-500 font-medium">Expected Consumption</th>
                    <th className="text-right py-2 px-3 text-slate-500 font-medium">Movements</th>
                    <th className="text-right py-2 px-3 text-slate-500 font-medium">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {s.inventoryItems.map(item => {
                    const rules = s.consumptionRules.filter(r => r.inventoryItemId === item.id);
                    const expected = rules.reduce((sum, r) => {
                      const count = s.sessions.filter(sess => sess.serviceId === r.serviceId && sess.state === 'COMPLETED').length;
                      return sum + r.quantity * count;
                    }, 0);
                    const movements = s.inventoryMovements.filter(m => m.inventoryItemId === item.id);
                    const totalMovement = movements.reduce((sum, m) => sum + (m.type === 'PURCHASE' ? m.quantity : -m.quantity), 0);
                    const variance = expected - Math.abs(totalMovement);

                    return (
                      <tr key={item.id} className="border-b border-slate-50">
                        <td className="py-3 px-3 font-medium text-slate-700">{item.name}</td>
                        <td className="py-3 px-3 text-right">{item.quantity} {item.unit}</td>
                        <td className="py-3 px-3 text-right">{expected.toFixed(2)} {item.unit}</td>
                        <td className="py-3 px-3 text-right">{movements.length}</td>
                        <td className={`py-3 px-3 text-right font-semibold ${Math.abs(variance) > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                          {variance > 0 ? '+' : ''}{variance.toFixed(2)} {item.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
