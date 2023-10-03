import mongoose from "mongoose";

const schema = mongoose.Schema({
  title: { type: String, require: true},
  photoLocation: { type: String, require: true },
  description: { type: String, require: true },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: [true, "user id is required"],
  },
});

export default mongoose.model("Post", schema);
