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

import { toast } from "react-toastify";
import styles from "styles/modules/Toasts.module.scss";

export const showSuccess = (message, options = {}) => {
  toast(message, {
    className: styles.success,
    ...options,
  });
};
export const showError = (message, options = {}) => {
  toast(message, {
    className: styles.error,
    ...options,
  });
};
