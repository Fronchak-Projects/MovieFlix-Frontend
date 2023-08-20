const PaginationLoader = () => {

  return (
    <div className="py-8 px-2">
    <div className="animate-pulse flex justify-center items-center gap-2 flex-wrap">
      <i className="bi bi-chevron-left text-gray-400"></i>
      <div className="bg-gray-400 w-10 h-10 rounded-full"></div>
      <div className="bg-gray-400 w-10 h-10 rounded-full"></div>
      <div className="bg-gray-400 w-10 h-10 rounded-full"></div>
      <div className="bg-gray-400 w-10 h-10 rounded-full"></div>
      <div className="bg-gray-400 w-10 h-10 rounded-full"></div>
      <i className="bi bi-chevron-right text-gray-400"></i>
    </div>
  </div>
  );
}

export default PaginationLoader;
