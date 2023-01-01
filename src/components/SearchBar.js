import React from 'react'
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Autocomplete } from '@mui/material';

const SearchBar = ({setSearchQuery, data, activityModal, populateFields, navigate}) => (
  <Autocomplete
  size='small'
    freeSolo
    id="free-solo-2-demo"
    disableClearable
    options={data}
    getOptionLabel={(option) => option.name || ""}
    renderInput={(params) => (
      <TextField
        size="small"
        {...params}
        label="Search companies"
        InputProps={{
          ...params.InputProps,
          type: 'search',
        }}
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          width: "300px",
          //height: "30px"
        }}
      />
    )}
    onInputChange={(e)=> setSearchQuery(e.target.value)}
    onChange={(e, f)=> {
      if (activityModal){
        console.log("activity modal", f);
        populateFields(f)

      } else {
        console.log("navbar");
        navigate(`/companies/${f.id}`)
      }
    }}
    style={{
      display: "flex",
      alignSelf: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: 10,
    }}
  />
);

export default SearchBar