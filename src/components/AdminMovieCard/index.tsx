import { Link } from 'react-router-dom';
import MovieCardType from "../../types/models/MovieCardType"
import { BASE_API_URL } from "../../utils/Contantes";

type Props = {
  movie: MovieCardType;
  handleDelete: (id: number) => void
}

const AdminMovieCard = ({ movie, handleDelete }: Props) => {
  return (
    <div className="card">
      <img
        src={ `${BASE_API_URL}/storage/${movie.image}` }
      />
      <div>
        <div>
          <h3><Link to={`/movie/${movie.id}`}>{ movie.title }</Link></h3>
        </div>
        <div>
          <Link to={`/movies/edit/${movie.id}`} className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700">Editar</Link>
          <button className="btn px-4 py-1 bg-red-500 hover:bg-red-700" onClick={() => handleDelete(movie.id)}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

export default AdminMovieCard;
