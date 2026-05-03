import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Locations', to: '/locations' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const transparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent py-6'
          : 'bg-primary/95 backdrop-blur-md py-4 shadow-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="https://res.cloudinary.com/dgqxt06km/image/upload/v1777811125/ChatGPT_Image_May_3__2026__11_50_43_AM-removebg-preview_nnigck.png"
            alt="Her Serene Highness Apartments"
            className="h-20 w-auto object-contain bg-white rounded-lg p-1"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 ${
                  isActive ? 'text-accent' : 'text-cream/80 hover:text-accent'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/locations"
            className="btn-primary text-xs py-2.5 px-6"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-cream p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-primary-light">
          <div className="px-6 py-6 flex flex-col gap-6">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-widest uppercase ${
                    isActive ? 'text-accent' : 'text-cream/80'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/locations" className="btn-primary text-xs w-fit">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
