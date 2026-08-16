'use client';

import { Bell, Calendar, Share2, ChevronDown, Link2, MessageCircle, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { episodes } from '../stories/episodes';

const REACTION_TYPES = [
  { key: 'like', label: 'Like', icon: 'thumbsup' },
  { key: 'laugh', label: 'Laughing', icon: '😂' },
  { key: 'surprise', label: 'Surprised', icon: '😮' },
  { key: 'nervous', label: 'Nervous', icon: '😰' },
];

export default function Home() {
  const [expandedEpisode, setExpandedEpisode] = useState(1);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [reactions, setReactions] = useState({});
  const [reactedKeys, setReactedKeys] = useState([]);
  const latestEpisode = episodes[episodes.length - 1];
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    fetch('/api/reactions')
      .then((res) => res.json())
      .then((data) => setReactions(data))
      .catch((err) => console.error('Failed to load reactions', err));

    const storedReacted = window.localStorage.getItem('episodeReactedKeys');
    if (storedReacted) {
      try {
        setReactedKeys(JSON.parse(storedReacted));
      } catch (err) {
        console.error('Failed to parse stored reacted keys', err);
      }
    }
  }, []);

  const toggleEpisode = (episodeNumber) => {
    setExpandedEpisode(expandedEpisode === episodeNumber ? null : episodeNumber);
  };

  const handleReaction = async (episodeNumber, type) => {
    const reactionKey = `${episodeNumber}-${type}`;
    if (reactedKeys.includes(reactionKey)) return;

    setReactions((prev) => {
      const current = prev[episodeNumber] || {};
      return {
        ...prev,
        [episodeNumber]: {
          ...current,
          [type]: (current[type] || 0) + 1,
        },
      };
    });

    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeNumber, type }),
      });
      if (!res.ok) throw new Error('Failed to save reaction');

      setReactedKeys((prev) => {
        const updated = [...prev, reactionKey];
        window.localStorage.setItem('episodeReactedKeys', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to save reaction', err);
      setReactions((prev) => {
        const current = prev[episodeNumber] || {};
        return {
          ...prev,
          [episodeNumber]: {
            ...current,
            [type]: Math.max((current[type] || 0) - 1, 0),
          },
        };
      });
    }
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Story of Noelle & Wallace',
    description: 'A San Francisco Romance, Delivered Daily',
    url: 'https://mywebsoap.com',
    inLanguage: 'en-US',
    blogPost: episodes.map((episode) => ({
      '@type': 'BlogPosting',
      headline: `${episode.number}: ${episode.title}`,
      datePublished: new Date(episode.date).toISOString().slice(0, 10),
      url: `https://mywebsoap.com/#episode-${episode.number}`,
      articleSection: 'Fiction',
      author: { '@type': 'Person', name: 'Lucy Thompson' },
      description: episode.content.split('\n\n')[0].slice(0, 300),
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <div
              key={episode.number}
              id={`episode-${episode.number}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Episode Header - Clickable */}
              <button
                onClick={() => toggleEpisode(episode.number)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
                aria-expanded={expandedEpisode === episode.number}
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
                  aria-hidden="true"
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    expandedEpisode === episode.number ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Story Content - Dropdown (always in the DOM so search engines and AI crawlers can read every episode, only hidden visually when collapsed) */}
              <div
                className={`p-6 border-t border-gray-200 bg-gray-50 ${
                  expandedEpisode === episode.number ? '' : 'hidden'
                }`}
              >
                {episode.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                <div className="flex flex-wrap items-center gap-3 pt-4 mt-2 border-t border-gray-200">
                  {REACTION_TYPES.map(({ key, label, icon }) => {
                    const hasReacted = reactedKeys.includes(`${episode.number}-${key}`);
                    return (
                      <button
                        key={key}
                        onClick={() => handleReaction(episode.number, key)}
                        disabled={hasReacted}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition text-sm ${
                          hasReacted
                            ? 'bg-teal-50 border-teal-300 text-teal-700 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                        }`}
                        aria-label={label}
                        aria-pressed={hasReacted}
                      >
                        {icon === 'thumbsup' ? (
                          <ThumbsUp className={`w-4 h-4 ${hasReacted ? 'text-teal-700' : 'text-teal-600'}`} />
                        ) : (
                          <span className="text-base leading-none">{icon}</span>
                        )}
                        <span className={hasReacted ? 'text-teal-700' : 'text-gray-500'}>
                          {reactions[episode.number]?.[key] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Episode Teaser */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Tomorrow</h3>
          <p className="text-gray-600">A chance meeting, an easy laugh — but is there more to Wallace than Noelle realizes? Find out in tomorrow's episode...</p>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setSubscribeOpen(!subscribeOpen)}
                className="flex items-center text-teal-600 hover:text-teal-700"
              >
                <Bell className="w-5 h-5 mr-2" />
                Get Daily Updates
              </button>

              {subscribeOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSubscribeOpen(false)}
                  />
                  <div className="absolute left-0 bottom-full mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-20">
                    <p className="text-sm text-gray-600 mb-3">
                      Get each new episode delivered to your inbox.
                    </p>
                    <form
                      action="https://buttondown.com/api/emails/embed-subscribe/lucyethomp"
                      method="post"
                      target="popupwindow"
                      onSubmit={() =>
                        window.open(
                          'https://buttondown.com/api/emails/embed-subscribe/lucyethomp',
                          'popupwindow',
                          'scrollbars=yes,width=800,height=600'
                        )
                      }
                      className="embeddable-buttondown-form flex flex-col gap-2"
                    >
                      <label htmlFor="bd-email" className="sr-only">
                        Enter your email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="bd-email"
                        required
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="submit"
                        value="Subscribe"
                        className="w-full py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition cursor-pointer"
                      />
                      <p className="text-xs text-gray-400 text-center mt-1">
                        <a
                          href="https://buttondown.com/refer/lucyethomp"
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          Powered by Buttondown.
                        </a>
                      </p>
                    </form>
                  </div>
                </>
              )}
            </div>
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