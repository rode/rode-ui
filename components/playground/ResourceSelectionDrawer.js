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

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Playground.module.scss";
import Button from "components/Button";
import Drawer from "components/Drawer";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import ResourceSearchAndResults from "./ResourceSearchAndResults";
import ResourceVersionSearchAndResults from "./ResourceVersionSearchAndResults";
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";

const RESOURCE = "Resource";
const VERSION = "Version";

const ResourceSelectionDrawer = ({ setResource, clearEvaluation }) => {
  const { dispatch } = useResources();
  const [genericResource, setGenericResource] = useState(null);
  const [resourceVersion, setResourceVersion] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentSection, setCurrentSection] = useState(RESOURCE);

  const openResourceSelection = () => setCurrentSection(RESOURCE);
  const openVersionSelection = () => setCurrentSection(VERSION);
  const clearSearchTerms = () => {
    dispatch({
      type: resourceActions.SET_SEARCH_TERM,
      data: "",
    });
    dispatch({
      type: resourceActions.SET_VERSION_SEARCH_TERM,
      data: "",
    });
  };

  useEffect(() => {
    clearEvaluation();

    if (genericResource && resourceVersion) {
      console.log("resourceVersion", resourceVersion);
      setResource(resourceVersion);
    }
  }, [genericResource, resourceVersion]);

  return (
    <>
      <Button
        label={"Search for resources"}
        buttonType="icon"
        onClick={() => {
          clearSearchTerms();
          setGenericResource(null);
          setResourceVersion(null);
          setCurrentSection(RESOURCE);
          setShowDrawer(true);
        }}
        className={styles.openSearchButton}
      >
        <Icon name={ICON_NAMES.SEARCH} size={"large"} />
      </Button>
      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        testId={"resourceSelectionDrawer"}
      >
        <div className={styles.resourceDrawerNavigation}>
          <Button
            buttonType={"text"}
            onClick={openResourceSelection}
            label={"Resource"}
            className={
              currentSection === RESOURCE
                ? styles.activeNavigationButton
                : styles.navigationButton
            }
          />
          <Button
            buttonType={"text"}
            onClick={openVersionSelection}
            label={"Version"}
            disabled={!genericResource}
            className={
              currentSection === VERSION
                ? styles.activeNavigationButton
                : styles.navigationButton
            }
          />
        </div>
        {currentSection === RESOURCE && (
          <ResourceSearchAndResults
            genericResource={genericResource}
            onResourceSelect={(resource) => {
              setGenericResource(resource);
              openVersionSelection();
            }}
          />
        )}
        {currentSection === VERSION && (
          <ResourceVersionSearchAndResults
            genericResource={genericResource}
            onVersionSelect={(version) => {
              setResourceVersion(version);
              setShowDrawer(false);
            }}
          />
        )}
      </Drawer>
    </>
  );
};

ResourceSelectionDrawer.propTypes = {
  setResource: PropTypes.func.isRequired,
  clearEvaluation: PropTypes.func.isRequired,
};

export default ResourceSelectionDrawer;
