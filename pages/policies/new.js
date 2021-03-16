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
import Input from "components/Input";
import TextArea from "components/TextArea";
import Button from "components/Button";

const NewPolicy = () => {
  const validatePolicy = () => {
    console.log("here validating policy");
  };
  const onSubmit = (event) => {
    event.preventDefault();

    console.log("event", event);

    // validate rego code
    validatePolicy();
    // save to api
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Create New Policy</h1>
      <div>
        <Input
          name={"policyName"}
          label={"Policy Name"}
          onChange={(event) => console.log(event.target.value)}
          horizontal
        />
        <Input
          name={"policyDescription"}
          label={"Description"}
          onChange={(event) => console.log(event.target.value)}
          horizontal
        />
        <TextArea
          name={"policyCode"}
          label={"Rego Policy Code"}
          onChange={(event) => console.log(event.target.value)}
        />
        <Button
          label={"Validate Policy"}
          buttonType={"text"}
          onClick={validatePolicy}
        />
      </div>
      <Button label={"Save Policy"} type={"submit"} />
    </form>
  );
};

export default NewPolicy;
