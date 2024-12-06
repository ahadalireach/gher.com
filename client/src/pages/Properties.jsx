/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Loader,
  PropertiesFilter,
  PropertyItem,
  SomethingWrong,
} from "../components";

const Properties = () => {
  const location = useLocation();
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

    const fetchProperties = async () => {
      setIsLoading(true);
      setShowMore(false);

      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/properties/view-properties?${searchQuery}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError("ServerError");
          return;
        }

        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }

        setIsLoading(false);
        setProperties(data);
      } catch (error) {
        setIsLoading(false);
        setError("ServerError");
      }
    };

    fetchProperties();
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
      e.target.id === "farmHouse"
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

    setIsMobileFilterOpen(false);
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
      }/properties/view-properties?${searchQuery}`
    );
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setProperties((prevProperties) => [...prevProperties, ...data]);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <div className="block lg:hidden mb-6">
            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700 transition"
              onClick={toggleMobileFilter}
            >
              Filter Properties
            </button>
          </div>

          {isMobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
              <div className="bg-white p-4 w-80 md:w-96 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-5 right-5 text-xl text-gray-600 hover:text-red-600 transition-all"
                  onClick={toggleMobileFilter}
                >
                  &times;
                </button>
                <PropertiesFilter
                  sidebardata={sidebardata}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          )}

          <div className="hidden lg:block sticky top-20">
            <PropertiesFilter
              sidebardata={sidebardata}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="w-full lg:w-3/4 xl:w-4/5">
          {isLoading && (
            <div className="flex justify-center col-span-1 sm:col-span-2">
              <Loader />
            </div>
          )}

          {error === "ServerError" && !isLoading && properties.length === 0 && (
            <div className="flex justify-center col-span-1 sm:col-span-2">
              <SomethingWrong
                title="OOPS!"
                subtitle="Something went wrong while fetching properties."
                description="Please check back later."
              />
            </div>
          )}
          {!isLoading && !error && properties.length === 0 ? (
            <div className="flex justify-center col-span-1 sm:col-span-2">
              <SomethingWrong
                subtitle="No properties found. Unable to find matching properties."
                description="Please adjust your filters or check back later!"
              />
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {!isLoading &&
              properties &&
              properties.map((property) => (
                <PropertyItem key={property.id} property={property} />
              ))}
          </div>

          {showMore && (
            <div className="text-center mt-8">
              <button
                className="bg-green-600 font-bold text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                onClick={onShowMoreClick}
              >
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
