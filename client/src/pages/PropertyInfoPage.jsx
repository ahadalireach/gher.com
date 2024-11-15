import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaChair,
  FaParking,
  FaMoneyBillWave,
  FaTag,
  FaInfoCircle,
  FaMap,
  FaBuilding,
  FaUtensils,
  FaHome,
  FaSchool,
  FaHospital,
  FaShoppingCart,
  FaBus,
  FaWifi,
  FaChild,
  FaDumbbell,
  FaSwimmer,
  FaUsers,
} from "react-icons/fa";
import { SellerContact, Loader } from "../components";

const PropertyInfoPage = () => {
  SwiperCore.use([Navigation]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { id: propertyId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/property/view-property/${propertyId}`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProperty(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const showContact = currentUser && property?.userRef !== currentUser._id;

  return (
    <main className="bg-gray-50">
      {loading && (
        <div className="flex justify-center items-center my-7 text-2xl text-gray-700">
          <Loader isProperty={true} />
        </div>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-red-600">
          Something went wrong!
        </p>
      )}

      {property && !loading && !error && (
        <div>
          <Swiper
            navigation
            pagination={{ clickable: true }}
            className="swiper-container mb-10"
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-bullet-active-color": "#fff",
              "--swiper-pagination-bullet-inactive-color": "#bbb",
              "--swiper-pagination-bullet-size": "10px",
              "--swiper-pagination-bullet-horizontal-gap": "6px",
            }}
          >
            {property.imageUrls.map((url) => (
              <SwiperSlide key={url} className="relative">
                <div
                  className="h-[720px] w-full"
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    objectFit: "cover",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex flex-col lg:flex-row gap-12 px-4 sm:px-14 lg:px-20">
            <div
              className={`flex flex-col ${
                showContact ? "lg:w-2/3" : "w-full"
              } max-w-5xl`}
            >
              <div className="mb-2 flex gap-4">
                <div className="flex items-center text-white mb-2 bg-orange-800 px-4 py-2 max-w-max">
                  <div className="flex flex-col">
                    <h6 className="text-xl  mb-1">
                      For{" "}
                      {property.purpose
                        ? property.purpose.charAt(0).toUpperCase() +
                          property.purpose.slice(1)
                        : "Not specified"}
                    </h6>
                  </div>
                </div>

                {property.offer && (
                  <div className="flex items-center text-white mb-2 bg-yellow-800 px-4 py-2 max-w-max">
                    <div className="flex flex-col">
                      <h6 className="text-xl mb-1">Offer</h6>
                    </div>
                  </div>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {property.title}
              </h1>

              <p className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <FaMapMarkerAlt className="text-green-800" />
                {property.address}
              </p>

              <div className="mb-8">
                <div className="flex items-center text-green-800 font-semibold mb-2 bg-green-200 px-4 py-2 max-w-max ">
                  <div className="flex">
                    <h6 className="text-xl  mb-1">
                      Rs: {/* */}
                      {property.offer
                        ? property.discountPrice.toLocaleString("en-US")
                        : property.regularPrice.toLocaleString("en-US")}
                    </h6>
                    {property.purpose === "rent" && (
                      <span className="text-lg font-semibold ml-1">
                        {" "}
                        / month
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-gray-800 mb-10">
                <div className="flex items-center mb-5 font-semibold">
                  <div className="w-1 h-8 bg-green-800 mr-4 rounded-sm" />
                  Description
                </div>
                <p className="text-gray-500 mb-6 text-sm sm:text-xl whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div className="text-gray-800 mb-10">
                <div className="flex items-center mb-5 font-semibold">
                  <div className="w-1 h-8 bg-green-800 mr-4 rounded-sm shadow-md" />
                  <h2 className="font-bold text-gray-900">Property Details</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-8 mb-6 bg-green-100 border-l border-r border-gray-300 rounded-md">
                  <div className="flex-1 sm:border-r sm:border-gray-300 lg:pr-6">
                    <ul className="text-green-800 font-semibold text-sm space-y-4">
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaMapMarkerAlt className="text-lg text-green-700" />
                        <span className="font-medium">Address:</span>
                        {property.address || "Not specified"}
                      </li>
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaInfoCircle className="text-lg text-green-700" />
                        <span className="font-medium">Property Status:</span>
                        {property.purpose
                          ? property.purpose.charAt(0).toUpperCase() +
                            property.purpose.slice(1)
                          : "Not specified"}
                      </li>
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaBuilding className="text-lg text-green-700" />
                        <span className="font-medium">Floors:</span>
                        {property.floors || "Not specified"}
                      </li>

                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaBath className="text-lg text-green-700" />
                        <span className="font-medium">Baths:</span>
                        {property.bathrooms || "Not specified"}
                      </li>
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaParking className="text-lg text-green-700" />
                        <span className="font-medium">Parking:</span>
                        {property.parking ? "Yes" : "No"}
                      </li>

                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaMoneyBillWave className="text-lg text-green-700" />
                        <span className="font-medium">Price:</span>
                        {property.regularPrice.toLocaleString("en-US")}
                      </li>
                    </ul>
                  </div>

                  <div className="flex-1 lg:pl-6">
                    <ul className="text-green-800 font-semibold text-sm space-y-4">
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaMap className="text-lg text-green-700" />
                        <span className="font-medium">Area:</span>
                        {property.area || "Not specified"}
                      </li>
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaHome className="text-lg text-green-700" />
                        <span className="font-medium">Property Type:</span>
                        {property.type &&
                          property.type.charAt(0).toUpperCase() +
                            property.type.slice(1)}
                      </li>
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaBed className="text-lg text-green-700" />
                        <span className="font-medium">Beds:</span>
                        {property.bedrooms || "Not specified"}
                      </li>
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaUtensils className="text-lg text-green-700" />
                        <span className="font-medium">Kitchens:</span>
                        {property.kitchens || "Not specified"}
                      </li>
                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaChair className="text-lg text-green-700" />
                        <span className="font-medium">Furnished:</span>
                        {property.furnished ? "Yes" : "No"}
                      </li>

                      <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                        <FaTag className="text-lg text-green-700" />
                        <span className="font-medium">Discount:</span>
                        {property.offer ? (
                          <div>
                            {(
                              +property.regularPrice - +property.discountPrice
                            ).toLocaleString("en-US")}
                          </div>
                        ) : (
                          "No"
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {(property.school ||
                property.hospital ||
                property.shoppingMalls ||
                property.publicTransport ||
                property.restaurants ||
                property.internet ||
                property.playarea ||
                property.gym ||
                property.pool ||
                property.communityCenter) && (
                <div className="text-gray-800 mb-10">
                  <div className="flex items-center mb-5 font-semibold">
                    <div className="w-1 h-8 bg-green-800 mr-4 rounded-sm shadow-md" />
                    <h2 className="font-bold text-gray-900">
                      Property Nearby:
                    </h2>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 mb-6 bg-green-100 border-l border-r border-gray-300 rounded-md">
                    <div className="flex-1 sm:border-r sm:border-gray-300 lg:pr-6">
                      <ul className="text-green-800 font-semibold text-sm space-y-4">
                        {property.school && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaSchool className="text-lg text-green-700" />
                            <span className="font-medium">Schools: </span>
                            {property.school ? "Yes" : "No"}
                          </li>
                        )}
                        {property.hospital && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaHospital className="text-lg text-green-700" />
                            <span className="font-medium">Hospitals: </span>
                            {property.hospital ? "Yes" : "No"}
                          </li>
                        )}
                        {property.shoppingMalls && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaShoppingCart className="text-lg text-green-700" />
                            <span className="font-medium">
                              Shopping Malls:{" "}
                            </span>
                            {property.shoppingMalls ? "Yes" : "No"}
                          </li>
                        )}
                        {property.publicTransport && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaBus className="text-lg text-green-700" />
                            <span className="font-medium">
                              Public Transport:{" "}
                            </span>
                            {property.publicTransport ? "Yes" : "No"}
                          </li>
                        )}
                        {property.restaurants && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaUtensils className="text-lg text-green-700" />
                            <span className="font-medium">Restaurants:</span>
                            {property.restaurants ? "Yes" : "No"}
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="flex-1 lg:pl-6">
                      <ul className="text-green-800 font-semibold text-sm space-y-4">
                        {property.internet && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaWifi className="text-lg text-green-700" />
                            <span className="font-medium">Internet:</span>
                            {property.internet ? "Yes" : "No"}
                          </li>
                        )}
                        {property.playarea && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaChild className="text-lg text-green-700" />
                            <span className="font-medium">Play Area:</span>
                            {property.playarea ? "Yes" : "No"}
                          </li>
                        )}
                        {property.gym && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaDumbbell className="text-lg text-green-700" />
                            <span className="font-medium">Gym:</span>
                            {property.gym ? "Yes" : "No"}
                          </li>
                        )}
                        {property.pool && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaSwimmer className="text-lg text-green-700" />
                            <span className="font-medium">Swimming Pool:</span>
                            {property.pool ? "Yes" : "No"}
                          </li>
                        )}
                        {property.communityCenter && (
                          <li className="flex items-center gap-4 p-4 border-b border-gray-300">
                            <FaUsers className="text-lg text-green-700" />
                            <span className="font-medium">
                              Community Center:
                            </span>
                            {property.communityCenter ? "Yes" : "No"}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {property.address && (
                <div className="font-semibold text-gray-800 mb-10">
                  <div className="flex items-center mb-5">
                    <div className="w-1 h-8 bg-green-800 mr-4 rounded-sm" />
                    <span>Location</span>
                  </div>
                  <div className="w-full sm:h-96 mb-6">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        property.address
                      )}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                      className="w-full h-full shadow-md"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location Map"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {showContact && (
              <div className="w-full lg:w-1/3 max-w-xs mb-12 lg:ml-12">
                <SellerContact property={property} />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
export default PropertyInfoPage;
