import { NavLink } from 'react-router-dom';

const Genres = () => {

  return (
    <div className="container px-2 mx-auto my-10">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-2xl uppercase">Gêneros</h2>
        <NavLink className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700" to="/genres/save">Adicionar gênero</NavLink>
      </div>
    </div>
  )
}

export default Genres;
