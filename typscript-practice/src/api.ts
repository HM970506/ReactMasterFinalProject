const API_KEY="ef84351b94903c34ce113fddd7775209";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  }
  
  export interface IGetMoviesResult {
  dates: {
  maximum: string;
  minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
  }

export async function getMovies() {
  const response= await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  const json=await response.json();
  return json;
}