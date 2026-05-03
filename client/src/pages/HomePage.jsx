import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import HeroSection from '../components/HeroSection';
import LocationCard from '../components/LocationCard';
import ApartmentCard from '../components/ApartmentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

export default function HomePage() {
  const [locations, setLocations] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/locations'),
      api.get('/apartments?available=true'),
    ])
      .then(([locRes, aptRes]) => {
        setLocations(locRes.data.data.slice(0, 3));
        setFeatured(aptRes.data.data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroSection />

      {/* About strip */}
      <section className="bg-primary py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent font-sans text-xs tracking-[0.4em] uppercase mb-4">
            The Experience
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cream font-light leading-snug italic mb-6">
            "Where luxury meets the warmth of home."
          </h2>
          <div className="gold-divider" />
          <p className="text-cream/50 text-base max-w-xl mx-auto leading-relaxed">
            Her Serene Highness Apartments offers exquisite short-let residences
            across Nigeria's most coveted addresses. Every detail is thoughtfully
            curated for your comfort, privacy, and pleasure.
          </p>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent font-sans text-xs tracking-[0.4em] uppercase mb-3">
              Where We Are
            </p>
            <h2 className="section-title">Our Locations</h2>
            <div className="gold-divider" />
            <p className="section-subtitle max-w-lg mx-auto">
              Discover premium residences in Nigeria's finest neighbourhoods.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <LocationCard key={loc._id} location={loc} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/locations" className="btn-outline">
              View All Locations <HiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      <section className="py-24 px-6 bg-cream-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent font-sans text-xs tracking-[0.4em] uppercase mb-3">
              Featured
            </p>
            <h2 className="section-title">Available Residences</h2>
            <div className="gold-divider" />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((apt) => (
                <ApartmentCard key={apt._id} apartment={apt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted">
              <p className="font-serif text-xl">No apartments available at this time.</p>
              <p className="text-sm mt-2">Please check back soon.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/locations" className="btn-outline">
              Browse All Apartments <HiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent font-sans text-xs tracking-[0.4em] uppercase mb-3">
              Why Choose Us
            </p>
            <h2 className="font-serif text-4xl text-cream">The HSH Difference</h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: '✦',
                title: 'Curated Luxury',
                desc: 'Each apartment is hand-selected and professionally designed for an unrivalled experience.',
              },
              {
                icon: '◈',
                title: 'Seamless Booking',
                desc: 'Book in minutes with our Airbnb-style availability calendar and secure Paystack payments.',
              },
              {
                icon: '◉',
                title: 'Total Privacy',
                desc: 'Your sanctuary, your rules. Fully self-contained residences with 24/7 concierge support.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-accent text-3xl mb-4">{icon}</div>
                <div className="w-8 h-px bg-accent mx-auto mb-4" />
                <h3 className="font-serif text-xl text-cream mb-3">{title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-accent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-primary font-light italic mb-4">
            Ready for a Royal Stay?
          </h2>
          <p className="text-primary/70 mb-8 text-base max-w-md mx-auto">
            Secure your dates today. A 10% non-refundable deposit confirms your booking.
          </p>
          <Link
            to="/locations"
            className="inline-flex items-center gap-2 bg-primary text-cream font-semibold px-10 py-4 tracking-wider uppercase text-sm hover:bg-primary-light transition-colors"
          >
            Book Your Stay <HiArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
