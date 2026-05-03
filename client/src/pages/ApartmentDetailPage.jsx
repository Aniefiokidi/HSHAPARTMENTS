import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HiLocationMarker,
  HiUsers,
  HiCheckCircle,
  HiArrowRight,
} from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import Gallery from '../components/Gallery';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const isUrl = (value) => /^https?:\/\//i.test(String(value || ''));

const formatPrice = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);

export default function ApartmentDetailPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    const normalizeApartment = (apt) => ({
      ...apt,
      images: (apt.images || []).filter(isUrl),
      videos: (apt.videos || []).filter(isUrl),
    });

    const loadApartment = async () => {
      try {
        // First try direct by-id endpoint
        const res = await api.get(`/apartments/${id}`);
        const normalized = normalizeApartment(res.data.data);
        setApartment(normalized);
        document.title = `${normalized.title} – Her Serene Highness`;
      } catch {
        try {
          // Vercel can miss dynamic API paths; fallback to list endpoint
          const listRes = await api.get('/apartments');
          const found = (listRes.data.data || []).find((item) => String(item._id) === String(id));

          if (!found) {
            setError('Apartment not found.');
            return;
          }

          const normalized = normalizeApartment(found);
          setApartment(normalized);
          document.title = `${normalized.title} – Her Serene Highness`;
        } catch {
          setError('Apartment not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadApartment();
  }, [id]);

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;

  if (error || !apartment) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl text-primary">{error}</p>
        <Link to="/locations" className="btn-outline">Browse Locations</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-muted">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link to="/locations" className="hover:text-accent transition-colors">Locations</Link>
        {apartment.location && (
          <>
            <span>/</span>
            <Link
              to={`/locations/${apartment.location.slug}`}
              className="hover:text-accent transition-colors"
            >
              {apartment.location.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-charcoal line-clamp-1">{apartment.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Gallery */}
        {(apartment.images?.length > 0 || apartment.videos?.length > 0) && (
          <div className="mb-12 animate-fade-in">
            <Gallery images={apartment.images} videos={apartment.videos} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2 animate-slide-up">
            {/* Header */}
            <div className="mb-8">
              {apartment.location && (
                <div className="flex items-center gap-1.5 text-accent text-sm mb-2">
                  <HiLocationMarker size={14} />
                  <span>{apartment.location.name}</span>
                </div>
              )}
              <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
                {apartment.title}
              </h1>
              <div className="gold-divider-left" />

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 text-sm text-muted mt-4">
                <span className="flex items-center gap-2">
                  <IoBedOutline className="text-accent" size={18} />
                  {apartment.bedrooms} Bedroom{apartment.bedrooms !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-2">
                  <IoWaterOutline className="text-accent" size={18} />
                  {apartment.bathrooms} Bathroom{apartment.bathrooms !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-2">
                  <HiUsers className="text-accent" size={16} />
                  Up to {apartment.maxGuests} Guest{apartment.maxGuests !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="font-serif text-2xl text-primary mb-4">About This Residence</h2>
              <p className="text-charcoal/70 leading-relaxed text-base whitespace-pre-line">
                {apartment.description}
              </p>
            </div>

            {/* Features */}
            {apartment.features?.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-primary mb-5">Amenities & Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {apartment.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-charcoal/80">
                      <HiCheckCircle className="text-accent shrink-0" size={16} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white shadow-xl p-8 border-t-4 border-accent animate-scale-in">
              {/* Price */}
              <div className="mb-6">
                <p className="text-muted text-xs tracking-widest uppercase mb-1">Starting from</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl text-primary">
                    {formatPrice(apartment.price)}
                  </span>
                  <span className="text-muted text-sm">{apartment.priceNote}</span>
                </div>
              </div>

              <div className="w-full h-px bg-cream-dark mb-6" />

              {/* Deposit notice */}
              <div className="bg-accent/10 border-l-4 border-accent p-3 mb-6">
                <p className="text-xs text-charcoal leading-relaxed">
                  A <strong>10% non-refundable deposit</strong> is required to secure your booking.
                </p>
              </div>

              {apartment.isAvailable ? (
                <Link
                  to={`/book/${apartment._id}`}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                  Book This Apartment
                  <HiArrowRight size={16} />
                </Link>
              ) : (
                <div className="text-center py-4 bg-cream-dark">
                  <p className="text-muted text-sm font-semibold tracking-widest uppercase">
                    Currently Unavailable
                  </p>
                </div>
              )}

              <p className="text-center text-muted text-xs mt-4 italic">
                Free cancellation within 24 hours of booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
