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

import React from "react";
import PropTypes from "prop-types";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Loading from "components/Loading";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "utils/constants";
import Button from "components/Button";
import styles from "styles/modules/PolicyHistory.module.scss";
import { useTheme } from "providers/theme";
import Text from "components/Text";
import ToggleCard from "components/ToggleCard";
import Code from "components/Code";

const PolicyHistory = ({ policy }) => {
  const { theme } = useTheme();
  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    `/api/policies/${policy.id}/versions`,
    {},
    15
  );

  return (
    <div className={styles[theme]}>
      <Loading loading={loading}>
        {data && (
          <>
            {data.map((version, index) => {
              return (
                <ToggleCard
                  key={version.version}
                  className={styles.historyCard}
                  header={
                    <div className={styles.versionCard}>
                      <div className={styles.versionHeaderDetails}>
                        <Text.Value className={styles.version}>{`v${
                          version.version
                        }${index === 0 ? " (latest)" : ""}`}</Text.Value>
                        <Text.Body2 className={styles.versionMessage}>
                          {version.message}
                        </Text.Body2>
                      </div>
                      <div>
                        <Text.Body2>
                          {dayjs(version.created).format(DATE_TIME_FORMAT)}
                        </Text.Body2>
                      </div>
                    </div>
                  }
                  content={
                    <div className={styles.versionDetails}>
                      <Text.Label as={"p"}>Rego Policy Code</Text.Label>
                      <Code language={"rego"} code={version.regoContent} />
                    </div>
                  }
                />
              );
            })}
          </>
        )}
        {!isLastPage && (
          <Button
            buttonType="text"
            onClick={goToNextPage}
            label={"View More"}
          />
        )}
      </Loading>
    </div>
  );
};

PolicyHistory.propTypes = {
  policy: PropTypes.object.isRequired,
};

export default PolicyHistory;
