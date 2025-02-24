import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; 

const ProtectedRoute = ( props ) => {
  const token = localStorage.getItem("token"); // בדיקת טוקן
  return token ? props.children : <Navigate to="/" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default ProtectedRoute;
