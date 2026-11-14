import { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Plus, Trash, LogOut, Image, CreditCard, KeyRound, Film, PhoneCall } from 'lucide-react';
import { auth } from '../firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box'
};

const sectionCard = {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #e8e8e8',
};

const btnPrimary = {
    padding: '0.75rem',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    borderRadius: '6px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
};

const ADMIN_KEY = 'janseva_admin_session';

const Admin = () => {
    const [user, setUser] = useState(() => {
        const local = localStorage.getItem(ADMIN_KEY);
        return local ? JSON.parse(local) : null;
    });
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [resetMsg, setResetMsg] = useState('');
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const [activeTab, setActiveTab] = useState('notifications');

    const {
        notifications, addNotification, deleteNotification,
        whatsNew, addWhatsNew, deleteWhatsNew,
        mediaItems, addMedia, deleteMedia,
        bankDetails, saveBankDetails,
        contactDetails, saveContactDetails,
        adminAuth, saveAdminAuth,
    } = useNotifications();

    const [newNotif, setNewNotif] = useState({ title: '', date: '', content: '', link: '' });
    const [notifMsg, setNotifMsg] = useState('');

    // What's New form state
    const [newPhoto, setNewPhoto] = useState({ imageUrl: '', caption: '' });
    const [photoMsg, setPhotoMsg] = useState('');
    const [photoMode, setPhotoMode] = useState('file'); // 'file' or 'url'

    // Media Gallery form state
    const [newMedia, setNewMedia] = useState({ imageUrl: '', caption: '' });
    const [mediaMsg, setMediaMsg] = useState('');
    const [mediaMode, setMediaMode] = useState('file'); // 'file' or 'url'

    // Helper to compress & convert local file to Base64
    const handleFileSelect = (file, setTarget, msgSetter) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, WEBP, etc.)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                // Resize image to max 1200px width/height to keep it fast & small
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 1200;

                if (width > height && width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to compressed jpeg data url
                const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
                setTarget(prev => ({ ...prev, imageUrl: dataUrl }));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Bank details form state
    const [bankForm, setBankForm] = useState({
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        branch: '',
        upiId: '',
    });
    const [bankMsg, setBankMsg] = useState('');

    // Contact details form state
    const [contactForm, setContactForm] = useState({
        phone: '9420799455',
        email: 'janseva00057@gmail.com',
        address: 'Anushri Park, Yavatmal, Maharashtra – 445001'
    });
    const [contactMsg, setContactMsg] = useState('');

    // Change password state
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState('');

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser({ email: u.email, uid: u.uid });
                localStorage.setItem(ADMIN_KEY, JSON.stringify({ email: u.email, uid: u.uid }));
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Sync bank details
    useEffect(() => {
        if (bankDetails) {
            setBankForm({
                accountName: bankDetails.accountName || '',
                accountNumber: bankDetails.accountNumber || '',
                bankName: bankDetails.bankName || '',
                ifscCode: bankDetails.ifscCode || '',
                branch: bankDetails.branch || '',
                upiId: bankDetails.upiId || '',
            });
        }
    }, [bankDetails]);

    // Sync contact details
    useEffect(() => {
        if (contactDetails) {
            setContactForm({
                phone: contactDetails.phone || '9420799455',
                email: contactDetails.email || 'janseva00057@gmail.com',
                address: contactDetails.address || 'Anushri Park, Yavatmal, Maharashtra – 445001'
            });
        }
    }, [contactDetails]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');

        const validEmail = (adminAuth?.email || 'admin@janseva.org').trim().toLowerCase();
        const validPassword = adminAuth?.password || 'AdminJanseva@2026#';

        const enteredEmail = email.trim().toLowerCase();
        if (enteredEmail === validEmail || enteredEmail === 'admin') {
            if (password === validPassword) {
                const session = { email: validEmail, uid: 'admin_master' };
                setUser(session);
                localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
                return;
            } else {
                setAuthError('Incorrect password. Please enter the valid admin password.');
                return;
            }
        } else {
            setAuthError('Invalid admin email address.');
            return;
        }
    };

    const handleLogout = async () => {
        try { await signOut(auth); } catch (e) { console.error(e); }
        setUser(null);
        localStorage.removeItem(ADMIN_KEY);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwMsg('');
        if (pwForm.newPw !== pwForm.confirm) {
            setPwMsg('❌ New passwords do not match.'); return;
        }
        if (pwForm.newPw.length < 8) {
            setPwMsg('❌ Strong password must be at least 8 characters.'); return;
        }

        const validPassword = adminAuth?.password || 'AdminJanseva@2026#';
        if (pwForm.current !== validPassword) {
            setPwMsg('❌ Current password is incorrect.');
            return;
        }

        await saveAdminAuth({
            email: adminAuth?.email || 'admin@janseva.org',
            password: pwForm.newPw,
            updatedAt: new Date().toISOString()
        });

        setPwForm({ current: '', newPw: '', confirm: '' });
        setPwMsg('✅ Strong Password successfully updated and synced across all devices!');
        setTimeout(() => setPwMsg(''), 4000);
    };

    const handleAddNotif = async (e) => {
        e.preventDefault();
        if (newNotif.title && newNotif.date && newNotif.content) {
            await addNotification(newNotif);
            setNewNotif({ title: '', date: '', content: '', link: '' });
            setNotifMsg('✅ Notification added successfully!');
            setTimeout(() => setNotifMsg(''), 3000);
        }
    };

    const handleAddPhoto = async (e) => {
        e.preventDefault();
        if (!newPhoto.imageUrl) return;
        await addWhatsNew(newPhoto);
        setNewPhoto({ imageUrl: '', caption: '' });
        setPhotoMsg('✅ What\'s New photo added successfully!');
        setTimeout(() => setPhotoMsg(''), 3000);
    };

    const handleAddMedia = async (e) => {
        e.preventDefault();
        if (!newMedia.imageUrl) return;
        await addMedia(newMedia);
        setNewMedia({ imageUrl: '', caption: '' });
        setMediaMsg('✅ Media photo added successfully!');
        setTimeout(() => setMediaMsg(''), 3000);
    };

    const handleSaveBankDetails = async (e) => {
        e.preventDefault();
        await saveBankDetails(bankForm);
        setBankMsg('✅ Bank details saved successfully!');
        setTimeout(() => setBankMsg(''), 3000);
    };

    const handleSaveContactDetails = async (e) => {
        e.preventDefault();
        await saveContactDetails(contactForm);
        setContactMsg('✅ Contact details saved successfully!');
        setTimeout(() => setContactMsg(''), 3000);
    };

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '5rem', color: '#666' }}>Loading...</div>
    );

    // ── Login Form ──────────────────────────────────────────────────────────────
    if (!user) {
        return (
            <div style={{
                maxWidth: '420px', margin: '4rem auto', padding: '2rem',
                border: '1px solid #e0e0e0', borderRadius: '14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center',
                backgroundColor: '#fff',
            }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Admin Portal</h2>
                <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                    Sign in to manage announcements, gallery & details.
                </p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    {authError && <p style={{ color: 'red', fontSize: '0.85rem', lineHeight: '1.4' }}>{authError}</p>}
                    <button type="submit" style={{ ...btnPrimary, fontSize: '1rem' }}>
                        Login to Dashboard
                    </button>
                </form>
            </div>
        );
    }

    // ── Dashboard ──────────────────────────────────────────────────────────────
    const tabs = [
        { key: 'notifications', label: '🔔 Notifications' },
        { key: 'whatsNew', label: '📸 What\'s New' },
        { key: 'media', label: '🖼️ Media & Gallery' },
        { key: 'bank', label: '🏦 Donate & Bank' },
        { key: 'contact', label: '📞 Contact Details' },
        { key: 'security', label: '🔑 Password' },
    ];

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <h1 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.75rem' }}>Admin Dashboard</h1>
                    <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Logged in as: {user.email}</p>
                </div>
                <button onClick={handleLogout} style={{
                    padding: '0.5rem 1.1rem', backgroundColor: '#ff4d4f',
                    color: '#fff', borderRadius: '6px', display: 'flex',
                    alignItems: 'center', gap: '6px', fontWeight: '600', border: 'none', cursor: 'pointer',
                }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', borderBottom: '2px solid #e0e0e0',
                marginBottom: '1.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch'
            }}>
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                        padding: '0.65rem 1rem',
                        border: 'none',
                        borderBottom: activeTab === tab.key ? '3px solid var(--primary-color)' : '3px solid transparent',
                        backgroundColor: 'transparent',
                        fontWeight: activeTab === tab.key ? '700' : '500',
                        color: activeTab === tab.key ? 'var(--primary-color)' : '#666',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        marginBottom: '-2px',
                        whiteSpace: 'nowrap',
                    }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── TAB: Notifications ── */}
            {activeTab === 'notifications' && (
                <>
                    <div style={sectionCard}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                            <Plus size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                            Add Announcement / Notification
                        </h3>
                        <form onSubmit={handleAddNotif} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <input type="text" placeholder="Title *"
                                value={newNotif.title}
                                onChange={e => setNewNotif({ ...newNotif, title: e.target.value })}
                                required style={inputStyle} />
                            <input type="date" value={newNotif.date}
                                onChange={e => setNewNotif({ ...newNotif, date: e.target.value })}
                                required style={inputStyle} />
                            <textarea placeholder="Content / Details *"
                                value={newNotif.content}
                                onChange={e => setNewNotif({ ...newNotif, content: e.target.value })}
                                required rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }} />
                            <input type="url" placeholder="Google Form / Registration Link (optional)"
                                value={newNotif.link}
                                onChange={e => setNewNotif({ ...newNotif, link: e.target.value })}
                                style={inputStyle} />
                            <button type="submit" style={btnPrimary}>
                                <Plus size={18} /> Publish Notification
                            </button>
                            {notifMsg && <p style={{ color: 'green', fontSize: '0.9rem' }}>{notifMsg}</p>}
                        </form>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Active Announcements ({notifications.length})</h3>
                        {notifications.length === 0
                            ? <p style={{ color: '#aaa' }}>No notifications published yet.</p>
                            : notifications.map(n => (
                                <div key={n.id} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', padding: '1rem',
                                    border: '1px solid #eee', borderRadius: '8px',
                                    backgroundColor: '#fff', marginBottom: '0.75rem',
                                }}>
                                    <div>
                                        <strong style={{ color: '#333' }}>{n.title}</strong>
                                        <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#888' }}>
                                            ({n.date})
                                        </span>
                                        <p style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.25rem' }}>
                                            {n.content?.slice(0, 80)}{n.content?.length > 80 ? '...' : ''}
                                        </p>
                                    </div>
                                    <button onClick={() => deleteNotification(n.id)}
                                        style={{ color: 'red', background: 'none', padding: '0.4rem', border: 'none', cursor: 'pointer' }}
                                        title="Delete">
                                        <Trash size={18} />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </>
            )}

            {/* ── TAB: What's New Photos ── */}
            {activeTab === 'whatsNew' && (
                <>
                    <div style={sectionCard}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                            <Image size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                            Add Photo to Home Page "What's New" Slider
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
                            Choose a photo directly from your device/phone or paste an image URL.
                        </p>

                        {/* Mode Toggle */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setPhotoMode('file')}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    border: photoMode === 'file' ? '2px solid var(--primary-color)' : '1px solid #ccc',
                                    backgroundColor: photoMode === 'file' ? '#e3f2fd' : '#fff',
                                    fontWeight: photoMode === 'file' ? '700' : '500',
                                    color: photoMode === 'file' ? 'var(--primary-color)' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                📁 Choose from Phone / PC
                            </button>
                            <button
                                type="button"
                                onClick={() => setPhotoMode('url')}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    border: photoMode === 'url' ? '2px solid var(--primary-color)' : '1px solid #ccc',
                                    backgroundColor: photoMode === 'url' ? '#e3f2fd' : '#fff',
                                    fontWeight: photoMode === 'url' ? '700' : '500',
                                    color: photoMode === 'url' ? 'var(--primary-color)' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                🔗 Image URL
                            </button>
                        </div>

                        <form onSubmit={handleAddPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {photoMode === 'file' ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e.target.files[0], setNewPhoto)}
                                        style={{
                                            ...inputStyle,
                                            padding: '0.5rem',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    <span style={{ fontSize: '0.78rem', color: '#888', display: 'block', marginTop: '4px' }}>
                                        Supports JPG, PNG, WEBP (auto-compressed for fast loading)
                                    </span>
                                </div>
                            ) : (
                                <input type="url" placeholder="Image URL * (e.g. https://...)"
                                    value={newPhoto.imageUrl}
                                    onChange={e => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                                    required={photoMode === 'url'} style={inputStyle} />
                            )}

                            <input type="text" placeholder="Caption (optional)"
                                value={newPhoto.caption}
                                onChange={e => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                                style={inputStyle} />

                            {newPhoto.imageUrl && (
                                <div style={{
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    maxHeight: '220px',
                                    border: '1px solid #ddd',
                                    backgroundColor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img src={newPhoto.imageUrl} alt="preview"
                                        style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }}
                                        onError={e => e.target.style.display = 'none'} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!newPhoto.imageUrl}
                                style={{
                                    ...btnPrimary,
                                    opacity: newPhoto.imageUrl ? 1 : 0.6,
                                    cursor: newPhoto.imageUrl ? 'pointer' : 'not-allowed'
                                }}
                            >
                                <Plus size={18} /> Add to What's New
                            </button>
                            {photoMsg && <p style={{ color: 'green', fontSize: '0.9rem' }}>{photoMsg}</p>}
                        </form>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Slider Photos ({whatsNew.length})</h3>
                        {whatsNew.length === 0
                            ? <p style={{ color: '#aaa' }}>No photos in What's New slider.</p>
                            : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                    gap: '1rem',
                                }}>
                                    {whatsNew.map(p => (
                                        <div key={p.id} style={{
                                            borderRadius: '10px', overflow: 'hidden',
                                            border: '1px solid #e0e0e0', backgroundColor: '#fff',
                                        }}>
                                            <img src={p.imageUrl} alt={p.caption || ''}
                                                style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                                                onError={e => e.target.style.display = 'none'} />
                                            <div style={{ padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.82rem', color: '#555', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {p.caption || <em style={{ color: '#bbb' }}>No caption</em>}
                                                </span>
                                                <button onClick={() => deleteWhatsNew(p.id)}
                                                    style={{ color: 'red', background: 'none', marginLeft: '8px', border: 'none', cursor: 'pointer' }}
                                                    title="Delete">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </>
            )}

            {/* ── TAB: Media & Gallery ── */}
            {activeTab === 'media' && (
                <>
                    <div style={sectionCard}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                            <Film size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                            Add Photo to Media & Gallery Page
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
                            Choose an activity photo directly from your device/phone or paste an image URL.
                        </p>

                        {/* Mode Toggle */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setMediaMode('file')}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    border: mediaMode === 'file' ? '2px solid var(--primary-color)' : '1px solid #ccc',
                                    backgroundColor: mediaMode === 'file' ? '#e3f2fd' : '#fff',
                                    fontWeight: mediaMode === 'file' ? '700' : '500',
                                    color: mediaMode === 'file' ? 'var(--primary-color)' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                📁 Choose from Phone / PC
                            </button>
                            <button
                                type="button"
                                onClick={() => setMediaMode('url')}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    border: mediaMode === 'url' ? '2px solid var(--primary-color)' : '1px solid #ccc',
                                    backgroundColor: mediaMode === 'url' ? '#e3f2fd' : '#fff',
                                    fontWeight: mediaMode === 'url' ? '700' : '500',
                                    color: mediaMode === 'url' ? 'var(--primary-color)' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                🔗 Image URL
                            </button>
                        </div>

                        <form onSubmit={handleAddMedia} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {mediaMode === 'file' ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e.target.files[0], setNewMedia)}
                                        style={{
                                            ...inputStyle,
                                            padding: '0.5rem',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    <span style={{ fontSize: '0.78rem', color: '#888', display: 'block', marginTop: '4px' }}>
                                        Supports JPG, PNG, WEBP (auto-compressed for fast loading)
                                    </span>
                                </div>
                            ) : (
                                <input type="url" placeholder="Image URL * (e.g. https://...)"
                                    value={newMedia.imageUrl}
                                    onChange={e => setNewMedia({ ...newMedia, imageUrl: e.target.value })}
                                    required={mediaMode === 'url'} style={inputStyle} />
                            )}

                            <input type="text" placeholder="Title / Caption * (e.g. Tree Plantation Drive 2026)"
                                value={newMedia.caption}
                                onChange={e => setNewMedia({ ...newMedia, caption: e.target.value })}
                                required style={inputStyle} />

                            {newMedia.imageUrl && (
                                <div style={{
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    maxHeight: '220px',
                                    border: '1px solid #ddd',
                                    backgroundColor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img src={newMedia.imageUrl} alt="preview"
                                        style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }}
                                        onError={e => e.target.style.display = 'none'} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!newMedia.imageUrl}
                                style={{
                                    ...btnPrimary,
                                    opacity: newMedia.imageUrl ? 1 : 0.6,
                                    cursor: newMedia.imageUrl ? 'pointer' : 'not-allowed'
                                }}
                            >
                                <Plus size={18} /> Add to Media Gallery
                            </button>
                            {mediaMsg && <p style={{ color: 'green', fontSize: '0.9rem' }}>{mediaMsg}</p>}
                        </form>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Gallery Photos ({mediaItems.length})</h3>
                        {mediaItems.length === 0
                            ? <p style={{ color: '#aaa' }}>No gallery photos added yet.</p>
                            : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                    gap: '1rem',
                                }}>
                                    {mediaItems.map(m => (
                                        <div key={m.id} style={{
                                            borderRadius: '10px', overflow: 'hidden',
                                            border: '1px solid #e0e0e0', backgroundColor: '#fff',
                                        }}>
                                            <img src={m.imageUrl} alt={m.caption || ''}
                                                style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                                                onError={e => e.target.style.display = 'none'} />
                                            <div style={{ padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.82rem', color: '#555', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {m.caption || <em style={{ color: '#bbb' }}>No caption</em>}
                                                </span>
                                                <button onClick={() => deleteMedia(m.id)}
                                                    style={{ color: 'red', background: 'none', marginLeft: '8px', border: 'none', cursor: 'pointer' }}
                                                    title="Delete">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </>
            )}

            {/* ── TAB: Bank Details ── */}
            {activeTab === 'bank' && (
                <div style={sectionCard}>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                        <CreditCard size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        Donation & Bank Details
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.25rem' }}>
                        Visitors will see these details in the "Donate" popup.
                    </p>
                    <form onSubmit={handleSaveBankDetails} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <input type="text" placeholder="Account Holder Name *"
                            value={bankForm.accountName}
                            onChange={e => setBankForm({ ...bankForm, accountName: e.target.value })}
                            required style={inputStyle} />
                        <input type="text" placeholder="Account Number *"
                            value={bankForm.accountNumber}
                            onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                            required style={inputStyle} />
                        <input type="text" placeholder="Bank Name *"
                            value={bankForm.bankName}
                            onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
                            required style={inputStyle} />
                        <input type="text" placeholder="IFSC Code *"
                            value={bankForm.ifscCode}
                            onChange={e => setBankForm({ ...bankForm, ifscCode: e.target.value })}
                            required style={inputStyle} />
                        <input type="text" placeholder="Branch Name"
                            value={bankForm.branch}
                            onChange={e => setBankForm({ ...bankForm, branch: e.target.value })}
                            style={inputStyle} />
                        <input type="text" placeholder="UPI ID (optional)"
                            value={bankForm.upiId}
                            onChange={e => setBankForm({ ...bankForm, upiId: e.target.value })}
                            style={inputStyle} />
                        <button type="submit" style={btnPrimary}>
                            <CreditCard size={18} /> Save Bank Details
                        </button>
                        {bankMsg && <p style={{ color: 'green', fontSize: '0.9rem' }}>{bankMsg}</p>}
                    </form>
                </div>
            )}

            {/* ── TAB: Contact Details ── */}
            {activeTab === 'contact' && (
                <div style={sectionCard}>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                        <PhoneCall size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        Update Contact Details
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.25rem' }}>
                        These details are displayed in the footer and contact sections across the website.
                    </p>
                    <form onSubmit={handleSaveContactDetails} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#444', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                            <input type="text" placeholder="e.g. 9420799455 *"
                                value={contactForm.phone}
                                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#444', display: 'block', marginBottom: '4px' }}>Email Address</label>
                            <input type="email" placeholder="e.g. janseva00057@gmail.com *"
                                value={contactForm.email}
                                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#444', display: 'block', marginBottom: '4px' }}>Office Address</label>
                            <textarea placeholder="Address *"
                                value={contactForm.address}
                                onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                                required rows={2}
                                style={{ ...inputStyle, resize: 'vertical' }} />
                        </div>
                        <button type="submit" style={btnPrimary}>
                            <PhoneCall size={18} /> Save Contact Details
                        </button>
                        {contactMsg && <p style={{ color: 'green', fontSize: '0.9rem' }}>{contactMsg}</p>}
                    </form>
                </div>
            )}

            {/* ── TAB: Change Password ── */}
            {activeTab === 'security' && (
                <div style={sectionCard}>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                        <KeyRound size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        Change Admin Password
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.25rem' }}>
                        Set a new password for future dashboard logins.
                    </p>
                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <input type="password" placeholder="Current Password *"
                            value={pwForm.current}
                            onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                            required style={inputStyle} />
                        <input type="password" placeholder="New Password * (min. 6 characters)"
                            value={pwForm.newPw}
                            onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })}
                            required style={inputStyle} />
                        <input type="password" placeholder="Confirm New Password *"
                            value={pwForm.confirm}
                            onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                            required style={inputStyle} />
                        <button type="submit" style={btnPrimary}>
                            <KeyRound size={18} /> Update Password
                        </button>
                        {pwMsg && (
                            <p style={{
                                fontSize: '0.9rem',
                                color: pwMsg.startsWith('✅') ? 'green' : 'red',
                            }}>{pwMsg}</p>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};

export default Admin;
