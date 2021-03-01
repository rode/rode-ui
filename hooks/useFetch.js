/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import useSWR from "swr";
import { useState, useEffect } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useFetch = (url, query) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const urlWithQuery = query ? `${url}?${new URLSearchParams(query)}` : url;

  const { data: swrData, error: swrError } = useSWR(
    url ? urlWithQuery : null,
    fetcher
  );

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
