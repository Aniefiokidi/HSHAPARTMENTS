import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { HiShieldCheck } from 'react-icons/hi';
import BookingCalendar from '../components/BookingCalendar';
import BookingForm from '../components/BookingForm';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);

// Load Paystack script once
function usePaystackScript() {
  useEffect(() => {
    if (document.getElementById('paystack-script')) return;
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);
}

export default function BookingPage() {
  const { apartmentId } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dateInfo, setDateInfo] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);

  usePaystackScript();

  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get(`/apartments/${apartmentId}`)
      .then((res) => {
        const apt = res.data.data;
        if (!apt.isAvailable) {
          toast.error('This apartment is not available for booking.');
          navigate(`/apartments/${apartmentId}`);
          return;
        }
        setApartment(apt);
        document.title = `Book ${apt.title} – Her Serene Highness`;
      })
      .catch(() => {
        toast.error('Apartment not found.');
        navigate('/locations');
      })
      .finally(() => setLoading(false));
  }, [apartmentId, navigate]);

  const handleDatesSelected = useCallback((info) => {
    setDateInfo(info);
  }, []);

  const initializePayment = useCallback(
    (booking) => {
      if (!window.PaystackPop) {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        return;
      }

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: booking.email,
        amount: Math.round(booking.depositAmount * 100), // kobo
        currency: 'NGN',
        ref: `HSH-${booking._id}-${Date.now()}`,
        metadata: {
          bookingId: booking._id,
          apartmentTitle: apartment.title,
          custom_fields: [
            {
              display_name: 'Apartment',
              variable_name: 'apartment',
              value: apartment.title,
            },
            {
              display_name: 'Booking ID',
              variable_name: 'booking_id',
              value: booking._id,
            },
          ],
        },
        onClose: () => {
          toast('Payment window closed. Your booking is pending.', { icon: 'ℹ️' });
          setSubmitting(false);
        },
        callback: async (response) => {
          try {
            toast.loading('Verifying payment…', { id: 'verify' });
            const res = await api.get(`/payments/verify/${response.reference}`);
            toast.dismiss('verify');
            if (res.data.success) {
              toast.success('Payment confirmed! Booking secured. 🎉');
              navigate(`/booking-confirmation/${booking._id}`);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch {
            toast.dismiss('verify');
            toast.error('Verification error. Please contact support with your reference: ' + response.reference);
          } finally {
            setSubmitting(false);
          }
        },
      });

      handler.openIframe();
    },
    [apartment, navigate]
  );

  const handleFormSubmit = useCallback(
    async (formData) => {
      if (!dateInfo) {
        toast.error('Please select your check-in and check-out dates.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await api.post('/bookings', {
          apartmentId,
          ...formData,
          checkInDate: dateInfo.checkInDate.toISOString(),
          checkOutDate: dateInfo.checkOutDate.toISOString(),
        });
        const booking = res.data.data;
        setPendingBooking(booking);
        initializePayment(booking);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
        setSubmitting(false);
      }
    },
    [apartmentId, dateInfo, initializePayment]
  );

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;

  if (!apartment) return null;

  return (
    <div className="pt-24 bg-cream min-h-screen">
      {/* Page header */}
      <div className="bg-primary py-14 px-6 text-center">
        <Link
          to={`/apartments/${apartmentId}`}
          className="text-accent/70 text-xs tracking-widest uppercase hover:text-accent transition-colors mb-4 inline-block"
        >
          ← Back to Apartment
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl text-cream">Reserve Your Stay</h1>
        <div className="gold-divider" />
        <p className="text-cream/50 text-sm">{apartment.title}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Deposit notice banner */}
        <div className="flex items-start gap-4 bg-accent/10 border border-accent/30 p-5 mb-10">
          <HiShieldCheck className="text-accent mt-0.5 shrink-0" size={22} />
          <div>
            <p className="font-semibold text-charcoal text-sm">Payment Policy</p>
            <p className="text-charcoal/70 text-sm mt-0.5">
              A <strong>10% non-refundable deposit</strong> is required to secure your booking.
              Your reservation is only confirmed after successful payment. The balance is due on check-in.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Calendar */}
          <div className="bg-white p-8 shadow-sm">
            <BookingCalendar apartment={apartment} onDatesSelected={handleDatesSelected} />

            {/* Selected dates summary */}
            {dateInfo && (
              <div className="mt-6 pt-6 border-t border-cream-dark animate-slide-up">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                  Selected Dates
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted mb-1">Check-in</p>
                    <p className="font-serif text-lg text-primary">
                      {format(dateInfo.checkInDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Check-out</p>
                    <p className="font-serif text-lg text-primary">
                      {format(dateInfo.checkOutDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <p className="text-muted text-sm mt-3">
                  {dateInfo.nights} night{dateInfo.nights !== 1 ? 's' : ''} •{' '}
                  <span className="text-accent font-semibold">
                    Deposit: {formatPrice(dateInfo.depositAmount)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-primary mb-6">Your Details</h2>
            <BookingForm
              apartment={apartment}
              dateInfo={dateInfo}
              onSubmit={handleFormSubmit}
              isLoading={submitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
