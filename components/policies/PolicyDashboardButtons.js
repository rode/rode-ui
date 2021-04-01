import React from "react";
import { useRouter } from "next/router";
import Button from "components/Button";
import styles from "styles/modules/Policy.module.scss"

const PolicyDashboardButtons = () => {
  const router = useRouter();
  return (
    <div className={styles.dashboardButtonsContainer}>
      <Button
        onClick={() => router.push("/policies/new")}
        label={"Create New Policy"}
      />
      <Button
        buttonType={"text"}
        onClick={() => router.push("/playground")}
        label={"Policy Evaluation Playground"}
      />
    </div>
  );
};

export default PolicyDashboardButtons;
