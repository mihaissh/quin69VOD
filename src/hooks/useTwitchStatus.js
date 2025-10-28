import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to check if a Twitch streamer is live
 * Dynamic polling: 15s when live, 30s when offline for faster updates
 */
export const useTwitchStatus = (channelName, twitchId) => {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const intervalRef = useRef(null);

  const checkLiveStatus = useCallback(async () => {
    if (!channelName) return;

    try {
      // Try to check if streamer is live using Twitch API via CORS proxy
      const response = await fetch(`https://decapi.me/twitch/viewercount/${channelName}`, {
        cache: 'no-store' // Prevent caching to get fresh data
      });
      const text = await response.text();
      
      const wasLive = isLive;
      
      if (text && text !== 'offline' && !text.includes('error') && !isNaN(text)) {
        const newViewerCount = parseInt(text, 10);
        setIsLive(true);
        setViewerCount(newViewerCount);
        
        // Log status change
        if (!wasLive) {
          console.info(`${channelName} went LIVE with ${newViewerCount} viewers`);
        }
      } else {
        setIsLive(false);
        setViewerCount(0);
        
        // Log status change
        if (wasLive) {
          console.info(`${channelName} went OFFLINE`);
        }
      }
      
      // Set Twitch profile image
      const twitchProfileUrl = `https://static-cdn.jtvnw.net/jtv_user_pictures/${channelName.toLowerCase()}-profile_image-300x300.png`;
      setProfileImage(twitchProfileUrl);
      
      setLoading(false);
    } catch (error) {
      console.error("Error checking Twitch status:", error);
      setIsLive(false);
      setViewerCount(0);
      setLoading(false);
    }
  }, [channelName, isLive]);

  useEffect(() => {
    // Initial check
    checkLiveStatus();
    
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Dynamic interval: 15 seconds when live, 30 seconds when offline
    const pollInterval = isLive ? 15000 : 30000;
    
    intervalRef.current = setInterval(checkLiveStatus, pollInterval);
    
    // Check status when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.info("Page visible again, checking live status...");
        checkLiveStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkLiveStatus, isLive]);

  return { isLive, viewerCount, loading, profileImage };
};

