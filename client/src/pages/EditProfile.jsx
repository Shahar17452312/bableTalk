import { Autocomplete, TextField, Button } from "@mui/material";
import HamburgerMenu from "../components/HamburgerMenu";
import { useState } from "react";
import axiosInstance from "../config/axios";
//import { useNavigate } from "react-router-dom";
import languages from "../config/languages";
import "../styles/EditProfile.css";

function EditProfile() {
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    password: "",
    preferredLanguage: "",
  });
  const userId=localStorage.getItem("id");

  //const navigate = useNavigate();

  function onChangeHandler(e) {
    const { name, value } = e.target;
    console.log(name);
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function onSubmitHandler(event) {
    event.preventDefault();
    try {
      const newUser = await axiosInstance.put("/user/"+userId, formValues);
        localStorage.setItem("name",newUser.data.name);
        localStorage.setItem("preferredLanguage",newUser.data.preferredLanguage);
      //navigate("/home");
    } catch (error) {
      console.error("error: ", error.response?.data?.message || error.message);
    }
  }

  function preferedLanguageHandler(event, value) {
    if (value) {
      setFormValues((prev) => ({
        ...prev,
        preferredLanguage: value.code,
      }));
    }
  }

  return (
    <div className="editProfile-main-container">
      <HamburgerMenu />
      <form onSubmit={onSubmitHandler} className="editProfile-form-container">
        <h3>Enter Your Details Below</h3>
        <TextField
          id="email"
          name="email"
          label="Email"
          value={formValues.email}
          onChange={onChangeHandler}
          variant="outlined"
          fullWidth
        />
        <TextField
          id="userName"
          name="name"
          label="Name"
          value={formValues.name}
          onChange={onChangeHandler}
          variant="outlined"
          fullWidth
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formValues.password}
          onChange={onChangeHandler}
          variant="outlined"
          fullWidth
        />
            <Autocomplete
                options={languages}
                id="preferredLanguage"
                getOptionLabel={(option) => option.name}
                onChange={preferedLanguageHandler}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Choose a language"
                    name="preferredLanguage"
                    fullWidth
                    sx={{
                        "& .MuiInputBase-input": {
                        fontSize: "1.2rem",
                        },
                        "& .MuiInputLabel-root": {
                        fontSize: "1.2rem", 
                        },
                    }}
                    />
                )}
                sx={{
                    width: "100%",
                    "& .MuiAutocomplete-input": {
                    fontSize: "1.2rem",
                    },
                    "& .MuiAutocomplete-option": {
                    fontSize: "1.2rem", 
                    },
                }}
                />


        <Button id="login" type="submit" variant="contained" fullWidth>
          Confirm
        </Button>
      </form>
    </div>
  );
}

export default EditProfile;
