import React from "react";
import Link from "next/link";
import styles from "styles/modules/Header.module.scss";
import RodeLogo from "./RodeLogo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../hooks/useTheme";

const navigationLinks = [
  {
    href: "/resources",
    label: "Resources",
  },
];

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className={`${styles.container} ${styles[theme]}`}>
      <Link href={"/"}>
        <a href={"/"}>
          <RodeLogo theme={theme} />
        </a>
      </Link>

      <div className={styles.links}>
        {navigationLinks.map((link) => {
          return (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          );
        })}
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Header;
