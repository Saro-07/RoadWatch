import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalReported: 0,
    resolved: 0,
    pending: 0,
    trustScore: 100
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch tickets from backend to calculate stats
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`);
        const rawData = await response.json();
        
        const data = user?.role === 'contractor' 
          ? rawData.filter(t => t.area === user?.area) 
          : rawData;

        const resolvedCount = data.filter(t => t.status === 'Completed').length;
        const pendingCount = data.filter(t => t.status !== 'Completed').length;
        
        setStats({
          totalReported: data.length,
          resolved: resolvedCount,
          pending: pendingCount,
          trustScore: user?.role === 'contractor' 
            ? (data.length > 0 ? Math.round((resolvedCount / data.length) * 100) : 0) 
            : 100 + (resolvedCount * 5)
        });

        setRecentActivity(data.slice(0, 5)); // Top 5 recent
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <h1>{user?.role === 'contractor' ? 'Contractor Workspace' : user?.role === 'official' ? 'Command Center' : 'Citizen Dashboard'}</h1>
        <p>{user?.role === 'contractor' ? `Monitor and resolve issues in your assigned area: ${user?.area}` : user?.role === 'official' ? 'City-wide overview of road health infrastructure.' : 'Monitor your reports and community impact.'}</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '10px', borderRadius: '50%' }}>
              <AlertCircle color="var(--accent-primary)" />
            </div>
            <h3>Total Reported</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.totalReported}</h2>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '50%' }}>
              <CheckCircle color="var(--status-safe)" />
            </div>
            <h3>Resolved Issues</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.resolved}</h2>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '50%' }}>
              <Clock color="var(--status-medium)" />
            </div>
            <h3>Pending</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.pending}</h2>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '50%' }}>
              <TrendingUp color="var(--accent-secondary)" />
            </div>
            <h3>{user?.role === 'contractor' ? 'Completion Rate' : 'Trust Score'}</h3>
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--accent-secondary)' }}>
            {stats.trustScore}{user?.role === 'contractor' ? '%' : ''}
          </h2>
        </div>
      </div>

      <div className="recent-activity" style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Reports</h2>
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {recentActivity.length === 0 ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No recent activity. Start reporting issues to see them here!
             </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '1rem' }}>Title</th>
                  <th style={{ padding: '1rem' }}>Issue Type</th>
                  <th style={{ padding: '1rem' }}>Severity</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((ticket, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>{ticket.title}</td>
                    <td style={{ padding: '1rem' }}>{ticket.issueType}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${ticket.severity.toLowerCase()}`}>{ticket.severity}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{ticket.status}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
