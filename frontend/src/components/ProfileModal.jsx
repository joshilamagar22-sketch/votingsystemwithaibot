import React from 'react'

function ProfileModal({ isOpen, onClose }) {
    if (!isOpen) return null

    // Retrieve active logged-in user from voteai storage
    const currentUser = JSON.parse(localStorage.getItem('voteai_current_user') || '{}')

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '500px',
                padding: '30px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
                >
                    ✕
                </button>

                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    {currentUser.role === 'candidate' && currentUser.photoUrl ? (
                        <img
                            src={currentUser.photoUrl}
                            alt={currentUser.name}
                            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #0284c7', marginBottom: '12px' }}
                        />
                    ) : (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                            👤
                        </div>
                    )}
                    <h2 style={{ margin: '5px 0', color: '#0f172a' }}>{currentUser.name || 'User Profile'}</h2>
                    <span style={{ background: currentUser.role === 'candidate' ? '#e0f2fe' : '#f0fdf4', color: currentUser.role === 'candidate' ? '#0369a1' : '#166534', padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {currentUser.role === 'candidate' ? `Candidate (${currentUser.position})` : 'Registered Voter'}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                        <strong style={{ color: '#64748b' }}>Full Name:</strong>
                        <span style={{ color: '#0f172a', fontWeight: '600' }}>{currentUser.name}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                        <strong style={{ color: '#64748b' }}>Voter ID:</strong>
                        <span style={{ color: '#0f172a', fontWeight: '600' }}>{currentUser.voterId}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                        <strong style={{ color: '#64748b' }}>Email:</strong>
                        <span style={{ color: '#0f172a', fontWeight: '600' }}>{currentUser.email}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: currentUser.role === 'candidate' ? '1px solid #e2e8f0' : 'none', paddingBottom: currentUser.role === 'candidate' ? '8px' : '0' }}>
                        <strong style={{ color: '#64748b' }}>Phone Number:</strong>
                        <span style={{ color: '#0f172a', fontWeight: '600' }}>{currentUser.phoneNumber}</span>
                    </div>

                    {currentUser.role === 'candidate' && (
                        <div style={{ paddingTop: '4px' }}>
                            <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Manifesto / Goals:</strong>
                            <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', fontStyle: 'italic' }}>
                                "{currentUser.description || 'No manifesto provided.'}"
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Close Profile
                </button>
            </div>
        </div>
    )
}

export default ProfileModal