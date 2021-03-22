import React, { useState } from "react";
import { useFormValidation } from "hooks/useFormValidation";
import * as yup from "yup";
import Input from "components/Input";

const schema = yup.object().shape({
  field: yup.string().required(),
});

const FormValidationComponent = () => {
  const [field, setField] = useState("");
  const { isValid, validateField, errors } = useFormValidation(schema);

  return (
    <div>
      <Input
        label={"Field Label"}
        name={"field"}
        value={field}
        onChange={(event) => setField(event.target.value)}
        onBlur={validateField}
      />
      {errors.field && <p data-testid="validation-error">{errors.field}</p>}
      <button onClick={() => isValid({ field })}>Validate Form</button>
    </div>
  );
};

export default FormValidationComponent;
