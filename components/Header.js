import React from "react";
import Link from "next/link";
import styles from "styles/modules/Header.module.scss";
import RodeLogo from "./icons/RodeLogo";
import ThemeToggle from "./ThemeToggle";

const navigationLinks = [
  {
    href: "/resources",
    label: "Resources",
  },
];

const Header = () => {
  return (
    <header className={styles.container}>
      <Link href={"/"}>
        <a href={"/"}>
          <RodeLogo />
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
       <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
