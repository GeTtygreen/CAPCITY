// import {} from "dotenv/config";
import  "dotenv/config"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fileupload from "express-fileupload";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Import the functions you need from the SDKs you need





import Amadeus from "amadeus";
const amadeus = new Amadeus({
  clientId: process.env.API_KEY_AMADEUS,
  clientSecret: process.env.API_SECRET_AMADEUS,
});

// import {flightSearch,autoComplete} from './flight_booking_backend/flycontrol.js'
const app = express();
app.use(bodyParser.json());
app.use(cors());

let initial_path = path.join(__dirname,"client");

app.use(express.static(initial_path));
app.use(fileupload());


app.get("/", (req, res) => {
  res.sendFile(path.join(initial_path, "../../client/main_page_frontend/index.html"));
 });



app.use(express.static("initial_path" + "../../client/main_page_frontend"));
app.use(express.static("initial_path" + "../../client/Profile_frontend"));
app.use(express.static("initial_path" + "../../client/signup_frontend"));
app.use(express.static("initial_path" + "../../client/login_frontend"));
app.use(express.static("initial_path" + "../../client/flight_frontend"));
app.use(express.static("initial_path" + "../../client/uploads"));
app.use("/uploads",express.static("initial_path" + "../../client/uploads"));

// REVIEW POST
app.get("/reviews", (req, res) => {
  res.sendFile(
    path.join(initial_path, "../client/main_page_frontend/reviewpage.html")
  );
});
//upload
app.post("/uploads", (req, res) => {
  let file = req.files.image;
  let date = new Date();
  //image name
  let imagename = date.getDate() + date.getTime() + file.name;
  // image upload path name
  let path = "client/uploads/" + imagename;

  // create upload object
  file.mv(path, (err) => {
    if (err) {
      throw err;
    } else {
      // uploaded image path
      res.json(`uploads/${imagename}`);
    }
  });
});

app.get("/:blog",(req,res) => {
  res.send(path.join(initial_path,"../client/main_page_frontend/reviewpage.html"))
});

app.use((req, res) => {
  res.json("404");
})


// FLIGHT ENDPOINTS
app.get("/api/autocomplete", async (request, response) => {
  try {
    const { query } = request;
    const { data } = await amadeus.referenceData.locations.get({
      keyword: query.keyword,
      subType: Amadeus.location.city,
    });
    response.json(data);
  } catch (error) {
    console.error(error.response);
    response.json([]);
  }
});

app.get("/api/search", async (request, response) => {
  try {
    const { query } = request;
    const { data } = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: query.origin,
      destinationLocationCode: query.destination,
      departureDate: query.departureDate,
      adults: query.adults,
      children: query.children,
      infants: query.infants,
      travelClass: query.travelClass,
      ...(query.returnDate ? { returnDate: query.returnDate } : {}),
    });
    response.json(data);
  } catch (error) {
    console.error(error.response);
    response.json([]);
  }
});

// INITIAL SEARCH REQUEST
app.get(`/city-and-airport-search/:parameter`, (req, res) => {
  const parameter = req.params.parameter;
  // Which cities or airports start with the parameter variable
  amadeus.referenceData.locations
    .get({
      keyword: parameter,
      subType: Amadeus.location.any,
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

app.get(`/flight-search`, (req, res) => {
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture;
  // Find the cheapest flights
  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: "1",
      max: "7",
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});
// FLIGHT CONFIRMATION
app.post(`/flight-confirmation`, (req, res) => {
  const flight = req.body.flight;
  // Confirm availability and price
  amadeus.shopping.flightOffers.pricing
    .post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      })
    )
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

app.post(`/flight-booking`, (req, res) => {
  // Book a flight

  const flight = req.body.flight;
  const name = req.body.name;

  amadeus.booking.flightOrders
    .post(
      JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: [flight],
          travelers: [
            {
              id: "1",
              dateOfBirth: "1982-01-16",
              name: {
                firstName: name.first,
                lastName: name.last,
              },
              gender: "MALE",
              contact: {
                emailAddress: "jorge.gonzales833@telefonica.es",
                phones: [
                  {
                    deviceType: "MOBILE",
                    countryCallingCode: "25",
                    number: "480080076",
                  },
                ],
              },
              documents: [
                {
                  documentType: "PASSPORT",
                  birthPlace: "",
                  issuanceLocation: "USA",
                  issuanceDate: "2015-04-14",
                  number: "00000000",
                  expiryDate: "2025-04-14",
                  issuanceCountry: "ES",
                  validityCountry: "ES",
                  nationality: "ES",
                  holder: true,
                },
              ],
            },
          ],
        },
      })
    )
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

// THIS IS THE SEARCH ENDPOINT
app.get("/api/search", async (request, response) => {
  try {
    const { query } = request;
    console.log(query);
    const { data } = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: query.origin,
      destinationLocationCode: query.destination,
      departureDate: query.departureDate,
      adults: query.adults,
      children: query.children,
      infants: query.infants,
      travelClass: query.travelClass,
      ...(query.returnDate ? { returnDate: query.returnDate } : {}),
    });
    response.json(data);
  } catch (error) {
    console.error(error.response);
    response.json([]);
  }
});
// THIS AUTOCOMPLETES THE INPUT FIELD
app.get("/api/autocomplete", async (request, response) => {
  try {
    const { query } = request;
    const { data } = await amadeus.referenceData.locations.get({
      keyword: query.keyword,
      subType: Amadeus.location.city,
    });
    response.json(data);
  } catch (error) {
    console.error(error.response);
    response.json([]);
  }
});
//

app.post(`/flight-confirmation`, (req, res) => {
  const flight = req.body.flight;

  // Confirm availability and price
  amadeus.shopping.flightOffers.pricing
    .post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      })
    )
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

app.post(`/flight-booking`, (req, res) => {
  // Book a flight

  const flight = req.body.flight;
  const name = req.body.name;

  amadeus.booking.flightOrders
    .post(
      JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: [flight],
          travelers: [
            {
              id: "1",
              dateOfBirth: "1982-01-16",
              name: {
                firstName: name.first,
                lastName: name.last,
              },
              gender: "MALE",
              contact: {
                emailAddress: "jorge.gonzales833@telefonica.es",
                phones: [
                  {
                    deviceType: "MOBILE",
                    countryCallingCode: "34",
                    number: "480080076",
                  },
                ],
              },
              documents: [
                {
                  documentType: "PASSPORT",
                  birthPlace: "Madrid",
                  issuanceLocation: "Madrid",
                  issuanceDate: "2015-04-14",
                  number: "00000000",
                  expiryDate: "2025-04-14",
                  issuanceCountry: "ES",
                  validityCountry: "ES",
                  nationality: "ES",
                  holder: true,
                },
              ],
            },
          ],
        },
      })
    )
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

const port = process.env.PORT || process.env.SERVER_PORT;
app.listen(port, () => console.log(`YOUR IN THE ${port} ZONE`));
