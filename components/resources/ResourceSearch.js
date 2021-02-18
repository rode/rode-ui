import React from "react";
import Input from "components/Input";
import styles from "styles/modules/Resources.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import Button from "components/Button";

const ResourceSearch = () => {
  return (
    <div className={styles.container}>
      <Input
        name={"resourceSearch"}
        label={"Search for a resource"}
        onChange={(e) => console.log("Not implemented: ", e.target.value)}
        placeholder={"Ex: alpine@sha256:etcetcetcetcetc"}
      />
      <Button
        onClick={() => console.log("Search is not implemented")}
        label={"Search"}
        buttonType={"icon"}
      >
        <Icon name={ICON_NAMES.SEARCH} size={"large"} />
      </Button>
    </div>
  );
};

export default ResourceSearch;
