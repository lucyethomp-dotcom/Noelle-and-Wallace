'use client';

import { Bell, Calendar, Share2, ChevronDown, Link2, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { episodes } from '../stories/episodes';

export default function Home() {
  const [expandedEpisode, setExpandedEpisode] = useState(1);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const latestEpisode = episodes[episodes.length - 1];
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const toggleEpisode = (episodeNumber) => {
    setExpandedEpisode(expandedEpisode === episodeNumber ? null : episodeNumber);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
    setShareMenuOpen(false);
  };

  const handleTextShare = () => {
    const message = `Check out The Story of Noelle & Wallace: ${shareUrl}`;
    window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
    setShareMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-100 to-teal-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">The Story of Noelle & Wallace</h1>
          <p className="text-lg text-gray-600">A San Francisco Romance, Delivered Daily</p>
        </div>
      </div>

      {/* Episodes List with Dropdowns */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-4">
          {episodes.map((episode) => (
            <div key={episode.number} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Episode Header - Clickable */}
              <button
                onClick={() => toggleEpisode(episode.number)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="text-left">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {episode.number}: {episode.title}
                  </h2>
                  <span className="text-sm text-gray-500 flex items-center mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {episode.date}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    expandedEpisode === episode.number ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Story Content - Dropdown */}
              {expandedEpisode === episode.number && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  {episode.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next Episode Teaser */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Tomorrow</h3>
          <p className="text-gray-600">What awaits Noelle at TechFlow? Find out in tomorrow's episode...</p>
          
          <div className="mt-6 flex items-center justify-between">
            <button className="flex items-center text-teal-600 hover:text-teal-700">
              <Bell className="w-5 h-5 mr-2" />
              Get Daily Updates
            </button>
            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="flex items-center text-gray-600 hover:text-gray-700"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Story
              </button>

              {shareMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShareMenuOpen(false)}
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20">
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Link2 className="w-4 h-4 mr-3" />
                      {copied ? 'Link copied!' : 'Copy link'}
                    </button>
                    <button
                      onClick={handleTextShare}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition border-t border-gray-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Text to someone
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Story Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">About the Story</h3>
            <p className="text-gray-600">
              Follow the evolving relationship between Noelle Thompson, a brilliant tech executive, 
              and Wallace Brown, a quantum physicist, as their paths cross in foggy San Francisco. 
              New episodes published every day at 7 AM PST.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Meet the Characters</h3>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-56 mb-3 rounded-lg overflow-hidden shadow-md border border-gray-200">
                  <img 
                    src="/noelle.png" 
                    alt="Noelle Thompson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-medium text-gray-800">Noelle Thompson</h4>
                <p className="text-sm text-gray-600 text-center">A tech executive with a brilliant mind and a goldendoodle named Charlie</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-40 h-56 mb-3 rounded-lg overflow-hidden shadow-md border border-gray-200">
                  <img 
                    src="/wallace.png" 
                    alt="Wallace Brown" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-medium text-gray-800">Wallace Brown</h4>
                <p className="text-sm text-gray-600 text-center">A quantum physicist whose groundbreaking research is changing the world</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}