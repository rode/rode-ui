import React from "react";
import styles from "../styles/Home.module.scss";

const Home = () => {
  return (
    <div>
      <h1>Rode UI</h1>
      <a href={"/"}>anchor</a>
      <button className={styles.button}>button</button>
    </div>
  );
};

export default Home;
