import { Link } from 'react-router-dom';
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-primary text-cream/70">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <p className="text-accent font-display text-xs tracking-[0.3em] uppercase mb-1">
            Her Serene Highness
          </p>
          <h3 className="font-serif text-2xl text-cream mb-4">Apartments</h3>
          <div className="w-10 h-px bg-accent mb-4" />
          <p className="text-sm leading-relaxed">
            Luxury short-let apartments curated for the discerning traveller.
            Experience refined living across Nigeria's finest addresses.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-widest uppercase mb-5">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/locations" className="hover:text-accent transition-colors">
                Our Locations
              </Link>
            </li>
            <li>
              <Link to="/locations" className="hover:text-accent transition-colors">
                Book a Stay
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-widest uppercase mb-5">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <HiLocationMarker className="text-accent mt-0.5 shrink-0" size={16} />
              <span>Lagos, Nigeria</span>
            </li>
            <li className="flex items-center gap-3">
              <HiPhone className="text-accent shrink-0" size={16} />
              <a href="tel:+2348000000000" className="hover:text-accent transition-colors">
                +234 800 000 0000
              </a>
            </li>
            <li className="flex items-center gap-3">
              <HiMail className="text-accent shrink-0" size={16} />
              <a
                href="mailto:hello@hshapartments.com"
                className="hover:text-accent transition-colors"
              >
                hello@hshapartments.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-light">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Her Serene Highness Apartments. All rights reserved.</p>
          <p className="italic font-display text-accent/60">
            Luxury crafted for royalty.
          </p>
        </div>
      </div>
    </footer>
  );
}
