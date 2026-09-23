import { useStore } from '../store';
import { Card, Badge, StatCard } from '../components/Layout';
import { UserCheck, Users, Clock, Armchair, Scissors } from 'lucide-react';

export function Barbers() {
  const s = useStore();

  const barberStats = s.barbers.map(barber => {
    const sessions = s.sessions.filter(sess => sess.barberId === barber.id && sess.state === 'COMPLETED');
    const avgDuration = sessions.length > 0
      ? Math.round(sessions.reduce((sum, sess) => {
          if (!sess.endedAt) return sum;
          return sum + (new Date(sess.endedAt).getTime() - new Date(sess.startedAt).getTime()) / 60000;
        }, 0) / sessions.length)
      : 0;
    const customers = new Set(sessions.map(sess => sess.trackingId)).size;
    const currentChair = barber.currentChairId ? s.chairs.find(c => c.id === barber.currentChairId) : null;

    return { barber, sessions: sessions.length, avgDuration, customers, currentChair };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Barbers</h1>
        <p className="text-sm text-slate-500 mt-1">Team performance and current status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barberStats.map(({ barber, sessions, avgDuration, customers, currentChair }) => (
          <Card key={barber.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserCheck size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{barber.name}</h3>
                  <Badge status={barber.active ? 'ONLINE' : 'OFFLINE'}>
                    {barber.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Users size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Customers</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{customers}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Scissors size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Services</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{sessions}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Avg Duration</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{avgDuration}<span className="text-sm text-slate-400"> min</span></p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Armchair size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Current Chair</span>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {currentChair ? currentChair.name : '—'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
