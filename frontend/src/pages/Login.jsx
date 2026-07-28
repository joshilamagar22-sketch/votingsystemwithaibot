import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [name, setName] = useState('')
    const [voterId, setVoterId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        setError('')

        const cleanName = name.trim().toLowerCase()
        const cleanVoterId = voterId.trim().toLowerCase()

        // 1. ADMIN PROTOCOL CHECK
        // Allows login if Admin credentials are passed in Voter ID/Name and Password fields
        if (
            (cleanVoterId === 'admin' || cleanName === 'admin' || cleanName === 'admin@voteai.org') &&
            password === 'admin123'
        ) {
            const adminUser = {
                id: 'admin-01',
                name: name.trim() || 'System Admin',
                voterId: voterId.trim() || 'ADMIN-001',
                email: 'admin@voteai.org',
                role: 'admin'
            }
            localStorage.setItem('voteai_current_user', JSON.stringify(adminUser))
            navigate('/admin-dashboard')
            return
        }

        // 2. Fetch registered voters & candidates from voteai storage
        const registeredUsers = JSON.parse(
            localStorage.getItem('voteai_users') ||
            localStorage.getItem('voteai_candidates') ||
            localStorage.getItem('candidates') ||
            '[]'
        )

        // Find user matching Username (Name), Voter ID, and Password
        const matchedUser = registeredUsers.find(
            (u) =>
                u.name?.trim().toLowerCase() === cleanName &&
                u.voterId?.trim().toLowerCase() === cleanVoterId &&
                u.password === password
        )

        if (matchedUser) {
            // Store active user session
            localStorage.setItem('voteai_current_user', JSON.stringify(matchedUser))

            // Check role and navigate accordingly
            if (matchedUser.role === 'admin') {
                navigate('/admin-dashboard')
            } else if (matchedUser.role === 'candidate') {
                navigate('/candidate-dashboard')
            } else {
                navigate('/voter-dashboard')
            }
        } else {
            // Fallback check: If candidate registered in step 3, check candidate database
            const registeredCandidates = JSON.parse(localStorage.getItem('voteai_candidates') || '[]')
            const candidateUser = registeredCandidates.find(
                (c) =>
                    c.name?.trim().toLowerCase() === cleanName &&
                    c.voterId?.trim().toLowerCase() === cleanVoterId &&
                    c.password === password
            )

            if (candidateUser) {
                localStorage.setItem('voteai_current_user', JSON.stringify(candidateUser))
                navigate('/candidate-dashboard')
            } else {
                setError('Invalid Username, Voter ID, or Password. Please try again.')
            }
        }
    }

    return (
        <div style={{ maxWidth: '450px', margin: '40px auto', padding: '30px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h2 className="app-title" style={{ textAlign: 'center', marginBottom: '8px' }}>VoteAI Portal Login</h2>
            <p className="app-subtitle" style={{ textAlign: 'center', marginBottom: '25px', color: '#64748b' }}>Enter your credentials to access your portal</p>

            {error && (
                <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                {/* Username / Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Username / Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #87ceeb', fontSize: '1rem', outline: 'none' }}
                    />
                </div>

                {/* Voter ID */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Voter ID</label>
                    <input
                        type="text"
                        value={voterId}
                        onChange={(e) => setVoterId(e.target.value)}
                        placeholder="VID-00123456"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #87ceeb', fontSize: '1rem', outline: 'none' }}
                    />
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #87ceeb', fontSize: '1rem', outline: 'none' }}
                    />
                </div>

                <button
                    type="submit"
                    className="ai-action-btn"
                    style={{ width: '100%', marginTop: '10px', padding: '12px', fontSize: '1.05rem', fontWeight: 'bold' }}
                >
                    Log In
                </button>
            </form>
        </div>
    )
}

export default Login