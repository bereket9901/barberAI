import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LiveShop } from './pages/LiveShop';
import { Sessions, SessionDetail } from './pages/Sessions';
import { Transactions } from './pages/Transactions';
import { Reconciliation } from './pages/Reconciliation';
import { Services } from './pages/Services';
import { Inventory } from './pages/Inventory';
import { Cameras } from './pages/Cameras';
import { Barbers } from './pages/Barbers';
import { Customers } from './pages/Customers';
import { Chairs } from './pages/Chairs';
import { Payments } from './pages/Payments';
import { Reports } from './pages/Reports';
import { AuditLog } from './pages/AuditLog';
import { Settings } from './pages/Settings';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live" element={<LiveShop />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/barbers" element={<Barbers />} />
          <Route path="/chairs" element={<Chairs />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reconciliation" element={<Reconciliation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
