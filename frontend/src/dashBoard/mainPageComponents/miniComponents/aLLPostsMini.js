import React, { useEffect, useState, useCallback } from "react";
/* axios */
import axios from "axios";
/* css */
import cssMiniMyPosts from "../../../css/dashboard/mainPageComponentsCSS/miniComponentsCSS/myPostsMiniCSS.module.css";
function ALLPostsMini() {
  /* states */
  const [posts, setPosts] = useState([]);
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
  /* frequen use functions */
  const showMyPosts = useCallback(async () => {
    // Replace 'apiEndpoint' with your actual API endpoint
    axios({
      method: "POST",
      url: "http://localhost:3001/api/v1/user/showAllPosts",
      headers: {
        jwt: myCookieValue,
      },
    })
      .then((response) => {
        setPosts(response.data.allPosts); // Assuming your API response is an array of posts
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [myCookieValue]);
  /* userEffect */
  useEffect(() => {
    showMyPosts();
  }, [showMyPosts]);
  return (
    <div>
      <h1>Post List</h1>
      <ul>
        {posts.map((post) => (
          <li
            key={post._id}
            className={`${cssMiniMyPosts.paddingGlobal} ${cssMiniMyPosts.widthAndBorder} ${cssMiniMyPosts.backgroundColor}`}
          >
            <div className={cssMiniMyPosts.center}>
              <div
                className={`${cssMiniMyPosts.blue} ${cssMiniMyPosts.flexrowjustifySpaceBetween}`}
              >
                <div>
                  <h1>user: {post.userName}</h1>
                </div>
              </div>
              <div>
                <h1>title: {post.title}</h1>
              </div>
              <div>
                <img
                  src={`http://localhost:3001${post.photoLocation.replace(
                    "./posts",
                    ""
                  )}`}
                  alt={"title Description"}
                  className={cssMiniMyPosts.img}
                ></img>
              </div>
              <div>
                <h1>description: </h1> {post.description}
              </div>
            </div>
          </li>
          // Replace 'title' with the actual property name you want to display
        ))}
      </ul>
    </div>
  );
}

export default ALLPostsMini;
