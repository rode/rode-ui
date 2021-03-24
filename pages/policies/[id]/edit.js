import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "hooks/useFetch";
import PolicyForm from "components/policies/PolicyForm";
import Loading from "components/Loading";

const EditPolicy = () => {
  const router = useRouter();
  const { id } = router.query;

  // TODO: add some state checks in here to avoid pulling policy if it already exists locally

  const { data, loading } = useFetch(id ? `/api/policies/${id}` : null);

  console.log("data", data);

  return (
    <Loading loading={loading}>
      {data && <PolicyForm type={"EDIT"} defaultValues={data} />}
    </Loading>
  );
};

export default EditPolicy;
