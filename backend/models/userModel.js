import mongoose from "mongoose";

const schema = mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  token: [{ type: String, required: true }],
  blogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
});

export default mongoose.model("User", schema);
