import { User, UserSettings } from "../types";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export async function getUser(token: string) {
  const response = await fetch(`${BACKEND_URL}/auth/user`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  
  const json = await response.json();
  return json.user;
}

export async function alterSetting(token: string, user: User, setter: (user: User) => any, key: keyof UserSettings, value: boolean) {
  const oldValue = user.settings[key];
  setter({ ...user, settings: {[key]: value} })

  const response = await fetch(`${BACKEND_URL}/auth/alter-setting`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: key,
      value: value
    })
  });
  const json = await response.json();

  if (!json.success) {
    setter({ ...user, settings: {[key]: oldValue} });
    throw new Error('Request failed, setting reverted');
  }
}