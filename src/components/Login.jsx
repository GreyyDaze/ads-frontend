import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import GoogleAdsAccounts from "./GoogleAdsAccounts";

const CLIENT_CONFIG = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirect_uri: "http://localhost:8080", // Matches console configuration
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
};

const SCOPES = [
  "https://www.googleapis.com/auth/adwords",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "openid",
];

const Login = () => {
  const [error, setError] = useState(null);
  const [authPopup, setAuthPopup] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [disconnetAccount, setDisconnetAccount] = useState(true);

  console.log(userId, "userId");

  // Function to exchange authorization code
  const exchangeAuthorizationCode = useCallback(
    async (code) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/exchange-code`,
          { code }
        );

        if (response.data.userId) {
          // Store userId in localStorage or state management
          localStorage.setItem("userId", response.data.userId);
          setUserId(response.data.userId);
          setDisconnetAccount(false);
          // Fetch accounts after successful authentication
        }
        // Close the popup if it's still open
        if (authPopup && !authPopup.closed) {
          authPopup.close();
        }
      } catch (error) {
        setError("Failed to exchange authorization code");
        console.error("OAuth exchange error:", error);
      }
    },
    [authPopup]
  );

  // Effect to handle OAuth redirect
  useEffect(() => {
    // Check if we're on the redirect page and have a code
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Try to find the opener window
      if (window.opener) {
        try {
          // Attempt to communicate back to opener
          window.opener.postMessage(
            {
              type: "OAUTH_AUTHORIZATION_CODE",
              code,
            },
            window.location.origin
          );

          // Close this window
          window.close();
        } catch (error) {
          console.error("Error communicating with opener:", error);
        }
      } else {
        // Fallback if no opener (direct navigation)
        exchangeAuthorizationCode(code);
      }
    }
  }, [exchangeAuthorizationCode]);

  // Effect to listen for messages from popup
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify the origin
      if (event.origin !== window.location.origin) return;

      // Check for authorization code message
      if (event.data && event.data.type === "OAUTH_AUTHORIZATION_CODE") {
        const { code } = event.data;
        console.log("Authorization Code:", code);
        // debugger;
        exchangeAuthorizationCode(code);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [exchangeAuthorizationCode]);

  // Initiate OAuth flow
  const initiateOAuthFlow = () => {
    const authUrl = `${CLIENT_CONFIG.auth_uri}?response_type=code&client_id=${
      CLIENT_CONFIG.client_id
    }&redirect_uri=${encodeURIComponent(
      CLIENT_CONFIG.redirect_uri
    )}&scope=${encodeURIComponent(
      SCOPES.join(" ")
    )}&access_type=offline&prompt=consent`;

    // Open popup window
    const popupWidth = 600;
    const popupHeight = 600;
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;

    const popup = window.open(
      authUrl,
      "Google OAuth Login",
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    // Store reference to popup
    setAuthPopup(popup);
  };

  // Function to clear cookies
  // const revokeGoogleToken = async (token) => {
  //   try {
  //     await axios.post(`https://oauth2.googleapis.com/revoke?token=${token}`);
  //     console.log("Google token revoked successfully.");
  //   } catch (error) {
  //     console.error("Error revoking Google token:", error);
  //   }
  // };

  const revokeGoogleAccess = () => {
    const script = document.createElement("script");
    // script.src = "https://accounts.google.com/logout";
    document.body.appendChild(script);
    script.remove();
  };

  // Function to handle logout
  const handleLogout = () => {
    revokeGoogleAccess();
    localStorage.removeItem("userId");
    setUserId("");
  };

  return (
    <div>
      {!userId ? (
        <>
          {disconnetAccount === true && (
            <button onClick={initiateOAuthFlow} style={{ fontSize: "18px" }}>
              Sign in with Google (Without Library)🚀
            </button>
          )}
        </>
      ) : (
        <div>
          <p>Successfully authenticated! {userId}</p>
          <button
            onClick={handleLogout}
            style={{ fontSize: "18px", marginTop: "10px" }}
          >
            Logout
          </button>

          <GoogleAdsAccounts
            userId={userId}
            setDisconnetAccount={setDisconnetAccount}
            disconnetAccount={disconnetAccount}
          />
          {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
      )}

      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
    </div>
  );
};

export default Login;
