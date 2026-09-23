import { useState } from 'react';
import { useStore, store, PaymentMethod } from '../store';
import { Card, Badge } from '../components/Layout';
import { Receipt, CreditCard, Search, Filter } from 'lucide-react';

export function Transactions() {
  const s = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);

  let transactions = [...s.transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (statusFilter !== 'all') {
    transactions = transactions.filter(t => t.status === statusFilter);
  }
  if (search) {
    const q = search.toLowerCase();
    transactions = transactions.filter(t =>
      t.id.toLowerCase().includes(q) ||
      s.customers.find(c => c.id === t.customerId)?.name?.toLowerCase().includes(q) ||
      t.items.some(i => i.serviceName.toLowerCase().includes(q))
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-800">{s.transactions.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-slate-500">Paid</p>
          <p className="text-xl font-bold text-green-600">{s.transactions.filter(t => t.status === 'PAID').length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-slate-500">Unpaid</p>
          <p className="text-xl font-bold text-red-600">{s.transactions.filter(t => t.status === 'UNPAID').length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className="text-xl font-bold text-amber-600">
            {s.transactions.reduce((sum, t) => sum + Math.max(0, t.amountDue - t.discount - t.amountPaid), 0).toLocaleString()} ETB
          </p>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Service</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Chair</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Amount Due</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Paid</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Outstanding</th>
                <th className="text-center py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-center py-3 px-4 font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 30).map(tx => {
                const customer = s.customers.find(c => c.id === tx.customerId);
                const chair = s.chairs.find(c => c.id === tx.chairId);
                const outstanding = Math.max(0, tx.amountDue - tx.discount - tx.amountPaid);

                return (
                  <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">#{tx.id.slice(-6)}</td>
                    <td className="py-3 px-4 text-slate-700">{customer?.name || 'Walk-in'}</td>
                    <td className="py-3 px-4 text-slate-700">{tx.items.map(i => i.serviceName).join(', ')}</td>
                    <td className="py-3 px-4 text-slate-600">{chair?.name}</td>
                    <td className="py-3 px-4 text-right font-medium">{tx.amountDue} ETB</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">{tx.amountPaid} ETB</td>
                    <td className="py-3 px-4 text-right text-red-600 font-medium">{outstanding > 0 ? `${outstanding} ETB` : '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge status={tx.status}>{tx.status.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.status !== 'PAID' && tx.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setShowPaymentModal(tx.id)}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs font-medium hover:bg-primary-700"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          transactionId={showPaymentModal}
          onClose={() => setShowPaymentModal(null)}
        />
      )}
    </div>
  );
}

function PaymentModal({ transactionId, onClose }: { transactionId: string; onClose: () => void }) {
  const s = useStore();
  const tx = s.transactions.find(t => t.id === transactionId);
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  if (!tx) return null;

  const outstanding = tx.amountDue - tx.discount - tx.amountPaid;

  const handleSubmit = () => {
    const payAmount = parseFloat(amount) || outstanding;
    store.recordPayment(tx.id, payAmount, method, reference || undefined);
    onClose();
  };

  const methods: PaymentMethod[] = ['CASH', 'TELEBIRR', 'CBE_BIRR', 'BANK_TRANSFER', 'CARD', 'OTHER'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Record Payment</h3>

        {/* Amount Due */}
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Amount Due</span>
            <span className="font-bold text-slate-800">{tx.amountDue} ETB</span>
          </div>
          {tx.discount > 0 && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-500">Discount</span>
              <span className="text-green-600">-{tx.discount} ETB</span>
            </div>
          )}
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">Already Paid</span>
            <span className="text-slate-600">{tx.amountPaid} ETB</span>
          </div>
          <div className="flex justify-between text-sm mt-2 pt-2 border-t border-slate-200">
            <span className="text-slate-700 font-medium">Outstanding</span>
            <span className="font-bold text-red-600">{outstanding} ETB</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {methods.map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  method === m
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Payment Amount (ETB)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={outstanding.toString()}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Reference */}
        {method !== 'CASH' && (
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Reference (optional)</label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="TRX-123456"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}
