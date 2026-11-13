import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';

// ── WhatsNew Carousel ──────────────────────────────────────────────────────────
const WhatsNewCarousel = ({ items }) => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % items.length);
        }, 3500);
    };

    useEffect(() => {
        if (items.length > 1) startTimer();
        return () => clearInterval(timerRef.current);
    }, [items.length]);

    if (!items || items.length === 0) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '220px', color: '#aaa', fontSize: '0.95rem',
                backgroundColor: '#f0f4fa', borderRadius: '10px',
            }}>
                No updates or photos added yet.
            </div>
        );
    }

    const goTo = (idx) => {
        clearInterval(timerRef.current);
        setCurrent(idx);
        startTimer();
    };

    return (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
            {/* Image */}
            <img
                src={items[current].imageUrl}
                alt={items[current].caption || 'What\'s New'}
                style={{
                    width: '100%',
                    maxHeight: '340px',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'opacity 0.4s ease',
                }}
            />

            {/* Caption */}
            {items[current].caption && (
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: '#fff', padding: '1.2rem 1rem 0.75rem',
                    fontSize: '0.95rem', fontWeight: '500',
                }}>
                    {items[current].caption}
                </div>
            )}

            {/* Prev / Next arrows */}
            {items.length > 1 && (
                <>
                    <button onClick={() => goTo((current - 1 + items.length) % items.length)}
                        style={arrowStyle('left')}>‹</button>
                    <button onClick={() => goTo((current + 1) % items.length)}
                        style={arrowStyle('right')}>›</button>
                </>
            )}

            {/* Dots */}
            {items.length > 1 && (
                <div style={{
                    position: 'absolute', bottom: '8px', left: '50%',
                    transform: 'translateX(-50%)', display: 'flex', gap: '6px',
                }}>
                    {items.map((_, i) => (
                        <span key={i} onClick={() => goTo(i)} style={{
                            width: i === current ? '20px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};

const arrowStyle = (side) => ({
    position: 'absolute',
    top: '50%',
    [side]: '10px',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.45)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: 0,
});

// ── Main Home Page ─────────────────────────────────────────────────────────────
const Home = () => {
    const { whatsNew } = useNotifications();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

            {/* What's New Box */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{
                    border: '2px solid var(--primary-color)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,86,179,0.1)',
                }}>
                    <div style={{
                        backgroundColor: 'var(--primary-color)',
                        color: '#fff',
                        padding: '0.65rem 1.25rem',
                        fontWeight: '700',
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        🔔 What's New
                    </div>
                    <div style={{ padding: '0' }}>
                        <WhatsNewCarousel items={whatsNew} />
                    </div>
                </div>
            </section>

            {/* Hero Section */}
            <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                    Bringing Hope to Every Life
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                    We are dedicated to creating a sustainable future where every individual has access
                    to education, healthcare, and a dignified life.
                </p>
            </section>

            {/* Vision & Mission */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem',
            }}>
                <div style={cardStyle('left', 'var(--primary-color)')}>
                    <h2 style={{ color: 'var(--primary-color)' }}>Our Vision</h2>
                    <p style={{ marginTop: '1rem', lineHeight: '1.8', color: '#444' }}>
                        To build an empowered, educated, and self-reliant society where every individual has equal
                        access to quality education, skill development, healthcare awareness, and livelihood opportunities.
                        We envision an inclusive community where children learn without barriers, youth gain meaningful
                        employment, women become confident and independent, and underprivileged families live with dignity.
                    </p>
                </div>
                <div style={cardStyle('right', 'var(--accent-color)')}>
                    <h2 style={{ color: 'var(--accent-color)', textAlign: 'right' }}>Our Mission</h2>
                    <p style={{ marginTop: '1rem', lineHeight: '1.8', color: '#444', textAlign: 'right' }}>
                        JanSeva Shikshan Sanstha is committed to driving positive social change through education,
                        awareness, and community support initiatives. Our mission is to promote quality education and
                        skill development for children, youth, and women; provide humanitarian support to underprivileged
                        families; and reduce unemployment through training and employment-oriented programs.
                    </p>
                </div>
            </section>

            {/* Board Members */}
            <section style={{
                backgroundColor: '#e3f2fd',
                padding: '2.5rem',
                borderRadius: '16px',
                textAlign: 'center',
            }}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Our Board Members</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.25rem',
                    textAlign: 'left',
                    maxWidth: '1000px',
                    margin: '0 auto',
                }}>
                    {[
                        { name: 'Harsha Anant Sawale', role: 'President' },
                        { name: 'Priyanka Keshav Dudhane', role: 'Vice President' },
                        { name: 'Ritesh Anant Sawale', role: 'Secretary' },
                        { name: 'Manoj Gajana Ujwane', role: 'Member' },
                        { name: 'Tejaswini Mayur Mawale', role: 'Member' },
                        { name: 'Rani Chandrakant Katyarmal', role: 'Member' },
                        { name: 'Gunvant Kisan Sawale', role: 'Member' },
                    ].map((m, i) => (
                        <div key={i} style={{
                            backgroundColor: '#fff',
                            padding: '1.25rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
                        }}>
                            <h3 style={{ fontSize: '1rem', color: '#333', marginBottom: '0.25rem' }}>{m.name}</h3>
                            <p style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}>{m.role}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

const cardStyle = (borderSide, color) => ({
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
    [`border${borderSide.charAt(0).toUpperCase() + borderSide.slice(1)}`]: `5px solid ${color}`,
});

export default Home;
