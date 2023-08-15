import { Link } from 'react-router-dom';
import GenreType from "../../types/models/GenreType";
import FallbackImage from '../../assets/imgs/fallback-image.png';
import { BASE_API_URL } from "../../utils/Contantes";

type Props = {
  genre: GenreType;
  handleDelete: (id: number) => void
}

const GenreCard = ({ genre, handleDelete }: Props) => {
  return (
    <div className="card">
      <img
        src={ genre.image ? `${BASE_API_URL}/storage/${genre.image}` : FallbackImage }
      />
      <div>
        <div>
          <h3><Link to={`/genres/${genre.id}`}>{ genre.name }</Link></h3>
        </div>
        <div>
          <Link to={`/genres/edit/${genre.id}`} className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700">Editar</Link>
          <button className="btn px-4 py-1 bg-red-500 hover:bg-red-700" onClick={() => handleDelete(genre.id)}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

export default GenreCard;
