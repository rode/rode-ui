import React from "react";
import ResourceSearchBar from "../components/resources/ResourceSearchBar";
import PolicySearchBar from "../components/policies/PolicySearchBar";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import styles from "styles/modules/Playground.module.scss";
import { useTheme } from "../providers/theme";

const PolicyEvaluationPlayground = () => {
  const {theme} = useTheme();

  return (
    <div className={`${styles.pageContainer} ${styles[theme]}`}>
      <div className={styles.leftContainer}>
        <h1 className={styles.pageTitle}>Policy Evaluation Playground</h1>
        <p>Select a policy, select a resource and version, and evaluate.</p>
        <div>
          <PolicySearchBar
            onSubmit={() => {
              console.log("policy search");
            }}
          />
        </div>
        <div>
          <ResourceSearchBar
            onSubmit={() => {
              console.log("resource search");
            }}
          />
        </div>
      </div>
      <div className={styles.rightContainer}>
        <p>{"Resource: <resource name goes here>"}</p>
        <TextArea
          name={"regoContent"}
          label={"Rego Policy Code"}
          onChange={(event) =>
            console.log("here changing text", event.target.value)
          }
        />
        <Button
          label={"Evaluate"}
          onClick={() => {
            console.log("here evaluating policy");
          }}
          className={styles.evaluateButton}
        />
      </div>
    </div>
  );
};

export default PolicyEvaluationPlayground;
