import React from "react";
import ResourceSearchBar from "../components/resources/ResourceSearchBar";
import PolicySearchBar from "../components/policies/PolicySearchBar";
import TextArea from "../components/TextArea";
import Button from "../components/Button";

const PolicyEvaluationPlayground = () => {
  return (
    <div>
      <div>

      <h1>Policy Evaluation Playground</h1>
      <p>Select a policy, select a resource and version, and evaluate.</p>
      <ResourceSearchBar onSubmit={() => {console.log('resource search')}}/>
      <PolicySearchBar onSubmit={() => {console.log('policy search')}}/>
      </div>
      <div>
        <p>{"Selected resource: <resource name goes here>"}</p>
        <TextArea name={'regoContent'} label={'Rego Policy Code'} onChange={(event) => console.log('here changing text', event.target.value)}/>
        <Button label={'Evaluate'} onClick={() => {console.log('here evaluating policy')}}/>
      </div>
    </div>
  );
};

export default PolicyEvaluationPlayground;