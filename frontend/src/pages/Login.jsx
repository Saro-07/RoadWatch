import React, { useState, useContext } from 'react';
import { AlertTriangle, Lock, User, Mail, MapPin, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AREAS = ['Downtown', 'Uptown', 'Northside', 'Southside', 'Eastside', 'Westside'];

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', area: 'Downtown' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setFormData({ username: '', password: '', confirmPassword: '', area: 'Downtown' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        return setError('Passwords do not match.');
      }
      if (formData.password.length < 6) {
        return setError('Password must be at least 6 characters.');
      }
    }

    setIsSubmitting(true);
    const result = mode === 'login'
      ? await login(formData.username, formData.password)
      : await register(formData.username, formData.password, formData.area);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{
              background: 'var(--accent-gradient)',
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle color="white" size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white', letterSpacing: '-0.5px' }}>RoadWatch</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
            {mode === 'login' ? 'Welcome back. Sign in to continue.' : 'Create your citizen account.'}
          </p>
        </div>

        {/* Mode toggle tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '1.75rem',
        }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                background: mode === m ? 'var(--accent-gradient)' : 'transparent',
                color: mode === m ? 'white' : 'var(--text-secondary)',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255,99,71,0.12)',
            border: '1px solid rgba(255,99,71,0.3)',
            color: '#ff6b6b',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Username */}
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', top: '13px', left: '13px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              name="username"
              className="input-field"
              placeholder="Username"
              style={{ paddingLeft: '40px', width: '100%' }}
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', top: '13px', left: '13px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="input-field"
              placeholder="Password"
              style={{ paddingLeft: '40px', paddingRight: '44px', width: '100%' }}
              value={formData.password}
              onChange={handleChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', padding: '4px',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Register-only fields */}
          {mode === 'register' && (
            <>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: '13px', left: '13px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="input-field"
                  placeholder="Confirm Password"
                  style={{ paddingLeft: '40px', width: '100%' }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', top: '13px', left: '13px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                <select
                  name="area"
                  className="input-field"
                  style={{ paddingLeft: '40px', width: '100%' }}
                  value={formData.area}
                  onChange={handleChange}
                >
                  {AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <p style={{ margin: '0', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Signing up registers you as a <strong style={{ color: 'white' }}>Citizen</strong>. Contractor &amp; Official accounts are managed by admin.
              </p>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.25rem', fontSize: '1rem', gap: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  {mode === 'login' ? <ArrowRight size={18} /> : <UserPlus size={18} />}
                </>
              )
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
