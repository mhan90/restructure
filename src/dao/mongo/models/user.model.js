import mongoose from "mongoose";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: String,
  email: {
    type: String,
    default: ""
  },
  age: {
    type: Number,
    default: 99
  },
  password: {
    type: String,
    required: true,
  },
  salt: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const UserModel = mongoose.model("user", schema);

export default UserModel;