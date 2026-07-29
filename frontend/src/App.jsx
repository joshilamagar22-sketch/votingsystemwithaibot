import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AIAssistant from './components/AIAssistant'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import UserPage from './pages/UserPage'
import CandidatePage from './pages/CandidatePage'
import AdminDashboard from './pages/AdminDashboard'

// Protected Route Wrapper for Admin Access
function AdminRoute({ children }) {
    const currentUser = JSON.parse(localStorage.getItem('voteai_current_user') || '{}')

    // Redirect to Login if user is not logged in or is not an admin
    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/Login" replace />
    }

    return children
}

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />}/>
                <Route path="/registration-success" element={<Register />} />
                <Route path="/voter-dashboard" element={<UserPage />} />
                <Route path="/candidate-dashboard" element={<CandidatePage />} />

                {/* PROTECTED ADMIN ROUTE */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                {/* Catch-all Wildcard Route (Keep at the bottom) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <AIAssistant />
        </Router>
    )
}

export default App