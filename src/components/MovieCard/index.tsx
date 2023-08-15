import { Link } from 'react-router-dom';
import MovieCardType from "../../types/models/MovieCardType"
import { BASE_API_URL } from "../../utils/Contantes";

type Props = {
  movie: MovieCardType;
}

const MovieCard = ({ movie }: Props) => {
  return (
    <div className="bg-white rounded-lg h-full flex flex-col">
      <img
        src={ `${BASE_API_URL}/storage/${movie.image}` }
        className="w-full sm:h-48 rounded-t-lg"
      />
      <div className="p-3 flex flex-1 flex-col justify-between">
        <h3 className="text-xl mb-2"><Link className="hover:underline hover:text-blue-400" to={`/movie/${movie.id}`}>{ movie.title }</Link></h3>
        <div className='text-end'>
          <Link to={`/movies/${movie.id}`} className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700">Veja mais</Link>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
