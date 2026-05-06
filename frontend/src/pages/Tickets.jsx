import React, { useState, useEffect, useContext } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Tickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [completingTicketId, setCompletingTicketId] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`);
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'Completed' && evidenceFile) {
        const formData = new FormData();
        formData.append('status', newStatus);
        formData.append('evidence', evidenceFile);
        
        await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/status`, {
          method: 'PATCH',
          body: formData
        });
        setCompletingTicketId(null);
        setEvidenceFile(null);
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
      }
      fetchTickets(); // Refresh
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = filter === 'All' || t.status === filter;
    const matchesArea = user?.role === 'contractor' 
      ? t.area === user?.area 
      : user?.role === 'official' 
        ? (areaFilter === 'All' || t.area === areaFilter)
        : true;
    return matchesStatus && matchesArea;
  });

  return (
    <div className="tickets-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1>Ticket Lifecycle Management</h1>
          <p>Authority view: Track, assign, and update reported issues.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchTickets}>
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          <button className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('All')}>All</button>
          <button className={`btn ${filter === 'Submitted' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('Submitted')}>Submitted</button>
          <button className={`btn ${filter === 'In Progress' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('In Progress')}>In Progress</button>
          <button className={`btn ${filter === 'Completed' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('Completed')}>Completed</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user?.role === 'official' && (
            <select 
              className="input-field" 
              style={{ width: '150px', padding: '0.5rem' }} 
              value={areaFilter} 
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              <option value="All">All Areas</option>
              <option value="Downtown">Downtown</option>
              <option value="Uptown">Uptown</option>
              <option value="Northside">Northside</option>
              <option value="Southside">Southside</option>
              <option value="Eastside">Eastside</option>
              <option value="Westside">Westside</option>
            </select>
          )}
          <div className="input-group" style={{ margin: 0, width: '300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
            <input type="text" className="input-field" placeholder="Search tickets..." style={{ paddingLeft: '40px' }} />
          </div>
        </div>
      </div>

      <div className="tickets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {loading && tickets.length === 0 ? (
          <p>Loading tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <p>No tickets found for this filter.</p>
        ) : (
          filteredTickets.map(ticket => (
            <div key={ticket.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ID: #{ticket.id}</span>
                <span className={`badge ${ticket.severity.toLowerCase()}`}>{ticket.severity}</span>
              </div>

              {ticket.imageUrl && (
                <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', height: '180px', background: 'rgba(0,0,0,0.5)' }}>
                  <img src={`${import.meta.env.VITE_API_URL}${ticket.imageUrl}`} alt="Issue" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              
              <h3 style={{ marginBottom: '0.5rem' }}>{ticket.title}</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{ticket.description}</p>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', margin: '0 0 5px 0' }}><strong>Type:</strong> {ticket.issueType}</p>
                <p style={{ fontSize: '0.85rem', margin: '0 0 5px 0' }}><strong>Area:</strong> {ticket.area}</p>
                <p style={{ fontSize: '0.85rem', margin: '0 0 5px 0' }}><strong>Reported:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                <p style={{ fontSize: '0.85rem', margin: '0' }}><strong>Confidence:</strong> {(ticket.confidenceScore * 100).toFixed(0)}%</p>
                {ticket.evidenceUrl && (
                  <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                    <p style={{ fontSize: '0.85rem', margin: '0 0 10px 0', color: 'var(--status-safe)' }}><strong>Resolution Evidence:</strong></p>
                    <div style={{ borderRadius: '8px', overflow: 'hidden', height: '120px', background: 'rgba(0,0,0,0.5)' }}>
                      <a href={`${import.meta.env.VITE_API_URL}${ticket.evidenceUrl}`} target="_blank" rel="noreferrer">
                        <img src={`${import.meta.env.VITE_API_URL}${ticket.evidenceUrl}`} alt="Resolved Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Status</span>
                  <strong style={{ 
                    color: ticket.status === 'Completed' ? 'var(--status-safe)' : 
                           ticket.status === 'In Progress' ? 'var(--status-medium)' : 'white' 
                  }}>{ticket.status}</strong>
                </div>
                
                {user?.role === 'contractor' && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {ticket.status === 'Submitted' && (
                      <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => updateStatus(ticket.id, 'In Progress')}>
                        Mark In Progress
                      </button>
                    )}
                    
                    {ticket.status === 'In Progress' && completingTicketId !== ticket.id && (
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--status-safe)' }} onClick={() => setCompletingTicketId(ticket.id)}>
                        Mark Completed
                      </button>
                    )}

                    {completingTicketId === ticket.id && (
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', marginTop: '10px' }}>
                        <input type="file" accept="image/*" onChange={(e) => setEvidenceFile(e.target.files[0])} style={{ fontSize: '0.8rem', maxWidth: '200px' }} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => { setCompletingTicketId(null); setEvidenceFile(null); }}>Cancel</button>
                          <button className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'var(--status-safe)' }} disabled={!evidenceFile} onClick={() => updateStatus(ticket.id, 'Completed')}>Submit Evidence</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tickets;
