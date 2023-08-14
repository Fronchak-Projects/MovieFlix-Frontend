import { Link } from "react-router-dom";

const AdminMovies = () => {

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-bold text-2xl uppercase">Filmes</h2>
        <Link className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700" to="/movies/save">Adicionar filme</Link>
      </div>
    </>
  )
}

export default AdminMovies;
