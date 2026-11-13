import { ExternalLink, Calendar, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationsModal = ({ onClose }) => {
    const { notifications } = useNotifications();

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1rem',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '2rem',
                    maxWidth: '560px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    position: 'relative',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#f0f0f0',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    ✕
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e3f2fd', paddingBottom: '0.75rem' }}>
                    <div style={{
                        backgroundColor: '#e3f2fd',
                        color: 'var(--primary-color)',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Bell size={22} />
                    </div>
                    <div>
                        <h2 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.4rem' }}>Latest Updates</h2>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>
                            Announcements & event notices ({notifications.length})
                        </span>
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#888' }}>
                        <p style={{ fontSize: '1rem' }}>No new announcements at this moment.</p>
                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>Please check back later.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map(n => (
                            <div key={n.id} style={{
                                backgroundColor: '#f9fbfe',
                                padding: '1.25rem',
                                borderRadius: '10px',
                                borderLeft: '4px solid var(--primary-color)',
                                borderTop: '1px solid #edf2f7',
                                borderRight: '1px solid #edf2f7',
                                borderBottom: '1px solid #edf2f7',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, color: '#1a1a1a', fontSize: '1.05rem', fontWeight: '700' }}>
                                        {n.title}
                                    </h4>
                                    {n.date && (
                                        <span style={{
                                            backgroundColor: '#e3f2fd',
                                            color: 'var(--primary-color)',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <Calendar size={12} style={{ marginRight: '4px' }} />
                                            {n.date}
                                        </span>
                                    )}
                                </div>

                                <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: n.link ? '0.75rem' : 0 }}>
                                    {n.content}
                                </p>

                                {n.link && (
                                    <a
                                        href={n.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            color: 'var(--primary-color)',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            textDecoration: 'none',
                                            backgroundColor: '#fff',
                                            padding: '0.35rem 0.8rem',
                                            borderRadius: '6px',
                                            border: '1px solid #c8e0fb',
                                        }}
                                    >
                                        Register / View Details <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsModal;
