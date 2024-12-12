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

  // Reset state when component mounts or heading is clicked
  const resetState = () => {
    setUsername('');
    setUsers([]);
    setError(null);
    navigate(location.pathname, { replace: true });
  };

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
    
    // Only show error and prevent search if username is empty
    if (!username.trim()) {
      setUsers([]);
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
    <div className="bg-zinc-950 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* App Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Github className="w-10 h-10 text-white" />
              <h1 onClick={resetState} className="text-3xl cursor-pointer hover:opacity-80 transition-opacity font-bold">Dev Finder</h1>
            </div>
            <p className="text-zinc-300 max-w-md mx-auto">
              Discover GitHub developers with ease. Search by username to explore profiles.
            </p>
          </div>

          {/* Search Header */}
          <div className="border-b border-zinc-800 pb-4 mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center">
                <div className="relative flex-1 mr-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      // Clear error when user starts typing
                      if (error === 'Please enter a username') {
                        setError(null);
                      }
                    }}
                    placeholder="Search GitHub users"
                    className="w-full px-3 py-2 pl-8 bg-zinc-950 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 hover:bg-zinc-700 transition-colors"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Error Handling */}
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 p-4  rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Search Results */}
          {users.length > 0 && (
            <div>
              <div className="text-white text-lg font-semibold mb-4">
                {users.length} users
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => handleUserSelect(user)}
                    className="bg-zinc-950 border border-zinc-700 rounded-md p-4 flex items-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.login}'s avatar`} 
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white">{user.name || user.login}</div>
                      <div className="text-zinc-500">{user.login}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubUserSearch;