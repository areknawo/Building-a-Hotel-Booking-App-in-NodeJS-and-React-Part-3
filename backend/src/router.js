// router.js
const { API_KEY, API_SECRET, STRIPE_KEY } = require("./config");
const Amadeus = require("amadeus");
const express = require("express");
const stripe = require("stripe")(STRIPE_KEY);

// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});
const API = "api";
// City search suggestions
router.get(`/${API}/search`, async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.city,
    });

    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});
// Querying hotels
router.get(`/${API}/hotels`, async (req, res) => {
  try {
    const { cityCode, checkInDate, checkOutDate } = req.query;
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode,
      checkInDate,
      checkOutDate,
    });

    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});
// Querying hotel offers
router.get(`/${API}/offers`, async (req, res) => {
  try {
    const { hotelId } = req.query;
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId,
    });

    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});
// Confirming the offer
router.get(`/${API}/offer`, async (req, res) => {
  try {
    const { offerId } = req.query;
    const response = await amadeus.shopping.hotelOffer(offerId).get();

    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});
// Booking
router.post(`/${API}/booking`, async (req, res) => {
  try {
    const { offerId } = req.query;
    const { body } = req;
    const response = await amadeus.booking.hotelBookings.post(
      JSON.stringify({
        data: {
          offerId,
          guests: body.guests,
          payments: body.payments,
        },
      })
    );

    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});
// Stripe Payment
router.post(`/${API}/create-payment-intent`, async (req, res) => {
  const { body } = req;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: body.amount * 100,
    currency: body.currency,
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = router;
