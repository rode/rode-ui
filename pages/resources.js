import React from "react";
import Input from "../components/Input";
import styles from "../styles/Resources.module.scss";
import Icon from "../components/Icon";
import { ICON_NAMES } from "../utils/icon-utils";

const Resources = () => {
  return (
    <div className={styles.container}>
      <Input
        name={"resourceSearch"}
        label={"Search for a resource"}
        onChange={(e) => console.log("Not implemented: ", e.target.value)}
        placeholder={"Ex: alpine@sha256:etcetcetcetcetc"}
      />
      <Icon name={ICON_NAMES.SEARCH} size={"large"} />
    </div>
  );
};

export default Resources;
