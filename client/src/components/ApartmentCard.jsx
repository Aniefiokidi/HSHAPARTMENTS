import { Link } from 'react-router-dom';
import { HiLocationMarker, HiUsers, HiArrowRight } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);

const isUrl = (value) => /^https?:\/\//i.test(String(value || ''));

export default function ApartmentCard({ apartment }) {
  const coverImage = apartment.images?.find(isUrl);
  const coverVideo = apartment.videos?.find(isUrl);
  const locationFallbackImage = apartment.location?.image;

  return (
    <div className="group bg-white card-hover overflow-hidden">
      {/* Image */}
      <Link to={`/apartments/${apartment._id}`} className="block relative overflow-hidden aspect-[4/3]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={apartment.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : coverVideo ? (
          <video
            src={coverVideo}
            className="w-full h-full object-cover"
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
          />
        ) : locationFallbackImage ? (
          <img
            src={locationFallbackImage}
            alt={apartment.location?.name || apartment.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-cream-dark flex items-center justify-center">
            <span className="text-accent font-display text-5xl italic opacity-30">HSH</span>
          </div>
        )}
        {!apartment.isAvailable && (
          <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
            <span className="text-cream font-semibold tracking-widest uppercase text-xs border border-cream/40 px-4 py-2">
              Unavailable
            </span>
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-primary/90 px-3 py-1.5">
          <p className="text-accent font-semibold text-sm">{formatPrice(apartment.price)}</p>
          <p className="text-cream/50 text-xs">{apartment.priceNote}</p>
        </div>
      </Link>

      {/* Body */}
      <div className="p-6">
        {apartment.location && (
          <div className="flex items-center gap-1.5 text-muted text-xs mb-2">
            <HiLocationMarker className="text-accent" size={12} />
            <span>{apartment.location.name}</span>
          </div>
        )}

        <Link to={`/apartments/${apartment._id}`}>
          <h3 className="font-serif text-xl text-primary mb-3 hover:text-accent transition-colors line-clamp-1">
            {apartment.title}
          </h3>
        </Link>

        {/* Stats */}
        <div className="flex items-center gap-5 text-xs text-muted mb-5 border-t border-cream-dark pt-4">
          <span className="flex items-center gap-1.5">
            <IoBedOutline size={14} className="text-accent" />
            {apartment.bedrooms} Bed{apartment.bedrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <IoWaterOutline size={14} className="text-accent" />
            {apartment.bathrooms} Bath{apartment.bathrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <HiUsers size={14} className="text-accent" />
            {apartment.maxGuests} Guests
          </span>
        </div>

        {apartment.isAvailable ? (
          <Link
            to={`/apartments/${apartment._id}`}
            className="flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase hover:gap-3 transition-all"
          >
            View Details <HiArrowRight size={14} />
          </Link>
        ) : (
          <span className="text-muted text-xs tracking-widest uppercase">Not Available</span>
        )}
      </div>
    </div>
  );
}
