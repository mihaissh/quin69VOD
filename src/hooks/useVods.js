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
      
      // Handle different response structures from FeathersJS
      // Response should be: { data: [], total: number } when pagination is enabled
      // Or might be just an array if pagination info is not available
      let vodsData, totalCount;
      
      if (Array.isArray(response)) {
        // If response is an array, pagination info is not available
        vodsData = response;
        totalCount = null; // Can't determine total from array alone
      } else if (response && typeof response === 'object') {
        // Response should be an object with data and total
        vodsData = Array.isArray(response.data) ? response.data : [];
        totalCount = response.total !== undefined ? response.total : null;
      } else {
        vodsData = [];
        totalCount = null;
      }
      
      // Log for debugging if we get fewer items than expected (but not on last page)
      if (vodsData.length < limit && page > 1 && vodsData.length > 0 && totalCount !== null) {
        const expectedItemsOnPage = Math.min(limit, totalCount - (page - 1) * limit);
        if (vodsData.length < expectedItemsOnPage) {
          console.warn(`Page ${page}: Expected ${expectedItemsOnPage} items, got ${vodsData.length}. Total: ${totalCount}, Skip: ${(page - 1) * limit}`);
        }
      }
      
      setVods(vodsData);
      setTotalVods(totalCount);
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

