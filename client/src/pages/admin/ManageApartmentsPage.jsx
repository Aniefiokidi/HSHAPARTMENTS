import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiTrash, HiPencil, HiPlus, HiX, HiCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const EMPTY_APT = {
  title: '',
  description: '',
  price: '',
  priceNote: 'per night',
  location: '',
  bedrooms: 1,
  bathrooms: 1,
  maxGuests: 2,
  isAvailable: true,
  images: '',
  videos: '',
  features: '',
};

const aptToForm = (apt) => ({
  title: apt.title,
  description: apt.description,
  price: apt.price,
  priceNote: apt.priceNote,
  location: apt.location?._id || apt.location,
  bedrooms: apt.bedrooms,
  bathrooms: apt.bathrooms,
  maxGuests: apt.maxGuests,
  isAvailable: apt.isAvailable,
  images: apt.images?.join('\n') || '',
  videos: apt.videos?.join('\n') || '',
  features: apt.features?.join('\n') || '',
});

const formToPayload = (form) => ({
  ...form,
  price: Number(form.price),
  bedrooms: Number(form.bedrooms),
  bathrooms: Number(form.bathrooms),
  maxGuests: Number(form.maxGuests),
  images: form.images
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean),
  videos: form.videos
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean),
  features: form.features
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean),
});

export default function ManageApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_APT);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setLocationsLoading(true);
    try {
      const [aptRes, locRes] = await Promise.all([api.get('/apartments'), api.get('/locations')]);
      setApartments(aptRes.data.data || []);
      setLocations(locRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load apartments/locations');
      setApartments([]);
      setLocations([]);
    } finally {
      setLoading(false);
      setLocationsLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    if (!locations.length) {
      toast.error('Create at least one location before adding an apartment.');
    }
    setForm(EMPTY_APT);
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (apt) => {
    setForm(aptToForm(apt));
    setEditing(apt._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      toast.error('Title, price, and location are required');
      return;
    }
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (editing) {
        await api.put(`/apartments/${editing}`, payload);
        toast.success('Apartment updated');
      } else {
        await api.post('/apartments', payload);
        toast.success('Apartment created');
      }
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/apartments/${id}`);
      toast.success('Apartment deleted');
      setApartments((p) => p.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const formatPrice = (n) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <AdminLayout title="Manage Apartments">
      <div className="flex justify-end mb-6">
        <button onClick={openCreate} className="btn-primary gap-2">
          <HiPlus size={16} /> Add Apartment
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl shadow-2xl my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark">
              <h3 className="font-serif text-xl">
                {editing ? 'Edit Apartment' : 'New Apartment'}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. The Royal Penthouse" />
                </div>

                <div>
                  <label className="label">Location *</label>
                  <select
                    name="location"
                    value={String(form.location || '')}
                    onChange={handleChange}
                    className="input-field bg-white"
                    disabled={locationsLoading || locations.length === 0}
                  >
                    <option value="">
                      {locationsLoading
                        ? 'Loading locations...'
                        : locations.length
                        ? 'Select location...'
                        : 'No locations available'}
                    </option>
                    {locations.map((l) => (
                      <option key={l._id} value={String(l._id)}>{l.name}</option>
                    ))}
                  </select>
                  {locations.length === 0 && !locationsLoading && (
                    <p className="text-xs text-red-600 mt-2">
                      No locations found. Create one in{' '}
                      <Link to="/admin/locations" className="underline text-accent">
                        Manage Locations
                      </Link>
                      .
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Price (₦) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" placeholder="e.g. 150000" min="0" />
                </div>

                <div>
                  <label className="label">Price Note</label>
                  <input name="priceNote" value={form.priceNote} onChange={handleChange} className="input-field" placeholder="per night" />
                </div>

                <div>
                  <label className="label">Bedrooms</label>
                  <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} className="input-field" min="0" />
                </div>

                <div>
                  <label className="label">Bathrooms</label>
                  <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} className="input-field" min="0" />
                </div>

                <div>
                  <label className="label">Max Guests</label>
                  <input type="number" name="maxGuests" value={form.maxGuests} onChange={handleChange} className="input-field" min="1" />
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <input type="checkbox" id="isAvailable" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="accent-accent w-4 h-4" />
                  <label htmlFor="isAvailable" className="text-sm text-charcoal cursor-pointer">Available for booking</label>
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="input-field resize-none" rows={4} placeholder="Describe the apartment…" />
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Image URLs (one per line)</label>
                  <textarea name="images" value={form.images} onChange={handleChange} className="input-field resize-none font-mono text-xs" rows={4} placeholder="https://res.cloudinary.com/…&#10;https://res.cloudinary.com/…" />
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Video URLs (one per line)</label>
                  <textarea name="videos" value={form.videos} onChange={handleChange} className="input-field resize-none font-mono text-xs" rows={2} placeholder="https://res.cloudinary.com/…" />
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Features / Amenities (one per line)</label>
                  <textarea name="features" value={form.features} onChange={handleChange} className="input-field resize-none" rows={4} placeholder="WiFi&#10;Smart TV&#10;Swimming Pool&#10;24/7 Security" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  <HiCheck size={16} />
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">
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
                {['Image', 'Title', 'Location', 'Price', 'Beds', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {apartments.map((apt) => (
                <tr key={apt._id} className="hover:bg-cream/50">
                  <td className="px-4 py-3">
                    {apt.images?.[0] ? (
                      <img src={apt.images[0]} alt={apt.title} className="w-16 h-11 object-cover" />
                    ) : (
                      <div className="w-16 h-11 bg-cream-dark" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium max-w-[160px] truncate">{apt.title}</td>
                  <td className="px-4 py-3 text-muted">{apt.location?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-accent font-semibold whitespace-nowrap">
                    {formatPrice(apt.price)}
                  </td>
                  <td className="px-4 py-3 text-muted">{apt.bedrooms}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 font-semibold uppercase tracking-wider ${
                      apt.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {apt.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(apt)} className="p-1.5 hover:text-accent transition-colors" title="Edit">
                        <HiPencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(apt._id, apt.title)} className="p-1.5 hover:text-red-500 transition-colors" title="Delete">
                        <HiTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {apartments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">No apartments yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
