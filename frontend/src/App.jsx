import React, { useContext, useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Map as MapIcon, List, Bell, LogOut, User, ShieldCheck } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import MapView from './pages/MapView';
import Tickets from './pages/Tickets';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import { AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationContext } from './context/NotificationContext';
import NotificationPanel from './components/NotificationPanel';
import './App.css';

// Inner app that can access both Auth and Notification contexts
function AppShell() {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount, fetchNotifications } = useContext(NotificationContext);
  const [notifOpen, setNotifOpen] = useState(false);

  const openNotifPanel = () => {
    setNotifOpen(true);
    fetchNotifications(); // Refresh on open
  };

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <AlertTriangle color="var(--accent-primary)" size={28} />
          <h2>RoadWatch</h2>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1 }}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} end>
            <LayoutDashboard size={20} />
            <span>{user?.role === 'contractor' ? 'Workspace' : 'Dashboard'}</span>
          </NavLink>

          {user?.role === 'citizen' && (
            <NavLink to="/report" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <AlertTriangle size={20} />
              <span>Report Issue</span>
            </NavLink>
          )}

          <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <MapIcon size={20} />
            <span>Road Health Map</span>
          </NavLink>

          <NavLink to="/tickets" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <List size={20} />
            <span>
              {user?.role === 'contractor' ? 'My Assigned Tickets' : user?.role === 'official' ? 'All Tickets' : 'Tickets & Status'}
            </span>
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              style={({ isActive }) => isActive ? {} : { color: '#8b5cf6' }}
            >
              <ShieldCheck size={20} />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>

        <div className="user-profile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <div className="info">
              <h4>{user.username}</h4>
              <span className="trust-score" style={{ textTransform: 'capitalize' }}>Role: {user.role}</span>
            </div>
          </div>
          <button onClick={logout} className="icon-btn" title="Logout">
            <LogOut size={18} color="#ff6b6b" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header glass-panel">
          <h3 style={{ textTransform: 'capitalize' }}>Welcome back, {user.username}</h3>
          <div className="actions">
            {/* Bell with unread badge */}
            <button
              className="icon-btn"
              onClick={openNotifPanel}
              title="Notifications"
              style={{ position: 'relative' }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px', right: '-4px',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px', height: '18px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  border: '2px solid var(--bg-color)',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {user?.role === 'citizen' && (
              <button className="btn btn-primary" onClick={() => window.location.href = '/report'}>
                + New Report
              </button>
            )}
          </div>
        </header>

        <div className="page-wrapper animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/profile" element={<Profile />} />
            {user?.role === 'admin' && <Route path="/admin" element={<AdminPanel />} />}
          </Routes>
        </div>
      </main>

      {/* Notification slide-in panel */}
      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppShell />
    </NotificationProvider>
  );
}

export default App;
