import mongoose from "mongoose";

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const TicketModel = mongoose.model("tickets", schema);

export default TicketModel;