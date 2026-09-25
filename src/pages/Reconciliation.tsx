import { useState } from 'react';
import { useStore, store } from '../store';
import { Card, Badge, AlertBanner } from '../components/Layout';
import { GitCompare, AlertTriangle, CheckCircle2, Eye, DollarSign, Package, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Reconciliation() {
  const s = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'services' | 'money' | 'inventory' | 'corrections'>('services');
  const recon = s.getReconciliationData();

  const tabs = [
    { id: 'services' as const, label: 'Services', icon: Eye },
    { id: 'money' as const, label: 'Money', icon: DollarSign },
    { id: 'inventory' as const, label: 'Inventory', icon: Package },
    { id: 'corrections' as const, label: 'Corrections', icon: Wrench },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reconciliation</h1>
        <p className="text-sm text-slate-500 mt-1">Compare AI observations with staff records</p>
      </div>

      {/* Status Banner */}
      <Card className={`p-5 ${recon.isReconciled ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-center gap-3">
          {recon.isReconciled ? (
            <>
              <CheckCircle2 size={28} className="text-green-600" />
              <div>
                <p className="font-bold text-green-800 text-lg">✓ FULLY RECONCILED</p>
                <p className="text-sm text-green-600">All AI observations match staff records.</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle size={28} className="text-amber-600" />
              <div>
                <p className="font-bold text-amber-800 text-lg">⚠ RECONCILIATION DISCREPANCY</p>
                <p className="text-sm text-amber-600">
                  {recon.difference} services and {Math.abs(recon.amountDifference).toLocaleString()} ETB require review.
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
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

      {/* Tab Content */}
      {tab === 'services' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5">
              <p className="text-sm text-slate-500">AI Observed</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{recon.aiObserved}</p>
              <p className="text-xs text-slate-400 mt-1">Services detected by AI</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-slate-500">Staff Recorded</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{recon.recorded}</p>
              <p className="text-xs text-slate-400 mt-1">Transactions created by staff</p>
            </Card>
            <Card className={`p-5 ${recon.difference > 0 ? 'border-red-200' : 'border-green-200'}`}>
              <p className="text-sm text-slate-500">Difference</p>
              <p className={`text-3xl font-bold mt-1 ${recon.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {recon.difference > 0 ? '+' : ''}{recon.difference}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {recon.difference > 0 ? 'Unmatched AI services' : 'All matched'}
              </p>
            </Card>
          </div>

          {/* Chair Breakdown */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">By Chair</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Chair</th>
                  <th className="text-right py-2 px-3 text-slate-500 font-medium">AI Services</th>
                  <th className="text-right py-2 px-3 text-slate-500 font-medium">Recorded</th>
                  <th className="text-right py-2 px-3 text-slate-500 font-medium">Difference</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recon.chairStats.map(cs => (
                  <tr key={cs.chair.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => navigate('/sessions')}>
                    <td className="py-3 px-3 font-medium">{cs.chair.name}</td>
                    <td className="py-3 px-3 text-right">{cs.aiServices}</td>
                    <td className="py-3 px-3 text-right">{cs.recorded}</td>
                    <td className={`py-3 px-3 text-right font-semibold ${cs.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {cs.difference > 0 ? `+${cs.difference}` : cs.difference}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge status={cs.difference === 0 ? 'MATCHED' : 'UNMATCHED_AI_SERVICE'}>
                        {cs.difference === 0 ? 'Matched' : 'Review'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Unmatched AI Services */}
          {recon.unmatchedSessions.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} />
                {recon.unmatchedSessions.length} Unmatched AI Services
              </h3>
              <div className="space-y-2">
                {recon.unmatchedSessions.map(session => {
                  const service = s.services.find(sv => sv.id === session.serviceId);
                  const chair = s.chairs.find(c => c.id === session.chairId);
                  const barber = s.barbers.find(b => b.id === session.barberId);
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100"
                      onClick={() => navigate(`/sessions/${session.id}`)}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">
                          {service?.name || 'Unknown service'} — {chair?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Barber: {barber?.name || 'Unknown'} • {new Date(session.startedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-red-600">{service?.price || 0} ETB</span>
                      <Badge status="UNMATCHED_AI_SERVICE">Unmatched</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'money' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5">
              <p className="text-sm text-slate-500">Expected Value</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{recon.expectedValue.toLocaleString()} ETB</p>
              <p className="text-xs text-slate-400 mt-1">AI-observed service values</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-slate-500">Recorded Value</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{recon.recordedValue.toLocaleString()} ETB</p>
              <p className="text-xs text-slate-400 mt-1">Staff-recorded transactions</p>
            </Card>
            <Card className={`p-5 ${recon.amountDifference > 0 ? 'border-red-200' : 'border-green-200'}`}>
              <p className="text-sm text-slate-500">Difference</p>
              <p className={`text-3xl font-bold mt-1 ${recon.amountDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {recon.amountDifference > 0 ? '-' : ''}{Math.abs(recon.amountDifference).toLocaleString()} ETB
              </p>
              <p className="text-xs text-slate-400 mt-1">Reconciliation discrepancy</p>
            </Card>
          </div>

          {/* Matching Engine Visualization */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Matching Engine</h3>
            <div className="space-y-3">
              {s.transactions.slice(0, 10).map(tx => {
                const session = tx.sessionId ? s.sessions.find(s => s.id === tx.sessionId) : null;
                const service = s.services.find(sv => sv.id === tx.serviceId);
                return (
                  <div key={tx.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    {/* AI Side */}
                    <div className="flex-1 text-right">
                      {session && (
                        <div>
                          <p className="text-xs text-slate-400">AI OBSERVATION</p>
                          <p className="text-sm font-medium">{service?.name}</p>
                          <p className="text-xs text-slate-500">{service?.price} ETB • {new Date(session.startedAt).toLocaleTimeString()}</p>
                        </div>
                      )}
                    </div>

                    {/* Match Status */}
                    <div className="shrink-0">
                      <Badge status={tx.reconciliationStatus}>
                        {tx.reconciliationStatus.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    {/* Transaction Side */}
                    <div className="flex-1">
                      <div>
                        <p className="text-xs text-slate-400">TRANSACTION</p>
                        <p className="text-sm font-medium">{tx.items.map(i => i.serviceName).join(', ')}</p>
                        <p className="text-xs text-slate-500">{tx.amountDue} ETB • {new Date(tx.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-slate-400">PAYMENT</p>
                      <p className="text-sm font-medium text-green-600">{tx.amountPaid} ETB</p>
                    </div>
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
            <h3 className="font-semibold text-slate-700 mb-4">Inventory Reconciliation</h3>
            <p className="text-sm text-slate-500 mb-4">Compare expected consumption (based on services) vs actual inventory movement.</p>
            <div className="space-y-3">
              {s.inventoryItems.map(item => {
                const rules = s.consumptionRules.filter(r => r.inventoryItemId === item.id);
                const expectedConsumption = rules.reduce((sum, r) => {
                  const serviceCount = s.sessions.filter(sess => sess.serviceId === r.serviceId && sess.state === 'COMPLETED').length;
                  return sum + r.quantity * serviceCount;
                }, 0);
                const actualConsumption = s.inventoryMovements
                  .filter(m => m.inventoryItemId === item.id && m.type === 'CONSUMPTION')
                  .reduce((sum, m) => sum + m.quantity, 0);
                const variance = expectedConsumption - actualConsumption;

                return (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-700">{item.name}</h4>
                      {Math.abs(variance) > 0.1 && (
                        <Badge status="PRICE_MISMATCH">REQUIRES REVIEW</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs">Expected Consumption</p>
                        <p className="font-medium">{expectedConsumption.toFixed(2)} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Actual Movement</p>
                        <p className="font-medium">{actualConsumption.toFixed(2)} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Variance</p>
                        <p className={`font-bold ${Math.abs(variance) > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                          {variance > 0 ? '+' : ''}{variance.toFixed(2)} {item.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab === 'corrections' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Manual Corrections</h3>
            <p className="text-sm text-slate-500 mb-4">
              Corrections applied to AI observations or transactions. Original AI data is never deleted.
            </p>
            <div className="space-y-3">
              {s.auditLogs.filter(l => l.action === 'AI_CORRECTION' || l.action === 'SERVICE_CORRECTION').map(log => (
                <div key={log.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-500 line-through">{log.previousValue}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-green-600 font-medium">{log.newValue}</span>
                  </div>
                  {log.reason && (
                    <p className="text-xs text-slate-500 mt-2">
                      <span className="font-medium">By:</span> {log.userName} • <span className="font-medium">Reason:</span> {log.reason}
                    </p>
                  )}
                </div>
              ))}
              {s.auditLogs.filter(l => l.action === 'AI_CORRECTION' || l.action === 'SERVICE_CORRECTION').length === 0 && (
                <p className="text-center text-slate-400 py-8">No corrections recorded yet.</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
