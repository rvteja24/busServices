process.env.NODE_ENV = "test";
const request = require("supertest");
const server = require("../server");
const config = require("../config/config");
const MongoClient = require('mongodb').MongoClient;

beforeAll(async () => {

  const client = new MongoClient(config.uri, config.options);
  client.connect(err => {
    if (err) throw err;
    client.db(config.databaseName).collection(config.collectionName).drop(() => {
      for (var i = 0; i < 40; i++) {
        var doc = {};
        if (i / 2 == 0) {
          doc = { seatNumber: i + 1, passengerAge: 22, passengerGender: "F", passengerName: "Jane Doe", ticketStatus: "CLOSED", phoneNumber: "9988776655", emailId: "abc@test.com" };
        }
        else {
          doc = { seatNumber: i + 1, passengerAge: 0, passengerGender: "", passengerName: "", ticketStatus: "OPEN", phoneNumber: "", emailId: "" };
        }
        client.db(config.databaseName).collection(config.collectionName).insertOne(doc, function (err, result) {
          if (err) throw err;
        });

      };
    });
  });
});

afterAll(async () => {

})


describe("GET / ", () => {
  test("It should respond with API details", async () => {
    const response = await request(server).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /api/v1/getAllClosedTickets ", () => {
  test("It should respond with 401 unauthorized since header is missing", async () => {
    const response = await request(server).get("/api/v1/getAllClosedTickets");
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with all the closed tickets", async () => {
    const response = await request(server).get("/api/v1/getAllClosedTickets").set("api-key", "L7g6TRuVjeQAlPJhLyEI");
    expect(response.statusCode).toBe(200);
    console.log(response.body);
    expect(response.body[0].ticketStatus).toBe("CLOSED");
  });
});

describe("GET /api/v1/getAllOpenTickets ", () => {
  test("It should respond with 401 unauthorized since header is missing", async () => {
    const response = await request(server).get("/api/v1/getAllOpenTickets");
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with all the open tickets", async () => {
    const response = await request(server).get("/api/v1/getAllOpenTickets").set("api-key", "L7g6TRuVjeQAlPJhLyEI");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].ticketStatus).toBe("OPEN");
  });
});

describe("GET /api/v1/getTicketStatus ", () => {
  test("It should respond with 401 unauthorized since header is missing", async () => {
    const response = await request(server).get("/api/v1/getTicketStatus");
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with ticketStatus as CLOSED for the given seat number 1", async () => {
    const response = await request(server).get("/api/v1/getTicketStatus").set("api-key", "L7g6TRuVjeQAlPJhLyEI").query({ seatNumber: 1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.ticketStatus).toBe("CLOSED");
  });

  test("It should respond with ticketStatus as OPEN for the given seat number 2", async () => {
    const response = await request(server).get("/api/v1/getTicketStatus").set("api-key", "L7g6TRuVjeQAlPJhLyEI").query({ seatNumber: 2 });
    expect(response.statusCode).toBe(200);
    expect(response.body.ticketStatus).toBe("OPEN");
  });

  test("It should respond with 404 error code for the given seat number 100", async () => {
    const response = await request(server).get("/api/v1/getTicketStatus").set("api-key", "L7g6TRuVjeQAlPJhLyEI").query({ seatNumber: 100 });
    expect(response.statusCode).toBe(404);
  });

  test("It should respond with 400 error code for no query parameters", async () => {
    const response = await request(server).get("/api/v1/getTicketStatus").set("api-key", "L7g6TRuVjeQAlPJhLyEI");
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /api/v1/getTicketInfo ", () => {
  test("It should respond with 401 unauthorized since header is missing", async () => {
    const response = await request(server).get("/api/v1/getTicketInfo");
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with ticket information for the given seat number 1", async () => {
    var actualTicket = { seatNumber: 1, passengerAge: 22, passengerGender: "F", passengerName: "Jane Doe", ticketStatus: "CLOSED", phoneNumber: "9988776655", emailId: "abc@test.com" };
    const response = await request(server).get("/api/v1/getTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").query({ seatNumber: 1 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(actualTicket);
  });

  test("It should respond with 404 error code for the given seat number 100", async () => {
    const response = await request(server).get("/api/v1/getTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").query({ seatNumber: 100 });
    expect(response.statusCode).toBe(404);
  });

  test("It should respond with 400 error code for no query parameters", async () => {
    const response = await request(server).get("/api/v1/getTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI");
    expect(response.statusCode).toBe(400);
  });
});

describe("PATCH /api/v1/updateTicketInfo ", () => {
  test("It should respond with 401 unauthorized since header is missing", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo");
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with 400 bad request and error message for body missing", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI");
    expect(response.statusCode).toBe(400);
    expect(response.body.errorMessage).toBe("Please check the request body and try again. seatNumber field is mandatory for updating ticket information");

  });

  test("It should respond with 400 bad request and error message for seat number missing", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"passengerAge": 25});
    expect(response.statusCode).toBe(400);
    expect(response.body.errorMessage).toBe("Please check the request body and try again. seatNumber field is mandatory for updating ticket information");

  });

  test("It should respond with 400 bad request and error message for invalid email id", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"seatNumber": 25, "emailId":"abc"});
    expect(response.statusCode).toBe(400);
    expect(response.body.errorMessage).toBe("Please check the emailId format");

  });
  
  test("It should respond with 400 bad request and error message for invalid phone number", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"seatNumber": 25, "phoneNumber":"abc"});
    expect(response.statusCode).toBe(400);
    expect(response.body.errorMessage).toBe("Please check the phone number format");

  });

  test("It should respond with 400 bad request and error message for invalid seat number", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"seatNumber": 70});
    expect(response.statusCode).toBe(400);
    expect(response.body.errorMessage).toBe("Please check the seat number");

  });

  test("It should respond with 400 bad request and error message for invalid ticket status", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"seatNumber": 20, "ticketStatus": "abcd"});
    expect(response.statusCode).toBe(400);
    expect(response.body.errorMessage).toBe("Please check the ticket status format, if the attribute is present it should be CLOSED/OPEN");

  });

  test("It should respond with status code 200 and success message for valid request", async () => {
    const response = await request(server).patch("/api/v1/updateTicketInfo").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"seatNumber": 10, "passengerName":"John DOEE"});
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Ticket updated successfully");

  });
});

describe("PUT /api/v1/openAllTickets ", () => {
  test("It should respond with 401 unauthorized since header is missing", async () => {
    const response = await request(server).put("/api/v1/openAllTickets");
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with 401 unauthorized since body with credentials is missing", async () => {
    const response = await request(server).put("/api/v1/openAllTickets").set("api-key", "L7g6TRuVjeQAlPJhLyEI");
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with 401 unauthorized since credentials are invalid", async () => {
    const response = await request(server).put("/api/v1/openAllTickets").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"username":"admin2", "password": "abcdef"});
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with status 200 and success message in response body", async () => {
    const response = await request(server).put("/api/v1/openAllTickets").set("api-key", "L7g6TRuVjeQAlPJhLyEI").send({"username":"admin1", "password": "serviceAdmin1!"});
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Successfully opened all the tickets");
  });
});

