const UsersTableLoader = () => {

  return (
    <div className="animate-pulse">
        <div className="h-14 bg-white"></div>
        { new Array(5).fill('').map((_, index) => (
          <div className="py-1 flex items-center" key={index}>
            <div className="w-2/12 lg:w-1/12">
              <div className="bg-gray-400 w-12 h-12 rounded-full"></div>
            </div>
            <div className="w-4/12 lg:w-5/12">
              <div className="bg-gray-400 w-4/5 rounded h-6"></div>
            </div>
            <div className="w-4/12">
              <div className="bg-gray-400 w-4/5 rounded h-6"></div>
            </div>
            <div className="w-2/12">
              <div className="bg-blue-400 h-8 w-5/6 md:w-3/5 lg:w-2/5 rounded-md "></div>
            </div>
          </div>
        )) }

    </div>
  );
}

export default UsersTableLoader;
