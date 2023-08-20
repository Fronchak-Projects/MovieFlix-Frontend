import { useEffect, useRef, useState } from 'react';
import useFetchFunction from "../../hooks/useFetchFunction";
import PageType from "../../types/PageType";
import MovieCardType from "../../types/models/MovieCardType";
import { BASE_API_URL } from '../../utils/Contantes';
import MovieCard from '../../components/MovieCard';
import useFetch from '../../hooks/useFetch';
import GenreType from '../../types/models/GenreType';


const Movies = () => {

  const [showClearFilterButton, setShowClearFilterButton] = useState<boolean>(false);
  const { data, fetchFunction } = useFetchFunction<PageType<MovieCardType>>();
  const genresFetch = useFetch<Array<GenreType>>(`${BASE_API_URL}/api/genres`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const refEffect = useRef<boolean>(false);
  const refInputTextFilter = useRef<HTMLInputElement | null>(null);
  const refComboBoxGenreFilter = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if(refEffect.current === false) {
      fetchFunction(`${BASE_API_URL}/api/movies?size=24`, {
        headers: {
          "Accept": "application/json"
        }
      })
    }

    return () => {
      refEffect.current = true;
    }
  }, [fetchFunction]);

  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textFilter = refInputTextFilter.current?.value ?? '';
    const genreFilter = refComboBoxGenreFilter.current?.value;
    if(!genreFilter || genreFilter === '0') {
      fetchFunction(`${BASE_API_URL}/api/movies?size=24&title=${textFilter}`, {
        headers: {
          "Accept": "application/json"
        }
      })
    }
    else {
      fetchFunction(`${BASE_API_URL}/api/movies?size=24&title=${textFilter}&genre=${genreFilter}`, {
        headers: {
          "Accept": "application/json"
        }
      })
    }
    setShowClearFilterButton(true);
  }

  const handleClearFilters = () => {
    if(refInputTextFilter.current) {
      refInputTextFilter.current.value = ''
    }
    if(refComboBoxGenreFilter.current) {
      refComboBoxGenreFilter.current.selectedIndex = 0;
    }
    fetchFunction(`${BASE_API_URL}/api/movies?size=24`, {
      headers: {
        "Accept": "application/json"
      }
    });
    setShowClearFilterButton(false);
  }

  return (
    <div className="container px-2 mx-auto py-4 md:py-8">
      <header className='mb-3'>
        <h2 className='text-2xl font-bold uppercase text-white'>Movies</h2>
      </header>
      <div className='mb-3 px-3 py-2 rounded-sm bg-white'>
        <h4 className='font-bold text-sm'>Filtros</h4>
        <form onSubmit={handleApplyFilters}>
          <div className='grid md:grid-cols-2 gap-x-2'>
            <div className='mb-2'>
              <input
                ref={refInputTextFilter}
                type='text'
                className='form'
                placeholder='Pesquise pelo filme desejado'
              />
            </div>
            { genresFetch.data && (
              <div className='mb-2'>
                <select
                  ref={refComboBoxGenreFilter}
                  className='form bg-white h-full'
                  defaultValue={0}

                >
                  <option value={0} disabled >Selecione uma categoria</option>
                  { genresFetch.data.map((genre) => (
                    <option value={genre.id} key={genre.id}>{ genre.name }</option>
                  )) }
                </select>
              </div>
            ) }
          </div>
          <div className='flex justify-end gap-2'>
            { showClearFilterButton && (
              <button
                type='button'
                onClick={handleClearFilters}
                className='btn bg-green-400 hover:bg-green-600 px-2 py-1 text-xs'>Limpar filtros
              </button>
            ) }
            <button
              className='btn bg-green-400 hover:bg-green-600 px-2 py-1 text-xs'
              type='submit'
            >Aplicar filtros</button>
          </div>
        </form>
      </div>
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
