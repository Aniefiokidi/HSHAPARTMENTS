import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiTrash, HiPencil, HiPlus, HiX, HiCheck } from 'react-icons/hi';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const EMPTY = { name: '', description: '', image: '' };

export default function ManageLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // holds _id
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchLocations = () =>
    api
      .get('/locations')
      .then((res) => setLocations(res.data.data))
      .finally(() => setLoading(false));

  useEffect(() => { fetchLocations(); }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (loc) => {
    setForm({ name: loc.name, description: loc.description, image: loc.image || '' });
    setEditing(loc._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      toast.error('Name and description are required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/locations/${editing}`, form);
        toast.success('Location updated');
      } else {
        await api.post('/locations', form);
        toast.success('Location created');
      }
      setShowForm(false);
      fetchLocations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete location "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/locations/${id}`);
      toast.success('Location deleted');
      setLocations((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout title="Manage Locations">
      <div className="flex justify-end mb-6">
        <button onClick={openCreate} className="btn-primary gap-2">
          <HiPlus size={16} /> Add Location
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark">
              <h3 className="font-serif text-xl">{editing ? 'Edit Location' : 'New Location'}</h3>
              <button onClick={() => setShowForm(false)}><HiX size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Victoria Island"
                />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Brief description of the location"
                />
              </div>
              <div>
                <label className="label">Image URL (Cloudinary)</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="input-field"
                  placeholder="https://res.cloudinary.com/…"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  <HiCheck size={16} />
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark text-xs tracking-widest uppercase text-muted">
              <tr>
                {['Image', 'Name', 'Slug', 'Description', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {locations.map((loc) => (
                <tr key={loc._id} className="hover:bg-cream/50">
                  <td className="px-5 py-3">
                    {loc.image ? (
                      <img src={loc.image} alt={loc.name} className="w-14 h-10 object-cover" />
                    ) : (
                      <div className="w-14 h-10 bg-cream-dark flex items-center justify-center text-muted text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium">{loc.name}</td>
                  <td className="px-5 py-3 text-muted font-mono text-xs">{loc.slug}</td>
                  <td className="px-5 py-3 text-muted max-w-xs truncate">{loc.description}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(loc)}
                        className="p-1.5 text-charcoal hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <HiPencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(loc._id, loc.name)}
                        className="p-1.5 text-charcoal hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <HiTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">
                    No locations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
