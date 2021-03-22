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
