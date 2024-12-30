// import React, { useState } from "react";
// import FBAdsAccounts from "./FBAdsAccounts";

// // Custom Facebook Login Button Component
// const CustomFbLoginButton = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [fbUserId, setFbUserId] = useState(null);

//   const handleFacebookLogin = () => {
//     const clientId = process.env.REACT_APP_FACEBOOK_APP_ID;
//     const redirectUri = "http://localhost:8080"; // Your backend redirect URI
//     const configId = process.env.REACT_APP_FACEBOOK_CONFIG_ID;
//     const facebookOAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=random_string&config_id=${configId}&scope=email,public_profile,ads_read,business_management,ads_management,`;

//     // Open Facebook OAuth dialog in a popup window
//     const width = 600;
//     const height = 800;
//     const left = (window.innerWidth - width) / 2;
//     const top = (window.innerHeight - height) / 2;
//     const popupWindow = window.open(
//       facebookOAuthUrl,
//       "Facebook Login",
//       `width=${width},height=${height},top=${top},left=${left},resizable=yes`
//     );

//     // Monitor the popup for the authorization code
//     const checkPopup = setInterval(() => {
//       try {
//         // Check if the popup has redirected back and contains the authorization code
//         if (popupWindow.location.href.includes("code=")) {
//           const urlParams = new URLSearchParams(popupWindow.location.search);
//           const authCode = urlParams.get("code"); // Get code from the URL

//           if (authCode) {
//             // Send the authorization code to the main window (parent window)
//             window.postMessage({ type: "FB_AUTH_CODE", code: authCode }, "*");

//             // Close the popup window after capturing the code
//             popupWindow.close();

//             clearInterval(checkPopup); // Clear the interval after handling
//           }
//         }
//       } catch (e) {
//         // Handle potential cross-origin issues if popup is from a different origin
//       }
//     }, 0);
//   };

//   const sendCodeToBackend = async (code) => {
//     setIsLoading(true);
//     try {
//       // Send the authorization code to the backend API without updating the main window's URL
//       const response = await fetch(
//         `${process.env.REACT_APP_BACKEND_URL}/api/auth/fb-login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ code }), // Send the authorization code to backend
//         }
//       );
//       const data = await response.json();
//       console.log("Facebook login response:", data);
//       setFbUserId(data.user?.facebookId);

//       setIsLoading(false);
//     } catch (err) {
//       console.error("Error logging in:", err);
//       alert("Login failed. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   // Listen for the message from the popup window
//   window.addEventListener("message", (event) => {
//     if (event.origin !== window.location.origin) return; // Validate origin
//     if (event.data.type === "FB_AUTH_CODE" && event.data.code) {
//       sendCodeToBackend(event.data.code); // Call the backend to exchange the code
//     }
//   });

//   return (
//     <>
//       {!fbUserId ? (
//         <button
//           onClick={handleFacebookLogin}
//           style={{
//             padding: "10px",
//             backgroundColor: "#1877F2",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           {isLoading ? "Loading..." : "Login with Facebook"}
//         </button>
//       ) : (
//         <FBAdsAccounts fbUserId={fbUserId} />
//       )}
//     </>
//   );
// };

// export default CustomFbLoginButton;


import React, { useState } from "react";
import axios from "axios";
import FBAdsAccounts from "./FBAdsAccounts";

// Custom Facebook Login Button Component
const CustomFbLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fbUserId, setFbUserId] = useState(null);

  const handleFacebookLogin = () => {
    const clientId = process.env.REACT_APP_FACEBOOK_APP_ID;
    const redirectUri = "http://localhost:8080"; // Your backend redirect URI
    const configId = process.env.REACT_APP_FACEBOOK_CONFIG_ID;
    const facebookOAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=random_string&config_id=${configId}&scope=email,public_profile,ads_read,read_insights,ads_management,`;

    // Open Facebook OAuth dialog in a popup window
    const width = 600;
    const height = 800;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const popupWindow = window.open(
      facebookOAuthUrl,
      "Facebook Login",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes`
    );

    // Monitor the popup for the authorization code
    const checkPopup = setInterval(() => {
      try {
        // Check if the popup has redirected back and contains the authorization code
        if (popupWindow.location.href.includes("code=")) {
          const urlParams = new URLSearchParams(popupWindow.location.search);
          const authCode = urlParams.get("code"); // Get code from the URL

          if (authCode) {
            // Send the authorization code directly to the backend to get the access token
            exchangeCodeForAccessToken(authCode);

            // Close the popup window after capturing the code
            popupWindow.close();
            clearInterval(checkPopup); // Clear the interval after handling
          }
        }
      } catch (e) {
        // Handle potential cross-origin issues if popup is from a different origin
      }
    }, 0);
  };

  const exchangeCodeForAccessToken = async (code) => {
    setIsLoading(true);
    try {
      // Use axios to call Facebook's OAuth access_token endpoint to exchange the code for an access token
      const response = await axios.get(
        `https://graph.facebook.com/v17.0/oauth/access_token`,
        {
          params: {
            client_id: process.env.REACT_APP_FACEBOOK_APP_ID,
            redirect_uri: 'http://localhost:8080/',
            client_secret: process.env.REACT_APP_FACEBOOK_APP_SECRET,
            code: code,
          },
        }
      );

      if (response.data.access_token) {
        // Use the access token to fetch user information
        const userInfoResponse = await axios.get(
          `https://graph.facebook.com/me`,
          {
            params: {
              access_token: response.data.access_token,
              fields: "id,name,email,picture",
            },
          }
        );

        const userInfo = userInfoResponse.data;
        console.log("User Info:", userInfo);

        setFbUserId(userInfo.id); // Store the Facebook user ID
        setIsLoading(false);
      } else {
        throw new Error("No access token received.");
      }
    } catch (err) {
      console.error("Error during Facebook login:", err);
      alert("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {!fbUserId ? (
        <button
          onClick={handleFacebookLogin}
          style={{
            padding: "10px",
            backgroundColor: "#1877F2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Login with Facebook"}
        </button>
      ) : (
        <FBAdsAccounts fbUserId={fbUserId} />
      )}
    </>
  );
};

export default CustomFbLoginButton;
