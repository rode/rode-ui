import React from "react";

export const useFormValidation = (schema) => {
  const [errors, setErrors] = React.useState({});

  const isValid = (formData) => {
    const { error } = schema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const updatedErrors = error.details.reduce(
        (accum, err) => {
          accum[err.path[0]] = err.message;

          return accum;
        },
        { ...errors }
      );

      setErrors(updatedErrors);

      return false;
    }
  };

  return {
    isValid,
    errors,
  };
};
