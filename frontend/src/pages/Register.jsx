import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()

    // Step 1: Role Selection ('voter' or 'candidate')
    const [role, setRole] = useState('')

    // Basic User Fields
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [voterId, setVoterId] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Candidate Specific Fields
    const [position, setPosition] = useState('President')
    const [description, setDescription] = useState('')
    const [photoPreview, setPhotoPreview] = useState(null)

    // Handle Image Upload for Candidates
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle Registration Submission
    const handleSubmit = (e) => {
        e.preventDefault()

        if (!role) {
            alert('Please select whether you are registering as a Voter or a Candidate.')
            return
        }

        // 1. Age Verification Check (Must be 18 or older)
        if (Number(age) < 18) {
            alert('You must be at least 18 years old to register and vote.')
            return
        }

        // Fetch existing users from voteai storage
        const existingUsers = JSON.parse(localStorage.getItem('voteai_users') || '[]')

        // 2. Uniqueness Checks
        const emailExists = existingUsers.some(
            (user) => user.email?.trim().toLowerCase() === email.trim().toLowerCase()
        )
        if (emailExists) {
            alert('An account with this Email Address already exists.')
            return
        }

        const voterIdExists = existingUsers.some(
            (user) => user.voterId?.trim().toLowerCase() === voterId.trim().toLowerCase()
        )
        if (voterIdExists) {
            alert('An account with this Voter ID already exists.')
            return
        }

        const phoneExists = existingUsers.some(
            (user) => user.phoneNumber?.trim() === phoneNumber.trim()
        )
        if (phoneExists) {
            alert('An account with this Phone Number already exists.')
            return
        }

        // Base user object
        const userData = {
            id: Date.now().toString(),
            name,
            age: Number(age),
            phoneNumber,
            voterId,
            email,
            password,
            role
        }

        if (role === 'candidate') {
            const candidateData = {
                ...userData,
                position,
                description,
                photoUrl: photoPreview || 'https://via.placeholder.com/100?text=Candidate'
            }

            localStorage.setItem('voteai_users', JSON.stringify([...existingUsers, candidateData]))

            const existingCandidates = JSON.parse(localStorage.getItem('voteai_candidates') || '[]')
            localStorage.setItem('voteai_candidates', JSON.stringify([...existingCandidates, candidateData]))

            localStorage.setItem('voteai_current_user', JSON.stringify(candidateData))
            alert('Candidate profile registered successfully!')
            navigate('/candidate-dashboard')
        } else {
            localStorage.setItem('voteai_users', JSON.stringify([...existingUsers, userData]))

            localStorage.setItem('voteai_current_user', JSON.stringify(userData))
            alert('Voter account registered successfully!')
            navigate('/voter-dashboard')
        }
    }

    const inputStyle = {
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #87ceeb',
        fontSize: '0.95rem',
        outline: 'none'
    }

    return (
        <div style={{ maxWidth: '520px', width: '90%', margin: '40px auto', padding: '28px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
            <h2 className="app-title" style={{ textAlign: 'center', marginBottom: '6px' }}>VoteAI Portal Registration</h2>
            <p className="app-subtitle" style={{ textAlign: 'center', marginBottom: '20px', color: '#64748b', fontSize: '0.9rem' }}>Create your account to access your portal</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>

                {/* 1. Role Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>I am registering as a:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() => setRole('voter')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: role === 'voter' ? '2px solid #87ceeb' : '1px solid #cbd5e1',
                                background: role === 'voter' ? '#f0f9ff' : '#fff',
                                color: role === 'voter' ? '#0284c7' : '#475569',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            🗳️ Voter
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole('candidate')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: role === 'candidate' ? '2px solid #87ceeb' : '1px solid #cbd5e1',
                                background: role === 'candidate' ? '#f0f9ff' : '#fff',
                                color: role === 'candidate' ? '#0284c7' : '#475569',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            🏆 Candidate
                        </button>
                    </div>
                </div>

                {/* 2. Personal Information Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Full Name / Username</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="18+"
                            min="18"
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Phone Number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1 234 567 890"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Voter ID</label>
                        <input
                            type="text"
                            value={voterId}
                            onChange={(e) => setVoterId(e.target.value)}
                            placeholder="VID-123456"
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* 3. Candidate-Only Fields */}
                {role === 'candidate' && (
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
                        <h4 style={{ margin: 0, color: '#0284c7', fontSize: '0.9rem' }}>Candidate Campaign Profile</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Running Position</label>
                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                style={{ ...inputStyle, background: '#fff' }}
                            >
                                <option value="President">President</option>
                                <option value="Vice President">Vice President</option>
                                <option value="Secretary">Secretary</option>
                                <option value="Treasurer">Treasurer</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Manifesto / Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly state your campaign goals..."
                                rows={2}
                                required
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>Upload Candidate Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                style={{ fontSize: '0.85rem' }}
                            />
                            {photoPreview && (
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginTop: '6px', border: '2px solid #87ceeb' }}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="ai-action-btn"
                    style={{ width: '100%', marginTop: '6px', padding: '12px', fontSize: '1rem', fontWeight: 'bold', boxSizing: 'border-box' }}
                >
                    Complete Registration
                </button>
            </form>
        </div>
    )
}

export default Register