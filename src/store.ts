import { v4 as uuidv4 } from 'uuid';

// ============ TYPES ============
export type UserRole = 'OWNER' | 'MANAGER' | 'CASHIER' | 'BARBER';
export type PaymentMethod = 'CASH' | 'TELEBIRR' | 'CBE_BIRR' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';
export type TransactionStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';
export type ReconciliationStatus = 'MATCHED' | 'UNMATCHED_AI_SERVICE' | 'UNMATCHED_TRANSACTION' | 'PRICE_MISMATCH' | 'SERVICE_MISMATCH' | 'PAYMENT_OUTSTANDING' | 'MANUAL_CORRECTION';
export type AIEventType = 'PERSON_DETECTED' | 'PERSON_ENTERED' | 'CHAIR_OCCUPIED' | 'SERVICE_STARTED' | 'SERVICE_DETECTED' | 'PERSON_LEAVING' | 'SERVICE_COMPLETED' | 'CHAIR_EMPTY';
export type SessionState = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InventoryMovementType = 'PURCHASE' | 'CONSUMPTION' | 'WASTE' | 'ADJUSTMENT' | 'CORRECTION';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'ERROR';

export interface User {
  id: string; name: string; email: string; role: UserRole; shopId: string;
}
export interface Shop {
  id: string; name: string; address: string; phone: string; currency: string;
}
export interface Barber {
  id: string; shopId: string; name: string; active: boolean; currentChairId?: string;
}
export interface Chair {
  id: string; shopId: string; name: string; cameraId?: string; active: boolean;
}
export interface Camera {
  id: string; shopId: string; name: string; status: CameraStatus; streamUrl: string;
  chairIds: string[]; lastHeartbeat: string;
}
export interface Customer {
  id: string; shopId: string; trackingId?: string; name?: string; phone?: string; visits: number;
}
export interface Service {
  id: string; shopId: string; name: string; price: number; duration: number; active: boolean;
}
export interface ServiceSession {
  id: string; shopId: string; chairId: string; barberId?: string; customerId?: string;
  trackingId: string; serviceId?: string; state: SessionState;
  startedAt: string; endedAt?: string; confidence: number;
  events: AIEvent[];
}
export interface AIEvent {
  id: string; sessionId: string; cameraId: string; chairId: string;
  trackingId: string; eventType: AIEventType; confidence: number;
  timestamp: string; serviceId?: string;
}
export interface Transaction {
  id: string; shopId: string; sessionId?: string; customerId?: string;
  barberId?: string; chairId?: string; serviceId?: string;
  amountDue: number; discount: number; amountPaid: number;
  status: TransactionStatus; reconciliationStatus: ReconciliationStatus;
  createdAt: string; items: TransactionItem[];
}
export interface TransactionItem {
  id: string; serviceId: string; serviceName: string; price: number; quantity: number;
}
export interface Payment {
  id: string; transactionId: string; amount: number; method: PaymentMethod;
  reference?: string; notes?: string; recordedBy: string; recordedAt: string;
}
export interface InventoryItem {
  id: string; shopId: string; name: string; unit: string; quantity: number;
  minQuantity: number; active: boolean;
}
export interface InventoryMovement {
  id: string; inventoryItemId: string; type: InventoryMovementType;
  quantity: number; notes?: string; recordedAt: string; recordedBy: string;
}
export interface ServiceConsumptionRule {
  id: string; serviceId: string; inventoryItemId: string; quantity: number;
}
export interface AuditLogEntry {
  id: string; timestamp: string; userId: string; userName: string;
  action: string; entity: string; entityId: string;
  previousValue?: string; newValue?: string; reason?: string;
}
export interface Alert {
  id: string; shopId: string; severity: AlertSeverity; title: string;
  message: string; entityId?: string; entityType?: string;
  createdAt: string; resolved: boolean;
}

// ============ SEED DATA ============
const SHOP_ID = 'shop-001';
const now = new Date();
const today = now.toISOString().split('T')[0];

function timeAgo(minutes: number): string {
  const d = new Date(now.getTime() - minutes * 60000);
  return d.toISOString();
}

export const seedShops: Shop[] = [
  { id: SHOP_ID, name: 'Addis Barber Studio', address: 'Bole Road, Addis Ababa', phone: '+251911234567', currency: 'ETB' }
];

export const seedUsers: User[] = [
  { id: 'user-001', name: 'Dawit Tesfaye', email: 'dawit@barberai.com', role: 'OWNER', shopId: SHOP_ID },
  { id: 'user-002', name: 'Abel Mekonnen', email: 'abel@barberai.com', role: 'MANAGER', shopId: SHOP_ID },
  { id: 'user-003', name: 'Sara Hailu', email: 'sara@barberai.com', role: 'CASHIER', shopId: SHOP_ID },
];

export const seedBarbers: Barber[] = [
  { id: 'barber-001', shopId: SHOP_ID, name: 'Abel Mekonnen', active: true, currentChairId: 'chair-001' },
  { id: 'barber-002', shopId: SHOP_ID, name: 'Yonas Bekele', active: true, currentChairId: 'chair-002' },
  { id: 'barber-003', shopId: SHOP_ID, name: 'Kidus Alemu', active: true, currentChairId: 'chair-003' },
  { id: 'barber-004', shopId: SHOP_ID, name: 'Daniel Girma', active: true },
];

export const seedChairs: Chair[] = [
  { id: 'chair-001', shopId: SHOP_ID, name: 'Chair 1', cameraId: 'camera-001', active: true },
  { id: 'chair-002', shopId: SHOP_ID, name: 'Chair 2', cameraId: 'camera-001', active: true },
  { id: 'chair-003', shopId: SHOP_ID, name: 'Chair 3', cameraId: 'camera-002', active: true },
  { id: 'chair-004', shopId: SHOP_ID, name: 'Chair 4', cameraId: 'camera-002', active: true },
];

export const seedCameras: Camera[] = [
  { id: 'camera-001', shopId: SHOP_ID, name: 'Camera 1 — Front', status: 'ONLINE', streamUrl: 'rtsp://192.168.1.101:554/stream1', chairIds: ['chair-001', 'chair-002'], lastHeartbeat: timeAgo(0) },
  { id: 'camera-002', shopId: SHOP_ID, name: 'Camera 2 — Back', status: 'ONLINE', streamUrl: 'rtsp://192.168.1.102:554/stream2', chairIds: ['chair-003', 'chair-004'], lastHeartbeat: timeAgo(1) },
];

export const seedServices: Service[] = [
  { id: 'svc-001', shopId: SHOP_ID, name: 'Haircut', price: 400, duration: 30, active: true },
  { id: 'svc-002', shopId: SHOP_ID, name: 'Haircut + Beard', price: 500, duration: 45, active: true },
  { id: 'svc-003', shopId: SHOP_ID, name: 'Kids Haircut', price: 300, duration: 20, active: true },
  { id: 'svc-004', shopId: SHOP_ID, name: 'Haircut + Coloring', price: 800, duration: 90, active: true },
  { id: 'svc-005', shopId: SHOP_ID, name: 'Shaving', price: 200, duration: 20, active: true },
];

export const seedCustomers: Customer[] = Array.from({ length: 20 }, (_, i) => ({
  id: `cust-${String(i + 1).padStart(3, '0')}`,
  shopId: SHOP_ID,
  trackingId: `CUST-${1000 + i}`,
  name: ['Abebe Kebede', 'Tadesse Wolde', 'Mulugeta Assefa', 'Haile Mariam', 'Getachew Reda', 'Fikadu Lemma', 'Birhane Teshome', 'Solomon Girma', 'Yared Mekonnen', 'Dereje Abebe', 'Tsegaye Worku', 'Amanuel Tesfa', 'Kibrom Hailu', 'Nahom Bekele', 'Robel Desta', 'Henok Tadesse', 'Mikiyas Solomon', 'Eyob Fikadu', 'Samuel Yohannes', 'Bereket Alemu'][i],
  visits: Math.floor(Math.random() * 15) + 3,
}));

export const seedInventoryItems: InventoryItem[] = [
  { id: 'inv-001', shopId: SHOP_ID, name: 'Shampoo', unit: 'L', quantity: 8.2, minQuantity: 3, active: true },
  { id: 'inv-002', shopId: SHOP_ID, name: 'Beard Oil', unit: 'L', quantity: 1.4, minQuantity: 2, active: true },
  { id: 'inv-003', shopId: SHOP_ID, name: 'Hair Color', unit: 'L', quantity: 3.8, minQuantity: 2, active: true },
  { id: 'inv-004', shopId: SHOP_ID, name: 'Developer', unit: 'L', quantity: 2.1, minQuantity: 2, active: true },
  { id: 'inv-005', shopId: SHOP_ID, name: 'Aftershave', unit: 'L', quantity: 4.5, minQuantity: 2, active: true },
  { id: 'inv-006', shopId: SHOP_ID, name: 'Hair Gel', unit: 'L', quantity: 5.0, minQuantity: 2, active: true },
];

export const seedConsumptionRules: ServiceConsumptionRule[] = [
  { id: 'rule-001', serviceId: 'svc-001', inventoryItemId: 'inv-001', quantity: 0.02 },
  { id: 'rule-002', serviceId: 'svc-001', inventoryItemId: 'inv-006', quantity: 0.01 },
  { id: 'rule-003', serviceId: 'svc-002', inventoryItemId: 'inv-001', quantity: 0.02 },
  { id: 'rule-004', serviceId: 'svc-002', inventoryItemId: 'inv-002', quantity: 0.005 },
  { id: 'rule-005', serviceId: 'svc-002', inventoryItemId: 'inv-005', quantity: 0.002 },
  { id: 'rule-006', serviceId: 'svc-004', inventoryItemId: 'inv-003', quantity: 0.05 },
  { id: 'rule-007', serviceId: 'svc-004', inventoryItemId: 'inv-004', quantity: 0.05 },
  { id: 'rule-008', serviceId: 'svc-005', inventoryItemId: 'inv-002', quantity: 0.003 },
  { id: 'rule-009', serviceId: 'svc-005', inventoryItemId: 'inv-005', quantity: 0.002 },
];

// Generate historical sessions and transactions
function generateHistoricalData() {
  const sessions: ServiceSession[] = [];
  const transactions: Transaction[] = [];
  const payments: Payment[] = [];
  const auditLogs: AuditLogEntry[] = [];
  const alerts: Alert[] = [];

  const serviceIds = ['svc-001', 'svc-002', 'svc-003', 'svc-004', 'svc-005'];
  const chairIds = ['chair-001', 'chair-002', 'chair-003', 'chair-004'];
  const barberIds = ['barber-001', 'barber-002', 'barber-003', 'barber-004'];
  const methods: PaymentMethod[] = ['CASH', 'TELEBIRR', 'CBE_BIRR', 'BANK_TRANSFER'];

  // Generate 50 historical sessions for today
  for (let i = 0; i < 50; i++) {
    const sessionId = `sess-${String(i + 1).padStart(4, '0')}`;
    const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
    const chairId = chairIds[i % 4];
    const barberId = barberIds[Math.floor(Math.random() * barberIds.length)];
    const customer = seedCustomers[Math.floor(Math.random() * seedCustomers.length)];
    const service = seedServices.find(s => s.id === serviceId)!;
    const minutesAgo = 300 - i * 5;
    const startedAt = timeAgo(minutesAgo + service.duration);
    const endedAt = timeAgo(minutesAgo);

    const session: ServiceSession = {
      id: sessionId, shopId: SHOP_ID, chairId, barberId,
      customerId: customer.id, trackingId: customer.trackingId!,
      serviceId, state: 'COMPLETED',
      startedAt, endedAt, confidence: 0.85 + Math.random() * 0.14,
      events: [
        { id: uuidv4(), sessionId, cameraId: chairId.includes('1') || chairId.includes('2') ? 'camera-001' : 'camera-002', chairId, trackingId: customer.trackingId!, eventType: 'PERSON_DETECTED', confidence: 0.95, timestamp: timeAgo(minutesAgo + service.duration + 2) },
        { id: uuidv4(), sessionId, cameraId: chairId.includes('1') || chairId.includes('2') ? 'camera-001' : 'camera-002', chairId, trackingId: customer.trackingId!, eventType: 'CHAIR_OCCUPIED', confidence: 0.97, timestamp: timeAgo(minutesAgo + service.duration + 1) },
        { id: uuidv4(), sessionId, cameraId: chairId.includes('1') || chairId.includes('2') ? 'camera-001' : 'camera-002', chairId, trackingId: customer.trackingId!, eventType: 'SERVICE_STARTED', confidence: 0.92, timestamp: startedAt, serviceId },
        { id: uuidv4(), sessionId, cameraId: chairId.includes('1') || chairId.includes('2') ? 'camera-001' : 'camera-002', chairId, trackingId: customer.trackingId!, eventType: 'SERVICE_DETECTED', confidence: 0.88, timestamp: timeAgo(minutesAgo + Math.floor(service.duration / 2)), serviceId },
        { id: uuidv4(), sessionId, cameraId: chairId.includes('1') || chairId.includes('2') ? 'camera-001' : 'camera-002', chairId, trackingId: customer.trackingId!, eventType: 'SERVICE_COMPLETED', confidence: 0.96, timestamp: endedAt, serviceId },
        { id: uuidv4(), sessionId, cameraId: chairId.includes('1') || chairId.includes('2') ? 'camera-001' : 'camera-002', chairId, trackingId: customer.trackingId!, eventType: 'CHAIR_EMPTY', confidence: 0.99, timestamp: timeAgo(minutesAgo - 1) },
      ]
    };
    sessions.push(session);

    // Create transactions for most sessions (46 out of 50 to create discrepancies)
    if (i < 46) {
      const txId = `tx-${String(i + 1).padStart(4, '0')}`;
      const isMismatch = i >= 42 && i < 46; // 4 price mismatches
      const discount = i % 7 === 0 ? 50 : 0;
      const amountDue = isMismatch ? service.price - 100 : service.price;
      const amountPaid = amountDue - discount;
      const method = methods[Math.floor(Math.random() * methods.length)];

      const tx: Transaction = {
        id: txId, shopId: SHOP_ID, sessionId, customerId: customer.id,
        barberId, chairId, serviceId,
        amountDue: isMismatch ? service.price : service.price,
        discount, amountPaid,
        status: amountPaid >= (isMismatch ? service.price : service.price) - discount ? 'PAID' : 'PARTIALLY_PAID',
        reconciliationStatus: isMismatch ? 'PRICE_MISMATCH' : 'MATCHED',
        createdAt: endedAt,
        items: [{ id: uuidv4(), serviceId, serviceName: service.name, price: isMismatch ? service.price - 100 : service.price, quantity: 1 }]
      };
      transactions.push(tx);

      const payment: Payment = {
        id: `pay-${String(i + 1).padStart(4, '0')}`,
        transactionId: txId, amount: amountPaid, method,
        reference: method === 'CASH' ? undefined : `TRX-${Math.floor(Math.random() * 900000) + 100000}`,
        recordedBy: 'user-003', recordedAt: timeAgo(minutesAgo - 2),
      };
      payments.push(payment);
    }
  }

  // Add some alerts
  alerts.push(
    { id: 'alert-001', shopId: SHOP_ID, severity: 'WARNING', title: '4 services have no matching transaction', message: 'AI observed 4 services that were not recorded by staff.', entityId: undefined, entityType: 'session', createdAt: timeAgo(30), resolved: false },
    { id: 'alert-002', shopId: SHOP_ID, severity: 'WARNING', title: 'Chair 2 has 3 unreconciled services', message: 'Multiple services at Chair 2 require review.', entityId: 'chair-002', entityType: 'chair', createdAt: timeAgo(45), resolved: false },
    { id: 'alert-003', shopId: SHOP_ID, severity: 'WARNING', title: 'Beard Oil inventory variance detected', message: 'Expected consumption differs from actual inventory movement by 200ml.', entityId: 'inv-002', entityType: 'inventory', createdAt: timeAgo(120), resolved: false },
    { id: 'alert-004', shopId: SHOP_ID, severity: 'INFO', title: '5 manual transaction corrections today', message: 'Multiple manual corrections have been applied to transactions.', createdAt: timeAgo(60), resolved: false },
    { id: 'alert-005', shopId: SHOP_ID, severity: 'CRITICAL', title: '4 price mismatches detected', message: 'AI expected different amounts than what was recorded.', createdAt: timeAgo(90), resolved: false },
  );

  // Add audit log entries
  auditLogs.push(
    { id: 'audit-001', timestamp: timeAgo(15), userId: 'user-002', userName: 'Abel Mekonnen', action: 'SERVICE_CORRECTION', entity: 'Transaction', entityId: 'tx-0043', previousValue: 'Haircut + Beard', newValue: 'Haircut', reason: 'AI classification incorrect' },
    { id: 'audit-002', timestamp: timeAgo(30), userId: 'user-003', userName: 'Sara Hailu', action: 'DISCOUNT_APPLIED', entity: 'Transaction', entityId: 'tx-0035', previousValue: '500 ETB', newValue: '450 ETB', reason: 'Loyal customer discount' },
    { id: 'audit-003', timestamp: timeAgo(60), userId: 'user-001', userName: 'Dawit Tesfaye', action: 'INVENTORY_ADJUSTMENT', entity: 'InventoryItem', entityId: 'inv-002', previousValue: '1.6 L', newValue: '1.4 L', reason: 'Physical count adjustment' },
    { id: 'audit-004', timestamp: timeAgo(90), userId: 'user-002', userName: 'Abel Mekonnen', action: 'AI_CORRECTION', entity: 'ServiceSession', entityId: 'sess-0044', previousValue: 'Haircut + Coloring', newValue: 'Haircut', reason: 'False detection - customer only got haircut' },
  );

  return { sessions, transactions, payments, auditLogs, alerts };
}

const historical = generateHistoricalData();

// ============ STATE MANAGEMENT ============
type Listener = () => void;

class Store {
  private listeners: Set<Listener> = new Set();
  
  // Core state
  currentUser: User = seedUsers[0]; // Owner by default
  currentShop: Shop = seedShops[0];
  
  // Data
  users: User[] = [...seedUsers];
  shops: Shop[] = [...seedShops];
  barbers: Barber[] = [...seedBarbers];
  chairs: Chair[] = [...seedChairs];
  cameras: Camera[] = [...seedCameras];
  services: Service[] = [...seedServices];
  customers: Customer[] = [...seedCustomers];
  sessions: ServiceSession[] = [...historical.sessions];
  transactions: Transaction[] = [...historical.transactions];
  payments: Payment[] = [...historical.payments];
  inventoryItems: InventoryItem[] = [...seedInventoryItems];
  inventoryMovements: InventoryMovement[] = [];
  consumptionRules: ServiceConsumptionRule[] = [...seedConsumptionRules];
  auditLogs: AuditLogEntry[] = [...historical.auditLogs];
  alerts: Alert[] = [...historical.alerts];
  
  // Active sessions (live)
  activeSessions: ServiceSession[] = [];
  
  // Demo mode
  demoMode: boolean = false;
  demoInterval: ReturnType<typeof setInterval> | null = null;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  // ============ ACTIONS ============
  switchRole(role: UserRole) {
    const user = this.users.find(u => u.role === role);
    if (user) {
      this.currentUser = user;
      this.notify();
    }
  }

  // Session management
  createSession(chairId: string, barberId: string, serviceId: string, trackingId: string): ServiceSession {
    const session: ServiceSession = {
      id: `sess-live-${uuidv4().slice(0, 8)}`,
      shopId: SHOP_ID, chairId, barberId,
      trackingId, serviceId,
      state: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      confidence: 0.90 + Math.random() * 0.09,
      events: [{
        id: uuidv4(), sessionId: '', cameraId: this.chairs.find(c => c.id === chairId)?.cameraId || 'camera-001',
        chairId, trackingId, eventType: 'SERVICE_STARTED', confidence: 0.95,
        timestamp: new Date().toISOString(), serviceId
      }]
    };
    session.events[0].sessionId = session.id;
    this.sessions.push(session);
    this.activeSessions.push(session);
    
    // Update barber's current chair
    const barber = this.barbers.find(b => b.id === barberId);
    if (barber) barber.currentChairId = chairId;
    
    this.notify();
    return session;
  }

  completeSession(sessionId: string) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.state = 'COMPLETED';
      session.endedAt = new Date().toISOString();
      session.events.push({
        id: uuidv4(), sessionId, cameraId: session.events[0].cameraId,
        chairId: session.chairId, trackingId: session.trackingId,
        eventType: 'SERVICE_COMPLETED', confidence: session.confidence,
        timestamp: new Date().toISOString(), serviceId: session.serviceId
      });
      this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
      
      // Update barber
      const barber = this.barbers.find(b => b.id === session.barberId);
      if (barber) barber.currentChairId = undefined;
      
      this.notify();
    }
  }

  // Transaction management
  createTransaction(sessionId: string, serviceId: string, chairId: string, barberId: string, customerId?: string): Transaction {
    const service = this.services.find(s => s.id === serviceId);
    if (!service) throw new Error('Service not found');
    
    const tx: Transaction = {
      id: `tx-${uuidv4().slice(0, 8)}`,
      shopId: SHOP_ID, sessionId, customerId, barberId, chairId, serviceId,
      amountDue: service.price, discount: 0, amountPaid: 0,
      status: 'UNPAID', reconciliationStatus: 'MATCHED',
      createdAt: new Date().toISOString(),
      items: [{ id: uuidv4(), serviceId, serviceName: service.name, price: service.price, quantity: 1 }]
    };
    this.transactions.push(tx);
    this.notify();
    return tx;
  }

  recordPayment(transactionId: string, amount: number, method: PaymentMethod, reference?: string) {
    const tx = this.transactions.find(t => t.id === transactionId);
    if (!tx) return;
    
    const payment: Payment = {
      id: `pay-${uuidv4().slice(0, 8)}`,
      transactionId, amount, method, reference,
      recordedBy: this.currentUser.id, recordedAt: new Date().toISOString()
    };
    this.payments.push(payment);
    tx.amountPaid += amount;
    
    if (tx.amountPaid >= tx.amountDue - tx.discount) {
      tx.status = 'PAID';
    } else if (tx.amountPaid > 0) {
      tx.status = 'PARTIALLY_PAID';
    }
    
    this.addAuditLog('PAYMENT_RECORDED', 'Transaction', transactionId, undefined, `${amount} ETB via ${method}`);
    this.notify();
  }

  applyDiscount(transactionId: string, discount: number, reason: string) {
    const tx = this.transactions.find(t => t.id === transactionId);
    if (!tx) return;
    const prev = `${tx.discount} ETB`;
    tx.discount = discount;
    if (tx.amountPaid >= tx.amountDue - tx.discount) tx.status = 'PAID';
    this.addAuditLog('DISCOUNT_APPLIED', 'Transaction', transactionId, prev, `${discount} ETB`, reason);
    this.notify();
  }

  // Inventory
  adjustInventory(itemId: string, quantity: number, type: InventoryMovementType, notes?: string) {
    const item = this.inventoryItems.find(i => i.id === itemId);
    if (!item) return;
    const prev = `${item.quantity} ${item.unit}`;
    item.quantity += (type === 'PURCHASE' ? quantity : -quantity);
    this.inventoryMovements.push({
      id: uuidv4(), inventoryItemId: itemId, type, quantity,
      notes, recordedAt: new Date().toISOString(), recordedBy: this.currentUser.id
    });
    this.addAuditLog('INVENTORY_ADJUSTMENT', 'InventoryItem', itemId, prev, `${item.quantity} ${item.unit}`, notes);
    this.notify();
  }

  // Audit
  addAuditLog(action: string, entity: string, entityId: string, prev?: string, newVal?: string, reason?: string) {
    this.auditLogs.unshift({
      id: uuidv4(), timestamp: new Date().toISOString(),
      userId: this.currentUser.id, userName: this.currentUser.name,
      action, entity, entityId, previousValue: prev, newValue: newVal, reason
    });
  }

  // Alerts
  addAlert(severity: AlertSeverity, title: string, message: string, entityId?: string, entityType?: string) {
    this.alerts.unshift({
      id: uuidv4(), shopId: SHOP_ID, severity, title, message,
      entityId, entityType, createdAt: new Date().toISOString(), resolved: false
    });
    this.notify();
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.resolved = true;
    this.notify();
  }

  // Reconciliation computation
  getReconciliationData() {
    const todaySessions = this.sessions.filter(s => {
      const d = new Date(s.startedAt);
      return d.toISOString().split('T')[0] === today;
    });
    const todayTx = this.transactions.filter(t => {
      const d = new Date(t.createdAt);
      return d.toISOString().split('T')[0] === today;
    });

    const aiObserved = todaySessions.length;
    const recorded = todayTx.length;
    const difference = aiObserved - recorded;

    const expectedValue = todaySessions.reduce((sum, s) => {
      const svc = this.services.find(sv => sv.id === s.serviceId);
      return sum + (svc?.price || 0);
    }, 0);

    const recordedValue = todayTx.reduce((sum, t) => sum + t.amountDue, 0);
    const amountDifference = expectedValue - recordedValue;

    // By chair
    const chairStats = this.chairs.map(chair => {
      const chairSessions = todaySessions.filter(s => s.chairId === chair.id);
      const chairTx = todayTx.filter(t => t.chairId === chair.id);
      return {
        chair,
        aiServices: chairSessions.length,
        recorded: chairTx.length,
        difference: chairSessions.length - chairTx.length
      };
    });

    // Unmatched
    const unmatchedSessions = todaySessions.filter(s => !todayTx.find(t => t.sessionId === s.id));
    const unmatchedTx = todayTx.filter(t => t.reconciliationStatus !== 'MATCHED');

    return {
      aiObserved, recorded, difference,
      expectedValue, recordedValue, amountDifference,
      chairStats, unmatchedSessions, unmatchedTx,
      isReconciled: difference === 0 && amountDifference === 0
    };
  }

  // Dashboard data
  getDashboardData() {
    const recon = this.getReconciliationData();
    const activeChairs = this.activeSessions.length;
    const totalCustomers = new Set(this.sessions.filter(s => s.state === 'COMPLETED').map(s => s.trackingId)).size;
    
    return {
      ...recon,
      activeChairs,
      totalCustomers,
      unresolvedAlerts: this.alerts.filter(a => !a.resolved).length,
    };
  }

  // ============ DEMO MODE ============
  startDemo() {
    if (this.demoMode) return;
    this.demoMode = true;
    this.notify();
    
    let demoStep = 0;
    const serviceIds = ['svc-001', 'svc-002', 'svc-001', 'svc-005'];
    const chairIds = ['chair-001', 'chair-002', 'chair-003', 'chair-004'];
    const barberIds = ['barber-001', 'barber-002', 'barber-003', 'barber-004'];
    
    this.demoInterval = setInterval(() => {
      demoStep++;
      
      if (demoStep % 3 === 1) {
        // New customer arrives
        const chairIdx = Math.floor(Math.random() * 4);
        const chair = this.chairs[chairIdx];
        const barber = this.barbers[chairIdx];
        const serviceId = serviceIds[chairIdx];
        const trackingId = `DEMO-${Date.now().toString(36).toUpperCase()}`;
        
        if (!this.activeSessions.find(s => s.chairId === chair.id)) {
          this.createSession(chair.id, barber.id, serviceId, trackingId);
          this.addAlert('INFO', `Customer detected at ${chair.name}`, `AI detected customer ${trackingId} at ${chair.name}.`, chair.id, 'chair');
        }
      }
      
      if (demoStep % 3 === 2) {
        // Complete a random active session
        if (this.activeSessions.length > 0) {
          const session = this.activeSessions[0];
          this.completeSession(session.id);
          
          // 70% chance staff records transaction
          if (Math.random() > 0.3) {
            const tx = this.createTransaction(session.id, session.serviceId!, session.chairId, session.barberId!, session.customerId);
            const service = this.services.find(s => s.id === session.serviceId)!;
            const method = (['CASH', 'TELEBIRR', 'CBE_BIRR'] as PaymentMethod[])[Math.floor(Math.random() * 3)];
            this.recordPayment(tx.id, service.price, method, method !== 'CASH' ? `TRX-${Math.floor(Math.random() * 900000) + 100000}` : undefined);
          } else {
            // Staff didn't record - creates discrepancy
            this.addAlert('WARNING', 'Unmatched AI service detected', `AI observed a service at ${this.chairs.find(c => c.id === session.chairId)?.name} but no transaction was recorded.`, session.id, 'session');
          }
        }
      }
      
      this.notify();
      
      // Stop after 30 steps
      if (demoStep >= 30) {
        this.stopDemo();
      }
    }, 4000);
  }

  stopDemo() {
    this.demoMode = false;
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }
    this.notify();
  }
}

export const store = new Store();

// React hook for store
import { useSyncExternalStore } from 'react';

export function useStore() {
  return useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store
  );
}
