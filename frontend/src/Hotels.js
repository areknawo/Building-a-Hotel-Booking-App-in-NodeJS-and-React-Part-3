import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  Apartment as HotelIcon,
  ExpandMore as ExpandIcon,
} from "@material-ui/icons";
import { Offers } from "./Offers";
import { getHotels } from "./api";

const useStyles = makeStyles((theme) => ({
  hotelList: {
    width: "100%",
  },
  hotelListing: {
    display: "flex",
  },
  hotelGraphic: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5rem",
    width: "5rem",
    marginRight: theme.spacing(2),
  },
  hotelImage: {
    height: "100%",
    width: "100%",
  },
  hotelIcon: {
    color: theme.palette.text.secondary,
    height: "3rem",
    width: "3rem",
  },
  hotelDetails: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  hotelName: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  hotelAddress: {
    display: "flex",
    flexDirection: "column",
  },
}));
const Hotels = ({ cityCode, checkInDate, checkOutDate, setOfferId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [activeHotelId, setActiveHotelId] = useState(false);
  const [hotels, setHotels] = useState(null);
  const handleChange = (hotelId) => (event, expanded) => {
    setActiveHotelId(expanded ? hotelId : false);
  };

  useEffect(() => {
    if (cityCode) {
      setLoading(true);
      getHotels(
        cityCode,
        checkInDate.format("YYYY-MM-DD"),
        checkOutDate.format("YYYY-MM-DD")
      )
        .then((hotels) => {
          setHotels(hotels);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setHotels(null);
    }
  }, [cityCode, checkInDate, checkOutDate]);

  if (loading) {
    return <CircularProgress />;
  }
  if (hotels && hotels.length === 0) {
    return <span>NO RESULTS</span>;
  }
  return (
    <div className={classes.hotelList}>
      {hotels &&
        hotels.map((hotel) => {
          const { name, address, hotelId, media } = hotel;
          const image = media ? media[0].uri : "";
          const active = activeHotelId === hotelId;

          return (
            <Accordion
              key={hotelId}
              expanded={active}
              onChange={handleChange(hotelId)}
            >
              <AccordionSummary expandIcon={<ExpandIcon />}>
                <div className={classes.hotelListing}>
                  <div className={classes.hotelGraphic}>
                    {image ? (
                      <img
                        src={image}
                        alt="HOTEL"
                        className={classes.hotelImage}
                      />
                    ) : (
                      <HotelIcon className={classes.hotelIcon} />
                    )}
                  </div>
                  <div className={classes.hotelDetails}>
                    <Typography className={classes.hotelName}>
                      {name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className={classes.hotelAddress}
                    >
                      {address.lines.map((line) => {
                        return <span key={line}>{line}</span>;
                      })}
                      <span>
                        {address.cityName}
                        {address.stateCode ? `, ${address.stateCode}` : ""}
                        {` ${address.postalCode}`}
                      </span>
                    </Typography>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Offers
                  active={active}
                  hotelId={hotelId}
                  setOfferId={setOfferId}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
    </div>
  );
};

export { Hotels };
