import { useState } from 'react';
import { useStore, store } from '../store';
import { Card, Badge } from '../components/Layout';
import { Scissors, Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

export function Services() {
  const s = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const handleSave = () => {
    if (!name || !price) return;
    if (editId) {
      const svc = s.services.find(sv => sv.id === editId);
      if (svc) {
        svc.name = name;
        svc.price = parseFloat(price);
        svc.duration = parseInt(duration) || svc.duration;
      }
    } else {
      s.services.push({
        id: `svc-${Date.now()}`,
        shopId: s.currentShop.id,
        name,
        price: parseFloat(price),
        duration: parseInt(duration) || 30,
        active: true,
      });
    }
    store.notify();
    setShowForm(false);
    setEditId(null);
    setName('');
    setPrice('');
    setDuration('');
  };

  const startEdit = (id: string) => {
    const svc = s.services.find(sv => sv.id === id);
    if (svc) {
      setEditId(id);
      setName(svc.name);
      setPrice(svc.price.toString());
      setDuration(svc.duration.toString());
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Services & Prices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage service offerings and pricing</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setName(''); setPrice(''); setDuration(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {s.services.map(service => (
          <Card key={service.id} className={`p-5 ${!service.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Scissors size={18} className="text-primary-500" />
                  <h3 className="font-semibold text-slate-800">{service.name}</h3>
                </div>
                <p className="text-2xl font-bold text-slate-800 mt-2">{service.price} ETB</p>
                <p className="text-sm text-slate-400 mt-1">{service.duration} min duration</p>
              </div>
              <Badge status={service.active ? 'COMPLETED' : 'CANCELLED'}>
                {service.active ? 'Active' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => startEdit(service.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <Edit2 size={12} /> Edit
              </button>
              <button
                onClick={() => { service.active = !service.active; store.notify(); }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                {service.active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                {service.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Consumption Rules */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Service Consumption Rules</h3>
        <p className="text-sm text-slate-500 mb-4">Expected inventory usage per service</p>
        <div className="space-y-3">
          {s.services.map(service => {
            const rules = s.consumptionRules.filter(r => r.serviceId === service.id);
            if (rules.length === 0) return null;
            return (
              <div key={service.id} className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-sm text-slate-700 mb-2">{service.name}</p>
                <div className="flex flex-wrap gap-2">
                  {rules.map(rule => {
                    const item = s.inventoryItems.find(i => i.id === rule.inventoryItemId);
                    return (
                      <span key={rule.id} className="px-2 py-1 bg-white rounded border text-xs text-slate-600">
                        {item?.name}: {rule.quantity} {item?.unit}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editId ? 'Edit Service' : 'New Service'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Service Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Haircut + Beard"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Price (ETB)</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="30"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                {editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
