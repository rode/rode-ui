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


const ChangeVersionDrawer = (props) => {
  const { resourceName, currentVersion } = props;
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);

  const { data, loading, goToNextPage, isLastPage } = usePaginatedFetch(
    resourceName ? "/api/resource-versions" : null,
    { resource: resourceName },
    10
  );

  const openDrawer = () => {
    setShowVersionDrawer(true);
  };

  // TODO: hide the change version button when there are no other versions that the currently viewed one
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
                  data.map((version) => (
                    <div key={version} className={styles.versionCard}>
                      <ResourceVersion version={version}/>
                      <Button buttonType={"text"} label={'Select'} onClick={() => {}}/>
                    </div>
                    )
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
