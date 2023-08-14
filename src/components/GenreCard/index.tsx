import { Link } from 'react-router-dom';
import GenreType from "../../types/models/GenreType";
import FallbackImage from '../../assets/imgs/fallback-image.png';
import { BASE_API_URL } from "../../utils/Contantes";

type Props = {
  genre: GenreType;
}

const GenreCard = ({ genre }: Props) => {
  return (
    <div className="bg-white rounded-lg h-full flex flex-col">
      <img
        src={ genre.image ? `${BASE_API_URL}/storage/${genre.image}` : FallbackImage }
        className="w-full sm:h-48 rounded-t-lg"
      />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <h3 className="text-xl mb-2"><Link className="hover:underline hover:text-blue-400" to={`/genres/${genre.id}`}>{ genre.name }</Link></h3>
        <div className="flex justify-end gap-x-2">
          <Link to={`/genres/edit/${genre.id}`} className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700">Editar</Link>
          <button className="btn px-4 py-1 bg-red-500 hover:bg-red-700">Excluir</button>
        </div>
      </div>
    </div>
  );
}

export default GenreCard;
