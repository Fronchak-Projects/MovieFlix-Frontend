import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import MovieType from "../../types/models/MovieType";
import useAuth from "../../hooks/useAuth";
import { BASE_API_URL } from "../../utils/Contantes";


const Movie = () => {

  const { id } = useParams();
  const { token } = useAuth();
  const movieFetch = useFetch<MovieType>(`${BASE_API_URL}/api/movies/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const movie = movieFetch.data;

  return (
    <div className='container px-2 mx-auto py-4 md:py-8'>
      { movie && (
        <div className='bg-white text-black rounded-lg grid md:grid-cols-2'>
          <img
            src={`${BASE_API_URL}/storage/${movie.image}`}
            className='w-full rounded-t-lg md:rounded-tr-none max-h-96'
          />
          <div className='p-4'>
            <h1 className='text-3xl font-bold mb-3'>{ movie.title }</h1>
            <div className='flex flex-wrap gap-3'>
              { movie.genres.map((genre) => (
                genre.image ? (
                  <div className='bg-blue-300 border-2 border-blue-600 text-blue-700 rounded-full flex items-center gap-3 pr-5 h-10' key={genre.id}>
                    { genre.image && <img src={`${BASE_API_URL}/storage/${genre.image}`} className='h-10 w-10 rounded-full'/> }
                    <span>{ genre.name }</span>
                  </div>
                ) : (
                  <div className='bg-blue-300 border-2 border-blue-600 text-blue-700 rounded-full flex items-center px-5 h-10' key={genre.id}>
                    <span>{ genre.name }</span>
                  </div>
                )
              )) }
            </div>
          </div>
          <div className='p-4 md:col-span-2'>
            <p className='leading-relaxed text-gray-700'>{ movie.synopsis }</p>
          </div>
        </div>
      ) }
    </div>
  )
}

export default Movie;
