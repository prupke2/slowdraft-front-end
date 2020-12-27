import { useState, useEffect } from 'react';
import axios from 'axios';

const useRequest = (url) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    const runRequest = async () => {
      try {
        setLoading(true);
        const response = await axios(url);
        if (!ignore) {
          setData(response.data);
          setError(false);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    runRequest();
    return (() => { ignore = true; });
  }, [url]);
  return { data, loading, error };
};

export default useRequest;
