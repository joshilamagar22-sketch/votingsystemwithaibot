import React, { useState, useRef, useEffect } from 'react'

function AIAssistant() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hi! Ask me about candidates, ballot measures, or how registration works." }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        const trimmed = input.trim()
        if (!trimmed || loading) return

        setMessages((prev) => [...prev, { sender: 'user', text: trimmed }])
        setInput('')
        setLoading(true)

        try {
            // Backend contract — coordinate this shape with whoever's building the Spring Boot side:
            // POST http://localhost:8080/api/assistant/chat
            // Request body:  { "message": "user's question here" }
            // Response body: { "reply": "assistant's answer here" }
            const res = await fetch('http://localhost:8080/api/assistant/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed })
            })

            if (!res.ok) throw new Error('Assistant request failed')

            const data = await res.json()
            setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }])
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: "Sorry, I couldn't reach the assistant right now. Please try again in a moment." }
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="assistant-panel">
            <div className="assistant-header">
                <span className="assistant-dot" />
                <span>VOTING ASSISTANT</span>
            </div>

            <div className="assistant-messages">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`assistant-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
                    >
                        {msg.text}
                    </div>
                ))}

                {loading && (
                    <div className="assistant-typing">
                        <span></span><span></span><span></span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className="assistant-input-row" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question…"
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    )
}

export default AIAssistant
