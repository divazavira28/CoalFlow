export const API_URL = "http://127.0.0.1:8000";

// GET request dengan auth token
export async function apiGet(path) {
  const token = localStorage.getItem("idToken");

  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("API GET Error: " + response.status);
  }

  return response.json();
}

// POST request dengan auth token
export async function apiPost(path, body) {
  const token = localStorage.getItem("idToken");

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("API POST Error: " + response.status);
  }

  return response.json();
}
