import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "components/Input";
import styles from "styles/modules/Resources.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import Button from "components/Button";

const ResourceSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const onClick = () => {
    if (searchTerm.trim().length) {
      console.log("Search is not implemented");
      router.push(`/resources?search=${searchTerm.trim()}`);
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <Input
        name={"resourceSearch"}
        label={"Search for a resource"}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={"Ex: alpine@sha256:etcetcetcetcetc"}
      />
      <Button
        onClick={onClick}
        label={"Search"}
        buttonType={"icon"}
        disabled={!searchTerm.length}
      >
        <Icon name={ICON_NAMES.SEARCH} size={"large"} />
      </Button>
    </div>
  );
};

export default ResourceSearchBar;
