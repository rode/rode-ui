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

import React, {useState} from "react";
import { useTheme } from "providers/theme";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import Input from "../../components/Input";

const PolicyGroups = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      name,
      description
    };

    const response = await fetch('/api/policy-groups', {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.log('error occurred',response);
      return;
    }

    const parsedResponse = await response.json();
    console.log('here successful save', parsedResponse);

  };

  return (
    <div>
      <p>New Policy Groups</p>
      <form onSubmit={onSubmit}>
        <Input
          name={"name"}
          label={"Policy Group Name"}
          onChange={(event) => {
            setName(event.target.value);
          }}
          value={name}
        />
        <Input
          name={"description"}
          label={"Description"}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          value={description}
        />
        <Button label={"Save Policy Group"} type={"submit"} />
        <Button
          label={"Cancel"}
          onClick={() => router.back()}
          buttonType={"text"}
        />
      </form>
    </div>
  );
};

export default PolicyGroups;
