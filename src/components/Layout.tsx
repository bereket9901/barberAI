import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Radio, Clock, Users, Scissors, Receipt,
  CreditCard, UserCheck, Armchair, Camera, Package, GitCompare,
  BarChart3, ScrollText, Settings, Menu, X, Shield, Play,
  StopCircle, AlertTriangle, Bell
} from 'lucide-react';
import { useStore, store, Alert } from '../store';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
  { path: '/live', label: 'Live Shop', icon: Radio, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
  { path: '/sessions', label: 'Sessions', icon: Clock, roles: ['OWNER', 'MANAGER'] },
  { path: '/customers', label: 'Customers', icon: Users, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
  { path: '/services', label: 'Services & Prices', icon: Scissors, roles: ['OWNER', 'MANAGER'] },
  { path: '/transactions', label: 'Transactions', icon: Receipt, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
  { path: '/payments', label: 'Payments', icon: CreditCard, roles: ['OWNER', 'MANAGER'] },
  { path: '/barbers', label: 'Barbers', icon: UserCheck, roles: ['OWNER', 'MANAGER'] },
  { path: '/chairs', label: 'Chairs', icon: Armchair, roles: ['OWNER', 'MANAGER'] },
  { path: '/cameras', label: 'Cameras', icon: Camera, roles: ['OWNER', 'MANAGER'] },
  { path: '/inventory', label: 'Inventory', icon: Package, roles: ['OWNER', 'MANAGER'] },
  { path: '/reconciliation', label: 'Reconciliation', icon: GitCompare, roles: ['OWNER', 'MANAGER'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
  { path: '/audit', label: 'Audit Log', icon: ScrollText, roles: ['OWNER'] },
  { path: '/settings', label: 'Settings', icon: Settings, roles: ['OWNER'] },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const s = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const role = s.currentUser.role;
  const unresolvedAlerts = s.alerts.filter(a => !a.resolved).length;

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💈</span>
            <div>
              <h1 className="font-bold text-lg leading-tight">BarberAI</h1>
              <p className="text-xs text-slate-400">Business Control</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Demo mode indicator */}
        {s.demoMode && (
          <div className="mx-3 mt-3 p-2 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot" />
            <span className="text-xs text-green-300 font-medium">DEMO MODE ACTIVE</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {filteredNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-slate-400" />
            <select
              value={role}
              onChange={(e) => store.switchRole(e.target.value as any)}
              className="flex-1 bg-slate-800 text-xs text-slate-300 rounded px-2 py-1 border border-slate-600"
            >
              <option value="OWNER">Owner</option>
              <option value="MANAGER">Manager</option>
              <option value="CASHIER">Cashier</option>
            </select>
          </div>
          <div className="text-xs text-slate-400 truncate">
            {s.currentUser.name} • {s.currentShop.name}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {filteredNav.find(n => n.path === location.pathname)?.label || 'BarberAI'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Demo button */}
            {!s.demoMode ? (
              <button
                onClick={() => store.startDemo()}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <Play size={14} />
                Start Demo
              </button>
            ) : (
              <button
                onClick={() => store.stopDemo()}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <StopCircle size={14} />
                Stop Demo
              </button>
            )}
            
            {/* Alerts bell */}
            <NavLink to="/reconciliation" className="relative p-2 text-slate-500 hover:text-slate-700">
              <Bell size={20} />
              {unresolvedAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unresolvedAlerts}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ============ SHARED UI COMPONENTS ============

export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, subtext, icon: Icon, color = 'blue', trend }: {
  label: string; value: string | number; subtext?: string;
  icon?: React.ElementType; color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  trend?: 'up' | 'down' | 'neutral';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function Badge({ status, children }: { status: string; children?: React.ReactNode }) {
  const styles: Record<string, string> = {
    MATCHED: 'bg-green-100 text-green-700 border-green-200',
    UNMATCHED_AI_SERVICE: 'bg-red-100 text-red-700 border-red-200',
    UNMATCHED_TRANSACTION: 'bg-orange-100 text-orange-700 border-orange-200',
    PRICE_MISMATCH: 'bg-amber-100 text-amber-700 border-amber-200',
    SERVICE_MISMATCH: 'bg-purple-100 text-purple-700 border-purple-200',
    PAYMENT_OUTSTANDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    MANUAL_CORRECTION: 'bg-slate-100 text-slate-700 border-slate-200',
    PAID: 'bg-green-100 text-green-700 border-green-200',
    UNPAID: 'bg-red-100 text-red-700 border-red-200',
    PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
    WAITING: 'bg-slate-100 text-slate-600 border-slate-200',
    ONLINE: 'bg-green-100 text-green-700 border-green-200',
    OFFLINE: 'bg-red-100 text-red-700 border-red-200',
    ERROR: 'bg-orange-100 text-orange-700 border-orange-200',
    OCCUPIED: 'bg-blue-100 text-blue-700 border-blue-200',
    AVAILABLE: 'bg-green-100 text-green-700 border-green-200',
    WARNING: 'bg-amber-100 text-amber-700 border-amber-200',
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    INFO: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {children || status.replace(/_/g, ' ')}
    </span>
  );
}

export function AlertBanner({ alert, onDismiss }: { alert: Alert; onDismiss?: () => void }) {
  const colors: Record<string, string> = {
    WARNING: 'bg-amber-50 border-amber-200 text-amber-800',
    CRITICAL: 'bg-red-50 border-red-200 text-red-800',
    INFO: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const icons: Record<string, React.ElementType> = {
    WARNING: AlertTriangle,
    CRITICAL: AlertTriangle,
    INFO: Bell,
  };
  const Icon = icons[alert.severity] || AlertTriangle;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${colors[alert.severity] || colors.WARNING}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{alert.title}</p>
        <p className="text-xs mt-0.5 opacity-80">{alert.message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-xs font-medium underline shrink-0">
          Dismiss
        </button>
      )}
    </div>
  );
}
