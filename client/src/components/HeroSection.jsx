import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 50%, #c4973f22 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #c4973f15 0%, transparent 50%)',
        }}
      />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent ml-[8%]" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent mr-[8%]" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in">
        {/* Eyebrow */}
        <p className="text-accent font-sans text-xs tracking-[0.4em] uppercase mb-6 animate-slide-up">
          Nigeria's Premier Short-Let
        </p>

        {/* Main title */}
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-cream font-light leading-none mb-2 animate-slide-up [animation-delay:100ms]">
          Her Serene
        </h1>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-accent font-light leading-none mb-8 italic animate-slide-up [animation-delay:200ms]">
          Highness
        </h1>

        <div className="gold-divider animate-scale-in [animation-delay:300ms]" />

        <p className="text-cream/60 font-sans text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed animate-slide-up [animation-delay:400ms]">
          Exquisitely appointed apartments for the refined soul. Each residence
          is a sanctuary of elegance, comfort, and unparalleled luxury.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:500ms]">
          <Link to="/locations" className="btn-primary group">
            Explore Residences
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
          <Link to="/locations" className="btn-outline text-accent-muted border-accent/40">
            View Locations
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in [animation-delay:800ms]">
        <span className="text-cream/30 text-xs tracking-widest uppercase font-sans">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent/60 to-transparent" />
      </div>
    </section>
  );
}
