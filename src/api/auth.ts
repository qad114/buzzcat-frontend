export async function getUser(token: string) {
  const response = await fetch('http://localhost:3001/auth/user', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  const json = await response.json();
  return json.user;
}