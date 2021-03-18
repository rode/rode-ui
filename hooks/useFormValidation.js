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

export const useFormValidation = (schema) => {
  const [errors, setErrors] = React.useState({});

  const isValid = (formData) => {
    const { error } = schema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const updatedErrors = error.details.reduce((accum, err) => {
        console.log("err", err);

        let message = err.message;

        if (err.type.includes("empty")) {
          message = "This field is required.";
        }

        accum[err.path[0]] = message;

        return accum;
      }, {});

      setErrors(updatedErrors);

      return false;
    }
  };

  return {
    isValid,
    errors,
  };
};
