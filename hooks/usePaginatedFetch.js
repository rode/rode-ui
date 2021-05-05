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

import { useSWRInfinite } from "swr";
import { fetcher, getPaginatedUrlKey } from "utils/hook-utils";

// TODO: handle errors here - data will have array with object error property in it
export const usePaginatedFetch = (url, query, pageSize) => {
  const { data, error, size, setSize } = useSWRInfinite(
    (_, previousPageData) =>
      getPaginatedUrlKey(previousPageData, url, query, pageSize),
    fetcher
  );

  const loading = !data && !error;

  const isLastPage =
    !loading && data?.length && !data[data.length - 1].pageToken?.length;

  const goToNextPage = () => setSize(size + 1);

  const formattedData = data?.reduce((accum, pageData) => {
    if (pageData.data) {
      return accum.concat(...pageData.data);
    }

    return accum;
  }, []);

  return {
    data: formattedData,
    loading,
    error, // TODO: change this to be whatever lives in data[0].error if it exists
    isLastPage,
    goToNextPage,
  };
};
