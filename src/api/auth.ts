const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export async function getUser(token: string) {
  const response = await fetch(`${BACKEND_URL}/auth/user`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  const json = await response.json();
  return json.user;
}