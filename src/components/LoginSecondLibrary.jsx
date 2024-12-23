// // import React, { useEffect, useState } from "react";
// // import { AuthProvider, useAuth } from "oidc-react";
// // import axios from "axios";

// // const LoginButton = () => {
// //   const [authorizationCode, setAuthorizationCode] = useState("");
// //   const [accessToken, setAccessToken] = useState(null);

// //   const auth = useAuth();

// //   console.log("auth:", auth);
// //   // Function to handle the login button click
// //   const handleLogin = () => {
// //     console.log("Login: ");
// //     debugger;
// //     auth.signInPopup(); // Triggers the Google login page
// //   };

// //   useEffect(() => {
// //     // Check if the authorization code is in the URL

// //     if (auth?.user?.profile?.code) {
// //       const code = auth.user.profile.code;
// //       console.log("Authorization Code:", code);
// //       setAuthorizationCode(code);
// //       console.log("Authorization Code:", code);
// //     }
// //   }, [auth]);

// //   useEffect(() => {
// //     if (authorizationCode) {
// //       const getAccessToken = async () => {
// //         try {
// //           const backendResponse = await axios.post(
// //             `${process.env.REACT_APP_BACKEND_URL}/api/auth/exchange-code`,
// //             { code: authorizationCode }
// //           );
// //           console.log("Backend Response:", backendResponse.data);
// //           setAccessToken(backendResponse.data.accessToken);
// //         } catch (error) {
// //           console.error("Error fetching access token:", error);
// //         }
// //       };
// //       getAccessToken();
// //     }
// //   }, [authorizationCode]);

// //   return (
// //     <button onClick={handleLogin} style={{ fontSize: "18px" }}>
// //       Sign in with Google (OIDC) 🚀
// //     </button>
// //   );
// // };

// // const Login = () => {
// //   return (
// //     <AuthProvider
// //       authority="https://accounts.google.com" // Google OAuth authority
// //       clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
// //       redirectUri="http://localhost:8080"
// //       responseType="code"
// //       clientSecret="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"
// //       scope="openid email profile https://www.googleapis.com/auth/adwords"
// //       silentRedirectUri="http://localhost:8080/"
// //       autoSignIn={false}
// //       onSigninCallback={() => console.log("Successfully logged in!")}
// //       onError={(error) => console.error("OIDC Error:", error)}
// //       loadUserInfo={true}
// //       onSignIn={(user) => console.log("User:", user)}
// //       userD
// //     >
// //       <LoginButton />
// //     </AuthProvider>
// //   );
// // };

// // export default Login;


// import React, { useEffect } from 'react';
// import { AuthProvider, useAuth } from 'oidc-react';
// import axios from 'axios';

// // Configuration for OIDC that matches your current Google OAuth setup
// const oidcConfig = {
//   authority: 'https://accounts.google.com',
//   clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//   redirectUri: 'http://localhost:8080',
//   responseType: 'code',
//   scope: 'openid profile email https://www.googleapis.com/auth/adwords',
  
//   // This extends the basic OIDC configuration to handle the access token exchange
//   onSignIn: async (user) => {
//     console.log('User signed in:', user);
    
//     if (user.code) {
//       try {
//         // Exchange the authorization code for tokens
//         const backendResponse = await axios.post(
//           `${process.env.REACT_APP_BACKEND_URL}/api/auth/exchange-code`,
//           { code: user.code }
//         );
//         console.log('Backend Response:', backendResponse.data);
        
//         // Store the access token in local storage or state management
//         localStorage.setItem('accessToken', backendResponse.data.accessToken);
//       } catch (error) {
//         console.error('Error exchanging code:', error);
//       }
//     }
//   }
// };

// // Main Login component
// const Login = () => {
//   const auth = useAuth();
  
//   // Effect to handle the access token after successful authentication
//   useEffect(() => {
//     if (auth.userData?.code) {
//       console.log('Authorization Code:', auth.userData.code);
//     }
//   }, [auth.userData]);

//   // Custom login handler to match your original implementation
//   const handleLogin = async () => {
//     try {
//       await auth.signIn();
//     } catch (error) {
//       console.log('Login Failed:', error);
//     }
//   };

//   return (
//     <button 
//       onClick={handleLogin} 
//       style={{ fontSize: '18px' }}
//       className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
//     >
//       Sign in with Google (OIDC) 🚀
//     </button>
//   );
// };

// // Wrapper component that provides the OIDC context
// const LoginWrapper = () => {
//   return (
//     <AuthProvider {...oidcConfig}>
//       <Login />
//     </AuthProvider>
//   );
// };

// export default LoginWrapper; 