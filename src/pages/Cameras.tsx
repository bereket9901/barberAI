import { useStore } from '../store';
import { Card, Badge, StatCard } from '../components/Layout';
import { Camera as CameraIcon, Wifi, WifiOff, Armchair, Clock, Video } from 'lucide-react';

export function Cameras() {
  const s = useStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Camera Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">Manage cameras and their chair assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {s.cameras.map(camera => (
          <Card key={camera.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  camera.status === 'ONLINE' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Video size={20} className={camera.status === 'ONLINE' ? 'text-green-600' : 'text-red-600'} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{camera.name}</h3>
                  <p className="text-xs text-slate-400">ID: {camera.id}</p>
                </div>
              </div>
              <Badge status={camera.status}>{camera.status}</Badge>
            </div>

            {/* Simulated Stream */}
            <div className="bg-slate-900 rounded-lg h-40 flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              {camera.status === 'ONLINE' ? (
                <div className="relative z-10 text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2 animate-pulse-dot" />
                  <p className="text-xs text-slate-400">Live Feed (Simulated)</p>
                  <p className="text-xs text-slate-500 mt-1">{camera.streamUrl}</p>
                </div>
              ) : (
                <div className="relative z-10 text-center">
                  <WifiOff size={24} className="mx-auto text-red-400 mb-2" />
                  <p className="text-xs text-red-400">Camera Offline</p>
                </div>
              )}
            </div>

            {/* Assigned Chairs */}
            <div className="mb-3">
              <p className="text-xs text-slate-400 mb-2">Assigned Chairs</p>
              <div className="flex gap-2">
                {camera.chairIds.map(chairId => {
                  const chair = s.chairs.find(c => c.id === chairId);
                  const hasSession = s.activeSessions.some(sess => sess.chairId === chairId);
                  return (
                    <div key={chairId} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                      hasSession ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <Armchair size={14} className={hasSession ? 'text-blue-500' : 'text-slate-400'} />
                      <span className="text-sm font-medium">{chair?.name}</span>
                      {hasSession && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-dot" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heartbeat */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400">
                  Last heartbeat: {new Date(camera.lastHeartbeat).toLocaleTimeString()}
                </span>
              </div>
              {camera.status === 'ONLINE' && (
                <div className="flex items-center gap-1">
                  <Wifi size={14} className="text-green-500" />
                  <span className="text-xs text-green-600">Connected</span>
                </div>
              )}
            </div>

            {/* Recent AI Events */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-2">Recent AI Events</p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {s.sessions
                  .flatMap(sess => sess.events.filter(e => e.cameraId === camera.id))
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      <span className="text-slate-600">{event.eventType.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Architecture Note */}
      <Card className="p-5 bg-slate-50">
        <h3 className="font-semibold text-slate-700 mb-2">Camera Architecture</h3>
        <p className="text-sm text-slate-500">
          Cameras can cover multiple chairs. The system supports future integration with RTSP, IP cameras, WebRTC, and USB cameras.
          AI vision processing is abstracted through a provider interface (currently using MockVisionProvider for demo).
        </p>
        <div className="mt-3 flex gap-4 text-xs text-slate-400">
          <span>✓ Multi-chair coverage</span>
          <span>✓ Provider abstraction</span>
          <span>✓ Future: RTSP/WebRTC</span>
        </div>
      </Card>
    </div>
  );
}
