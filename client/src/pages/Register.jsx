import { useState } from "react";
import {TextField, Autocomplete,Button} from "@mui/material";
import "../styles/Register.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(){
    const languages = [
        { code: "af", name: "Afrikaans", flag: "🇿🇦" },
        { code: "sq", name: "Albanian", flag: "🇦🇱" },
        { code: "am", name: "Amharic", flag: "🇪🇹" },
        { code: "ar", name: "Arabic", flag: "🇸🇦" },
        { code: "hy", name: "Armenian", flag: "🇦🇲" },
        { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
        { code: "eu", name: "Basque", flag: "🇪🇸" },
        { code: "bn", name: "Bengali", flag: "🇧🇩" },
        { code: "bs", name: "Bosnian", flag: "🇧🇦" },
        { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
        { code: "my", name: "Burmese", flag: "🇲🇲" },
        { code: "zh", name: "Chinese", flag: "🇨🇳" },
        { code: "hr", name: "Croatian", flag: "🇭🇷" },
        { code: "cs", name: "Czech", flag: "🇨🇿" },
        { code: "da", name: "Danish", flag: "🇩🇰" },
        { code: "nl", name: "Dutch", flag: "🇳🇱" },
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "et", name: "Estonian", flag: "🇪🇪" },
        { code: "fi", name: "Finnish", flag: "🇫🇮" },
        { code: "fr", name: "French", flag: "🇫🇷" },
        { code: "ka", name: "Georgian", flag: "🇬🇪" },
        { code: "de", name: "German", flag: "🇩🇪" },
        { code: "el", name: "Greek", flag: "🇬🇷" },
        { code: "he", name: "Hebrew", flag: "🇮🇱" },
        { code: "hi", name: "Hindi", flag: "🇮🇳" },
        { code: "hu", name: "Hungarian", flag: "🇭🇺" },
        { code: "is", name: "Icelandic", flag: "🇮🇸" },
        { code: "id", name: "Indonesian", flag: "🇮🇩" },
        { code: "it", name: "Italian", flag: "🇮🇹" },
        { code: "ja", name: "Japanese", flag: "🇯🇵" },
        { code: "ko", name: "Korean", flag: "🇰🇷" },
        { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
        { code: "ms", name: "Malay", flag: "🇲🇾" },
        { code: "no", name: "Norwegian", flag: "🇳🇴" },
        { code: "fa", name: "Persian", flag: "🇮🇷" },
        { code: "pl", name: "Polish", flag: "🇵🇱" },
        { code: "pt", name: "Portuguese", flag: "🇵🇹" },
        { code: "ro", name: "Romanian", flag: "🇷🇴" },
        { code: "ru", name: "Russian", flag: "🇷🇺" },
        { code: "es", name: "Spanish", flag: "🇪🇸" },
        { code: "sv", name: "Swedish", flag: "🇸🇪" },
        { code: "th", name: "Thai", flag: "🇹🇭" },
        { code: "tr", name: "Turkish", flag: "🇹🇷" },
        { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
        { code: "ur", name: "Urdu", flag: "🇵🇰" },
        { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
      ];

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
            const newUser=await axios.post("http://localhost:3000/auth/register",formValues);
            localStorage.setItem(newUser.data._id,"id");
            localStorage.setItem(newUser.data.preferredLanguage,"preferredLanguage");
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
