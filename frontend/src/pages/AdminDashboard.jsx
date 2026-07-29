import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
    const navigate = useNavigate()

    // State management
    const [users, setUsers] = useState([])
    const [candidates, setCandidates] = useState([])
    const [electionActive, setElectionActive] = useState(false)
    const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'users' | 'candidates'
    const [notice, setNotice] = useState(null) // { type: 'error' | 'success' | 'info', message: string }
    const [pendingDeleteId, setPendingDeleteId] = useState(null) // user awaiting delete confirmation

    // Load data from localStorage on mount
    useEffect(() => {
        // Auth Check
        const currentUser = JSON.parse(localStorage.getItem('voteai_current_user') || '{}')
        if (currentUser.role !== 'admin') {
            setNotice({ type: 'error', message: 'Access Denied. Admin privileges required.' })
            setTimeout(() => navigate('/login'), 1800)
            return
        }

        const storedUsers = JSON.parse(localStorage.getItem('voteai_users') || '[]')
        const storedCandidates = JSON.parse(localStorage.getItem('voteai_candidates') || '[]')
        const storedElectionStatus = JSON.parse(localStorage.getItem('voteai_election_active') || 'false')

        setUsers(storedUsers)
        setCandidates(storedCandidates)
        setElectionActive(storedElectionStatus)
    }, [navigate])

    // Toggle Election Status (Start / Stop)
    const toggleElection = () => {
        const nextState = !electionActive
        setElectionActive(nextState)
        localStorage.setItem('voteai_election_active', JSON.stringify(nextState))
        setNotice({
            type: nextState ? 'success' : 'info',
            message: `Election has been ${nextState ? 'STARTED' : 'STOPPED'}.`
        })
    }

    // Step 1: user clicks Delete — show inline confirm instead of window.confirm
    const requestDeleteUser = (userId) => {
        setPendingDeleteId(userId)
    }

    // Step 2a: user confirms — actually delete
    const confirmDeleteUser = () => {
        const updatedUsers = users.filter(u => u.id !== pendingDeleteId)
        const updatedCandidates = candidates.filter(c => c.id !== pendingDeleteId)

        setUsers(updatedUsers)
        setCandidates(updatedCandidates)

        localStorage.setItem('voteai_users', JSON.stringify(updatedUsers))
        localStorage.setItem('voteai_candidates', JSON.stringify(updatedCandidates))

        setPendingDeleteId(null)
        setNotice({ type: 'success', message: 'User deleted successfully.' })
    }

    // Step 2b: user backs out
    const cancelDeleteUser = () => {
        setPendingDeleteId(null)
    }

    // Handle Admin Logout
    const handleLogout = () => {
        localStorage.removeItem('voteai_current_user')
        navigate('/login')
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>

            {/* Header / Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem' }}>🛡️ Admin Control Panel</h1>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Manage election lifecycle, users, and candidate entries.</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ padding: '10px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Logout Admin
                </button>
            </div>

            {/* Inline notice (replaces alert()) */}
            {notice && (
                <div className={`inline-notice ${notice.type}`}>
                    {notice.message}
                </div>
            )}

            {/* Inline confirm (replaces window.confirm()) */}
            {pendingDeleteId && (
                <div className="inline-confirm">
                    <p>Are you sure you want to delete this user? This can't be undone.</p>
                    <div className="inline-confirm-actions">
                        <button className="confirm-yes" onClick={confirmDeleteUser}>Delete</button>
                        <button className="confirm-no" onClick={cancelDeleteUser}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Election Control Banner */}
            <div style={{ background: electionActive ? '#f0fdf4' : '#fef2f2', border: `1px solid ${electionActive ? '#bbf7d0' : '#fecaca'}`, padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: 0, color: electionActive ? '#166534' : '#991b1b' }}>
                        Election Status: {electionActive ? '🟢 ACTIVE & LIVE' : '🔴 CLOSED / PAUSED'}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                        {electionActive ? 'Voters are currently allowed to submit votes.' : 'Voting portal is currently closed to incoming votes.'}
                    </p>
                </div>
                <button
                    onClick={toggleElection}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: electionActive ? '#dc2626' : '#16a34a',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    {electionActive ? 'End Voting' : 'Start Voting'}
                </button>
            </div>

            {/* Metric Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Registered</span>
                    <h2 style={{ margin: '8px 0 0 0', color: '#0f172a' }}>{users.length} Users</h2>
                </div>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Voters</span>
                    <h2 style={{ margin: '8px 0 0 0', color: '#0284c7' }}>{users.filter(u => u.role === 'voter').length} Accounts</h2>
                </div>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Candidates</span>
                    <h2 style={{ margin: '8px 0 0 0', color: '#d97706' }}>{candidates.length} Profiles</h2>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #cbd5e1', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderBottom: activeTab === 'overview' ? '3px solid #0284c7' : 'none',
                        background: 'transparent',
                        fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
                        color: activeTab === 'overview' ? '#0284c7' : '#64748b',
                        cursor: 'pointer'
                    }}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderBottom: activeTab === 'users' ? '3px solid #0284c7' : 'none',
                        background: 'transparent',
                        fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                        color: activeTab === 'users' ? '#0284c7' : '#64748b',
                        cursor: 'pointer'
                    }}
                >
                    User Records ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('candidates')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderBottom: activeTab === 'candidates' ? '3px solid #0284c7' : 'none',
                        background: 'transparent',
                        fontWeight: activeTab === 'candidates' ? 'bold' : 'normal',
                        color: activeTab === 'candidates' ? '#0284c7' : '#64748b',
                        cursor: 'pointer'
                    }}
                >
                    Candidates ({candidates.length})
                </button>
            </div>

            {/* Tab 1: User Table */}
            {(activeTab === 'users' || activeTab === 'overview') && (
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#334155', marginBottom: '12px' }}>Registered Users Directory</h3>
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                            <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Role</th>
                                <th style={{ padding: '12px' }}>Voter ID</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Phone</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>No user records found.</td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.name}</td>
                                        <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    background: u.role === 'admin' ? '#fee2e2' : u.role === 'candidate' ? '#fef3c7' : '#e0f2fe',
                                                    color: u.role === 'admin' ? '#991b1b' : u.role === 'candidate' ? '#92400e' : '#075985'
                                                }}>
                                                    {u.role ? u.role.toUpperCase() : 'USER'}
                                                </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>{u.voterId || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>{u.email}</td>
                                        <td style={{ padding: '12px' }}>{u.phoneNumber || 'N/A'}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => requestDeleteUser(u.id)}
                                                    style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 2: Candidate Profiles */}
            {activeTab === 'candidates' && (
                <div>
                    <h3 style={{ color: '#334155', marginBottom: '12px' }}>Candidate Profiles</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {candidates.length === 0 ? (
                            <p style={{ color: '#94a3b8' }}>No candidates registered yet.</p>
                        ) : (
                            candidates.map((c) => (
                                <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#ffffff', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <img
                                        src={c.photoUrl || 'https://via.placeholder.com/80'}
                                        alt={c.name}
                                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
                                    />
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>{c.name}</h4>
                                        <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 'bold' }}>Running for {c.position}</span>
                                        <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>{c.description ? `${c.description.substring(0, 45)}...` : 'No manifesto provided.'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}

export default AdminDashboard
