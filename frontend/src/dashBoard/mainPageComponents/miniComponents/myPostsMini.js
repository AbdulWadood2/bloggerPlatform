import React, { useEffect, useState, useCallback } from "react";
/* axios */
import axios from "axios";
/* css */
import cssMiniMyPosts from "../../../css/dashboard/mainPageComponentsCSS/miniComponentsCSS/myPostsMiniCSS.module.css";
const MyPosts = ({ socket }) => {
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState([]);
  const [dataChangedRunning, setDataChangedRunning] = useState(false);
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
      url: "http://localhost:3001/api/v1/user/showMyPosts",
      headers: {
        jwt: myCookieValue,
      },
    })
      .then((response) => {
        setPosts(response.data.describedUserBlogsArray); // Assuming your API response is an array of posts
        setUserName(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [myCookieValue]);
  /* function handlers */
  const handleDeletePostClick = useCallback(
    async (event) => {
      if (dataChangedRunning) {
        return; // Return early if handleDataChanged is already running
      }
      try {
        setDataChangedRunning(true); // Set the flag to indicate that handleDataChanged is running
        /* id */
        const id = event.target.id;
        // Create a data object with the id
        const dataToSend = { id };

        // Send a POST request to the server
        await axios.post(
          "http://localhost:3001/api/v1/user/deletePost",
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
              jwt: myCookieValue, // Assuming myCookieValue contains your JWT
            },
          }
        );
      } catch (error) {
        console.error("Error while making the POST request:", error);
      } finally {
        setDataChangedRunning(false); // Reset the flag after handleDataChanged has finished running
      }
    },
    [myCookieValue, dataChangedRunning]
  );
  /* userEffect */
  useEffect(() => {
    showMyPosts();
  }, [showMyPosts]);

  useEffect(() => {
    socket.on("dataChanged", showMyPosts);

    // Clean up the socket event listener
    return () => {
      socket.off("dataChanged", showMyPosts);
    };
  }, [socket,showMyPosts]);

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
                  <h1>user: {userName}</h1>
                </div>
                <div>
                  <button
                    id={post._id}
                    className={cssMiniMyPosts.deleteButton}
                    onClick={handleDeletePostClick}
                  >
                    x
                  </button>
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
};

export default MyPosts;
