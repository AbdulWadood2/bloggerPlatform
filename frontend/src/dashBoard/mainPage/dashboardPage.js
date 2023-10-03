import React from "react";
import styles from "../../css/dashboard/mainPageCSS/dashboardPageCSS.module.css";
import { useState } from "react";
/* router */
import { useNavigate } from "react-router-dom";
function DashboardPage() {
  /* navigate */
  const navigate = useNavigate();
  // adding the states
  const [isActive, setIsActive] = useState(false);

  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false);
  };

  /* function handlers */
  function deleteCookie(cookieName) {
    // Set the cookie's expiration date to a date in the past
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  function logoutHandler(event) {
    // Usage example:
    deleteCookie("jwt");
    navigate("/");
  }

  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          {/* logo */}
          <a href="#home" className={`${styles.logo}`}>
            Blogger Platform
          </a>

          <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
            <li onClick={removeActive}>
              <a href="/makePost" className={`${styles.navLink}`}>
                Make Post
              </a>
            </li>
            <li onClick={removeActive}>
              <a href="/showMyPosts" className={`${styles.navLink}`}>
                Show My Posts
              </a>
            </li>
            <li onClick={removeActive}>
              <a href="/showAllPosts" className={`${styles.navLink}`}>
                Show All Posts
              </a>
            </li>
            <li>
              <button onClick={logoutHandler}>logout</button>
            </li>
          </ul>

          <div
            className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
            onClick={toggleActiveClass}
          >
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default DashboardPage;
