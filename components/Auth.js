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
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Text from "components/Text";
import styles from "styles/modules/Auth.module.scss";
import { useTheme } from "providers/theme";

const Login = ({ className }) => {
  const router = useRouter();
  return (
    <Text.Body1
      as={"a"}
      className={`${className} ${styles.link}`}
      href={`/login?returnTo=${encodeURIComponent(router.asPath)}`}
    >
      Log In
    </Text.Body1>
  );
};

Login.propTypes = {
  className: PropTypes.string,
};

const Logout = ({ className, user }) => {
  return (
    <Text.Body1 className={className}>
      Signed in as {user.name}
      {". "}
      <Text.Body1
        as={"a"}
        className={`${className} ${styles.link}`}
        href={"/logout"}
      >
        Log Out
      </Text.Body1>
    </Text.Body1>
  );
};

Logout.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

const Auth = (props) => {
  const { enabled, user } = props;
  const { theme } = useTheme();

  if (!enabled) {
    return null;
  }

  return (
    <div className={styles.container} data-testid="auth">
      {user?.isAuthenticated ? (
        <Logout className={styles[theme]} user={user} />
      ) : (
        <Login className={styles[theme]} />
      )}
    </div>
  );
};

Auth.propTypes = {
  enabled: PropTypes.bool,
  user: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    name: PropTypes.string.isRequired,
  }),
};

export default Auth;
