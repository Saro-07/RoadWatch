import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Award, Shield, Settings, Bell, Lock } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="profile-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Profile</h1>
        <p>Manage your account details and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Column: User Card */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--accent-gradient)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ margin: '0 0 0.5rem' }}>{user.username}</h2>
          <span className="badge" style={{ textTransform: 'capitalize', marginBottom: '1.5rem', display: 'inline-block' }}>
            {user.role}
          </span>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Shield size={18} color="var(--status-safe)" />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trust Score</div>
                <div style={{ fontWeight: 'bold' }}>{user.trustScore || 100}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={18} color="var(--accent-secondary)" />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Credit Points</div>
                <div style={{ fontWeight: 'bold' }}>{user.creditPoints || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} /> Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Username</label>
                <input type="text" className="input-field" value={user.username} disabled style={{ opacity: 0.7 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Account Role</label>
                <input type="text" className="input-field" value={user.role} disabled style={{ opacity: 0.7, textTransform: 'capitalize' }} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={20} /> Account Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
                <Lock size={18} /> Change Password
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
                <Bell size={18} /> Notification Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
