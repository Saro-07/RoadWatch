import React, { useContext } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Map as MapIcon, List, Bell, LogOut, User } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import MapView from './pages/MapView';
import Tickets from './pages/Tickets';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const { user, logout } = useContext(AuthContext);

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
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
            <LayoutDashboard size={20} />
            <span>{user?.role === 'contractor' ? 'Workspace' : 'Dashboard'}</span>
          </NavLink>
          
          {user?.role === 'citizen' && (
            <NavLink to="/report" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <AlertTriangle size={20} />
              <span>Report Issue</span>
            </NavLink>
          )}

          <NavLink to="/map" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <MapIcon size={20} />
            <span>Road Health Map</span>
          </NavLink>

          <NavLink to="/tickets" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <List size={20} />
            <span>{user?.role === 'contractor' ? 'My Assigned Tickets' : user?.role === 'official' ? 'All Tickets' : 'Tickets & Status'}</span>
          </NavLink>

          <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
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
            <button className="icon-btn"><Bell size={20} /></button>
            {user?.role === 'citizen' && (
              <button className="btn btn-primary" onClick={() => window.location.href='/report'}>
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
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
