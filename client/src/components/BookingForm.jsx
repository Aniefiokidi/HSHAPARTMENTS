import { useState } from 'react';
import { HiUser, HiPhone, HiMail, HiUsers, HiPencil } from 'react-icons/hi';

export default function BookingForm({ apartment, dateInfo, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    guests: 1,
    specialRequests: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email is required';
    if (form.guests < 1 || form.guests > apartment.maxGuests)
      e.guests = `Guests must be between 1 and ${apartment.maxGuests}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!dateInfo) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="label">Full Name</label>
        <div className="relative">
          <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className={`input-field pl-9 ${errors.fullName ? 'border-red-400' : ''}`}
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="label">Phone Number</label>
        <div className="relative">
          <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+234 800 000 0000"
            className={`input-field pl-9 ${errors.phone ? 'border-red-400' : ''}`}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="label">Email Address</label>
        <div className="relative">
          <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`input-field pl-9 ${errors.email ? 'border-red-400' : ''}`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Guests */}
      <div>
        <label className="label">Number of Guests</label>
        <div className="relative">
          <HiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <select
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className={`input-field pl-9 appearance-none bg-white cursor-pointer ${errors.guests ? 'border-red-400' : ''}`}
          >
            {Array.from({ length: apartment?.maxGuests || 6 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} Guest{n !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
      </div>

      {/* Special Requests */}
      <div>
        <label className="label">Special Requests (optional)</label>
        <div className="relative">
          <HiPencil className="absolute left-3 top-3 text-muted" size={16} />
          <textarea
            name="specialRequests"
            value={form.specialRequests}
            onChange={handleChange}
            placeholder="Early check-in, dietary needs, etc."
            rows={3}
            className="input-field pl-9 resize-none"
          />
        </div>
      </div>

      {/* Deposit notice */}
      <div className="bg-accent/10 border-l-4 border-accent p-4">
        <p className="text-xs text-charcoal leading-relaxed">
          <span className="font-bold text-accent">⚑ Payment Policy: </span>
          A <strong>10% non-refundable deposit</strong> is required to secure your booking.
          Your stay is only confirmed upon successful payment.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !dateInfo}
        className="btn-primary w-full"
      >
        {isLoading ? 'Processing…' : 'Proceed to Payment'}
      </button>

      {!dateInfo && (
        <p className="text-center text-muted text-xs">Please select your dates above to continue.</p>
      )}
    </form>
  );
}
