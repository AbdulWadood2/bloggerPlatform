import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // for send email is required
import mongoose from "mongoose";
const app = express();
import route from "./routes/userRoute.js";
import "dotenv/config";
/* set http */
import { createServer } from "http";

const http = createServer(app);
/* set socket */
import { Server } from "socket.io";
const socketIO = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
/* middlewares */
app.use(cors()); // Enable CORS middleware first it is important because it is not work when we not put it on top
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/v1/user", route);
app.use(express.static("posts")); // Serve static files from the 'public' directory
/* connect to mongodb */
mongoose.connect(process.env.dataBase).then(() => {
  console.log("mongoDB Connected!");

  // Add change event listener to the Users collection
  const userPostCollection = mongoose.connection.collection("posts");
  const userChangeStream = userPostCollection.watch();

  userChangeStream.on("change", (change) => {
    // Emit user dataChanged event to connected clients
    socketIO.emit("dataChanged", change);
  });
});

const port = 3001;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
