import { useState, useEffect } from 'react';

// Custom hook for fetching data
export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Implement fetch logic
        // const response = await fetch(url);
        // const result = await response.json();
        // setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};
