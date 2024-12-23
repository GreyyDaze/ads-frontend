import React, { useState } from "react";
import axios from "axios";

const GoogleAdsAccounts = ({ userId, setDisconnetAccount, disconnetAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [adsInfo, setAdsInfo] = useState([]);

  console.log("userId:", userId);

  // Fetch accounts function
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ads/accounts/${userId}`
      );
      setAccounts(response.data.accountInfo);
      console.log(response.data.accountInfo, "data");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch ads info function for multiple accounts
  const fetchAdsInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = selectedAccounts.map((accountId) =>
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/ads/userAds/${userId}/${accountId}`
        )
      );

      const responses = await Promise.all(requests);
      const allAdsInfo = responses.map((res) => res.data.adsInfo);

      setAdsInfo(allAdsInfo.flat());
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  // Handle account selection
  const toggleAccountSelection = (accountId) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const disconnetApp = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/disconnect`,
        {
          userId,
        }
      );
      if(response.data.disconnect === true){
        setDisconnetAccount(true);
        window.location.reload();
      }
      console.log(response.data.message); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      {!adsInfo.length && accounts.length === 0 && disconnetAccount === false && (
        <button onClick={fetchAccounts} style={{ fontSize: "18px" }}>
          Connect Your Google Ad Account
        </button>
      )}
      {disconnetAccount === false && <button onClick={disconnetApp}>Disconnect App</button>}


      {error && <p style={{ color: "red" }}>{error}</p>}

      {!adsInfo.length && accounts.length > 0 && (
        <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "5px 100px",
          }}
        >
          <h2>Your Google Ads Accounts</h2>

          {accounts.map((account) => (
            <div
              key={account.customer_client.id}
              onClick={() => toggleAccountSelection(account.customer_client.id)}
              style={{
                border: selectedAccounts.includes(account.customer_client.id)
                  ? "2px solid magenta"
                  : "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <p style={{ color: "magenta" }}>
                {account.customer_client.descriptive_name}
              </p>
            </div>
          ))}

          <button
            onClick={fetchAdsInfo}
            disabled={selectedAccounts.length === 0}
            style={{ marginTop: "20px", fontSize: "16px" }}
          >
            Fetch Ads Information
          </button>
        </div>
        </>
      )}

      {adsInfo.length > 0 && (
        <div style={{ padding: "20px" }}>
          <h2>Your Ads Information</h2>
          {adsInfo.length > 0 ? (
            <ul>
              {adsInfo.map((ad) => (
                <li key={ad.campaign.id} style={{ marginBottom: "15px" }}>
                  <strong>Campaign Name:</strong> {ad.campaign.name} <br />
                  <strong>Status:</strong> {ad.campaign.status} <br />
                  <strong>Start Date:</strong> {ad.campaign.start_date} <br />
                  <strong>End Date:</strong> {ad.campaign.end_date}
                </li>
              ))}
            </ul>
          ) : (
            <p>No campaigns found for the selected accounts.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleAdsAccounts;
