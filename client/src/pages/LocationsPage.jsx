import { useEffect, useState } from 'react';
import LocationCard from '../components/LocationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Locations – Her Serene Highness Apartments';
    api
      .get('/locations')
      .then((res) => setLocations(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-primary py-20 px-6 text-center">
        <p className="text-accent font-sans text-xs tracking-[0.4em] uppercase mb-3">
          Explore
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream mb-4">Our Locations</h1>
        <div className="gold-divider" />
        <p className="text-cream/50 max-w-lg mx-auto text-base">
          Premium short-let residences across Nigeria's most prestigious addresses.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <LoadingSpinner />
        ) : locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <LocationCard key={loc._id} location={loc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">
            <p className="font-serif text-2xl mb-3">No locations yet.</p>
            <p className="text-sm">Check back soon — great things are coming.</p>
          </div>
        )}
      </div>
    </div>
  );
}
