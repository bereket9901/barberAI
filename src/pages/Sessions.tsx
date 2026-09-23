import { useState } from 'react';
import { useStore, store, ServiceSession } from '../store';
import { Card, Badge } from '../components/Layout';
import { Clock, User, Scissors, Armchair, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export function Sessions() {
  const s = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'unmatched'>('all');

  let sessions = [...s.sessions].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  if (filter === 'completed') sessions = sessions.filter(s => s.state === 'COMPLETED');
  if (filter === 'in_progress') sessions = sessions.filter(s => s.state === 'IN_PROGRESS');
  if (filter === 'unmatched') {
    const matchedSessionIds = s.transactions.map(t => t.sessionId);
    sessions = sessions.filter(sess => sess.state === 'COMPLETED' && !matchedSessionIds.includes(sess.id));
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Service Sessions</h1>
        <div className="flex gap-2">
          {(['all', 'in_progress', 'completed', 'unmatched'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'Active' : f === 'completed' ? 'Completed' : 'Unmatched'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {sessions.slice(0, 50).map(session => {
          const service = s.services.find(sv => sv.id === session.serviceId);
          const barber = s.barbers.find(b => b.id === session.barberId);
          const chair = s.chairs.find(c => c.id === session.chairId);
          const tx = s.transactions.find(t => t.sessionId === session.id);
          const duration = session.endedAt
            ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
            : Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000);

          return (
            <Card
              key={session.id}
              className="p-4 hover:shadow-md cursor-pointer transition-all"
              onClick={() => navigate(`/sessions/${session.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-slate-400">#{session.id.slice(-6)}</span>
                    <Badge status={session.state}>{session.state.replace('_', ' ')}</Badge>
                    {tx && <Badge status={tx.reconciliationStatus}>{tx.reconciliationStatus.replace(/_/g, ' ')}</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Scissors size={14} />
                      {service?.name || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Armchair size={14} />
                      {chair?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {barber?.name || 'Unassigned'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {duration} min
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {service && <p className="font-semibold text-slate-700">{service.price} ETB</p>}
                  <p className="text-xs text-slate-400">
                    {new Date(session.startedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const navigate = useNavigate();
  const session = s.sessions.find(sess => sess.id === id);

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Session not found</p>
        <button onClick={() => navigate('/sessions')} className="mt-4 text-primary-600 font-medium">
          ← Back to Sessions
        </button>
      </div>
    );
  }

  const service = s.services.find(sv => sv.id === session.serviceId);
  const barber = s.barbers.find(b => b.id === session.barberId);
  const chair = s.chairs.find(c => c.id === session.chairId);
  const customer = session.customerId ? s.customers.find(c => c.id === session.customerId) : null;
  const tx = s.transactions.find(t => t.sessionId === session.id);
  const payments = tx ? s.payments.filter(p => p.transactionId === tx.id) : [];
  const duration = session.endedAt
    ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
    : Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/sessions')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={16} /> Back to Sessions
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">SESSION #{session.id.slice(-5).toUpperCase()}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge status={session.state}>{session.state.replace('_', ' ')}</Badge>
            {tx && <Badge status={tx.reconciliationStatus}>{tx.reconciliationStatus.replace(/_/g, ' ')}</Badge>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-slate-800">{Math.round(session.confidence * 100)}%</p>
          <p className="text-xs text-slate-400">AI Confidence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Session Details */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Session Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Customer</span>
              <span className="text-sm font-medium text-slate-700">
                {customer?.name || `#${session.trackingId}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Chair</span>
              <span className="text-sm font-medium text-slate-700">{chair?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Barber</span>
              <span className="text-sm font-medium text-slate-700">{barber?.name || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Service</span>
              <span className="text-sm font-medium text-slate-700">{service?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Started</span>
              <span className="text-sm font-medium text-slate-700">
                {new Date(session.startedAt).toLocaleTimeString()}
              </span>
            </div>
            {session.endedAt && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Ended</span>
                <span className="text-sm font-medium text-slate-700">
                  {new Date(session.endedAt).toLocaleTimeString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Duration</span>
              <span className="text-sm font-medium text-slate-700">{duration} minutes</span>
            </div>
            {service && (
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <span className="text-sm text-slate-500">Expected Amount</span>
                <span className="text-sm font-bold text-slate-800">{service.price} ETB</span>
              </div>
            )}
          </div>
        </Card>

        {/* Transaction & Payment */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Transaction & Payment</h3>
          {tx ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Transaction</span>
                <Badge status={tx.reconciliationStatus}>{tx.reconciliationStatus.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Amount Due</span>
                <span className="text-sm font-medium text-slate-700">{tx.amountDue} ETB</span>
              </div>
              {tx.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Discount</span>
                  <span className="text-sm font-medium text-green-600">-{tx.discount} ETB</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Amount Paid</span>
                <span className="text-sm font-medium text-slate-700">{tx.amountPaid} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <Badge status={tx.status}>{tx.status.replace(/_/g, ' ')}</Badge>
              </div>
              {payments.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Payments</p>
                  {payments.map(p => (
                    <div key={p.id} className="flex justify-between text-sm py-1">
                      <span className="text-slate-600">{p.method.replace('_', ' ')}</span>
                      <span className="font-medium">{p.amount} ETB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertTriangle size={32} className="mx-auto text-amber-400 mb-2" />
              <p className="text-sm font-medium text-amber-700">No matching transaction</p>
              <p className="text-xs text-slate-400 mt-1">AI observed this service but staff did not record it.</p>
            </div>
          )}
        </Card>
      </div>

      {/* AI Event Timeline */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">AI Event Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-4">
            {session.events
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((event, idx) => (
                <div key={event.id} className="flex items-start gap-4 pl-0">
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    event.eventType === 'SERVICE_COMPLETED' ? 'bg-green-100' :
                    event.eventType === 'SERVICE_STARTED' ? 'bg-blue-100' :
                    event.eventType === 'CHAIR_OCCUPIED' ? 'bg-purple-100' :
                    'bg-slate-100'
                  }`}>
                    {event.eventType === 'SERVICE_COMPLETED' ? (
                      <CheckCircle2 size={14} className="text-green-600" />
                    ) : (
                      <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium text-slate-700">
                      {event.eventType.replace(/_/g, ' ')}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {Math.round(event.confidence * 100)}% confidence
                      </span>
                      <span className="text-xs text-slate-400">
                        {s.chairs.find(c => c.id === event.chairId)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
