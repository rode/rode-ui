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

const createUrlWithQueryAndPages = (url, query, pageSize, pageToken) => {
  const allParams = {
    ...query,
    pageSize,
    pageToken,
  };

  Object.keys(allParams).forEach((param) =>
    !allParams[param] ? delete allParams[param] : null
  );
  const formattedUrl = `${url}?${new URLSearchParams(allParams)}`;
  return url ? formattedUrl : null;
};

export const getPaginatedUrlKey = (previousPageData, url, query, pageSize) => {
  if (previousPageData && !previousPageData.pageToken.length) {
    return null;
  }

  if (!previousPageData) {
    return createUrlWithQueryAndPages(url, query, pageSize);
  }

  return createUrlWithQueryAndPages(
    url,
    query,
    pageSize,
    previousPageData.pageToken
  );
};

export const fetcher = (...args) => fetch(...args).then((res) => res.json());
