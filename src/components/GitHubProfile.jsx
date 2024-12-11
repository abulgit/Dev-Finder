import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Twitter, Users, GitFork, Star, Clock, ArrowLeft, Mail, Building, Link as LinkIcon} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Language color mapping
const LANGUAGE_COLORS = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'C++': '#f34b7d',
  'C#': '#178600',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Swift': '#ffac45',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'Shell': '#89e051',
  'Scala': '#c22d40',
  'R': '#198CE7',
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const GitHubProfile = () => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleGoBack = () => {
    const state = location.state;
    if (state?.users) {
      navigate('/', { state: { users: state.users, searchTerm: state.searchTerm } });
    } else {
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={handleGoBack} className="px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button 
          onClick={handleGoBack}
          className="mb-6 text-zinc-200 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Search</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/4">
            <div className="relative group">
              <img 
                src={profile.avatar_url} 
                alt={`${profile.login}'s avatar`} 
                className="w-full rounded-full border border-zinc-700"
              />
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-semibold text-white">{profile.name}</h1>
              <p className="text-xl text-zinc-400">{profile.login}</p>
            </div>
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 w-full block text-center px-3 py-1.5 border border-zinc-600 rounded-md text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              Follow
            </a>

            <div className="mt-4">
              <p className="text-zinc-300">{profile.bio}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-zinc-400">
                <Users className="h-4 w-4" />
                <a 
                  href={`${profile.html_url}?tab=followers`} 
                  className="flex items-center gap-1"
                >
                  <span className="font-bold text-zinc-50 hover:text-blue-700">
                    {formatNumber(profile.followers)}
                  </span>
                  <span>followers</span>
                </a>
              </div>
              <span className='text-zinc-50'>·</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <a 
                  href={`${profile.html_url}?tab=following`} 
                  className="flex items-center gap-1"
                >
                  <span className="font-bold text-zinc-50 hover:text-blue-700">
                    {formatNumber(profile.following)}
                  </span>
                  <span>following</span>
                </a>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              {profile.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className='font-bold text-zinc-100'>{profile.company}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className='text-zinc-300'>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className='font-bold text-zinc-300'>{profile.email}</span>
                </div>
              )}
              {profile.blog && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <a href={profile.blog} className="text-zinc-100 hover:underline" target="_blank" rel="noopener noreferrer">
                    {profile.blog}
                  </a>
                </div>
              )}
              {profile.twitter_username && (
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  <a href={`https://twitter.com/${profile.twitter_username}`} className="text-zinc-100 hover:underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                    @{profile.twitter_username}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:w-3/4">
            <div className="border-b border-zinc-700 mb-6">
              <nav className="flex space-x-8">
                <a href="#" className="border-b-2 border-orange-500 pb-3 px-1 text-sm font-semibold text-white">
                  Repositories <span className="bg-zinc-800 rounded-full px-2 ml-1">Top 6</span>
                </a>
              </nav>
            </div>

            <div className="space-y-4">
              {repos.map((repo, index) => (
                <div key={repo.id}>
                  {index > 0 && <div className="border-t border-zinc-700 my-4"></div>}
                  <div className="pt-4 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={repo.html_url}
                            className="text-blue-400 hover:underline font-semibold text-xl"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {repo.name}
                          </a>
                          <span className="px-2 py-0.5 border border-zinc-600 rounded-2xl text-xs font-medium text-zinc-300">
                            Public
                          </span>
                        </div>
                        <p className="mt-1 text-zinc-400">{repo.description}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ 
                              backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b8b8b'
                            }}
                          ></div>
                          <span>{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{formatNumber(repo.stargazers_count)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{formatNumber(repo.forks_count)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubProfile;