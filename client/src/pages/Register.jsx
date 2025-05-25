import { useState } from "react";
import {TextField, Autocomplete,Button} from "@mui/material";
import "../styles/Register.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import languages from "../config/languages";

function Register(){
   

    const [formValues,setFormValues]=useState({
        email:"",
        name:"",
        password:"",
        preferredLanguage:""
    });
    const [errorMessage,setErrorMessage]=useState("");
    const [flag,setFlag]=useState(false);
    const [errorFlag,setErrorFlag]=useState(true);
    const navigate = useNavigate();

    function onChangeHandler(event){
        const {name,value}=event.target;
        console.log(event);

        setFormValues(prev=>({...prev, [name]:value}));

    }


    async function onSubmitHandler(event){ 
        event.preventDefault();
        console.log(formValues)
        if(!formValues.email||!formValues.name||!formValues.password||!formValues.preferredLanguage){
            setErrorMessage("Please fill all fields");
            setErrorFlag(false)
            setFlag(true);
            return;
        }
        try{
            console.log("Sending request to server");
            const newUser=await axios.post("http://localhost:3000/auth/register",formValues,
                {
                    withCredentials:true
                }
            );
            localStorage.setItem("id",newUser.data._id);
            localStorage.setItem("preferredLanguage",newUser.data.preferredLanguage);
            navigate("/home");
            

        }
        catch(error){
            setErrorFlag(false);
            setErrorMessage("cannot register with that username or email");
            console.error("error: ",error.response.data.message);
        }

    }

    function preferedLanguageHandler(event){
        const value=event.target.innerHTML;
        const preferredLanguageCode=languages.find((languages)=>languages.name===value).code;
        console.log(preferredLanguageCode)
        setFormValues((prev)=>({...prev,preferredLanguage:preferredLanguageCode}));
        
    }





    return (
    <div className="register-main-container" >
        <form method="post" onSubmit={onSubmitHandler} className="register-form-container">
        <h3>Enter Your Details Below</h3>
            <TextField 
                id="email" 
                name="email" 
                label={flag?"error":"Email"}
                error={flag}
                value={formValues.email} 
                onChange={onChangeHandler} 
                variant="outlined" 
            />
            <TextField
                id="name" 
                name="name" 
                label={flag?"error":"Name"}
                error={flag}
                value={formValues.name} 
                onChange={onChangeHandler} 
                variant="outlined"
            />
            <TextField
                id="password" 
                name="password" 
                label={flag?"error":"Password"}
                error={flag}
                value={formValues.password} 
                onChange={onChangeHandler} 
                variant="outlined"
            />

                <Autocomplete
                    options={languages}
                    id="preferredLanguage"
                    getOptionLabel={(option) => `${option.name}`}
                    onChange={preferedLanguageHandler} // שולח את הבקשה כאן
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            value={formValues.preferredLanguage}
                            label={flag ? "error" : "Choose a language"}
                            error={flag}
                            name="preferredLanguage"
                        />
                    )}
                />
                
            <Button id="login" type="submit" variant="contained">Confirm</Button>
            <h3 hidden={errorFlag} style={{backgroundColor:"red"}}>{errorMessage}</h3>


        </form>    
       
    </div>)



}

export default Register;
