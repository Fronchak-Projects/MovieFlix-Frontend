import { NavLink, Outlet } from 'react-router-dom';

const AdminContainer = () => {

  return (
    <div className="container px-2 py-4 md:py-8 mx-auto grid grid-cols-1 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9">
      <nav className="flex flex-wrap gap-2 md:gap-1 md:flex-col mb-3 md:mb-0 md:pr-2 md:border-r border-gray-500">
        <NavLink to="/admin/genres" className="admin-nav-link">Gêneros</NavLink>
        <NavLink to="/admin/movies" className="admin-nav-link">Filmes</NavLink>
        <NavLink to="/admin/users" className="admin-nav-link">Usuários</NavLink>
      </nav>
      <main className="md:col-span-4 lg:col-span-6 xl:col-span-8 md:pl-2">
        <Outlet />
      </main>
    </div>
  )


}

export default AdminContainer;
