import { useNotifications } from '../context/NotificationContext';

const DonateModal = ({ onClose }) => {
    const { bankDetails } = useNotifications();

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, padding: '1rem',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '2rem',
                    maxWidth: '460px',
                    width: '100%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    position: 'relative',
                    animation: 'fadeIn 0.2s ease',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: '#f0f0f0', border: 'none', borderRadius: '50%',
                        width: '32px', height: '32px', fontSize: '1.1rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >✕</button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>💛</div>
                    <h2 style={{ color: 'var(--primary-color)', margin: '0.5rem 0 0.25rem' }}>
                        Support Our Cause
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        Your donation helps us serve the community better.
                    </p>
                </div>

                {!bankDetails ? (
                    <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>
                        Bank details not available yet. Please contact us directly.
                    </p>
                ) : (
                    <div style={{
                        backgroundColor: '#f0f7ff',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px solid #c8e0fb',
                    }}>
                        <h3 style={{
                            color: 'var(--primary-color)', marginBottom: '1rem',
                            fontSize: '1rem', textAlign: 'center',
                            borderBottom: '1px solid #c8e0fb', paddingBottom: '0.5rem',
                        }}>
                            🏦 Bank Account Details
                        </h3>

                        {[
                            { label: 'Account Holder', value: bankDetails.accountName },
                            { label: 'Account Number', value: bankDetails.accountNumber },
                            { label: 'Bank Name', value: bankDetails.bankName },
                            { label: 'IFSC Code', value: bankDetails.ifscCode },
                            { label: 'Branch', value: bankDetails.branch },
                        ].map(row => row.value && (
                            <div key={row.label} style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '0.6rem',
                                flexWrap: 'wrap', gap: '0.25rem',
                            }}>
                                <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500', minWidth: '130px' }}>
                                    {row.label}
                                </span>
                                <span style={{
                                    fontSize: '0.9rem', color: '#222', fontWeight: '700',
                                    backgroundColor: '#fff', padding: '0.2rem 0.6rem',
                                    borderRadius: '6px', border: '1px solid #dde',
                                    letterSpacing: '0.3px',
                                }}>
                                    {row.value}
                                </span>
                            </div>
                        ))}

                        {bankDetails.upiId && (
                            <div style={{
                                marginTop: '1rem', paddingTop: '1rem',
                                borderTop: '1px solid #c8e0fb', textAlign: 'center',
                            }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.4rem' }}>
                                    Or pay via UPI
                                </p>
                                <span style={{
                                    fontSize: '1rem', fontWeight: '800',
                                    color: 'var(--primary-color)',
                                    backgroundColor: '#fff', padding: '0.4rem 1rem',
                                    borderRadius: '8px', border: '1px solid var(--primary-color)',
                                    display: 'inline-block',
                                }}>
                                    {bankDetails.upiId}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <p style={{
                    textAlign: 'center', marginTop: '1.25rem',
                    fontSize: '0.8rem', color: '#aaa',
                }}>
                    Thank you for your generous support 🙏
                </p>
            </div>
        </div>
    );
};

export default DonateModal;
