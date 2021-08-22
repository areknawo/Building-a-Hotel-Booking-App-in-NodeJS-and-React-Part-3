import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  ListItemIcon,
  Divider,
} from "@material-ui/core";
import { LocalOffer as TagIcon } from "@material-ui/icons";
import { getOffers } from "./api";

const useStyles = makeStyles((theme) => ({
  offerList: {
    width: "100%",
  },
  offerLoadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  offerListing: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      alignItems: "flex-start",
      flexDirection: "row",
    },
  },
  offerIcon: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "inline-flex",
    },
  },
  offerTextWrapper: {
    textTransform: "uppercase",
    paddingRight: theme.spacing(1),
    width: "100%",
  },
  offerText: {
    display: "block",
  },
}));
const Offers = ({ active, hotelId, setOfferId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (active) {
      setLoading(true);
      getOffers(hotelId)
        .then((offers) => {
          setOffers(offers);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setOffers([]);
    }
  }, [active, hotelId]);

  if (loading) {
    return (
      <div className={classes.offerLoadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <List className={classes.offerList}>
      <Divider />
      {offers.map((offer, index) => {
        const [headline, ...description] =
          offer.room.description.text.split("\n");

        return (
          <ListItem
            alignItems="flex-start"
            divider={index !== offers.length - 1}
            className={classes.offerListing}
            key={offer.id}
          >
            <ListItemIcon className={classes.offerIcon}>
              <TagIcon />
            </ListItemIcon>
            <ListItemText
              className={classes.offerTextWrapper}
              primary={<span className={classes.offerText}>{headline}</span>}
              secondary={
                <>
                  {description.map((line) => {
                    return (
                      <span key={line} className={classes.offerText}>
                        {line}
                      </span>
                    );
                  })}
                </>
              }
            />
            <div>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setOfferId(offer.id)}
              >
                {offer.price.total}
                {offer.price.currency}
              </Button>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
};

export { Offers };
