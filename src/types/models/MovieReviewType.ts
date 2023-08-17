type MovieReviewType = {
  id: number;
  comment: string | null;
  rating: number;
  user: {
    id: number;
    name: string;
    image: string | null;
  }
}

export default MovieReviewType;
