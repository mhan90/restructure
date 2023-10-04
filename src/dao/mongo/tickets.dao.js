import TicketModel from "./models/ticket.model.js";
import EErrors from "../../utils/enum.error.js";

export default class Tickets {
    addTicket = async (ticket) => TicketModel.create(ticket)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
    getTicket = async (id) => TicketModel.findById(id)
        .catch(e => {
            e.code = EErrors.DATABASE_ERROR;
            throw e;
        });
}