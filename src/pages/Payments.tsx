import { useStore } from '../store';
import { Card, Badge, StatCard } from '../components/Layout';
import { CreditCard, DollarSign } from 'lucide-react';

export function Payments() {
  const s = useStore();

  const byMethod = s.payments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = s.transactions.reduce((sum, t) => sum + Math.max(0, t.amountDue - t.discount - t.amountPaid), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payments</h1>
        <p className="text-sm text-slate-500 mt-1">Payment records and method breakdown</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Collected" value={`${totalPaid.toLocaleString()} ETB`} icon={DollarSign} color="green" />
        <StatCard label="Total Outstanding" value={`${totalOutstanding.toLocaleString()} ETB`} icon={CreditCard} color="red" />
        <StatCard label="Transactions" value={s.transactions.length} icon={CreditCard} color="blue" />
      </div>

      {/* By Method */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Payment Methods Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {['CASH', 'TELEBIRR', 'CBE_BIRR', 'BANK_TRANSFER', 'CARD', 'OTHER'].map(method => {
            const amount = byMethod[method] || 0;
            const count = s.payments.filter(p => p.method === method).length;
            return (
              <div key={method} className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">{method.replace('_', ' ')}</p>
                <p className="text-lg font-bold text-slate-800">{amount.toLocaleString()}</p>
                <p className="text-xs text-slate-400">ETB • {count} payments</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Payment List */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Method</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Reference</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {[...s.payments].reverse().slice(0, 30).map(payment => {
                const tx = s.transactions.find(t => t.id === payment.transactionId);
                return (
                  <tr key={payment.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">#{payment.id.slice(-6)}</td>
                    <td className="py-3 px-4 text-slate-700">#{payment.transactionId.slice(-6)}</td>
                    <td className="py-3 px-4">
                      <Badge status="MATCHED">{payment.method.replace('_', ' ')}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">{payment.amount} ETB</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs">{payment.reference || '—'}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(payment.recordedAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
