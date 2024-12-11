// components/GitHubUserSearch.jsx
import React, { useState, useEffect } from 'react';
import { Search, Github } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const GitHubUserSearch = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Restore search results from location state
  useEffect(() => {
    const state = location.state;
    if (state && state.users) {
      setUsers(state.users);
      setUsername(state.searchTerm);
    }
  }, [location.state]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/search/users?q=${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.items || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching GitHub users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    // Navigate to user profile and pass search state
    navigate(`/user/${user.login}`, { 
      state: { 
        users, 
        searchTerm: username 
      } 
    });
  };

  return (
    <div className="dark bg-zinc-950 text-zinc-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center justify-center space-x-3 mb-4">
          <Github className="w-12 h-12 text-zinc-100" />
          <h1 className="text-4xl font-bold text-zinc-100">
            Dev Finder
          </h1>
        </div>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Explore GitHub profiles with ease. Search for users and discover their repositories, 
          contributions, and activity across the GitHub community.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-6">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full p-3 pl-10 bg-zinc-800 text-zinc-50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-zinc-500 transition-all duration-300"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 bg-zinc-300 text-zinc-900 rounded-lg hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-zinc-900 border border-zinc-700 text-zinc-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {users.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-zinc-200">Found Users</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  onClick={() => handleUserSelect(user)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-zinc-600 group cursor-pointer"
                >
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.login}'s avatar`} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-zinc-700 group-hover:border-zinc-500 transition-all duration-300"
                      />
                      <div className="absolute bottom-0 right-0 bg-zinc-300 w-5 h-5 rounded-full border-2 border-zinc-800 animate-pulse"></div>
                    </div>
                    <div className="text-zinc-200 hover:text-white font-semibold text-sm truncate max-w-full transition-colors duration-300 group-hover:text-white">
                      {user.login}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubUserSearch;
