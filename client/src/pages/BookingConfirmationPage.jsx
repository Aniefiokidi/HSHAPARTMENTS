import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HiCheckCircle, HiCalendar, HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Booking Confirmed – Her Serene Highness';
    api
      .get(`/bookings/${bookingId}`)
      .then((res) => setBooking(res.data.data))
      .catch(() => setError('Booking details not found.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;

  if (error || !booking) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl text-primary">{error}</p>
        <Link to="/" className="btn-outline">Go Home</Link>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)
  );
  const isConfirmed = booking.status === 'confirmed';

  return (
    <div className="pt-24 min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Status header */}
        <div className={`text-center mb-12 ${isConfirmed ? '' : 'opacity-70'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isConfirmed ? 'bg-accent/20' : 'bg-cream-dark'
          }`}>
            <HiCheckCircle
              size={48}
              className={isConfirmed ? 'text-accent' : 'text-muted'}
            />
          </div>

          {isConfirmed ? (
            <>
              <h1 className="font-serif text-4xl text-primary mb-2">Booking Confirmed!</h1>
              <div className="gold-divider" />
              <p className="text-muted text-base">
                Your reservation has been secured. We look forward to hosting you.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-3xl text-primary mb-2">Booking Pending</h1>
              <div className="gold-divider" />
              <p className="text-muted text-sm">
                Payment not yet confirmed. Please complete payment to secure your stay.
              </p>
            </>
          )}
        </div>

        {/* Booking card */}
        <div className="bg-white shadow-lg border-t-4 border-accent">
          {/* Apartment cover */}
          {booking.apartment?.images?.[0] && (
            <div className="h-48 overflow-hidden">
              <img
                src={booking.apartment.images[0]}
                alt={booking.apartment?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Apartment name */}
            <div className="mb-6">
              <p className="text-muted text-xs tracking-widest uppercase mb-1">Residence</p>
              <h2 className="font-serif text-2xl text-primary">{booking.apartment?.title}</h2>
              {booking.apartment?.location && (
                <div className="flex items-center gap-1.5 text-accent text-sm mt-1">
                  <HiLocationMarker size={12} />
                  <span>{booking.apartment.location.name}</span>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-cream-dark mb-6" />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-muted text-xs tracking-widest uppercase mb-1">
                  <HiCalendar size={12} /> Check-in
                </div>
                <p className="font-serif text-xl text-primary">
                  {format(new Date(booking.checkInDate), 'EEE, MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-muted text-xs tracking-widest uppercase mb-1">
                  <HiCalendar size={12} /> Check-out
                </div>
                <p className="font-serif text-xl text-primary">
                  {format(new Date(booking.checkOutDate), 'EEE, MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <p className="text-muted text-sm mb-6">
              {nights} night{nights !== 1 ? 's' : ''} · {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
            </p>

            <div className="w-full h-px bg-cream-dark mb-6" />

            {/* Guest info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-muted tracking-widest uppercase mb-1">Guest</p>
                <p className="font-semibold text-charcoal">{booking.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-muted tracking-widest uppercase mb-1">Booking Ref</p>
                <p className="font-mono text-xs text-charcoal break-all">{booking._id}</p>
              </div>
              <div className="flex items-center gap-2">
                <HiPhone className="text-accent" size={14} />
                <span className="text-sm text-charcoal">{booking.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiMail className="text-accent" size={14} />
                <span className="text-sm text-charcoal">{booking.email}</span>
              </div>
            </div>

            <div className="w-full h-px bg-cream-dark mb-6" />

            {/* Price breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total stay ({nights} nights)</span>
                <span className="font-semibold">{formatPrice(booking.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">
                  Deposit paid (10%)
                  <span className="ml-1 text-xs italic text-accent">non-refundable</span>
                </span>
                <span className="font-semibold text-accent">{formatPrice(booking.depositAmount)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-cream-dark pt-2">
                <span className="text-muted">Balance due at check-in</span>
                <span className="font-semibold">
                  {formatPrice(booking.totalPrice - booking.depositAmount)}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase ${
              isConfirmed
                ? 'bg-accent/15 text-accent'
                : 'bg-cream-dark text-muted'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-accent' : 'bg-muted'}`} />
              {isConfirmed ? 'Confirmed' : 'Pending Payment'}
            </div>

            {booking.paystackReference && (
              <p className="text-xs text-muted mt-3">
                Paystack Ref: <span className="font-mono">{booking.paystackReference}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/" className="btn-primary flex-1 text-center">
            Back to Home
          </Link>
          <Link to="/locations" className="btn-outline flex-1 text-center">
            Browse More Apartments
          </Link>
        </div>

        {!isConfirmed && (
          <div className="mt-6 bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            <strong>Complete Your Payment</strong>
            <p className="mt-1 text-xs">
              To confirm this booking, please return to the booking page and complete payment.
              Your dates will remain held for a limited time.
            </p>
            <Link
              to={`/book/${booking.apartment?._id}`}
              className="btn-primary text-xs mt-3 inline-flex"
            >
              Complete Payment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
