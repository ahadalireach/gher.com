/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader, PropertyFilter, PropertyItem } from "../components";

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

  // ********* Fetch All Properties ********* //
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
      setLoading(true);
      setShowMore(false);

      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/properties/view-properties?${searchQuery}`
        );
        const data = await res.json();
        console.log(loading, searchQuery);
        if (!res.ok) {
          toast.error(data.message || "Failed to fetch properties");
          return;
        }

        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }

        setLoading(false);
        setProperties(data);
      } catch (error) {
        setLoading(false);
        toast.error(
          error.message || "An error occurred while fetching properties"
        );
      }
    };

    fetchProperties();
  }, [location.search]);

  // ********* Handle Input CHange ********* //
  const handleChange = (e) => {
    console.log(e.target.id, e.target.value, e.target.name);

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

  // ********* Fetch Properties  ********* //
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

  // ********* Show More Properties ********* //
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
    setProperties([...properties, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row lg:space-x-6 mx-auto gap-6">
      <div className="w-full md:w-4/12 p-7 border-b-2 md:border-r-2 lg:min-h-screen lg:sticky lg:top-0 lg:h-screen overflow-auto">
        <PropertyFilter
          sidebardata={sidebardata}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
      <div className="w-full md:w-8/12 overflow-auto">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {loading && (
            <div className="flex justify-center items-center w-full">
              <Loader />
            </div>
          )}

          {!loading && properties.length === 0 ? (
            <p className="text-xl text-slate-700">
              No properties found matching your search criteria. Please try
              adjusting your filters or search terms.
            </p>
          ) : null}

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
