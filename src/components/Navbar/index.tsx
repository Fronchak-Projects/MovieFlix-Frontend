

const Navbar = () => {


  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-1 flex justify-between md:justify-start items-center">
        <div className="flex gap-x-2 text-xl">
          <i className="bi bi-film"></i>
          <h1 className="font-bold">Movie Flix</h1>
        </div>
        <i className="bi bi-list text-white md:invisible"></i>
        <nav className="hidden md:flex flex-1 justify-between">
          <ul className="flex">
            <li><a className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" href="#">Movies</a></li>
            <li><a className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" href="#">About Us</a></li>
          </ul>
          <ul className="flex">
            <li><a className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" href="/auth/login">Login</a></li>
            <li><a className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" href="/auth/register">Register</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
