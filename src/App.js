import React from "react";
import Login from "./components/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import FbLoginButton from "./components/FbLoginButton";
// import Login from "./components/LoginSecondLibrary";
// import Login from "./components/LoginLibrary";

function App() {
  return (
    <div className="App">
      {/* <h1>OAuth Login with Google</h1> */}
      {/* <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}> */}
        {/* <Login /> */}
        <h1>Facebook Login with MERN</h1>
        <FbLoginButton />
      {/* </GoogleOAuthProvider> */}
    </div>
  );
}

export default App;
