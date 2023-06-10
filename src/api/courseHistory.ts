import { User } from "../types";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export async function addToCourseHistory(token: string, subject: string, number: string, level: string, grade: string) {
  const response = await fetch(`${BACKEND_URL}/course-history/insert`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject: subject,
      number: number,
      level: level,
      grade: grade
    })
  });

  const json = await response.json();
  if (!json.success) {
    throw new Error('Request failed');
  }
}