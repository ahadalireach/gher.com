import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, PropertyItem } from "../components";

const Properties = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "allTypes",
    purpose: "allPurposes",
    parking: false,
    furnished: false,
    offer: false,
    nearby: [],
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const purposeFromUrl = urlParams.get("purpose");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const nearbyFromUrl = urlParams.get("nearby");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      purposeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      nearbyFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "allTypes",
        purpose: purposeFromUrl || "allPurposes",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        nearby: nearbyFromUrl ? nearbyFromUrl.split(",") : [],
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchproperties = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();

      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/property/view-properties?${searchQuery}`
      );
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setProperties(data);
      setLoading(false);
    };

    fetchproperties();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "allPurposes" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSidebardata({ ...sidebardata, purpose: e.target.id });
    }

    if (
      e.target.id === "allTypes" ||
      e.target.id === "house" ||
      e.target.id === "flat" ||
      e.target.id === "farmhouse" ||
      e.target.id === "shop"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }

    if (e.target.type === "checkbox") {
      const { id, checked } = e.target;
      setSidebardata((prevState) => ({
        ...prevState,
        nearby: checked
          ? [...prevState.nearby, id]
          : prevState.nearby.filter((item) => item !== id),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("purpose", sidebardata.purpose);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("nearby", sidebardata.nearby.join(","));
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();

    navigate(`/properties?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfProperties = properties.length;

    const startIndex = numberOfProperties;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/property/view-properties?${searchQuery}`
    );
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setProperties([...properties, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 lg:w-4/12 p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full border-gray-300 outline-none  focus:border-green-500"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="allTypes"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.type === "allTypes"}
              />
              <span>All</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="house"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.type === "house"}
              />
              <span>House</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="shop"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.type === "shop"}
              />
              <span>Shop</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="flat"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.type === "flat"}
              />
              <span>Flat</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="farmhouse"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.type === "farmhouse"}
              />
              <span>Farm House</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Purpose:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="allPurposes"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.purpose === "allPurposes"}
              />
              <span>Both</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.purpose === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.purpose === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
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
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <h5 className="font-normal text-gray-500">Nearby:</h5>
            {[
              { label: "School", id: "school" },
              { label: "Hospital", id: "hospital" },
              { label: "Shopping Malls", id: "shoppingMalls" },
              { label: "Public Transport", id: "publicTransport" },
              { label: "Restaurants", id: "restaurants" },
              { label: "Internet", id: "internet" },
              { label: "Play Area", id: "playarea" },
              { label: "Gym", id: "gym" },
              { label: "Pool", id: "pool" },
              { label: "Community Center", id: "communityCenter" },
            ].map((option) => (
              <div key={option.id}>
                <input
                  type="checkbox"
                  id={option.id}
                  className="hidden peer"
                  onChange={handleChange}
                  checked={sidebardata.nearby.includes(option.id)}
                />
                <label
                  htmlFor={option.id}
                  className="peer-checked:bg-green-600 peer-checked:text-white px-4 py-2 rounded-lg border border-gray-300 cursor-pointer transition-all"
                >
                  {option.label}
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
              className="border rounded-lg p-2 border-gray-300 outline-none focus:border-green-500"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:bg-green-800">
            Search
          </button>
        </form>
      </div>

      <div className="w-full md:w-3/4 lg:w-2/3">
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && properties.length === 0 && (
            <p className="text-xl text-slate-700">No Property found!</p>
          )}
          {loading && <Loader />}

          {!loading &&
            properties &&
            properties.map((property) => (
              <PropertyItem key={property._id} property={property} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Properties;
