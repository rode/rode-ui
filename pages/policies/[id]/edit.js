import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "hooks/useFetch";
import PolicyForm from "components/policies/PolicyForm";
import Loading from "components/Loading";

// TODO: add some state checks in here to avoid pulling policy if it already exists locally??? does this make sense with SWR?
const EditPolicy = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading } = useFetch(id ? `/api/policies/${id}` : null);

  return (
    <Loading loading={loading}>
      <PolicyForm type={"EDIT"} defaultValues={data} />
    </Loading>
  );
};

export default EditPolicy;
