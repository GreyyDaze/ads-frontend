import React, { useState } from 'react';
import FBAdInfo from './FBAdInfo';

const FBAdsAccounts = ({ fbUserId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adsAccounts, setAdsAccounts] = useState([]);
  const [adAccountIDs, setAdAcoountIDs] = useState([]);

  const fetchAdsAccounts = async () => {
    if (!fbUserId) {
      alert('Please log in first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ads/fb-ads-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: fbUserId }),
      });
      const data = await response.json();

      if (data.adsAccounts) {
        setAdsAccounts(data.adsAccounts);
        setAdAcoountIDs([...adAccountIDs, data.adsAccounts[0]?._data?.id ]);
        console.log(data.adsAccounts, 'adsAccounts');
        debugger
      } else {
        alert('Failed to fetch ads accounts.');
      }
    } catch (err) {
      console.error('Error fetching ads accounts:', err);
      alert('Error fetching ads accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  console.log(JSON.stringify(adAccountIDs), 'adsAccountid');

  return (
    <div>
      <button
        onClick={fetchAdsAccounts}
        style={{
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        {isLoading ? 'Loading...' : 'Fetch Ads Accounts'}
      </button>

      <ul>
        {adsAccounts.map((account) => (
          <li key={account.id}>
            {account.name} (ID: {account.id})
          </li>
        ))}
      </ul>

      <FBAdInfo userId={fbUserId} accountIds={adAccountIDs} />
    </div>
  );
};

export default FBAdsAccounts;
