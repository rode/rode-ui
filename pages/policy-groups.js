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

import React from "react";
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";
import Button from "../components/Button";

const PolicyGroups = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div>
      <p>Policy Groups</p>
      <Button label={'Create New Policy Group'} onClick={() => router.push("/policy-groups/new")}/>
    </div>
  );
};

export default PolicyGroups;