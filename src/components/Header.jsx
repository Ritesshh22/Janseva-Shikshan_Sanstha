import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import DonateModal from './DonateModal';
import NotificationsModal from './NotificationsModal';

const LOGO_URL = '/logo.jpg';

const Header = () => {
    const { notifications } = useNotifications();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 820);
    const [showDonate, setShowDonate] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 820);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleContactClick = (e) => {
        e.preventDefault();
        setMenuOpen(false);
        const footer = document.getElementById('contact-footer');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'About Us', to: '/about' },
        { label: 'Media', to: '/media' },
        { label: 'Contact', to: '#contact', onClick: handleContactClick },
        { label: 'Login', to: '/admin' },
    ];

    return (
        <>
            <header style={{
                backgroundColor: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}>
                {/* Branding Top Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '0.75rem 1rem' : '0.85rem 2.5rem',
                    borderBottom: '1px solid #eef2f6',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    gap: '1rem',
                }}>
                    {/* Left: Logo + Sanstha Name + Reg No Side-by-Side */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '0.75rem' : '1.25rem',
                        flex: 1,
                    }}>
                        <img
                            src={LOGO_URL}
                            alt="Janseva Shikshan Sanstha Logo"
                            onError={(e) => { e.target.style.display = 'none'; }}
                            style={{
                                height: isMobile ? '56px' : '78px',
                                width: isMobile ? '56px' : '78px',
                                objectFit: 'contain',
                                borderRadius: '50%',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Link to="/" style={{
                                fontSize: isMobile ? '1.05rem' : '1.45rem',
                                fontWeight: '800',
                                color: 'var(--primary-color)',
                                lineHeight: '1.25',
                                letterSpacing: '0.2px',
                                textDecoration: 'none',
                            }}>
                                JANSEVA SHIKSHAN AND SAMAJIK BAHUUDDESHIY SANSTHA
                            </Link>
                            <span style={{
                                fontSize: isMobile ? '0.75rem' : '0.88rem',
                                color: '#666',
                                fontWeight: '600',
                                marginTop: '0.25rem',
                                letterSpacing: '0.3px',
                            }}>
                                Reg. No: Yavatmal/0000057/2026
                            </span>
                        </div>
                    </div>

                    {/* Right: Updates Button */}
                    <div
                        onClick={() => setShowUpdates(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: isMobile ? '0.45rem 0.75rem' : '0.55rem 1.15rem',
                            borderRadius: '30px',
                            backgroundColor: 'var(--secondary-color)',
                            color: 'var(--primary-color)',
                            transition: 'all 0.2s ease',
                            border: '1.5px solid #bcdbfb',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 5px rgba(0,86,179,0.08)',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#d2e8fc';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--secondary-color)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Bell size={isMobile ? 16 : 18} style={{ marginRight: '6px' }} />
                        <span style={{ fontWeight: '700', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                            Updates ({notifications.length})
                        </span>
                    </div>
                </div>

                {/* Navigation Bar */}
                <nav style={{
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? '0 1rem' : '0 2rem',
                    }}>
                        {/* Desktop links */}
                        {!isMobile && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        onClick={link.onClick || undefined}
                                        style={{
                                            color: '#fff',
                                            padding: '0.8rem 1.25rem',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            display: 'block',
                                            transition: 'background 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        {isMobile && (
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#fff', fontSize: '1.6rem',
                                    cursor: 'pointer', padding: '0.6rem 0', lineHeight: 1,
                                }}
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? '✕' : '☰'}
                            </button>
                        )}

                        {/* Donate Button */}
                        <button
                            onClick={() => { setShowDonate(true); setMenuOpen(false); }}
                            style={{
                                backgroundColor: 'var(--accent-color)',
                                color: '#fff',
                                padding: isMobile ? '0.45rem 1rem' : '0.55rem 1.4rem',
                                borderRadius: '22px',
                                fontWeight: '700',
                                fontSize: isMobile ? '0.85rem' : '0.95rem',
                                display: 'inline-block',
                                margin: '0.4rem 0 0.4rem auto',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                transition: 'opacity 0.2s, transform 0.2s',
                                whiteSpace: 'nowrap',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.opacity = '0.9';
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            💛 Donate
                        </button>
                    </div>
                </nav>

                {/* Mobile dropdown menu */}
                {isMobile && menuOpen && (
                    <div style={{
                        backgroundColor: 'var(--primary-color)',
                        borderTop: '1px solid rgba(255,255,255,0.15)',
                        paddingBottom: '0.5rem',
                    }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={link.onClick || (() => setMenuOpen(false))}
                                style={{
                                    display: 'block',
                                    color: '#fff',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            {/* Donate Modal */}
            {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}

            {/* Updates / Notifications Modal */}
            {showUpdates && <NotificationsModal onClose={() => setShowUpdates(false)} />}
        </>
    );
};

export default Header;
