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
import PropTypes from "prop-types";
import Button from "components/Button";
// import styles from "styles/modules/OccurrenceDetails.module.scss";
import Modal from "components/Modal";

const OccurrenceCodeModal = ({ json }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <>
      <Modal
        onClose={() => setShowCode(false)}
        title={"Occurrence JSON"}
        isVisible={showCode}
      >
        <pre data-testid="occurrenceJson">
          <code>{JSON.stringify(json, null, 2)}</code>
        </pre>
      </Modal>
      <Button onClick={() => setShowCode(true)} label={"Show JSON"} />
    </>
  );
};

OccurrenceCodeModal.propTypes = {
  json: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default OccurrenceCodeModal;
