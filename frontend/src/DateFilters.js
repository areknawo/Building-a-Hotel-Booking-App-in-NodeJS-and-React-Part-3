import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  datePickersContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
    width: "100%",
  },
  datePicker: {
    flex: 1,
  },
  spacer: {
    width: theme.spacing(2),
  },
}));
const DateFilters = ({
  checkInDate,
  checkOutDate,
  setCheckOutDate,
  setCheckInDate,
}) => {
  const classes = useStyles();
  const minCheckIn = useRef(dayjs());

  useEffect(() => {
    const minCheckOutDate = checkInDate.add(1, "day");
    setCheckOutDate(
      +minCheckOutDate > +checkOutDate ? minCheckOutDate : checkOutDate
    );
  }, [checkInDate, checkOutDate, setCheckOutDate]);

  return (
    <div className={classes.datePickersContainer}>
      <DatePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        label="Check In"
        value={checkInDate}
        minDate={minCheckIn.current}
        onChange={(date) => setCheckInDate(date)}
        className={classes.datePicker}
      />
      <div className={classes.spacer} />
      <DatePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        label="Check Out"
        value={checkOutDate}
        minDate={checkInDate.add(1, "day")}
        onChange={(date) => setCheckOutDate(date)}
        className={classes.datePicker}
      />
    </div>
  );
};

export { DateFilters };
