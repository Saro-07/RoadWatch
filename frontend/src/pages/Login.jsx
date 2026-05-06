import React, { useState, useContext } from 'react';
import { AlertTriangle, Lock, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);
    
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
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
            <AlertTriangle color="var(--accent-primary)" size={36} />
            <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>RoadWatch</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message" style={{ background: 'rgba(255, 99, 71, 0.1)', border: '1px solid rgba(255, 99, 71, 0.3)', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
          
          <div className="input-group" style={{ position: 'relative', marginBottom: '1rem' }}>
            <User className="input-icon" size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Username" 
              style={{ paddingLeft: '40px', width: '100%' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Lock className="input-icon" size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password" 
              style={{ paddingLeft: '40px', width: '100%' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-hints" style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 10px 0', color: 'white' }}><strong>Test Accounts:</strong></p>
          <p style={{ margin: '0 0 5px 0' }}>User: <strong>citizen1</strong> | Pass: <strong>password123</strong></p>
          <p style={{ margin: '0 0 5px 0' }}>User: <strong>contractor1</strong> | Pass: <strong>password123</strong></p>
          <p style={{ margin: 0 }}>User: <strong>official1</strong> | Pass: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
