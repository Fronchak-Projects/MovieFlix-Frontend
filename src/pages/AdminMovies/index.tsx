import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from '../../hooks/useFetch';
import PageType from '../../types/PageType';
import MovieCardType from '../../types/models/MovieCardType';
import { BASE_API_URL } from '../../utils/Contantes';
import useFetchFunction from '../../hooks/useFetchFunction';
import AdminMovieCard from '../../components/AdminMovieCard';
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";

const AdminMovies = () => {

  const [movies, setMovies] = useState<Array<MovieCardType> | undefined>();
  const useFetchPage = useFetchFunction<PageType<MovieCardType>>();
  const useFetchDelete = useFetchFunction();
  const { isAuthenticated, hasAnyRole, logout, token } = useAuth();
  const refEffect = useRef<boolean>(false);
  const [idDeleted, setIdDeleted] = useState<number | undefined>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if(refEffect.current === false) {
      useFetchPage.fetchFunction(`${BASE_API_URL}/api/movies`, {
        headers: {
          "Accept": "application/json"
        }
      })
    }

    return () => {
      refEffect.current = true;
    }
  }, [useFetchPage.fetchFunction]);

  useEffect(() => {
    const page = useFetchPage.data;
    if(page) {
      setMovies(page.data);
    }
  }, [useFetchPage.data]);

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
      { movies === undefined ? (
        <p>Carregando filmes</p>
      ) : (
        <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
          { movies.map((movie) => (
            <AdminMovieCard movie={movie} key={movie.id}  handleDelete={handleDelete} />
          )) }
        </main>
      ) }
    </>
  )
}

export default AdminMovies;
