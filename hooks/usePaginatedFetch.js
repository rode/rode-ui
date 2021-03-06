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

import { useEffect } from "react";
import { useSWRInfinite } from "swr";
import { fetcher, getPaginatedUrlKey } from "utils/hook-utils";
import { showError } from "utils/toast-utils";

export const usePaginatedFetch = (url, query, pageSize) => {
  const { data, error, size, setSize } = useSWRInfinite(
    (_, previousPageData) =>
      getPaginatedUrlKey(previousPageData, url, query, pageSize),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );

  const loading = !data && !error;

  const hasError = data?.length && data[0].error;

  const isLastPage =
    !loading && data?.length && !data[data.length - 1].pageToken?.length;

  const goToNextPage = () => setSize(size + 1);

  const formattedData = data?.reduce((accum, pageData) => {
    if (pageData.data) {
      return accum.concat(...pageData.data);
    }

    return accum;
  }, []);

  useEffect(() => {
    if (hasError) {
      showError("An unexpected error has occurred.");
    }
  }, [hasError]);

  return {
    data: hasError ? null : formattedData,
    loading,
    error: hasError ? data[0].error : null,
    isLastPage,
    goToNextPage,
  };
};
