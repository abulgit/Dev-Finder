import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Twitter, Users, GitFork, Star, Clock } from 'lucide-react';

const GitHubProfile = ({ username, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileResponse.json();

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();

        setProfile(profileData);
        setRepos(reposData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [username]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-zinc-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/30 text-red-500 p-6 rounded-lg text-center">
          <p>{error}</p>
          <button onClick={onClose} className="mt-4 bg-zinc-700 text-zinc-50 px-4 py-2 rounded-lg hover:bg-zinc-600">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="dark bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50 p-8">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={profile.avatar_url} 
                alt={`${profile.login}'s avatar`} 
                className="w-40 h-40 rounded-full object-cover border-4 border-zinc-700 hover:border-zinc-500 transition-colors duration-300"
              />
              <a 
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                @{profile.login}
              </a>
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-zinc-100 mb-2">{profile.name || profile.login}</h1>
                <p className="text-zinc-400 text-lg">{profile.bio || 'No bio available'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.location && (
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <MapPin className="h-5 w-5" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.twitter_username && (
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <Twitter className="h-5 w-5" />
                    <a 
                      href={`https://twitter.com/${profile.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      @{profile.twitter_username}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {formatDate(profile.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Clock className="h-5 w-5" />
                  <span>Last updated {formatDate(profile.updated_at)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{profile.public_repos}</div>
                  <div className="text-sm text-zinc-400">Repositories</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{profile.followers}</div>
                  <div className="text-sm text-zinc-400">Followers</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{profile.following}</div>
                  <div className="text-sm text-zinc-400">Following</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{profile.public_gists}</div>
                  <div className="text-sm text-zinc-400">Gists</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6 text-zinc-200">Recent Repositories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <a 
                  key={repo.id} 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 hover:bg-zinc-700/50 transition-all duration-300"
                >
                  <h3 className="font-semibold text-zinc-100 truncate group-hover:text-zinc-200">{repo.name}</h3>
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{repo.description || 'No description'}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-zinc-500">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {repo.forks_count}
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`w-3 h-3 rounded-full mr-1 ${repo.language ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
                      {repo.language || 'Unknown'}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubProfile;