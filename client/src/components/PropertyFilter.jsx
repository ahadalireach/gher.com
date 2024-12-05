/* eslint-disable react/prop-types */
const PropertiesFilter = ({ sidebardata, handleChange, handleSubmit }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <div className="flex items-center gap-2">
        <label className="whitespace-nowrap font-semibold text-sm md:text-base text-gray-800">
          Search:
        </label>
        <input
          type="text"
          id="searchTerm"
          placeholder="Title..."
          className="border rounded-lg p-2 w-full border-gray-300 outline-none focus:border-green-600 transition duration-200 text-sm md:text-base"
          value={sidebardata.searchTerm}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold text-sm md:text-base text-gray-800">
          Type:
        </label>
        {[
          { label: "All", id: "allTypes" },
          { label: "House", id: "house" },
          { label: "Flat", id: "flat" },
          { label: "Farm House", id: "farmHouse" },
        ].map((type) => (
          <div className="flex gap-2 items-center" key={type.id}>
            <input
              type="checkbox"
              id={type.id}
              className="appearance-none w-4 h-4 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
              onChange={handleChange}
              checked={sidebardata.type === type.id}
            />
            <span className="text-xs md:text-sm text-gray-700">
              {type.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold text-sm md:text-base text-gray-800">
          Purpose:
        </label>
        {[
          { label: "All", id: "allPurposes" },
          { label: "Rent", id: "rent" },
          { label: "Sell", id: "sell" },
        ].map((purpose) => (
          <div className="flex gap-2 items-center" key={purpose.id}>
            <input
              type="checkbox"
              id={purpose.id}
              className="appearance-none w-4 h-4 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
              onChange={handleChange}
              checked={sidebardata.purpose === purpose.id}
            />
            <span className="text-xs md:text-sm text-gray-700">
              {purpose.label}
            </span>
          </div>
        ))}
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            id="offer"
            className="appearance-none w-4 h-4 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
            onChange={handleChange}
            checked={sidebardata.offer}
          />
          <span className="text-xs md:text-sm text-gray-700">Offer</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold text-sm md:text-base text-gray-800">
          Features:
        </label>
        {["parking", "furnished"].map((amenity) => (
          <div className="flex gap-2 items-center" key={amenity}>
            <input
              type="checkbox"
              id={amenity}
              className="appearance-none w-4 h-4 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
              onChange={handleChange}
              checked={sidebardata[amenity]}
            />
            <span className="text-xs md:text-sm text-gray-700 capitalize">
              {amenity}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold text-sm md:text-base text-gray-800">
          Nearby:
        </label>
        {[
          { label: "School", id: "school" },
          { label: "Hospital", id: "hospital" },
          { label: "Gym", id: "gym" },
          { label: "Mall", id: "shoppingMalls" },
          { label: "Transport", id: "publicTransport" },
          { label: "Restaurant", id: "restaurants" },
          { label: "Internet", id: "internet" },
          { label: "Play Area", id: "playArea" },
        ].map((place) => (
          <div className="flex items-center" key={place.id}>
            <input
              type="checkbox"
              id={place.id}
              className="hidden peer"
              onChange={handleChange}
              checked={sidebardata.nearby.includes(place.id)}
            />
            <label
              htmlFor={place.id}
              className="peer-checked:bg-green-600 peer-checked:text-white p-2 rounded-md border border-gray-300 cursor-pointer text-xs md:text-sm transition-all"
            >
              {place.label}
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="font-semibold text-sm md:text-base text-gray-800">
          Sort:
        </label>
        <select
          onChange={handleChange}
          defaultValue={"created_at_desc"}
          id="sort_order"
          className="border rounded-lg p-2 w-full border-gray-300 outline-none focus:border-green-600 transition duration-200 text-sm md:text-base"
        >
          <option value="createdAt_desc">Latest</option>
          <option value="createdAt_asc">Oldest</option>
          <option value="regularPrice_desc">Price: High to Low</option>
          <option value="regularPrice_asc">Price: Low to High</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none transition-all text-sm md:text-base"
      >
        Apply Filters
      </button>
    </form>
  );
};

export default PropertiesFilter;
