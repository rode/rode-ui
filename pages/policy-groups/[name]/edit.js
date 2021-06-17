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
import { useRouter } from "next/router";
import { usePolicyGroup } from "hooks/usePolicyGroup";
import PolicyGroupForm from "components/policy-groups/PolicyGroupForm";
import Loading from "components/Loading";
import Link from "next/link";
import styles from "styles/modules/PolicyGroupForm.module.scss";

const EditPolicyGroup = () => {
  const router = useRouter();

  const { name } = router.query;

  const { policyGroup, loading } = usePolicyGroup(name);

  return (
    <Loading loading={loading}>
      {policyGroup ? (
        <PolicyGroupForm
          title={"Edit Policy Group"}
          method={"PATCH"}
          endpoint={`/api/policy-groups/${policyGroup.name}`}
          verb={"update"}
          submitButtonText={"Update Policy Group"}
          policyGroup={policyGroup}
        />
      ) : (
        <div className={styles.notFoundContainer}>
          <h1>No policy group found under {`"${name}"`}</h1>
          <p>
            Go to the <Link href={"/policy-groups"}>dashboard</Link> to view all
            policy groups
          </p>
        </div>
      )}
    </Loading>
  );
};

export default EditPolicyGroup;
