import React, { useRef } from "react";
/* css */
import styles from "../../css/dashboard/mainPageCSS/dashboardPageCSS.module.css";
import stylesMakePost from "../../css/dashboard/mainPageComponentsCSS/makePostComponent.module.css";
/* stateReact */
import { useState } from "react";
/* axios */
import axios from "axios";
/* router */
import { useNavigate } from "react-router-dom";
function MakePostComponent() {
  /* navigate */
  const navigate = useNavigate();
  /* for make file null */
  const fileInputRef = useRef(null);
  // adding the states
  const [isActive, setIsActive] = useState("");
  const [Title, setTitle] = useState("");
  const [TextareaValue, setTextareaValue] = useState("");
  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false);
  };

  /* handlers */
  function handleInput(event) {
    setTitle(event.target.value);
  }
  function handleTextarea(event) {
    setTextareaValue(event.target.value);
  }
  let File;
  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    File = fileObj;
  };
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
  async function handleSubmit(event) {
    /* cheak cookie */
    function getCookie(cookieName) {
      const name = cookieName + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(";");

      for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === " ") {
          cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      return "";
    }

    // Usage example:
    const myCookieValue = getCookie("jwt");
    if (Title && TextareaValue && File) {
      if (File.type.includes("image")) {
        alert("file upload successfully");
        let fieldTakenArray = [];
        fieldTakenArray[0] = Title;
        fieldTakenArray[1] = TextareaValue;
        fieldTakenArray[2] = File;
        setTextareaValue("");
        setTitle("");
        fileInputRef.current.value = "";
        let dataTosend = new FormData();
        dataTosend.append("title", fieldTakenArray[0]);
        dataTosend.append("description", fieldTakenArray[1]);
        dataTosend.append("photoLocation", fieldTakenArray[2]);
        const response = await axios({
          method: "POST",
          data: dataTosend,
          url: "http://localhost:3001/api/v1/user/makePost",
          headers: {
            jwt: myCookieValue,
          },
        });
        if (response.data.success === false) {
          alert("error");
        }
        if (response.data.success === true) {
        }
      } else {
        alert(
          "plz upload image not another file or try another image like jpg image"
        );
      }
    } else {
      alert("plz fill all fields");
    }
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
              <a
                href="/makePost"
                className={`${styles.navLink} ${styles.active}`}
              >
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
      <div>
        <form className={stylesMakePost.centerBlog}>
          <label>Title:</label>
          <input
            placeholder="Title"
            value={Title}
            onChange={handleInput}
          ></input>
          <label>Description:</label>
          <textarea
            className={stylesMakePost.textArea}
            value={TextareaValue}
            onChange={handleTextarea}
          />
          <label>Upload Image:</label>
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
          <div className={stylesMakePost.submit} onClick={handleSubmit}>
            SUBMIT
          </div>
        </form>
      </div>
    </div>
  );
}

export default MakePostComponent;
