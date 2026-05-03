import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back.');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-accent font-display text-xs tracking-[0.3em] uppercase mb-1">
            Her Serene Highness
          </p>
          <h1 className="font-serif text-3xl text-cream">Admin Portal</h1>
          <div className="gold-divider" />
        </div>

        <form onSubmit={handleSubmit} className="bg-primary-light p-10 shadow-2xl space-y-5">
          <div>
            <label className="label text-cream/50">Email</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@hshapartments.com"
                required
                className="input-field pl-9 bg-primary border-primary text-cream placeholder-muted/50 focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="label text-cream/50">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="input-field pl-9 bg-primary border-primary text-cream placeholder-muted/50 focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
