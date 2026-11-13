import { useNotifications } from '../context/NotificationContext';
import { Image as ImageIcon, Calendar } from 'lucide-react';

const Media = () => {
    const { mediaItems } = useNotifications();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    color: 'var(--primary-color)',
                    fontSize: '2.2rem',
                    marginBottom: '0.75rem',
                    fontWeight: '800'
                }}>
                    Media & Gallery
                </h1>
                <p style={{ color: '#666', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
                    Highlights of our social work, educational initiatives, events, and community activities.
                </p>
            </div>

            {mediaItems.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 1rem',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    color: '#888'
                }}>
                    <ImageIcon size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.1rem' }}>No media photos uploaded yet.</p>
                    <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.5rem' }}>
                        Photos added by the administrator will appear here.
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.75rem',
                }}>
                    {mediaItems.map((item) => (
                        <div key={item.id} style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '65%', backgroundColor: '#f0f0f0' }}>
                                <img
                                    src={item.imageUrl}
                                    alt={item.caption || 'Janseva Activity'}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.4s ease'
                                    }}
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Available'; }}
                                />
                            </div>
                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <h3 style={{
                                    fontSize: '1.05rem',
                                    fontWeight: '600',
                                    color: '#222',
                                    marginBottom: '0.5rem',
                                    lineHeight: '1.4'
                                }}>
                                    {item.caption || 'Community Event'}
                                </h3>
                                {item.createdAt && (
                                    <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: '0.8rem', marginTop: 'auto' }}>
                                        <Calendar size={13} style={{ marginRight: '5px' }} />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Media;
