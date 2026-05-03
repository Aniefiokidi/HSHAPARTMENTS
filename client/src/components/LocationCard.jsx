import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

export default function LocationCard({ location }) {
  return (
    <Link
      to={`/locations/${location.slug}`}
      className="group relative overflow-hidden block bg-primary card-hover"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        {location.image ? (
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-primary-light flex items-center justify-center">
            <span className="text-accent font-display text-6xl italic opacity-30">H</span>
          </div>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="w-8 h-px bg-accent mb-3 transition-all duration-300 group-hover:w-12" />
        <h3 className="font-serif text-2xl text-cream mb-1">{location.name}</h3>
        <p className="text-cream/60 text-sm line-clamp-2 mb-4">{location.description}</p>
        <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase">
          Explore <HiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
        </span>
      </div>
    </Link>
  );
}
