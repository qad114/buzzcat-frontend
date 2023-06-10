import { Course } from "../types";

const BACKEND_URL = 'http://localhost:3002'; //process.env.REACT_APP_BACKEND_URL;

export async function searchCourses({ term, query, creditsLow, creditsHigh, offset, limit }: 
    {term: string, query: string, creditsLow?: number | string, creditsHigh?: number | string, offset?: number | string, limit?: number | string}): Promise<Course[]> {
  const url = `${BACKEND_URL}/search` +
              `?term=202308` +
              `&query=${query}` +
              (creditsLow === undefined ? `` : `&credits_min=${creditsLow}`) +
              (creditsHigh === undefined ? `` : `&credits_max=${creditsHigh}`) +
              (offset === undefined ? `` : `&offset=${offset}`) +
              (limit === undefined ? `` : `&limit=${limit}`);
  console.log(url);
  const json = await (await fetch(url)).json();
  return json.result;
}

export async function getCourse({ subject, number }: {subject: string, number: string}): Promise<Course> {
  const url = `${BACKEND_URL}/get_course?term=202308&subject=${subject}&number=${number}`;
  const json = await (await fetch(url)).json();
  return json.result;
}