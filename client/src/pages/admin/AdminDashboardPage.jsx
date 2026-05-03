import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const StatCard = ({ label, value, color = 'accent' }) => (
  <div className="bg-white p-6 shadow-sm border-t-4 border-accent">
    <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-1">{label}</p>
    <p className="font-serif text-4xl text-primary">{value ?? '—'}</p>
  </div>
);

export default function AdminDashboardPage() {
  const { admin, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/apartments'),
      api.get('/locations'),
      api.get('/bookings'),
    ])
      .then(([aptRes, locRes, bookRes]) => {
        const bookings = bookRes.data.data;
        setStats({
          apartments: aptRes.data.data.length,
          locations: locRes.data.data.length,
          bookings: bookings.length,
          confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        });
        setRecentBookings(bookings.slice(0, 8));
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (n) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome + logout */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-muted text-sm">
          Welcome back, <strong className="text-charcoal">{admin?.name}</strong>
        </p>
        <button
          onClick={logout}
          className="text-xs text-muted hover:text-red-500 transition-colors font-semibold tracking-widest uppercase"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Apartments" value={stats.apartments} />
        <StatCard label="Locations" value={stats.locations} />
        <StatCard label="Total Bookings" value={stats.bookings} />
        <StatCard label="Confirmed" value={stats.confirmed} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Manage Apartments', to: '/admin/apartments' },
          { label: 'Manage Locations', to: '/admin/locations' },
          { label: 'View Bookings', to: '/admin/bookings' },
        ].map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className="btn-outline text-center"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Recent bookings table */}
      <div>
        <h2 className="font-serif text-xl text-primary mb-4">Recent Bookings</h2>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : recentBookings.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark text-xs tracking-widest uppercase text-muted">
                <tr>
                  {['Guest', 'Apartment', 'Check-in', 'Check-out', 'Deposit', 'Status'].map(
                    (h) => (
                      <th key={h} className="text-left px-5 py-3 font-semibold">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3 font-medium">{b.fullName}</td>
                    <td className="px-5 py-3 text-muted">{b.apartment?.title ?? '—'}</td>
                    <td className="px-5 py-3 text-muted">
                      {new Date(b.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {new Date(b.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-accent font-semibold">
                      {formatPrice(b.depositAmount)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : b.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-sm">No bookings yet.</p>
        )}
      </div>
    </AdminLayout>
  );
}
