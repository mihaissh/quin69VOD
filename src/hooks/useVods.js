import { useState, useEffect, useCallback } from "react";
import vodsClient from "../vods/client";

/**
 * Custom hook for fetching VODs with various filter options
 */
export const useVods = (filter, filterOptions, page, limit) => {
  const [vods, setVods] = useState(null);
  const [totalVods, setTotalVods] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVods = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = {
        $limit: limit,
        $skip: (page - 1) * limit,
        $sort: {
          createdAt: -1,
        },
      };

      switch (filter) {
        case "Date":
          if (filterOptions.startDate > filterOptions.endDate) {
            setLoading(false);
            return;
          }
          query.createdAt = {
            $gte: filterOptions.startDate.toISOString(),
            $lte: filterOptions.endDate.toISOString(),
          };
          break;
          
        case "Title":
          if (!filterOptions.title || filterOptions.title.length === 0) {
            setLoading(false);
            return;
          }
          query.title = {
            $iLike: `%${filterOptions.title}%`,
          };
          break;
          
        case "Game":
          if (!filterOptions.game || filterOptions.game.length === 0) {
            setLoading(false);
            return;
          }
          query.chapters = {
            name: filterOptions.game,
          };
          break;
          
        default:
          // Default query already set
          break;
      }

      const response = await vodsClient.service("vods").find({ query });
      setVods(response.data);
      setTotalVods(response.total);
    } catch (e) {
      console.error("Error fetching VODs:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [filter, filterOptions, page, limit]);

  useEffect(() => {
    fetchVods();
  }, [fetchVods]);

  return { vods, totalVods, loading, error, refetch: fetchVods };
};

/**
 * Custom hook for fetching a single VOD by ID
 */
export const useVod = (vodId, VODS_API_BASE, channel) => {
  const [vod, setVod] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVod = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${VODS_API_BASE}/vods/${vodId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch VOD: ${response.statusText}`);
        }
        
        const data = await response.json();
        setVod(data);
        document.title = `${data.id} - ${channel}`;
      } catch (e) {
        console.error("Error fetching VOD:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchVod();
  }, [vodId, VODS_API_BASE, channel]);

  return { vod, loading, error };
};

