import mongoose from "mongoose";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: String,
  email: {
    type: String,
    unique: true,
    default: ""
  },
  age: {
    type: Number,
    default: 0
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const UserModel = mongoose.model("user", schema);

export default UserModel;