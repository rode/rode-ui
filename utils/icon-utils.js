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

import Search from "components/icons/Search";
import Cog from "components/icons/Cog";
import ShieldCheck from "components/icons/ShieldCheck";
import Server from "components/icons/Server";
import Liatrio from "components/icons/Liatrio";
import Github from "components/icons/Github";
import Twitter from "components/icons/Twitter";

const SEARCH = "Search";
const COG = "Cog";
const SHIELD_CHECK = "ShieldCheck";
const SERVER = "Server";
const LIATRIO = "Liatrio";
const GITHUB = "Github";
const TWITTER = "Twitter";

export const ICON_COMPONENTS = {
  [SEARCH]: Search,
  [LIATRIO]: Liatrio,
  [GITHUB]: Github,
  [TWITTER]: Twitter,
  [COG]: Cog,
  [SHIELD_CHECK]: ShieldCheck,
  [SERVER]: Server
};

export const ICON_NAMES = {
  SEARCH,
  COG,
  SHIELD_CHECK,
  SERVER,
  LIATRIO,
  GITHUB,
  TWITTER,
};
