import { useStore } from '../store';
import { Card, Badge } from '../components/Layout';
import { Armchair, Camera, User, Clock } from 'lucide-react';

export function Chairs() {
  const s = useStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Chairs</h1>
        <p className="text-sm text-slate-500 mt-1">Chair management and status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {s.chairs.map(chair => {
          const camera = s.cameras.find(c => c.id === chair.cameraId);
          const activeSession = s.activeSessions.find(sess => sess.chairId === chair.id);
          const todaySessions = s.sessions.filter(sess => sess.chairId === chair.id && sess.state === 'COMPLETED');
          const todayTx = s.transactions.filter(t => t.chairId === chair.id);

          return (
            <Card key={chair.id} className={`p-5 ${activeSession ? 'border-blue-200' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeSession ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    <Armchair size={24} className={activeSession ? 'text-blue-600' : 'text-slate-400'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{chair.name}</h3>
                    <Badge status={activeSession ? 'OCCUPIED' : 'AVAILABLE'}>
                      {activeSession ? 'Occupied' : 'Available'}
                    </Badge>
                  </div>
                </div>
              </div>

              {activeSession ? (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-slate-400" />
                    <span className="text-slate-600">#{activeSession.trackingId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-slate-600">
                      {Math.round((Date.now() - new Date(activeSession.startedAt).getTime()) / 60000)} min
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 mb-4">No active session</p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Today's Services</p>
                  <p className="text-lg font-bold text-slate-700">{todaySessions.length}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Today's Transactions</p>
                  <p className="text-lg font-bold text-slate-700">{todayTx.length}</p>
                </div>
              </div>

              {camera && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Camera size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{camera.name}</span>
                  <Badge status={camera.status}>{camera.status}</Badge>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
