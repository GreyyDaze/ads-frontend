import React, { useState } from "react";
import axios from "axios";

const GoogleAdsAccounts = ({ userId }) => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [adsInfo, setAdsInfo] = useState(null);

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

  // Fetch ads info function
  const fetchAdsInfo = async (accountId) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedAccount(accountId);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ads/userAds/${userId}/${accountId}`
      );

      setAdsInfo(response.data.adsInfo);
      console.log(response.data.adsInfo, "ads data");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelection = (accountId) => {
    fetchAdsInfo(accountId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {!adsInfo && accounts.length === 0 && (
        <button onClick={fetchAccounts} style={{ fontSize: "18px" }}>
          Connect Your Google Ad Account
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!adsInfo && accounts.length > 0 && (
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
              onClick={() => handleAccountSelection(account.customer_client.id)}
              style={{
                border:
                  selectedAccount === account.customer_client.id
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
        </div>
      )}

      {adsInfo && (
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
            <p>No campaigns found for this account.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleAdsAccounts;
