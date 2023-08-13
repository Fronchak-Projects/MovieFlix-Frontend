import { NavLink } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { BASE_API_URL } from '../../utils/Contantes';
import GenreType from '../../types/models/GenreType';
import GenreCard from '../../components/GenreCard';

const Genres = () => {

  const { data, isLoading, error, status } = useFetch<Array<GenreType>>(`${BASE_API_URL}/api/genres`, {
    headers: {
      "Accept": "application/json"
    }
  })

  console.log(data);
  console.log(error);

  return (
    <div className="container px-2 mx-auto my-10">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-bold text-2xl uppercase">Gêneros</h2>
        <NavLink className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700" to="/genres/save">Adicionar gênero</NavLink>
      </div>
      { isLoading && isLoading === true && (
        <p className="text-xl">Carregando gêneros</p>
      ) }
      { data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          { data.map((genre) => (
            <div className="p-2" key={genre.id}>
              <GenreCard genre={genre} />
            </div>
          )) }
        </div>
      ) }
    </div>
  )
}

export default Genres;
