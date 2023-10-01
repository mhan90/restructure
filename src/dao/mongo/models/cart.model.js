import mongoose from "mongoose";

const schema = new mongoose.Schema({
  purchaser: {
    type: String,
    required: true
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        },
        quantity: Number,
      },
    ],
    default: [],
    required: true,
  },
});

const CartModel = mongoose.model("carts", schema);

export default CartModel;
