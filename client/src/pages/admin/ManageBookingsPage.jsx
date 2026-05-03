import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiBan, HiEye } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-600',
};

const formatPrice = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchBookings = (status = '') =>
    api
      .get(`/bookings${status ? `?status=${status}` : ''}`)
      .then((res) => setBookings(res.data.data))
      .finally(() => setLoading(false));

  useEffect(() => { fetchBookings(); }, []);

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setFilter(val);
    setLoading(true);
    fetchBookings(val);
  };

  const handleCancel = async (id, name) => {
    if (!window.confirm(`Cancel booking for ${name}? This cannot be undone.`)) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <AdminLayout title="Manage Bookings">
      {/* Filter */}
      <div className="flex items-center gap-4 mb-6">
        <label className="label mb-0">Filter by status:</label>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="input-field w-auto"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="text-muted text-sm ml-auto">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark text-xs tracking-widest uppercase text-muted">
              <tr>
                {['Guest', 'Apartment', 'Check-in', 'Check-out', 'Guests', 'Total', 'Deposit', 'Payment', 'Status', 'Actions'].map(
                  (h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-cream/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{b.fullName}</p>
                      <p className="text-xs text-muted">{b.email}</p>
                      <p className="text-xs text-muted">{b.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted max-w-[140px] truncate">
                    {b.apartment?.title ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {new Date(b.checkInDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {new Date(b.checkOutDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted text-center">{b.guests}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {formatPrice(b.totalPrice)}
                  </td>
                  <td className="px-4 py-3 text-accent font-semibold whitespace-nowrap">
                    {formatPrice(b.depositAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 font-semibold uppercase tracking-wider ${
                      b.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 font-semibold uppercase tracking-wider ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/booking-confirmation/${b._id}`}
                        target="_blank"
                        className="p-1.5 hover:text-accent transition-colors"
                        title="View"
                      >
                        <HiEye size={16} />
                      </Link>
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(b._id, b.fullName)}
                          className="p-1.5 hover:text-red-500 transition-colors"
                          title="Cancel booking"
                        >
                          <HiBan size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-muted">
                    No bookings found.
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
