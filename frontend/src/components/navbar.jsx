import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '25px',
            borderRadius: '8px'
        }}>
            {/* App Logo */}
            <div style={{ fontWeight: 'bold', color: '#0099e6', fontSize: '1.2rem' }}>
                🗳️ VoteAI
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#666666', fontWeight: '500' }}>Home</Link>
                <Link to="/login" style={{ textDecoration: 'none', color: '#666666', fontWeight: '500' }}>Login</Link>
                <Link to="/register" style={{ textDecoration: 'none', color: '#666666', fontWeight: '500' }}>Register</Link>
            </div>
        </nav>
    )
}

export default Navbar