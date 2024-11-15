import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AboutUs, Focus, Hero, HomeProperties } from "../components";

const HomePage = () => {
  const [offerProperties, setOfferProperties] = useState([]);
  const [saleProperties, setSaleProperties] = useState([]);
  const [rentProperties, setRentProperties] = useState([]);

  const fetchProperties = async (type, setter) => {
    try {
      let url = "";

      if (type === "offer") {
        url = `${
          import.meta.env.VITE_BACKEND_URL
        }/property/view-properties?offer=true&limit=3`;
      } else if (type === "rent") {
        url = `${
          import.meta.env.VITE_BACKEND_URL
        }/property/view-properties?purpose=rent&limit=3`;
      } else if (type === "sell") {
        url = `${
          import.meta.env.VITE_BACKEND_URL
        }/property/view-properties?purpose=sell&limit=3`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Could not fetch ${type} properties. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setter(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch properties.");
    }
  };
  useEffect(() => {
    fetchProperties("offer", setOfferProperties);
    fetchProperties("rent", setRentProperties);
    fetchProperties("sell", setSaleProperties);
  }, []);

  return (
    <>
      <Hero />
      <AboutUs />

      {offerProperties.length > 0 && (
        <HomeProperties
          title="Recent Offers"
          properties={offerProperties}
          url={"/search?offer=true"}
        />
      )}

      {rentProperties.length > 0 && (
        <HomeProperties
          title="Recent Rental Places"
          properties={rentProperties}
          url="/search?purpose=rent"
        />
      )}

      {saleProperties.length > 0 && (
        <HomeProperties
          title="Recent Places for Sale"
          properties={saleProperties}
          url="/search?purpose=sell"
        />
      )}

      <Focus />
    </>
  );
};

export default HomePage;
