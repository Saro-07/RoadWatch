import React, { useContext } from 'react';
import { X, Bell, CheckCheck, Ticket } from 'lucide-react';
import { NotificationContext } from '../context/NotificationContext';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 199,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Slide-in panel */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '380px',
        background: 'var(--surface-color)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        zIndex: 200,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={20} color="var(--accent-primary)" />
            <h3 style={{ margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <span style={{
                background: 'var(--accent-primary)',
                color: '#fff',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>{unreadCount}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.8rem',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--text-secondary)',
            }}>
              <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ margin: 0 }}>No notifications yet</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                You'll see updates on your reports here.
              </p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '10px',
                  background: n.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(59, 130, 246, 0.1)',
                  border: `1px solid ${n.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.2)'}`,
                  cursor: n.isRead ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!n.isRead) e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; }}
                onMouseLeave={e => { if (!n.isRead) e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: n.isRead ? 'rgba(255,255,255,0.06)' : 'rgba(59, 130, 246, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ticket size={16} color={n.isRead ? 'var(--text-secondary)' : 'var(--accent-primary)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: '0 0 4px',
                    fontSize: '0.875rem',
                    lineHeight: '1.4',
                    color: n.isRead ? 'var(--text-secondary)' : 'white',
                  }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                {!n.isRead && (
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'var(--accent-primary)', flexShrink: 0, marginTop: '4px',
                  }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
