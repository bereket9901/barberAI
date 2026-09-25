import { useStore } from '../store';
import { Card, Badge } from '../components/Layout';
import { Clock, User, Scissors, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LiveShop() {
  const s = useStore();
  const navigate = useNavigate();

  const getChairStatus = (chairId: string) => {
    const activeSession = s.activeSessions.find(sess => sess.chairId === chairId);
    if (activeSession) {
      const service = s.services.find(sv => sv.id === activeSession.serviceId);
      const barber = s.barbers.find(b => b.id === activeSession.barberId);
      const duration = Math.floor((Date.now() - new Date(activeSession.startedAt).getTime()) / 60000);
      return { occupied: true, session: activeSession, service, barber, duration };
    }
    return { occupied: false };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Shop Monitor</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time chair status and AI observations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
          <span className="text-sm text-slate-500">Live</span>
        </div>
      </div>

      {/* Chair Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {s.chairs.map(chair => {
          const status = getChairStatus(chair.id);
          return (
            <Card
              key={chair.id}
              className={`p-5 transition-all cursor-pointer hover:shadow-md ${
                status.occupied ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'
              }`}
              onClick={() => {
                if (status.occupied && status.session) {
                  navigate(`/sessions/${status.session.id}`);
                }
              }}
            >
              {/* Chair Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">{chair.name}</h3>
                <Badge status={status.occupied ? 'OCCUPIED' : 'AVAILABLE'}>
                  {status.occupied ? 'Occupied' : 'Available'}
                </Badge>
              </div>

              {status.occupied && status.session ? (
                <div className="space-y-3">
                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {status.session.customerId
                        ? s.customers.find(c => c.id === status.session.customerId)?.name || `#${status.session.trackingId}`
                        : `#${status.session.trackingId}`}
                    </span>
                  </div>

                  {/* Barber */}
                  {status.barber && (
                    <div className="flex items-center gap-2">
                      <Scissors size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{status.barber.name}</span>
                    </div>
                  )}

                  {/* Service */}
                  {status.service && (
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-sm font-medium text-blue-800">{status.service.name}</p>
                      <p className="text-xs text-blue-600">{status.service.price} ETB</p>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-sm font-mono text-slate-700">{status.duration} min</span>
                  </div>

                  {/* AI Confidence */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">AI Confidence</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${status.session.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        {Math.round(status.session.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Session State */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <Badge status={status.session.state}>{status.session.state.replace('_', ' ')}</Badge>
                    {status.service && (
                      <span className="text-xs font-semibold text-green-600">
                        {status.service.price} ETB due
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300">
                      <path d="M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2z" />
                      <path d="M4 13v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
                      <path d="M6 19v2M18 19v2" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">Waiting for customer</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Camera Status */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Camera Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {s.cameras.map(camera => (
            <div key={camera.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              {camera.status === 'ONLINE' ? (
                <Wifi size={18} className="text-green-500" />
              ) : (
                <WifiOff size={18} className="text-red-500" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{camera.name}</p>
                <p className="text-xs text-slate-400">
                  Chairs: {camera.chairIds.map(id => s.chairs.find(c => c.id === id)?.name).join(', ')}
                </p>
              </div>
              <Badge status={camera.status}>{camera.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Recent AI Events</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {s.sessions
            .flatMap(sess => sess.events.map(e => ({ ...e, sessionTrackingId: sess.trackingId })))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 15)
            .map(event => (
              <div key={event.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50">
                <span className="text-xs font-mono text-slate-400 w-20">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                <Badge status={event.eventType === 'SERVICE_COMPLETED' ? 'COMPLETED' : event.eventType === 'CHAIR_OCCUPIED' ? 'OCCUPIED' : 'IN_PROGRESS'}>
                  {event.eventType.replace(/_/g, ' ')}
                </Badge>
                <span className="text-sm text-slate-600">
                  {s.chairs.find(c => c.id === event.chairId)?.name} • #{event.sessionTrackingId}
                </span>
                <span className="text-xs text-slate-400 ml-auto">
                  {Math.round(event.confidence * 100)}%
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
