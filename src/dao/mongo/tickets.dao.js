import TicketModel from "./models/ticket.model.js";

export default class Tickets {
    addTicket = async (ticket) => TicketModel.create(ticket);
    getTicket = async (id) => TicketModel.findById(id);
}