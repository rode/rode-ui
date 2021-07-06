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
import config from "config";
import { auth } from "express-openid-connect";

export const oidc = () => {
  const { clientId, clientSecret, issuerUrl, scope } = config.get("oidc");

  const { secret: appSecret, url: appUrl } = config.get("app");

  return auth({
    authRequired: false,
    authorizationParams: {
      response_type: "code",
      response_mode: "form_post",
      scope: scope,
    },
    enableTelemetry: false,
    issuerBaseURL: issuerUrl,
    baseURL: appUrl,
    clientID: clientId,
    clientSecret: clientSecret,
    secret: appSecret,
    idpLogout: true,
  });
};

export const tokenRefresh = () => async (req, res, next) => {
  if (!req.oidc?.accessToken) {
    req.accessToken = null;
    return next();
  }

  let accessToken = req.oidc.accessToken;

  const { isExpired, access_token: token, refresh } = accessToken;
  if (token && isExpired()) {
    console.log("token expired, refreshing");
    accessToken = await refresh();
    console.log("refreshed");
  }

  req.accessToken = accessToken.access_token;
  next();
};
