import React, { useState, useEffect } from 'react'
import ProfileModal from '../components/ProfileModal.jsx' // 👈 Import ProfileModal

function CandidatePage() {
    // Current Active Logged-in Candidate Session
    const [currentUser, setCurrentUser] = useState({})

    // UI States
    const [showProfile, setShowProfile] = useState(false)
    const [candidates, setCandidates] = useState([])
    const [results, setResults] = useState({})

    useEffect(() => {
        // 1. Get logged-in candidate profile
        const activeUser = JSON.parse(localStorage.getItem('voteai_current_user') || '{}')
        setCurrentUser(activeUser)

        // 2. Fetch all registered candidates
        const storedCandidates = JSON.parse(
            localStorage.getItem('voteai_candidates') ||
            localStorage.getItem('candidates') ||
            '[]'
        )
        setCandidates(storedCandidates)

        // 3. Fetch live election vote counts
        const storedResults = JSON.parse(localStorage.getItem('voteai_results') || '{}')
        setResults(storedResults)
    }, [])

    // Get total votes cast for percentage calculations
    const totalVotesCast = Object.values(results).reduce((a, b) => a + b, 0) || 1

    // Get total votes specific to this candidate
    const myVoteCount = results[currentUser.name] || 0
    const myPercentage = Math.round((myVoteCount / totalVotesCast) * 100) || 0

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
            {/* Top Banner Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#fff',
                padding: '30px',
                borderRadius: '16px',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>Candidate Portal 🏅</h1>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
                        Welcome, <strong>{currentUser.name || 'Candidate'}</strong> ({currentUser.position || 'Position Unspecified'})
                    </p>
                </div>

                {/* Profile Button */}
                <button
                    onClick={() => setShowProfile(true)}
                    style={{
                        padding: '12px 20px',
                        fontSize: '0.95rem',
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                    }}
                >
                    👤 My Profile
                </button>
            </div>

            {/* Candidate Live Tally Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ padding: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Your Running Position</h4>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#0284c7' }}>
                        {currentUser.position || 'Not Set'}
                    </p>
                </div>
                <div style={{ padding: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Votes Secured</h4>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#16a34a' }}>
                        {myVoteCount} Votes ({myPercentage}%)
                    </p>
                </div>
                <div style={{ padding: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Total Ballot Count</h4>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#0f172a' }}>
                        {totalVotesCast === 1 && Object.keys(results).length === 0 ? 0 : totalVotesCast} Total Cast
                    </p>
                </div>
            </div>

            {/* Live Standings across all Candidates */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#0f172a', borderBottom: '2px solid #87ceeb', paddingBottom: '8px', marginBottom: '20px' }}>
                    📊 Live Election Tally
                </h2>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    {candidates.length === 0 ? (
                        <p style={{ margin: 0, color: '#64748b', textAlign: 'center' }}>No candidates found in the election records.</p>
                    ) : (
                        candidates.map((candidate, idx) => {
                            const count = results[candidate.name] || 0
                            const percentage = Math.round((count / totalVotesCast) * 100) || 0
                            const isMe = candidate.name === currentUser.name

                            return (
                                <div key={idx} style={{ marginBottom: '20px', padding: isMe ? '12px' : '0', background: isMe ? '#f0f9ff' : 'transparent', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: '600', color: '#334155' }}>
                                        <span>
                                            {candidate.name} {isMe && <strong style={{ color: '#0284c7' }}>(YOU)</strong>}
                                            <small style={{ color: '#64748b', marginLeft: '6px' }}>({candidate.position})</small>
                                        </span>
                                        <span>{count} votes ({percentage}%)</span>
                                    </div>
                                    <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percentage}%`,
                                            height: '100%',
                                            background: isMe ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
                                            transition: 'width 0.4s ease'
                                        }} />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </section>

            {/* Profile Modal */}
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
    )
}

export default CandidatePage