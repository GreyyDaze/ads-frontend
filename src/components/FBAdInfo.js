import React, { useState } from 'react';

const FBAdInfo = ({ userId, accountIds }) => {
  const [adsData, setAdsData] = useState(null);

  const fetchAds = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ads/fb-ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, accountIds }),
      });
      const data = await response.json();
      setAdsData(data.adsData);
    } catch (err) {
      console.error('Error fetching ads:', err);
    }
  };

  return (
    <div>
      <button onClick={fetchAds}>Fetch Ads</button>
      {adsData && (
        <div>
          {Object.entries(adsData).map(([accountId, ads]) => (
            <div key={accountId}>
              <h3>Ads for Account {accountId}</h3>
              <ul>
                {ads.map((ad) => (
                  <li key={ad.id}>
                    {ad.name} (Status: {ad.status}, Effective Status: {ad.effective_status})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FBAdInfo;
