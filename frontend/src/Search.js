import React, { useEffect, useState } from "react";
import {
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {
  LocationOn as PinIcon,
  Search as MagnifierIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import { search } from "./api";

const useStyles = makeStyles((theme) => ({
  cityName: {
    fontWeight: 400,
  },
  icon: {
    color: theme.palette.text.secondary,
  },
  optionIcon: {
    marginRight: theme.spacing(2),
  },
  searchIcon: {
    marginLeft: theme.spacing(1),
  },
}));
const Search = ({ setCityCode }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const { process, cancel } = search(inputValue);

    process((options) => {
      setOptions(options);
    });

    return () => cancel();
  }, [inputValue]);

  return (
    <div>
      <Autocomplete
        autoComplete
        autoHighlight
        freeSolo
        disableClearable
        blurOnSelect
        clearOnBlur
        options={options}
        onChange={(event, newValue) => {
          setCityCode(newValue.code);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        getOptionLabel={(option) => option.city || ""}
        renderOption={(option) => {
          return (
            <Grid container alignItems="center">
              <Grid item>
                <PinIcon className={clsx(classes.icon, classes.optionIcon)} />
              </Grid>
              <Grid item xs>
                <span className={classes.cityName}>{option.city}</span>
                <Typography variant="body2" color="textSecondary">
                  {option.country}
                  {option.state ? `, ${option.state}` : ""}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
        renderInput={(props) => (
          <TextField
            {...props}
            placeholder="Search"
            label="City"
            variant="outlined"
            InputProps={{
              ...props.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifierIcon
                    className={clsx(classes.icon, classes.searchIcon)}
                  />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export { Search };
