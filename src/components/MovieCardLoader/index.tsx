const MovieCardLoader = () => {
  return (
    <div className="bg-white rounded-md border border-gray-400">
      <div className="animate-pulse">
        <div className="h-48 bg-gray-400"></div>
        <div className="p-3">
          <div className="h-8 bg-gray-400 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-400 rounded w-1/2 mb-6"></div>
          <div className="flex justify-end">
            <div className="h-8 bg-blue-400 rounded-md w-2/5"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCardLoader;
