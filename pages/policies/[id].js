import React from "react";
import { useRouter } from "next/router";

const Policy = () => {
  const router = useRouter();

  const { id } = router.query;

  return (
    <div>
      <p>This is the policy page for {id}</p>
    </div>
  );
};

export default Policy;
