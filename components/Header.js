import React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.scss";
import Logo from "./icons/Logo";

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
          <Logo />
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
    </header>
  );
};

export default Header;
