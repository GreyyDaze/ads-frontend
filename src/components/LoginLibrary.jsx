// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useGoogleLogin } from "@react-oauth/google";

// const Login = () => {
//   const [authorizationCode, setAuthorizationCode] = useState("");
//   const [accessToken, setAccessToken] = useState(null);

//   const login = useGoogleLogin({
//     onSuccess: (tokenResponse) => {
//       console.log(tokenResponse);
//       setAuthorizationCode(tokenResponse.code);
//     },
//     onError: (error) => {
//       console.log("Login Failed:", error);
//     },

//     redirect_uri: "http://localhost:8080",
//     flow: "auth-code",
//     scope: "https://www.googleapis.com/auth/adwords",
//   });

//   console.log("google client id:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

//   useEffect(() => {
//     console.log("Authorization Code:", authorizationCode);
//     const getAccessToken = async () => {
//       const backendResponse = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/api/auth/exchange-code`,
//         { code: authorizationCode }
//       );
//       console.log("Backend Response:", backendResponse.data);
//       setAccessToken(backendResponse.data.accessToken);
//     //   debugger;
//     };
//     if (![null, undefined, ""].includes(authorizationCode)) {
//       console.log("Authorization Code inside if:", authorizationCode);
//     //   debugger;
//       getAccessToken();
//     }
//   }, [authorizationCode]);

//   return (
//     <button onClick={login} style={{ fontSize: "18px" }}>
//       Sign in with Google (Library) 🚀
//     </button>
//   );
// };

// export default Login;
 