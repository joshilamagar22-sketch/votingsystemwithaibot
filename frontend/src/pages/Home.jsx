import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()

    return (
        <div className="home-page">
            <section
                className="hero"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '32px'
                }}
            >
                <div className="hero-copy" style={{ flex: '1 1 45%', minWidth: '300px' }}>
                    <span className="eyebrow">VoteAI Application</span>
                    <h1>Vote with confidence.<br />Ask before you decide.</h1>
                    <p className="hero-sub">
                        A secure voting platform with a built-in assistant. Ask it about
                        candidates or ballot measures in plain language, get a verified
                        account, and cast a vote that's counted in the open.
                    </p>
                    <div className="home-actions">
                        <button className="btn-primary" onClick={() => navigate('/Login')}>
                            Log In
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/Register')}>
                            Register
                        </button>
                    </div>
                </div>

                {/* Hero Image with Top Fade Mask */}
                <div
                    className="hero-image"
                    style={{
                        flex: '1 1 45%',
                        minWidth: '300px',
                        display: 'flex',
                        justify: 'center',
                        alignItems: 'center',
                        maxWidth: '520px'
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80"
                        alt="Voting Sign"
                        style={{
                            width: '100%',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            borderRadius: '0 0 16px 16px', // Rounded bottom corners
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                            // Mask gradient for top-side fade-out effect
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)'
                        }}
                    />
                </div>
            </section>

            <div className="perforation" aria-hidden="true" />

            <section className="features">
                <h2>What makes this different</h2>
                <div className="feature-grid">
                    <article className="feature">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M8 12h8M8 8h5M8 16h4M4 4h16v16H4z" />
                            </svg>
                        </div>
                        <h3>Ask Your Ballot</h3>
                        <p>
                            Get plain-language answers about candidates and measures from
                            the assistant, drawn from verified public records — no more
                            guessing what a proposition actually does.
                        </p>
                    </article>

                    <article className="feature">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
                            </svg>
                        </div>
                        <h3>Verified Identity</h3>
                        <p>
                            Every vote is tied to a securely verified account, so the
                            final count reflects real, eligible voters — once per person,
                            every time.
                        </p>
                    </article>

                    <article className="feature">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M4 20V10M12 20V4M20 20v-7" />
                            </svg>
                        </div>
                        <h3>Transparent Results</h3>
                        <p>
                            Watch counts update as they come in, with an auditable trail
                            behind every tally so results can be checked, not just
                            trusted.
                        </p>
                    </article>
                </div>
            </section>

            <footer className="home-footer">
                <p>SECURE SESSION &middot; ENCRYPTED BALLOT ACCESS</p>
            </footer>
        </div>
    )
}

export default Home