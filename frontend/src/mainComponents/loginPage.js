import { useState, useEffect } from "react";
/* css */
import "../css/mainComponentsCSS/loginPageCSS.css";
/* axios for use api's */
import axios from "axios";
/* reactRouterDom */
import { useNavigate } from "react-router-dom";
/* component */
function LoginPage() {
  /* navigate */
  const navigate = useNavigate();

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

  /* auto return to dashboard */
  useEffect(() => {
    if (myCookieValue) {
      navigate("/dashboard");
    }
  }, [myCookieValue,navigate]);

  /* funtions  */
  /* function to set cookies */
  // Set a cookie with a name, value, and optional expiration date
  function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  /* for states */
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  /* handlered */
  function handleUserNameChange(event) {
    setuserName(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleSignUpJump(event) {
    navigate("/");
  }
  async function handleSubmitButtonClick(event) {
    try {
      if (event.target.id === "submit") {
        // this is a function that cheaks that the text is aplicable for file or folder name
        function isValidFolderName(text) {
          // Windows folder name rules
          const forbiddenChars = /[<>:"/\\|?*]/; // Invalid characters
          const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i; // Reserved names

          return (
            !forbiddenChars.test(text) &&
            !reservedNames.test(text) &&
            text.length <= 255
          );
        }
        if (userName && password) {
          if (isValidFolderName(userName)) {
            const response = await axios.post(
              "http://localhost:3001/api/v1/user/login",
              {
                userName: userName,
                password: password,
              }
            );
            if (response.data.success === false) {
              alert(response.data.message);
            }
            if (response.data.success === true) {
              // set cookie example
              setCookie("jwt", response.data.token, 30);
              navigate("/dashboard");
            }
          } else {
            alert(
              "username is not acceptable plz use the name like only alphabets and the name that is a valid folder name"
            );
          }
        } else {
          alert("username or password is missing");
        }
      }
    } catch (error) {
      if (error.response.data.error.keyPattern.userName === 1) {
        alert(
          "plz change your userName because this user name is already taken"
        );
      } else {
        alert("something wroung on server", error);
      }
    }
  }
  return (
    <div className="container">
      <div className="heading">
        <h1>Login Page</h1>
      </div>
      <div>
        <input
          id="username"
          value={userName}
          placeholder="ENTER YOUR USERNAME"
          onChange={handleUserNameChange}
        ></input>
      </div>
      <div>
        <input
          id="password"
          value={password}
          placeholder="ENTER YOUR PASSWORD"
          onChange={handlePasswordChange}
        ></input>
      </div>
      <div>
        <button id="submit" onClick={handleSubmitButtonClick}>
          SUBMIT
        </button>
      </div>
      <div className="alreadyHaveAccount" onClick={handleSignUpJump}>
        Back to SignUp?
      </div>
    </div>
  );
}

export default LoginPage;
