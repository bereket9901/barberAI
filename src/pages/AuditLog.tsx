import { useStore } from '../store';
import { Card, Badge } from '../components/Layout';
import { ScrollText, Shield, Clock, User } from 'lucide-react';

export function AuditLog() {
  const s = useStore();

  const logs = [...s.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield size={24} className="text-primary-500" />
            Audit Log
          </h1>
          <p className="text-sm text-slate-500 mt-1">Owner-only access • Complete activity history</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg">
          <Shield size={14} className="text-primary-600" />
          <span className="text-xs font-medium text-primary-700">OWNER ONLY</span>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Time</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Action</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Entity</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Previous</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">New Value</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <User size={12} className="text-slate-400" />
                      <span className="text-sm text-slate-700">{log.userName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={
                      log.action.includes('CORRECTION') ? 'MANUAL_CORRECTION' :
                      log.action.includes('PAYMENT') ? 'PAID' :
                      log.action.includes('DISCOUNT') ? 'PRICE_MISMATCH' :
                      log.action.includes('INVENTORY') ? 'SERVICE_MISMATCH' :
                      'MATCHED'
                    }>
                      {log.action.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600">{log.entity}</span>
                    <span className="text-xs text-slate-400 ml-1">#{log.entityId.slice(-6)}</span>
                  </td>
                  <td className="py-3 px-4">
                    {log.previousValue && (
                      <span className="text-sm text-red-500 line-through">{log.previousValue}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {log.newValue && (
                      <span className="text-sm text-green-600 font-medium">{log.newValue}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {log.reason && (
                      <span className="text-xs text-slate-500 italic">{log.reason}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {logs.length === 0 && (
        <Card className="p-12 text-center">
          <ScrollText size={48} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400">No audit entries yet</p>
        </Card>
      )}
    </div>
  );
}
