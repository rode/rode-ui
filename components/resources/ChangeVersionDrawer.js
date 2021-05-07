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

import React, { useState } from "react";
import Button from "components/Button";
import Drawer from "components/Drawer";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Loading from "components/Loading";
import ResourceVersion from "./ResourceVersion";
import styles from "styles/modules/Resource.module.scss"
import LabelWithValue from "../LabelWithValue";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import {useRouter} from "next/router";
import { useResources } from "../../providers/resources";
import { resourceActions } from "../../reducers/resources";

const ChangeVersionDrawer = (props) => {
  const { resourceName, currentVersion } = props;
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);
  const router = useRouter();
  const {dispatch} = useResources();

  const { data, loading, goToNextPage, isLastPage } = usePaginatedFetch(
    resourceName ? "/api/resource-versions" : null,
    { resource: resourceName },
    10
  );

  const openDrawer = () => {
    setShowVersionDrawer(true);
  };

  const selectVersion = (uri) => {
    router.push(`/resources/${encodeURIComponent(uri)}`);
    setShowVersionDrawer(false);
    dispatch({
      type: resourceActions.SET_OCCURRENCE_DETAILS,
      data: null
    });
  }

  // TODO: hide the change version button when there are no other versions than the currently viewed one
  return (
    <>
      <Button type={"text"} onClick={openDrawer} label={"Change Version"} />
      <Drawer
        isOpen={showVersionDrawer}
        onClose={() => setShowVersionDrawer(false)}
      >
        <Loading loading={loading}>
          <div className={styles.versionSelectionHeader}>
            <p className={styles.versionSelectionName}>{ resourceName }</p>
            <p className={styles.versionSelectionInstructions}>Select from the list below to see occurrences related to that version</p>
          </div>
          {
            data?.length > 0 ?
                  data.map(({resourceVersion, uri}) => {
                    const isCurrentVersion = resourceVersion === currentVersion;

                    return (
                        <div key={resourceVersion} className={styles.versionCard}>
                          <div>
                            <LabelWithValue label={"Version"} value={<ResourceVersion version={resourceVersion}/>}/>
                          </div>
                          <Button
                            buttonType={"text"}
                            label={isCurrentVersion ? "Selected" : 'Select'}
                            disabled={isCurrentVersion}
                            className={styles.versionSelectionButton}
                            onClick={() => selectVersion(uri)}
                          >
                            {
                              isCurrentVersion &&
                              <>
                                <Icon name={ICON_NAMES.CHECK}/>
                                <p>Selected</p>
                              </>
                            }
                          </Button>
                        </div>
                      )
                    }
                  )
              :
              <p>{ `No versions found matching the resource "${resourceName}"` }</p>
          }
        </Loading>
      </Drawer>
    </>
  );
};

export default ChangeVersionDrawer;
