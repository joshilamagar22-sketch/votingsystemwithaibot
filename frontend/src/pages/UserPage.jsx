import React, { useState, useEffect } from 'react'
import ProfileModal from '../components/ProfileModal'

function UserPage() {
    // Current Active Logged-in User
    const [currentUser, setCurrentUser] = useState({})

    // 1. Candidate Data - Reads directly from the voteai store
    const [candidates, setCandidates] = useState([])

    // 2. Voting & UI States
    const [isVotingOpen, setIsVotingOpen] = useState(true)
    const [hasVoted, setHasVoted] = useState(false)
    const [showVoteModal, setShowVoteModal] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [selectedVotes, setSelectedVotes] = useState({})

    // 3. Dynamic Results State
    const [results, setResults] = useState({})

    // Fetch user, candidates, and vote status on mount
    useEffect(() => {
        // Retrieve logged-in voter session
        const activeUser = JSON.parse(localStorage.getItem('voteai_current_user') || '{}')
        setCurrentUser(activeUser)

        // Retrieve candidates registered in Register.jsx
        const storedCandidates = JSON.parse(
            localStorage.getItem('voteai_candidates') ||
            localStorage.getItem('candidates') ||
            '[]'
        )
        setCandidates(storedCandidates)

        // Retrieve existing election votes tally
        const storedResults = JSON.parse(localStorage.getItem('voteai_results') || '{}')
        const initialResults = { ...storedResults }
        storedCandidates.forEach(c => {
            if (initialResults[c.name] === undefined) {
                initialResults[c.name] = 0
            }
        })
        setResults(initialResults)

        // Check if this voter has already voted
        const votedList = JSON.parse(localStorage.getItem('voteai_voted_users') || '[]')
        if (activeUser.voterId && votedList.includes(activeUser.voterId)) {
            setHasVoted(true)
        }
    }, [])

    // Handle selecting a candidate for a position
    const handleSelectCandidate = (position, candidateName) => {
        setSelectedVotes(prev => ({
            ...prev,
            [position]: candidateName
        }))
    }

    // Submit Final Ballot to voteai storage
    const handleSubmitVote = (e) => {
        e.preventDefault()

        if (hasVoted) {
            alert('You have already cast your vote in this election!')
            return
        }

        const selectedCount = Object.keys(selectedVotes).length
        if (selectedCount === 0) {
            alert('Please select at least one candidate before submitting.')
            return
        }

        // 1. Update vote tallies
        const updatedResults = { ...results }
        Object.values(selectedVotes).forEach(candidateName => {
            if (candidateName) {
                updatedResults[candidateName] = (updatedResults[candidateName] || 0) + 1
            }
        })

        setResults(updatedResults)
        localStorage.setItem('voteai_results', JSON.stringify(updatedResults))

        // 2. Lock vote for this user ID
        if (currentUser.voterId) {
            const votedList = JSON.parse(localStorage.getItem('voteai_voted_users') || '[]')
            votedList.push(currentUser.voterId)
            localStorage.setItem('voteai_voted_users', JSON.stringify(votedList))
        }

        setHasVoted(true)
        setShowVoteModal(false)
        alert('🎉 Your vote has been recorded successfully in VoteAI!')
    }

    // Extract unique positions dynamically from registered candidates
    const registeredPositions = [...new Set(candidates.map(c => c.position))]
    const getCandidatesByPosition = (pos) => candidates.filter(c => c.position === pos)

    // Calculate total votes cast for percentage calculation
    const totalVotesCast = Object.values(results).reduce((a, b) => a + b, 0) || 1

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
            {/* Top Banner Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
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
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>Welcome, {currentUser.name || 'Voter'} 👋</h1>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Review candidate manifestos, cast your vote, and follow real-time election results.</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* My Profile Button */}
                    <button
                        onClick={() => setShowProfile(true)}
                        style={{
                            padding: '12px 20px',
                            fontSize: '0.95rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: '8px'
                        }}
                    >
                        👤 My Profile
                    </button>

                    {hasVoted ? (
                        <span style={{ background: '#22c55e', color: '#fff', padding: '12px 20px', borderRadius: '30px', fontWeight: 'bold' }}>
                            ✓ Vote Submitted
                        </span>
                    ) : (
                        <button
                            onClick={() => setShowVoteModal(true)}
                            disabled={candidates.length === 0}
                            style={{
                                padding: '12px 28px',
                                fontSize: '1.1rem',
                                background: candidates.length > 0 ? '#f59e0b' : '#94a3b8',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 'bold',
                                cursor: candidates.length > 0 ? 'pointer' : 'not-allowed',
                                borderRadius: '8px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            🗳️ Vote Now
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ padding: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Election Status</h4>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: isVotingOpen ? '#16a34a' : '#dc2626' }}>
                        {isVotingOpen ? '🟢 Active & Live' : '🔴 Closed'}
                    </p>
                </div>
                <div style={{ padding: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Registered Candidates</h4>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#0f172a' }}>{candidates.length} Candidate(s)</p>
                </div>
                <div style={{ padding: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Your Ballot Status</h4>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: hasVoted ? '#16a34a' : '#d97706' }}>
                        {hasVoted ? 'Completed' : 'Pending Action'}
                    </p>
                </div>
            </div>

            {/* ---------------- SECTION 1: KNOW YOUR CANDIDATES ---------------- */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#0f172a', borderBottom: '2px solid #87ceeb', paddingBottom: '8px', marginBottom: '20px' }}>
                    📖 Know Your Candidates
                </h2>

                {candidates.length === 0 ? (
                    <div style={{ padding: '40px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
                        <h3>No candidates registered in VoteAI yet</h3>
                        <p>Once candidates register via the registration page, their profiles will instantly show up here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {candidates.map((candidate, idx) => (
                            <div key={idx} style={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <img
                                    src={candidate.photoUrl || candidate.photoPreview || 'https://via.placeholder.com/100?text=No+Photo'}
                                    alt={candidate.name}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid #87ceeb', marginBottom: '12px' }}
                                />
                                <h3 style={{ margin: '5px 0', color: '#0f172a' }}>{candidate.name}</h3>
                                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px' }}>
                                    Running for {candidate.position}
                                </span>
                                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>
                                    "{candidate.description || 'No description provided.'}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ---------------- SECTION 2: ONGOING VOTING RESULTS ---------------- */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#0f172a', borderBottom: '2px solid #87ceeb', paddingBottom: '8px', marginBottom: '20px' }}>
                    📊 Ongoing Voting Results
                </h2>

                {candidates.length === 0 ? (
                    <div style={{ padding: '30px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
                        Live vote analytics will update here as candidates register and users submit votes.
                    </div>
                ) : (
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        {candidates.map((candidate, idx) => {
                            const count = results[candidate.name] || 0
                            const percentage = Math.round((count / totalVotesCast) * 100) || 0

                            return (
                                <div key={idx} style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: '600', color: '#334155' }}>
                                        <span>{candidate.name} <small style={{ color: '#64748b' }}>({candidate.position})</small></span>
                                        <span>{count} votes ({percentage}%)</span>
                                    </div>
                                    <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percentage}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
                                            transition: 'width 0.4s ease'
                                        }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* ---------------- SECTION 3: VOTE NOW BALLOT MODAL ---------------- */}
            {showVoteModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '30px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#0f172a' }}>Cast Your Official Vote</h2>
                            <button
                                onClick={() => setShowVoteModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitVote}>
                            {registeredPositions.map((pos) => {
                                const posCandidates = getCandidatesByPosition(pos)
                                return (
                                    <div key={pos} style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                                        <h3 style={{ color: '#0284c7', marginTop: 0 }}>Select {pos}</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                            {posCandidates.map((c) => {
                                                const isSelected = selectedVotes[pos] === c.name
                                                return (
                                                    <div
                                                        key={c.name}
                                                        onClick={() => handleSelectCandidate(pos, c.name)}
                                                        style={{
                                                            border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                                                            background: isSelected ? '#f0f9ff' : '#fff',
                                                            borderRadius: '10px',
                                                            padding: '12px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={pos}
                                                            checked={isSelected}
                                                            onChange={() => handleSelectCandidate(pos, c.name)}
                                                        />
                                                        <div>
                                                            <strong style={{ display: 'block', color: '#0f172a' }}>{c.name}</strong>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowVoteModal(false)}
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Submit Vote
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Render Profile Modal */}
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
    )
}

export default UserPage