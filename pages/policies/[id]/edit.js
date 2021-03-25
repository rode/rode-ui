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
        <PolicyForm type={"EDIT"} defaultValues={policy} />
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
