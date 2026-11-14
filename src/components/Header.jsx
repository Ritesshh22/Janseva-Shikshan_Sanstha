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
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [showDonate, setShowDonate] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

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
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}>
                {/* Branding Top Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '0.6rem 0.85rem' : '0.75rem 2rem',
                    borderBottom: '1px solid #edf2f7',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    gap: '0.75rem',
                }}>
                    {/* Left: Logo + Name + Reg No */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '0.6rem' : '1rem',
                        flex: 1,
                        minWidth: 0,
                    }}>
                        <img
                            src={LOGO_URL}
                            alt="Janseva Shikshan Sanstha Logo"
                            onError={(e) => { e.target.style.display = 'none'; }}
                            style={{
                                height: isMobile ? '50px' : (isTablet ? '64px' : '74px'),
                                width: isMobile ? '50px' : (isTablet ? '64px' : '74px'),
                                objectFit: 'contain',
                                borderRadius: '50%',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <Link to="/" style={{
                                fontSize: isMobile ? '0.92rem' : (isTablet ? '1.18rem' : '1.38rem'),
                                fontWeight: '800',
                                color: 'var(--primary-color)',
                                lineHeight: '1.2',
                                letterSpacing: '0.1px',
                                textDecoration: 'none',
                                display: 'block',
                                wordBreak: 'break-word',
                            }}>
                                JANSEVA SHIKSHAN AND SAMAJIK BAHUUDDESHIY SANSTHA
                            </Link>
                            <span style={{
                                fontSize: isMobile ? '0.72rem' : '0.84rem',
                                color: '#666',
                                fontWeight: '600',
                                marginTop: '0.2rem',
                                display: 'block',
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
                            padding: isMobile ? '0.4rem 0.65rem' : '0.5rem 1rem',
                            borderRadius: '30px',
                            backgroundColor: 'var(--secondary-color)',
                            color: 'var(--primary-color)',
                            transition: 'all 0.2s ease',
                            border: '1.5px solid #bcdbfb',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 4px rgba(0,86,179,0.06)',
                            flexShrink: 0,
                        }}
                    >
                        <Bell size={isMobile ? 15 : 18} style={{ marginRight: '5px' }} />
                        <span style={{ fontWeight: '700', fontSize: isMobile ? '0.78rem' : '0.88rem' }}>
                            Updates ({notifications.length})
                        </span>
                    </div>
                </div>

                {/* Navigation Bar */}
                <nav style={{
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                }}>
                    <div style={{
                        maxWidth: '1440px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? '0 0.85rem' : '0 2rem',
                    }}>
                        {/* Desktop links */}
                        {!isMobile && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        onClick={link.onClick || undefined}
                                        style={{
                                            color: '#fff',
                                            padding: isTablet ? '0.7rem 0.85rem' : '0.75rem 1.15rem',
                                            fontWeight: '600',
                                            fontSize: isTablet ? '0.88rem' : '0.95rem',
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
                                    color: '#fff', fontSize: '1.5rem',
                                    cursor: 'pointer', padding: '0.55rem 0', lineHeight: 1,
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
                                padding: isMobile ? '0.4rem 0.85rem' : '0.5rem 1.3rem',
                                borderRadius: '20px',
                                fontWeight: '700',
                                fontSize: isMobile ? '0.82rem' : '0.92rem',
                                display: 'inline-block',
                                margin: '0.35rem 0 0.35rem auto',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
                                whiteSpace: 'nowrap',
                                border: 'none',
                                cursor: 'pointer',
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
                        borderTop: '1px solid rgba(255,255,255,0.12)',
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
                                    padding: '0.7rem 1.25rem',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
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
