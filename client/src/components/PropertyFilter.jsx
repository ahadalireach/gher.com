/* eslint-disable react/prop-types */

const PropertiesFilter = ({ sidebardata, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <label className="whitespace-nowrap font-semibold">Search Term:</label>
        <input
          type="text"
          id="searchTerm"
          placeholder="Search..."
          className="border rounded-lg p-2 w-full border-gray-300 outline-none focus:border-green-500"
          value={sidebardata.searchTerm}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold">Type:</label>
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
              className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
              onChange={handleChange}
              checked={sidebardata.type === type.id}
            />
            <span>{type.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold">Purpose:</label>
        {[
          {
            label: "All",
            id: "allPurposes",
          },
          {
            label: "Rent",
            id: "rent",
          },
          {
            label: "Sell",
            id: "sell",
          },
        ].map((purpose) => (
          <div className="flex gap-2 items-center" key={purpose.id}>
            <input
              type="checkbox"
              id={purpose.id}
              className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
              onChange={handleChange}
              checked={sidebardata.purpose === purpose.id}
            />
            <span>{purpose.label}</span>
          </div>
        ))}
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            id="offer"
            className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
            onChange={handleChange}
            checked={sidebardata.offer}
          />
          <span>Offer</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <label className="font-semibold">Amenities:</label>
        {["parking", "furnished"].map((amenity) => (
          <div className="flex gap-2 items-center" key={amenity}>
            <input
              type="checkbox"
              id={amenity}
              className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
              onChange={handleChange}
              checked={sidebardata[amenity]}
            />
            <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {" "}
        <label className="font-semibold">Near by:</label>
        {[
          {
            label: "School",
            id: "school",
          },
          {
            label: "Hospital",
            id: "hospital",
          },
          {
            label: "Gym",
            id: "gym",
          },
          {
            label: "Mall",
            id: "shoppingMalls",
          },
          {
            label: "Transport",
            id: "publicTransport",
          },
          {
            label: "Restaurant",
            id: "restaurants",
          },
          {
            label: "Internet",
            id: "internet",
          },
          {
            label: "Play Area",
            id: "playArea",
          },
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
              className="peer-checked:bg-green-600 peer-checked:text-white p-1 rounded-lg border border-gray-300 cursor-pointer transition-all"
            >
              {place.label}
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="font-semibold">Sort:</label>
        <select
          onChange={handleChange}
          defaultValue={"created_at_desc"}
          id="sort_order"
          className="border rounded-lg p-2 w-full border-gray-300 outline-none focus:border-green-500"
        >
          <option value="createdAt_desc">Latest</option>
          <option value="createdAt_asc">Oldest</option>
          <option value="regularPrice_desc">Price high to low</option>
          <option value="regularPrice_asc">Price low to high</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none"
      >
        Apply Filters
      </button>
    </form>
  );
};

export default PropertiesFilter;
