type UserReviewType = {
  id: number;
  comment: string | null;
  rating: number;
  movie: {
    id: number;
    title: string;
    image: string;
  }
}

export default UserReviewType;
