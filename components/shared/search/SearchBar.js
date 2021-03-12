import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Search.module.scss";
import Input from "components/Input";
import Button from "components/Button";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

const SearchBar = (props) => {
  const {
    onSubmit,
    onChange,
    searchTerm,
    label,
    name,
    placeholder,
    helpText,
  } = props;

  return (
    <form role="search" className={styles.searchForm} onSubmit={onSubmit}>
      <div className={styles.searchBarContainer}>
        <Input
          name={name}
          label={label}
          onChange={onChange}
          placeholder={placeholder}
          value={searchTerm}
        />
        <Button
          label={"Search"}
          buttonType={"icon"}
          disabled={!searchTerm?.length}
          type={"submit"}
        >
          <Icon name={ICON_NAMES.SEARCH} size={"large"} />
        </Button>
      </div>
      {helpText && <p className={styles.searchHelp}>{helpText}</p>}
    </form>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  searchTerm: PropTypes.string,
  placeholder: PropTypes.string,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default SearchBar;
