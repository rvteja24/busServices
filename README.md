# busServices
services for handling bus tickets

Clone the code from this repository.

Make sure you have latest version of node.js & npm installed on your machine.

Setup the mongoDb instance on your machine and in the config.js update the uri of connection string the database name and the collection name.

Run 'npm install' from the project root directory to install all the node dependencies.

Run 'node mongoDbSetup/mongoTicketsCollectionSetup.js' from the project root directory to setup dummy data in the mongodb for the first time.

Run 'node server.js' from the project root folder to start the node.js instance.

Navigate to localhost:8000 and use the below mentioned end points for the apis:

'/api/v1/getTicketStatus' - to get ticket status (CLOSED/OPEN) based on seat number

'/api/v1/getAllClosedTickets' - to get all closed tickets

'/api/v1/getAllOpenTickets' - to get all open tickets

'/api/v1/getTicketInfo' - get ticket information based on seat number

'api/v1/updateTicketInfo' - to update ticket info with given parameters

'/api/v1/openAllTickets' - ----admin only functionality---- to open up all the tickets
