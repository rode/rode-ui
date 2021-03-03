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

import Loading from "components/Loading";
import React from "react";
import PropTypes from "prop-types";
import { useFetch } from "hooks/useFetch";
import BuildOccurrenceSection from "components/occurrences/BuildOccurrenceSection";
import SecureOccurrenceSection from "components/occurrences/SecureOccurrenceSection";
import DeployOccurrenceSection from "components/occurrences/DeployOccurrenceSection";
import OccurrenceDetails from "components/occurrences/OccurrenceDetails";
import styles from "styles/modules/Occurrences.module.scss";
import { useResources } from "providers/resources";
import { useTheme } from "providers/theme";

const ResourceOccurrences = (props) => {
  const { resourceUri } = props;
  const { state } = useResources();
  const { theme } = useTheme();

  const { data, loading } = useFetch(resourceUri ? `/api/occurrences` : null, {
    resourceUri,
  });

  return (
    <div className={`${styles.layout} ${styles[theme]}`}>
      <Loading loading={loading} />
      {data && (
        <>
          <div>
            <BuildOccurrenceSection occurrences={data.build} />
            <SecureOccurrenceSection occurrences={data.secure} />
            <DeployOccurrenceSection occurrences={data.deploy} />
          </div>
          {state.occurrenceDetails && (
            <div>
              <OccurrenceDetails occurrences={state.occurrenceDetails} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

ResourceOccurrences.propTypes = {
  resourceUri: PropTypes.string,
};

export default ResourceOccurrences;
