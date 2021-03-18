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
