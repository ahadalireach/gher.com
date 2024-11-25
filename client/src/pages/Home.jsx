import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Hero,
  AboutUs,
  ServicesOverview,
  HomeProperties,
  Loader,
  SomethingWrong,
} from "../components";

const Home = () => {
  const [fetchedProperties, setFetchedProperties] = useState({
    offer: [],
    rent: [],
    sell: [],
  });
  const [propertyErrors, setPropertyErrors] = useState({
    offer: false,
    rent: false,
    sell: false,
  });
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  // ********* Fetch Properties ********* //
  const fetchProperties = async (type, query) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/properties/view-properties?${query}&limit=3`;
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        setPropertyErrors((prev) => ({ ...prev, [type]: true }));
        toast.error(data.message || `Failed to fetch ${type} properties.`);
        return;
      }

      setFetchedProperties((prev) => ({ ...prev, [type]: data }));
    } catch (error) {
      setPropertyErrors((prev) => ({ ...prev, [type]: true }));
      if (error instanceof TypeError) {
        console.error(
          `Network error fetching ${type} properties:`,
          error.message
        );
      } else {
        console.error(
          `Unexpected error fetching ${type} properties:`,
          error.message
        );
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProperties(true);
      try {
        await Promise.all([
          fetchProperties("offer", "offer=true"),
          fetchProperties("rent", "purpose=rent"),
          fetchProperties("sell", "purpose=sell"),
        ]);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchData();
  }, []);

  const allTypesHaveErrors = Object.values(propertyErrors).every(
    (hasError) => hasError
  );

  return (
    <>
      <Hero />
      <AboutUs />
      {isLoadingProperties ? (
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
            propertyErrors[type] ? (
              <SomethingWrong
                key={type}
                subtitle={"Oops!"}
                description={`Failed to load ${type} properties.`}
                isHome={true}
              />
            ) : (
              fetchedProperties[type].length > 0 && (
                <HomeProperties
                  key={type}
                  title={
                    type === "offer"
                      ? "Recent Properties with Offers"
                      : type === "rent"
                      ? "Recent Properties for Rent"
                      : "Recent Properties for Sale"
                  }
                  properties={fetchedProperties[type]}
                  url={
                    type === "offer"
                      ? "/properties?offer=true"
                      : `/properties?purpose=${type}`
                  }
                />
              )
            )
          )}
        </>
      )}
      <ServicesOverview />
    </>
  );
};

export default Home;
