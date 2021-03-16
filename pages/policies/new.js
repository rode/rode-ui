import React from "react";
import Input from "components/Input";

const NewPolicy = () => {
  return (
    <div>
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
      </div>
    </div>
  );
};

export default NewPolicy;
