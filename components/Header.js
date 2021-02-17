import React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.scss";
import Logo from "./Logo";

const navigationLinks = [
  {
    href: "/",
    label: "Resources",
  },
];

const Header = () => {
  return (
    <header className={styles.container}>
      <Logo />

      <div className={styles.links}>
        {navigationLinks.map((link) => {
          return (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
