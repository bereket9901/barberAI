import { useStore, store } from '../store';
import { Card, StatCard, Badge, AlertBanner } from '../components/Layout';
import {
  Scissors, Receipt, AlertTriangle, DollarSign,
  Eye, GitCompare, TrendingUp, TrendingDown, CheckCircle2,
  Radio as RadioIcon, BarChart3 as BarChart3Icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const s = useStore();
  const navigate = useNavigate();
  const data = s.getDashboardData();
  const unresolvedAlerts = s.alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Business Control — Today</h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {s.demoMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-300 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
            <span className="text-sm font-medium text-green-700">Live Demo</span>
          </div>
        )}
      </div>

      {/* Reconciliation Status Banner */}
      <Card className={`p-4 ${data.isReconciled ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-center gap-3">
          {data.isReconciled ? (
            <>
              <CheckCircle2 size={24} className="text-green-600" />
              <div>
                <p className="font-semibold text-green-800">✓ BUSINESS RECORDS RECONCILED</p>
                <p className="text-sm text-green-600">All AI observations match staff records.</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle size={24} className="text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">⚠ RECONCILIATION REQUIRED</p>
                <p className="text-sm text-amber-600">
                  {data.difference > 0 ? `${data.difference} services require review` : 'Discrepancies detected between AI observations and staff records.'}
                  {data.amountDifference !== 0 && ` • ${data.amountDifference.toLocaleString()} ETB difference`}
                </p>
              </div>
              <button
                onClick={() => navigate('/reconciliation')}
                className="ml-auto px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                Review Now
              </button>
            </>
          )}
        </div>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Customers Observed"
          value={data.aiObserved}
          icon={Eye}
          color="blue"
          subtext="AI-detected today"
        />
        <StatCard
          label="Services Observed"
          value={data.aiObserved}
          icon={Scissors}
          color="purple"
          subtext="Completed per AI"
        />
        <StatCard
          label="Transactions Recorded"
          value={data.recorded}
          icon={Receipt}
          color="green"
          subtext="Staff recorded today"
        />
        <StatCard
          label="Unreconciled Services"
          value={data.difference}
          icon={AlertTriangle}
          color={data.difference > 0 ? 'red' : 'green'}
          subtext={data.difference > 0 ? 'Require review' : 'All matched'}
        />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-blue-500" />
            <h3 className="font-semibold text-slate-700">AI Expected Value</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{data.expectedValue.toLocaleString()} ETB</p>
          <p className="text-xs text-slate-400 mt-1">Based on AI-observed services</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={18} className="text-green-500" />
            <h3 className="font-semibold text-slate-700">Recorded Value</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{data.recordedValue.toLocaleString()} ETB</p>
          <p className="text-xs text-slate-400 mt-1">Staff-recorded transactions</p>
        </Card>
        <Card className={`p-5 ${data.amountDifference > 0 ? 'border-red-200' : 'border-green-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            {data.amountDifference > 0 ? (
              <TrendingDown size={18} className="text-red-500" />
            ) : (
              <CheckCircle2 size={18} className="text-green-500" />
            )}
            <h3 className="font-semibold text-slate-700">Difference</h3>
          </div>
          <p className={`text-3xl font-bold ${data.amountDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {data.amountDifference > 0 ? '-' : ''}{Math.abs(data.amountDifference).toLocaleString()} ETB
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {data.amountDifference > 0 ? 'Reconciliation discrepancy' : 'Fully reconciled'}
          </p>
        </Card>
      </div>

      {/* Chair Analytics */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Chair Analytics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Chair</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">AI Services</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Recorded</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Difference</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.chairStats.map(cs => (
                <tr key={cs.chair.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => navigate('/sessions')}>
                  <td className="py-3 px-3 font-medium text-slate-700">{cs.chair.name}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{cs.aiServices}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{cs.recorded}</td>
                  <td className={`py-3 px-3 text-right font-semibold ${cs.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {cs.difference > 0 ? `+${cs.difference}` : cs.difference}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Badge status={cs.difference === 0 ? 'MATCHED' : 'UNMATCHED_AI_SERVICE'}>
                      {cs.difference === 0 ? 'Reconciled' : 'Review'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Alerts Section */}
      {unresolvedAlerts.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Reconciliation Alerts ({unresolvedAlerts.length})
          </h3>
          <div className="space-y-3">
            {unresolvedAlerts.slice(0, 5).map(alert => (
              <AlertBanner
                key={alert.id}
                alert={alert}
                onDismiss={() => store.resolveAlert(alert.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/live')}
          className="Card p-4 text-left hover:border-primary-300 hover:shadow-md transition-all"
        >
          <RadioIcon size={24} className="text-primary-500 mb-2" />
          <p className="font-semibold text-slate-700">Live Shop</p>
          <p className="text-xs text-slate-400">{data.activeChairs} active chairs</p>
        </button>
        <button
          onClick={() => navigate('/reconciliation')}
          className="Card p-4 text-left hover:border-primary-300 hover:shadow-md transition-all"
        >
          <GitCompare size={24} className="text-primary-500 mb-2" />
          <p className="font-semibold text-slate-700">Reconciliation</p>
          <p className="text-xs text-slate-400">{data.difference} items to review</p>
        </button>
        <button
          onClick={() => navigate('/reports')}
          className="Card p-4 text-left hover:border-primary-300 hover:shadow-md transition-all"
        >
          <BarChart3Icon size={24} className="text-primary-500 mb-2" />
          <p className="font-semibold text-slate-700">Daily Report</p>
          <p className="text-xs text-slate-400">View today's summary</p>
        </button>
      </div>
    </div>
  );
}


