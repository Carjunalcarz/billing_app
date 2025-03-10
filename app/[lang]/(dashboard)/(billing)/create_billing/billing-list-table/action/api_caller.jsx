const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Use environment variables

// Generic function for API calls
export const apiRequest = async (endpoint, method = null, body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error with ${method} request to ${endpoint}:`, error);
    throw error;
  }
};

// API call for fetching subscriptions
export const fetchBilling = async (params ,token) => {
  return apiRequest(`/api/billings/${params}`, "GET", null, token);
};

// API call for fetching subscriptions
export const fetchSubscribers = async (token) => {
  return apiRequest("/api/subscriptions", "GET", null, token);
};

// API call for fetching subscriptions
export const createBilling = async (token, postData) => {
  return apiRequest("/api/billings/create", "POST", postData, token);
  // console.log(`TOKEN :::: ${token}  || POST DATA ::: ${postData} `);
};

