module.exports = (app) => {
    const ticketController = require('../controllers/ticket.controller.js');

var pathToV1APIs = "/api/v1";

//get ticket status based on seat number
app.get(pathToV1APIs + '/getTicketStatus', ticketController.getStatus)
//get all closed tickets
app.get(pathToV1APIs + '/getAllClosedTickets', ticketController.getAllClosedTickets)
//get all open tickets
app.get(pathToV1APIs + '/getAllOpenTickets', ticketController.getAllOpenTickets)
//get ticket information based on seat number
app.get(pathToV1APIs + '/getTicketInfo', ticketController.getTicketinfo)
//update ticket info with given parameters
//app.put(pathToV1APIs + '/updateTicketInfo', ticketController.updateTicketInfo)
//----admin only functionality---- open up all the tickets
app.put(pathToV1APIs + '/openAllTickets', ticketController.openAllTickets)
}