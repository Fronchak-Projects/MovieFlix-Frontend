import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from '../../hooks/useFetch';
import PageType from '../../types/PageType';
import MovieCardType from '../../types/models/MovieCardType';
import { BASE_API_URL } from '../../utils/Contantes';
import useFetchFunction from '../../hooks/useFetchFunction';
import AdminMovieCard from '../../components/AdminMovieCard';
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";
import GenreType from '../../types/models/GenreType';
import MovieCardLoader from '../../components/MovieCardLoader';
import PaginationLoader from '../../components/PaginationLoader';
import Pagination from '../../components/Pagination';
import AdminMovieCardLoader from '../../components/AdminMovieCardLoader';

const AdminMovies = () => {

  const [movies, setMovies] = useState<Array<MovieCardType> | undefined>();
  const [idDeleted, setIdDeleted] = useState<number | undefined>();
  const [showClearFilterButton, setShowClearFilterButton] = useState<boolean>(false);

  const refEffect = useRef<boolean>(false);
  const refFilter = useRef<string>('');
  const refGenreFilter = useRef<string>('0');
  const refInputTextFilter = useRef<HTMLInputElement | null>(null);
  const refComboBoxGenreFilter = useRef<HTMLSelectElement | null>(null);

  const { isAuthenticated, hasAnyRole, logout, token } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const useFetchPage = useFetchFunction<PageType<MovieCardType>>();
  const useFetchDelete = useFetchFunction();
  const genresFetch = useFetch<Array<GenreType>>(`${BASE_API_URL}/api/genres`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const fetchMovies = useCallback((page: number = 0) => {
    useFetchPage.fetchFunction(`${BASE_API_URL}/api/movies?size=8&page=${page}&title=${refFilter.current}${refGenreFilter.current === '0' ? '' : `&genre=${refGenreFilter.current}`}`, {
      headers: {
        "Accept": "application/json"
      }
    });
  }, [useFetchPage.fetchFunction]);

  useEffect(() => {
    if(refEffect.current === false) {
      fetchMovies();
    }

    return () => {
      refEffect.current = true;
    }
  }, [fetchMovies]);

  useEffect(() => {
    const page = useFetchPage.data;
    if(page) {
      setMovies(page.data);
    }
    else {
      setMovies(undefined);
    }
  }, [useFetchPage.data]);

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

  const handleDelete = (id: number) => {
    if(!isAuthenticated()) {
      navigate("/auth/login", {
        replace: true,
        state: {
          from: pathname
        }
      });
      logout();
      toast.info("Você precisa estar logado para realizar essa ação");
      return;
    }
    if(!hasAnyRole(['admin'])) {
      toast.info("Você não tem permissão para realizar essa ação");
      return;
    }
    setIdDeleted(id);
    useFetchDelete.fetchFunction(`${BASE_API_URL}/api/movies/${id}`, {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  }

  useEffect(() => {
    if(useFetchDelete.status === 204) {
      toast.success("Filme deletado com sucesso");
      const nextMovies = movies?.filter((movie) => movie.id != idDeleted);
      setMovies(nextMovies);
    }
  }, [useFetchDelete.status, idDeleted])

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-bold text-2xl uppercase">Filmes</h2>
        <Link className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700" to="/movies/save">Adicionar filme</Link>
      </div>
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
      { useFetchPage.isLoading && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
            <AdminMovieCardLoader />
            <AdminMovieCardLoader />
            <AdminMovieCardLoader />
            <AdminMovieCardLoader />
          </div>
          <PaginationLoader />
        </>
      ) }
      { movies && (
        <>
          { movies.length === 0 ? (
            <div className='px-4 py-8 bg-white rounded-lg'>
              <p className='text-black font-xl text-center'>Não foi encontrado nenhum filme</p>
            </div>
          ) : (
            <main>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
                { movies.map((movie) => (
                  <AdminMovieCard movie={movie} key={movie.id}  handleDelete={handleDelete} />
                )) }
              </div>
              <Pagination
                activePage={useFetchPage.data ? (useFetchPage.data.current_page - 1) : 0}
                pageCount={useFetchPage.data ? useFetchPage.data.last_page : 0}
                onPageChange={handlePageChange}
              />
            </main>
          ) }
        </>
      ) }
    </>
  )
}

export default AdminMovies;
