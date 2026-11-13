import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import DonateModal from './DonateModal';

const Footer = () => {
    const [showDonate, setShowDonate] = useState(false);

    return (
        <>
            <footer
                id="contact-footer"
                style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '3rem 2rem', marginTop: 'auto' }}
            >
                <div style={{
                    maxWidth: '1200px', margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '2rem',
                }}>
                    {/* About */}
                    <div>
                        <h3 style={headStyle}>About Us</h3>
                        <p style={{ fontSize: '0.88rem', color: '#aaa', lineHeight: '1.7' }}>
                            JanSeva Shikshan and Samajik Bahuuddeshiy Sanstha — working towards
                            education, empowerment, and community welfare in Yavatmal, Maharashtra.
                        </p>
                        <p style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.75rem' }}>
                            Reg. No: Yavatmal/0000057/2026
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={headStyle}>Contact Us</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={liStyle}>
                                <MapPin size={18} style={iconStyle} />
                                <span style={textStyle}>
                                    Anushri Park, Yavatmal, Maharashtra – 445001
                                </span>
                            </li>
                            <li style={liStyle}>
                                <Phone size={18} style={iconStyle} />
                                <a href="tel:+918805589202" style={{ ...textStyle, textDecoration: 'none' }}>
                                    +91 88055 89202
                                </a>
                            </li>
                            <li style={liStyle}>
                                <Mail size={18} style={iconStyle} />
                                <span style={textStyle}>—</span>
                            </li>
                        </ul>
                    </div>

                    {/* Follow + Donate */}
                    <div>
                        <h3 style={headStyle}>Follow Us</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            {[Facebook, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" style={{ color: '#aaa', transition: 'color 0.3s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                                    <Icon size={22} />
                                </a>
                            ))}
                        </div>

                        <h3 style={headStyle}>Get Involved</h3>
                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.75rem' }}>
                            Join our mission. Volunteer or donate to bring hope and change.
                        </p>
                        <button
                            onClick={() => setShowDonate(true)}
                            style={{
                                display: 'inline-block',
                                padding: '0.55rem 1.3rem',
                                backgroundColor: 'var(--accent-color)',
                                color: '#fff',
                                borderRadius: '20px',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            💛 Donate Now
                        </button>
                    </div>
                </div>

                <div style={{
                    textAlign: 'center', marginTop: '2.5rem',
                    paddingTop: '1rem', borderTop: '1px solid #333',
                    fontSize: '0.78rem', color: '#666',
                }}>
                    © {new Date().getFullYear()} JanSeva Shikshan and Samajik Bahuuddeshiy Sanstha. All rights reserved.
                </div>
            </footer>

            {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}
        </>
    );
};

const headStyle = {
    color: '#fff',
    borderBottom: '2px solid var(--accent-color)',
    paddingBottom: '0.5rem',
    display: 'inline-block',
    marginBottom: '1rem',
};
const liStyle = { display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '10px' };
const iconStyle = { color: 'var(--accent-color)', flexShrink: 0, marginTop: '2px' };
const textStyle = { fontSize: '0.88rem', color: '#ccc' };

export default Footer;
