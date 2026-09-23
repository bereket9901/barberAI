import { useStore } from '../store';
import { Card, Badge } from '../components/Layout';
import { Settings as SettingsIcon, Building, Users, Shield, Camera, Clock } from 'lucide-react';

export function Settings() {
  const s = useStore();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">System configuration and preferences</p>
      </div>

      {/* Shop Info */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Building size={18} className="text-primary-500" />
          Shop Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Shop Name</label>
            <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">{s.currentShop.name}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Address</label>
            <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">{s.currentShop.address}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Phone</label>
            <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">{s.currentShop.phone}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Currency</label>
            <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">{s.currentShop.currency}</p>
          </div>
        </div>
      </Card>

      {/* Users */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Users size={18} className="text-primary-500" />
          Users & Roles
        </h3>
        <div className="space-y-2">
          {s.users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <Badge status={user.role === 'OWNER' ? 'CRITICAL' : user.role === 'MANAGER' ? 'WARNING' : 'MATCHED'}>
                {user.role}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* System Configuration */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <SettingsIcon size={18} className="text-primary-500" />
          System Configuration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">Session Timeout</p>
              <p className="text-xs text-slate-400">Time before an inactive session is auto-completed</p>
            </div>
            <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded border">60 seconds</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">AI Confidence Threshold</p>
              <p className="text-xs text-slate-400">Minimum confidence for auto-matching</p>
            </div>
            <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded border">85%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">Reconciliation Window</p>
              <p className="text-xs text-slate-400">Time window for matching AI events to transactions</p>
            </div>
            <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded border">5 minutes</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">AI Observations Immutable</p>
              <p className="text-xs text-slate-400">AI data cannot be deleted, only corrected with audit trail</p>
            </div>
            <Badge status="COMPLETED">Enabled</Badge>
          </div>
        </div>
      </Card>

      {/* AI Provider */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Camera size={18} className="text-primary-500" />
          AI Vision Provider
        </h3>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Badge status="IN_PROGRESS">ACTIVE</Badge>
            <span className="text-sm font-medium text-blue-800">MockVisionProvider</span>
          </div>
          <p className="text-xs text-blue-600">
            Currently using simulated AI vision for demo mode. The system supports future integration with:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-white rounded text-xs text-slate-600 border">Ollama / Qwen Vision</span>
            <span className="px-2 py-1 bg-white rounded text-xs text-slate-600 border">Gemini Vision</span>
            <span className="px-2 py-1 bg-white rounded text-xs text-slate-600 border">YOLO</span>
            <span className="px-2 py-1 bg-white rounded text-xs text-slate-600 border">Custom Models</span>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-primary-500" />
          Security & Access Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Authentication</p>
            <p className="text-sm font-medium text-green-800">JWT Token-Based</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Password Security</p>
            <p className="text-sm font-medium text-green-800">Bcrypt Hashing</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Data Isolation</p>
            <p className="text-sm font-medium text-green-800">Shop-Level (shopId)</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Rate Limiting</p>
            <p className="text-sm font-medium text-green-800">Enabled</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
