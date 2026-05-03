import { Link } from 'react-router-dom';

export default function AdminLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-cream flex flex-col min-h-screen shrink-0">
        <div className="px-6 py-8 border-b border-primary-light">
          <p className="text-accent font-display text-xs tracking-[0.3em] uppercase">Her Serene Highness</p>
          <h2 className="font-serif text-lg text-cream mt-0.5">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { label: 'Dashboard', to: '/admin' },
            { label: 'Apartments', to: '/admin/apartments' },
            { label: 'Locations', to: '/admin/locations' },
            { label: 'Bookings', to: '/admin/bookings' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-accent hover:bg-primary-light transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-primary-light">
          <Link to="/" className="text-xs text-cream/40 hover:text-accent transition-colors">
            ← View Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-5">
          <h1 className="font-serif text-2xl text-primary">{title}</h1>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
