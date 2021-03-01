import useSWR from "swr";
import { useState, useEffect } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useFetch = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { data: swrData, error: swrError } = useSWR(url ? url : null, fetcher);

  useEffect(() => {
    if (swrData) {
      setLoading(false);
      setData(swrData);
      setError(null);
    }
  }, [swrData]);

  useEffect(() => {
    if (swrError) {
      setLoading(false);
      setData(null);
      setError(swrError);
    }
  }, [swrError]);

  return {
    data,
    loading,
    error,
  };
};
