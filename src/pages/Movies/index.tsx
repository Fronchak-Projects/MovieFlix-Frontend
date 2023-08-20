import { useEffect, useRef, useState, useCallback } from 'react';
import useFetchFunction from "../../hooks/useFetchFunction";
import PageType from "../../types/PageType";
import MovieCardType from "../../types/models/MovieCardType";
import { BASE_API_URL } from '../../utils/Contantes';
import MovieCard from '../../components/MovieCard';
import useFetch from '../../hooks/useFetch';
import GenreType from '../../types/models/GenreType';
import Pagination from '../../components/Pagination';


const Movies = () => {

  const [showClearFilterButton, setShowClearFilterButton] = useState<boolean>(false);
  const { data, fetchFunction, isLoading, error } = useFetchFunction<PageType<MovieCardType>>();
  const genresFetch = useFetch<Array<GenreType>>(`${BASE_API_URL}/api/genres`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const refEffect = useRef<boolean>(false);
  const refFilter = useRef<string>('');
  const refGenreFilter = useRef<string>('0');
  const refInputTextFilter = useRef<HTMLInputElement | null>(null);
  const refComboBoxGenreFilter = useRef<HTMLSelectElement | null>(null);

  const fetchMovies = useCallback((page: number = 0) => {
    fetchFunction(`${BASE_API_URL}/api/movies?size=2&page=${page}&title=${refFilter.current}${refGenreFilter.current === '0' ? '' : `&genre=${refGenreFilter.current}`}`, {
      headers: {
        "Accept": "application/json"
      }
    });
  }, [fetchFunction]);

  useEffect(() => {
    if(refEffect.current === false) {
      fetchMovies(0);
    }

    return () => {
      refEffect.current = true;
    }
  }, [fetchMovies]);

  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refFilter.current = refInputTextFilter.current?.value ?? '';
    refGenreFilter.current = refComboBoxGenreFilter.current?.value ?? '0';
    fetchMovies();
    setShowClearFilterButton(true);
  }

  const handleClearFilters = () => {
    refFilter.current = '';
    refGenreFilter.current = '0';
    if(refInputTextFilter.current) {
      refInputTextFilter.current.value = ''
    }
    if(refComboBoxGenreFilter.current) {
      refComboBoxGenreFilter.current.selectedIndex = 0;
    }
    fetchMovies(0);
    setShowClearFilterButton(false);
  }

  const handlePageChange = (page: number) => {
    fetchMovies(page + 1);
    if(refInputTextFilter.current) {
      refInputTextFilter.current.value = refFilter.current;
    }
    if(refComboBoxGenreFilter.current) {
      refComboBoxGenreFilter.current.value = refGenreFilter.current;
    }
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
      { isLoading && (
        <p>Carregando filmes</p>
      ) }
      { data && (
        <>
          { data.data.length === 0 ? (
            <div className='px-4 py-8 bg-white rounded-lg'>
              <p className='text-black font-xl text-center'>Desculpe, não encontramos nenhum filme</p>
            </div>
          ) : (
            <main>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                { data.data.map((movie) => (
                  <MovieCard movie={movie} key={movie.id} />
                )) }
              </div>
              <Pagination
                activePage={data.current_page - 1}
                pageCount={data.last_page}
                onPageChange={handlePageChange}
              />
            </main>
          ) }
        </>
      )}
    </div>
  );
}

export default Movies;
