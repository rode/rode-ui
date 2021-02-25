import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {useRouter} from "next/router";
import { useTheme } from "../../hooks/useTheme";

const Resource = () => {
  const {theme} = useTheme();
  const router = useRouter();
  const {resourceUri} = router.query;

  useEffect(() => {
    //fetch to get the occurrences for the resource uri
  }, [resourceUri]);

  return (
    <div>
      <p>Resource: {resourceUri}</p>
    </div>
  )
}

Resource.propTypes = {

}

export default Resource