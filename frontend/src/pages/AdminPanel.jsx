import React, { useState, useEffect, useContext } from 'react';
import {
  Users, Plus, Trash2, Edit2, X, Check,
  ShieldCheck, HardHat, UserCheck, BarChart3, RefreshCw
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AREAS = ['Downtown', 'Uptown', 'Northside', 'Southside', 'Eastside', 'Westside', 'All'];
const ROLES = ['contractor', 'official'];

const ROLE_META = {
  admin:      { label: 'Admin',      icon: ShieldCheck, color: '#8b5cf6' },
  official:   { label: 'Official',   icon: UserCheck,   color: '#3b82f6' },
  contractor: { label: 'Contractor', icon: HardHat,     color: '#f59e0b' },
  citizen:    { label: 'Citizen',    icon: Users,       color: '#10b981' },
};

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser]   = useState(null); // user being edited inline
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast]   = useState(null);
  const [form, setForm]     = useState({ username: '', password: '', role: 'contractor', area: 'Downtown' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API}/api/admin/users?requesterId=${user.id}`),
        fetch(`${API}/api/admin/stats?requesterId=${user.id}`),
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStats(statsData);
    } catch (err) {
      showToast('Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, requesterId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error); setSubmitting(false); return; }
      showToast(`${form.role} account "${form.username}" created!`);
      setShowModal(false);
      setForm({ username: '', password: '', role: 'contractor', area: 'Downtown' });
      fetchData();
    } catch { setFormError('Server error. Please try again.'); }
    setSubmitting(false);
  };

  const handleUpdate = async (id, newRole, newArea) => {
    try {
      const res = await fetch(`${API}/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, area: newArea, requesterId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error, 'error'); return; }
      showToast('User updated successfully.');
      setEditUser(null);
      fetchData();
    } catch { showToast('Server error.', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/admin/users/${id}?requesterId=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { showToast(data.error, 'error'); setDeletingId(null); return; }
      showToast('User deleted.');
      setDeletingId(null);
      fetchData();
    } catch { showToast('Server error.', 'error'); }
  };

  const grouped = {
    official:   users.filter(u => u.role === 'official'),
    contractor: users.filter(u => u.role === 'contractor'),
    citizen:    users.filter(u => u.role === 'citizen'),
    admin:      users.filter(u => u.role === 'admin'),
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 300,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
          color: toast.type === 'error' ? '#f87171' : '#34d399',
          padding: '0.85rem 1.25rem', borderRadius: '10px',
          fontSize: '0.9rem', fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s ease',
          maxWidth: '320px',
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1>Admin Panel</h1>
          <p>Manage contractor and official accounts across the platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Create Account
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Users', value: stats.totalUsers, color: '#8b5cf6' },
            { label: 'Total Tickets', value: stats.totalTickets, color: '#3b82f6' },
            { label: 'Resolved', value: stats.resolvedTickets, color: '#10b981' },
          ].map(s => (
            <div key={s.label} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '10px', height: '40px', borderRadius: '4px', background: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Tables by Role */}
      {['official', 'contractor', 'citizen', 'admin'].map(role => {
        const RoleIcon = ROLE_META[role].icon;
        const roleColor = ROLE_META[role].color;
        const roleUsers = grouped[role];
        if (roleUsers.length === 0) return null;

        return (
          <div key={role} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ background: `${roleColor}22`, padding: '8px', borderRadius: '8px' }}>
                <RoleIcon size={18} color={roleColor} />
              </div>
              <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{ROLE_META[role].label}s</h3>
              <span style={{
                background: `${roleColor}22`, color: roleColor,
                borderRadius: '999px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700,
              }}>{roleUsers.length}</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 500 }}>Username</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 500 }}>Area</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 500 }}>Trust Score</th>
                  {role !== 'admin' && role !== 'citizen' && (
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 500 }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {roleUsers.map(u => {
                  const isEditing = editUser?.id === u.id;
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: `${roleColor}33`, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: roleColor,
                          }}>
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500 }}>{u.username}</span>
                          {u.id === user.id && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>You</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        {isEditing ? (
                          <select
                            className="input-field"
                            style={{ padding: '4px 8px', fontSize: '0.85rem', width: '130px' }}
                            value={editUser.area}
                            onChange={e => setEditUser(prev => ({ ...prev, area: e.target.value }))}
                          >
                            {AREAS.map(a => <option key={a}>{a}</option>)}
                          </select>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.area}</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>{u.trustScore}</span>
                      </td>
                      {role !== 'admin' && role !== 'citizen' && (
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                          {deletingId === u.id ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Delete?</span>
                              <button onClick={() => handleDelete(u.id)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                Yes
                              </button>
                              <button onClick={() => setDeletingId(null)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                No
                              </button>
                            </div>
                          ) : isEditing ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleUpdate(u.id, editUser.role, editUser.area)} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                <Check size={13} /> Save
                              </button>
                              <button onClick={() => setEditUser(null)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                <X size={13} /> Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button onClick={() => setEditUser({ id: u.id, role: u.role, area: u.area })}
                                title="Edit area"
                                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-primary)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => setDeletingId(u.id)}
                                title="Delete user"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Create User Modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 200, backdropFilter: 'blur(4px)',
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 201, width: '100%', maxWidth: '460px',
            background: '#13131a', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '2rem',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Create New Account</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Account Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {ROLES.map(r => {
                    const M = ROLE_META[r];
                    const RIcon = M.icon;
                    const selected = form.role === r;
                    return (
                      <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))} style={{
                        padding: '0.75rem', borderRadius: '10px', border: `2px solid ${selected ? M.color : 'rgba(255,255,255,0.1)'}`,
                        background: selected ? `${M.color}20` : 'rgba(0,0,0,0.2)',
                        color: selected ? M.color : 'var(--text-secondary)',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s',
                      }}>
                        <RIcon size={16} />{M.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Username</label>
                <input type="text" className="input-field" placeholder="e.g. contractor_northside" required minLength={3}
                  value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Password</label>
                <input type="password" className="input-field" placeholder="Min. 6 characters" required minLength={6}
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Assigned Area</label>
                <select className="input-field" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))}>
                  {AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? 'Creating...' : `Create ${ROLE_META[form.role].label}`}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
