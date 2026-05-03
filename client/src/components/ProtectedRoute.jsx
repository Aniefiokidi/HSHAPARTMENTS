import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login', { replace: true });
    }
  }, [admin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-accent font-display text-2xl italic animate-pulse">
          Her Serene Highness…
        </div>
      </div>
    );
  }

  return admin ? children : null;
}
