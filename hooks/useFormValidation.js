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
  const [formData, setFormData] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  const isValid = (formData) => {
    setFormData(formData);

    let isValid = true;

    try {
      schema.validateSync(formData, {
        abortEarly: false,
      });
      setErrors({});
    } catch (errors) {
      const updatedErrors = errors.inner.reduce((accum, error) => {
        accum[error.path] = error.message;

        return accum;
      }, {});

      setErrors(updatedErrors);

      isValid = false;
    }

    return isValid;
  };

  const validateField = (event, forceValidation = false) => {
    if (!forceValidation && !formData) {
      return;
    }
    const field = event.target.name;
    const value = event.target.value;

    const formDataWithUpdatedField = {
      ...formData,
      [field]: value,
    };

    isValid(formDataWithUpdatedField);
  };

  return {
    isValid,
    validateField,
    errors,
  };
};
