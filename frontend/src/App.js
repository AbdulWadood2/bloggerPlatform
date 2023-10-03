/* for routes */
import { BrowserRouter, Routes, Route } from "react-router-dom";
/* css */
import "./App.css";
/* mainComponents */
import SignupPage from "./mainComponents/signUpPage.js";
import LoginPage from "./mainComponents/loginPage.js";
/* dashBoard */
import DashboardPage from "./dashBoard/mainPage/dashboardPage.js";
/* dashBoard Components */
import MakePostComponent from "./dashBoard/mainPageComponents/makePostComponent";
import ShowMyPostComponents from "./dashBoard/mainPageComponents/showMyPostComponents";
import ShowAllPostComponent from "./dashBoard/mainPageComponents/showAllPostComponent";
/* web socket */
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:3001");

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/*  mainComponents  */}
          <Route path="/" element={<SignupPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          {/* dashboard */}
          <Route path="/dashboard" element={<DashboardPage />}></Route>
          {/* dashboard components */}
          <Route path="/makePost" element={<MakePostComponent />}></Route>
          <Route
            path="/showMyPosts"
            element={<ShowMyPostComponents socket={socket} />}
          ></Route>
          <Route
            path="/showAllPosts"
            element={<ShowAllPostComponent />}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
