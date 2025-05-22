
import {TextField,Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {  useState } from "react";
import "../styles/Login.css";
import axiosInstance from "../config/axios";
function Login(){

    const [formValues,setFormValues] = useState({ email: "", password: "" });
    const [flag,serFlag]=useState(false);
    const navigate = useNavigate();


    async function onSubmitHandler(event){
        event.preventDefault();
        try{
            const user=await axiosInstance.post("/auth/login",formValues);
            console.log(user.data);
            localStorage.setItem("id",user.data._id);
            localStorage.setItem("name",user.data.name);
            localStorage.setItem("preferredLanguage",user.data.preferredLanguage);
            localStorage.setItem("token",user.data.token);

            navigate("/home");
        }
        catch(error){
            serFlag(true);

            console.error("error: ",error.response.data.message);
        }
    }




    function onChangeHandler(event){
        const {name,value}=event.target;
        setFormValues((prev)=>{
            return {
                ...prev,
                [name]:value
            };
        });
        
        
    }


    function onClickHandler(){
        navigate("/register");
    }

    return (<div className="login-main-container">
        <h1>BableTalk</h1>

        <form onSubmit={onSubmitHandler} className="login-form-container">
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
                id="password" 
                name="password" 
                label={flag?"error":"Password"} 
                error={flag}
                value={formValues.password} 
                onChange={onChangeHandler} 
                variant="outlined" 
             />
            <Button id="login" type="submit" variant="contained">Login</Button>
            <Button id="register" variant="contained" onClick={onClickHandler}>Register</Button>

        </form>
    </div>)


}


export default Login;