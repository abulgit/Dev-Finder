// App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GitHubUserSearch from './components/GitHubUserSearch'
import GitHubProfile from './components/GitHubProfile'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GitHubUserSearch />} />
        <Route path="/user/:username" element={<GitHubProfile />} />
      </Routes>
    </Router>
  )
}

export default App