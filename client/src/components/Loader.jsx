const Loader = ({ isProperty }) => {
  return (
    <div
      className={`${
        isProperty ? "mt-72" : ""
      } text-xl text-slate-700 text-center w-full`}
    >
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-28 h-28 border-8 text-green-700 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-green-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
