import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
  styled,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { confirmOffer, createPaymentIntent, makeBooking } from "./api";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
const CardElementContainer = styled("div")({
  padding: "18.5px 14px",
  border: "1px solid rgba(0, 0, 0, 0.23)",
  borderRadius: "4px",
  "&:focus": {
    outline: "-webkit-focus-ring-color auto 1px",
  },
});
const useStyles = makeStyles({
  divider: {
    height: "1rem",
  },
});
const BookingDialog = ({ offerId, setOfferId }) => {
  const [stripeClientSecret, setStripeClientSecret] = useState("");
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardFilled, setCardFilled] = useState(false);
  const [filled, setFilled] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const resetState = () => {
    setBooked(false);
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setCardFilled(false);
    setFilled(false);
    setError("");
    setAvailable(false);
    setLoading(false);
  };
  const handleClose = () => setOfferId(null);
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleCardChange = (event) => {
    setCardFilled(event.complete);
  };
  const payWithCard = async () => {
    const result = await stripe.confirmCardPayment(stripeClientSecret, {
      payment_method: {
        card: elements.getElement("card"),
      },
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  };
  const handleAction = async () => {
    if (booked) {
      resetState();
      handleClose();
    } else {
      setLoading(true);
      try {
        await payWithCard();
        const response = await makeBooking(offerId, {
          name: { firstName, lastName },
          contact: {
            phone,
            email,
          },
        });

        if (response) {
          console.log(response);
          setError("");
          setBooked(true);
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilled(Boolean(firstName && lastName && phone && email && cardFilled));
    setError("");
  }, [firstName, lastName, phone, email, cardFilled]);
  useEffect(() => {
    if (offerId) {
      setLoading(true);
      confirmOffer(offerId)
        .then((response) => {
          if (response) {
            const [offer] = response.offers;

            if (offer && offer.id === offerId) {
              createPaymentIntent(
                parseFloat(offer.price.total),
                offer.price.currency.toLowerCase()
              )
                .then(({ clientSecret }) => {
                  if (clientSecret) {
                    setStripeClientSecret(clientSecret);
                    setAvailable(true);
                  } else {
                    setAvailable(false);
                  }
                })
                .catch((error) => {
                  console.error(error);
                  setAvailable(false);
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          } else {
            setAvailable(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setAvailable(null);
    }
  }, [offerId]);
  return (
    <Dialog
      open={Boolean(offerId)}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>BOOK THE OFFER</DialogTitle>
      <DialogContent>
        <DialogContentText>
          OFFER: {offerId} {available === false && " is not available"}
        </DialogContentText>
        {error && <Alert severity="error">{error}</Alert>}
        {booked && <Alert severity="success">Booking successful.</Alert>}
        {(error || booked) && <div className={classes.divider} />}
        <TextField
          variant="outlined"
          placeholder="First Name"
          fullWidth
          autoComplete="given-name"
          value={firstName}
          onChange={handleFirstNameChange}
        />
        <div className={classes.divider} />
        <TextField
          variant="outlined"
          placeholder="Last Name"
          fullWidth
          autoComplete="family-name"
          value={lastName}
          onChange={handleLastNameChange}
        />
        <div className={classes.divider} />
        <TextField
          variant="outlined"
          placeholder="Phone Number"
          fullWidth
          type="tel"
          autoComplete="phone"
          value={phone}
          onChange={handlePhoneChange}
        />
        <div className={classes.divider} />
        <TextField
          variant="outlined"
          placeholder="Email"
          fullWidth
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
        />
        <div className={classes.divider} />
        <CardElementContainer>
          <CardElement onChange={handleCardChange} />
        </CardElementContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          disabled={typeof available !== "boolean"}
        >
          CANCEL
        </Button>
        <Button
          color="primary"
          variant="contained"
          autoFocus
          disabled={!available || !filled || loading}
          onClick={handleAction}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : booked ? (
            "CONTINUE"
          ) : (
            "BOOK"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { BookingDialog };
