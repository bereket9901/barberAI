import { useState } from 'react';
import { useStore } from '../store';
import { Card, Badge } from '../components/Layout';
import { Users, Search, Scissors, DollarSign, Clock } from 'lucide-react';

export function Customers() {
  const s = useStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const customersWithStats = s.customers.map(customer => {
    const sessions = s.sessions.filter(sess => sess.customerId === customer.id);
    const transactions = s.transactions.filter(t => t.customerId === customer.id);
    const totalDue = transactions.reduce((sum, t) => sum + t.amountDue, 0);
    const totalPaid = transactions.reduce((sum, t) => sum + t.amountPaid, 0);
    const outstanding = totalDue - totalPaid;

    return { customer, sessions: sessions.length, transactions: transactions.length, totalDue, totalPaid, outstanding };
  });

  const filtered = search
    ? customersWithStats.filter(c =>
        c.customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.customer.trackingId?.toLowerCase().includes(search.toLowerCase())
      )
    : customersWithStats;

  const selected = selectedId ? customersWithStats.find(c => c.customer.id === selectedId) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">Customer profiles and visit history</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
          {filtered.map(({ customer, sessions, totalDue, totalPaid, outstanding }) => (
            <Card
              key={customer.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedId === customer.id ? 'ring-2 ring-primary-500 border-primary-200' : ''
              }`}
              onClick={() => setSelectedId(customer.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{customer.name || 'Anonymous'}</p>
                  <p className="text-xs text-slate-400">{customer.trackingId} • {sessions} visits</p>
                </div>
                {outstanding > 0 && (
                  <span className="text-xs font-medium text-red-600">{outstanding} ETB</span>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Customer Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users size={32} className="text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selected.customer.name || 'Anonymous Customer'}</h2>
                    <p className="text-sm text-slate-400">{selected.customer.trackingId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Visits</p>
                    <p className="text-xl font-bold text-slate-800">{selected.sessions}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Services</p>
                    <p className="text-xl font-bold text-slate-800">{selected.transactions}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Total Due</p>
                    <p className="text-xl font-bold text-slate-800">{selected.totalDue.toLocaleString()} ETB</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Outstanding</p>
                    <p className={`text-xl font-bold ${selected.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {selected.outstanding.toLocaleString()} ETB
                    </p>
                  </div>
                </div>
              </Card>

              {/* Service History */}
              <Card className="p-5">
                <h3 className="font-semibold text-slate-700 mb-4">Service History</h3>
                <div className="space-y-2">
                  {s.sessions
                    .filter(sess => sess.customerId === selectedId)
                    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
                    .slice(0, 10)
                    .map(session => {
                      const service = s.services.find(sv => sv.id === session.serviceId);
                      const chair = s.chairs.find(c => c.id === session.chairId);
                      return (
                        <div key={session.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Scissors size={14} className="text-slate-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">{service?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400">{chair?.name} • {new Date(session.startedAt).toLocaleDateString()}</p>
                          </div>
                          <span className="text-sm font-medium text-slate-600">{service?.price} ETB</span>
                          <Badge status={session.state}>{session.state.replace('_', ' ')}</Badge>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Users size={48} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400">Select a customer to view details</p>
              <p className="text-xs text-slate-300 mt-1">Customer identity is optional — AI uses temporary tracking IDs</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
