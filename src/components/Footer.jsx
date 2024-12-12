import React, { useEffect, useState } from "react";
import { Twitter } from 'lucide-react';

// Reusable button-like span style
const statBadgeStyle = "border-zinc-500 text-zinc-200 bg-zinc-600 rounded-lg hover:bg-zinc-200 hover:text-zinc-900 cursor-pointer px-2 py-1 text-xs";

const Footer = () => {
  const [stats, setStats] = useState({ totalQueries: 0, totalUsers: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://git-user-stats.vercel.app/api/stats"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

return (
    <footer className="fixed bottom-0 w-full bg-transparent backdrop-blur-sm text-white px-4 py-1 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
      {/* Developer Info - Responsive Layout */}
      <div className="text-sm text-gray-300 flex items-center justify-center w-full md:w-auto">
        <span className="mr-2">Developed and Designed by Abul</span>
        <a 
          href="https://twitter.com/Abultwitt" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors duration-300 flex items-center"
        >
          <Twitter size={18} />
        </a>
      </div>

      {/* Stats Section - Responsive Layout */}
      <div className="flex flex-col items-center w-full md:w-auto">
        {error ? (
          <p className="text-red-400 text-sm">Error: {error}</p>
        ) : (
          <div className="text-sm flex items-center space-x-3">
            <span className="hidden md:inline">API requests:</span>
            <div className="flex space-x-2">
              <span className={statBadgeStyle}>
                Queries: {stats.newtotalQueries}
              </span>
              <span className={statBadgeStyle}>
                Users: {stats.newtotalUsers}
              </span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;