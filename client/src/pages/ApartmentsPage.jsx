import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApartmentCard from '../components/ApartmentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const normalizeSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ApartmentsPage() {
  const { slug } = useParams();
  const [location, setLocation] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    api
      .get('/locations')
      .then(async (locRes) => {
        const targetSlug = normalizeSlug(slug || '');
        const loc = (locRes.data.data || []).find((item) => normalizeSlug(item.slug || item.name) === targetSlug);

        if (!loc) {
          throw new Error('Location not found');
        }

        setLocation(loc);
        document.title = `${loc.name} – Her Serene Highness Apartments`;

        const aptRes = await api.get(`/apartments?location=${loc._id}`);
        setApartments(aptRes.data.data);
      })
      .catch(() => setError('Location not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-cream">
        <LoadingSpinner message="Loading apartments…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl text-primary">{error}</p>
        <Link to="/locations" className="btn-outline">
          Back to Locations
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative bg-primary py-20 px-6 text-center overflow-hidden">
        {location?.image && (
          <img
            src={location.image}
            alt={location.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="relative z-10">
          <Link
            to="/locations"
            className="text-accent/70 text-xs tracking-widest uppercase hover:text-accent transition-colors mb-4 inline-block"
          >
            ← All Locations
          </Link>
          <h1 className="font-serif text-5xl md:text-6xl text-cream mb-4">{location?.name}</h1>
          <div className="gold-divider" />
          {location?.description && (
            <p className="text-cream/50 max-w-lg mx-auto text-base">{location.description}</p>
          )}
        </div>
      </div>

      {/* Apartments */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {apartments.length > 0 ? (
          <>
            <p className="text-muted text-sm mb-8 font-sans">
              {apartments.length} residence{apartments.length !== 1 ? 's' : ''} in {location?.name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apartments.map((apt) => (
                <ApartmentCard key={apt._id} apartment={apt} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted">
            <p className="font-serif text-2xl mb-3">No apartments in {location?.name} yet.</p>
            <p className="text-sm mb-6">We're working on it. Check back soon.</p>
            <Link to="/locations" className="btn-outline">
              Explore Other Locations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
