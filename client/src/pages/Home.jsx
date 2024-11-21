/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Hero,
  AboutUs,
  OurFocus,
  HomeProperties,
  Loader,
  SomethingWrong,
} from "../components";
import { toast } from "react-toastify";

const HomePage = () => {
  const [properties, setProperties] = useState({
    offer: [],
    rent: [],
    sell: [],
  });
  const [errors, setErrors] = useState({
    offer: false,
    rent: false,
    sell: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ********* Fetch Properties ********* //
  const fetchProperties = async (type, query) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/properties/view-properties?${query}&limit=3`;
      const res = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, [type]: true }));
        toast.error(data.message || `Failed to fetch ${type} properties.`);
        return;
      }

      setProperties((prev) => ({ ...prev, [type]: data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [type]: true }));
      console.error(`Error fetching ${type} properties:`, error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchProperties("offer", "offer=true"),
          fetchProperties("rent", "purpose=rent"),
          fetchProperties("sell", "purpose=sell"),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const errorMessages = Object.entries(errors)
    .filter(([, hasError]) => hasError)
    .map(([type]) => `Failed to load ${type} properties.`);

  const allTypesHaveErrors = Object.values(errors).every(
    (hasError) => hasError
  );

  return (
    <>
      <Hero />
      <AboutUs />
      {isLoading ? (
        <Loader />
      ) : allTypesHaveErrors ? (
        <SomethingWrong
          subtitle={"Oops!"}
          description="Failed to fetch properties. Please try again later or check console for possible issues."
          isHome={true}
        />
      ) : (
        <>
          {["offer", "rent", "sell"].map((type) =>
            errors[type] ? (
              <SomethingWrong
                key={type}
                subtitle={"Oops!"}
                description={`Failed to load ${type} properties.`}
                isHome={true}
              />
            ) : (
              properties[type].length > 0 && (
                <HomeProperties
                  key={type}
                  title={
                    type === "offer"
                      ? "Recent Offers"
                      : type === "rent"
                      ? "Recent Rental Places"
                      : "Recent Places for Sale"
                  }
                  properties={properties[type]}
                  url={
                    type === "offer"
                      ? "/search?offer=true"
                      : `/search?purpose=${type}`
                  }
                />
              )
            )
          )}
        </>
      )}
      <OurFocus />
    </>
  );
};

export default HomePage;
