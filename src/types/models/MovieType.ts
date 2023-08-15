import GenreType from "./GenreType";

type MovieType = {
  id: number;
  title: string;
  synopsis: string;
  rating: number | null;
  image: string;
  genres: Array<GenreType>
}

export default MovieType;
