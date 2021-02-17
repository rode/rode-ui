import React from "react";
import Input from "../components/Input";

const Resources = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "50%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Input
        name={"resourceSearch"}
        label={"Search for a resource"}
        onChange={(e) => console.log("Not implemented: ", e.target.value)}
        placeholder={"Ex: alpine@sha256:etcetcetcetcetc"}
      />
    </div>
  );
};

export default Resources;
