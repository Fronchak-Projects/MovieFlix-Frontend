import { useEffect, useRef } from 'react';
import useFetchFunction from "../../hooks/useFetchFunction";
import PageType from "../../types/PageType";
import MovieCardType from "../../types/models/MovieCardType";
import { BASE_API_URL } from '../../utils/Contantes';
import MovieCard from '../../components/MovieCard';


const Movies = () => {

  const { data, isLoading, error, status, fetchFunction } = useFetchFunction<PageType<MovieCardType>>();
  const refEffect = useRef<boolean>(false);

  useEffect(() => {
    if(refEffect.current === false) {
      fetchFunction(`${BASE_API_URL}/api/movies`, {
        headers: {
          "Accept": "application/json"
        }
      })
    }

    return () => {
      refEffect.current = true;
    }
  }, [fetchFunction]);

  return (
    <div className="container px-2 mx-auto py-4 md:py-8">
      <header className='mb-3'>
        <h2 className='text-2xl font-bold uppercase text-white'>Movies</h2>
      </header>
      { data === undefined ? (
        <p>Carregando filmes</p>
      ) : (
        <main className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
          { data.data.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          )) }
        </main>
      ) }
    </div>
  )
}

export default Movies;
