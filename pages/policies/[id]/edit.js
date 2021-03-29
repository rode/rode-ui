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
import PolicyForm from "components/policies/PolicyForm";
import Loading from "components/Loading";
import { usePolicy } from "hooks/usePolicy";
import styles from "styles/modules/Policy.module.scss";
import Link from "next/link";

const EditPolicy = () => {
  const router = useRouter();
  const { id } = router.query;

  const { policy, loading } = usePolicy(id);

  return (
    <Loading loading={loading}>
      {policy ? (
        <PolicyForm
          title={"Edit Policy"}
          method={"PATCH"}
          endpoint={`/api/policies/${id}`}
          verb={"update"}
          submitButtonText={"Update Policy"}
          policy={policy}
        />
      ) : (
        <div className={styles.notFound}>
          <h1 className={styles.notFound}>No policy found under {`"${id}"`}</h1>
          <p>
            Try <Link href={"/policies"}>searching for a policy</Link>.
          </p>
        </div>
      )}
    </Loading>
  );
};

export default EditPolicy;
