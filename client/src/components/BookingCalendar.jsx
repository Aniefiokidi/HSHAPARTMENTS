import { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, isWithinInterval, parseISO } from 'date-fns';
import api from '../api/axios';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);

export default function BookingCalendar({ apartment, onDatesSelected }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch booked dates
  useEffect(() => {
    if (!apartment?._id) return;
    api
      .get(`/apartments/${apartment._id}/booked-dates`)
      .then((res) => setBookedRanges(res.data.data))
      .catch(() => setBookedRanges([]))
      .finally(() => setLoading(false));
  }, [apartment?._id]);

  // Build a Set of all blocked dates for fast lookup
  const isDateBlocked = useCallback(
    (date) => {
      return bookedRanges.some(({ checkInDate, checkOutDate }) => {
        const start = parseISO(checkInDate);
        const end = parseISO(checkOutDate);
        // Block from checkIn up to (not including) checkOut
        return isWithinInterval(date, { start, end: addDays(end, -1) });
      });
    },
    [bookedRanges]
  );

  const filterDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !isDateBlocked(date);
  };

  const handleChange = ([start, end]) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * apartment.price;
      const depositAmount = parseFloat((totalPrice * 0.1).toFixed(2));
      onDatesSelected({ checkInDate: start, checkOutDate: end, nights, totalPrice, depositAmount });
    } else {
      onDatesSelected(null);
    }
  };

  const nights =
    startDate && endDate
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = nights * (apartment?.price || 0);
  const depositAmount = parseFloat((totalPrice * 0.1).toFixed(2));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted text-sm">
        Checking availability…
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-serif text-xl text-primary mb-2">Select Your Dates</h3>
      <p className="text-muted text-sm mb-5">
        Strikethrough dates are unavailable.
      </p>

      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        filterDate={filterDate}
        minDate={new Date()}
        monthsShown={2}
        calendarClassName="w-full"
      />

      {/* Price breakdown */}
      {startDate && endDate && (
        <div className="mt-6 bg-cream-dark p-5 animate-slide-up">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">
              {formatPrice(apartment.price)} × {nights} night{nights !== 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-primary">{formatPrice(totalPrice)}</span>
          </div>
          <div className="border-t border-cream pt-3 flex justify-between items-baseline">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted">
                Deposit Due Now (10%)
              </p>
              <p className="text-xs text-muted mt-0.5 italic">Non-refundable</p>
            </div>
            <span className="text-accent font-bold text-xl">{formatPrice(depositAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
