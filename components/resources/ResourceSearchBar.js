import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Input from "components/Input";
import styles from "styles/modules/Resources.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import Button from "components/Button";

const ResourceSearchBar = ({ currentSearch }) => {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const router = useRouter();

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const onSubmit = (event) => {
    event.preventDefault();

    if (searchTerm.trim().length) {
      console.log("Search is not implemented");
      router.push(`/resources?search=${searchTerm.trim()}`);
    }
  };

  return (
    <form className={styles.searchBarContainer} onSubmit={onSubmit}>
      <Input
        name={"resourceSearch"}
        label={"Search for a resource"}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={"Ex: alpine@sha256:etcetcetcetcetc"}
        value={searchTerm}
      />
      <Button
        label={"Search"}
        buttonType={"icon"}
        disabled={!searchTerm}
        type={"submit"}
      >
        <Icon name={ICON_NAMES.SEARCH} size={"large"} />
      </Button>
    </form>
  );
};

ResourceSearchBar.propTypes = {
  currentSearch: PropTypes.string,
};

export default ResourceSearchBar;
