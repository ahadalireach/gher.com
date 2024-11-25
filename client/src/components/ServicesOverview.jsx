import { Link } from "react-router-dom";
import { FaHome, FaRss, FaDollarSign } from "react-icons/fa";

const serviceOptions = [
  {
    id: 1,
    title: "Buy Your Dream Home",
    description:
      "Find the perfect home for your family with our help at every step.",
    url: "/properties?searchTerm=&purpose=sell",
    urlName: "Explore Properties",
    icon: FaHome,
  },
  {
    id: 2,
    title: "Rent a Comfortable Home",
    description:
      "Discover rental homes for short or long stays that meet your needs.",
    url: "/properties?searchTerm=&purpose=rent",
    urlName: "Find Rental Options",
    icon: FaRss,
  },
  {
    id: 3,
    title: "Sell Your Property",
    description:
      "Let us help you sell your property quickly and at a good price.",
    url: "/sell-property",
    urlName: "Start Selling",
    icon: FaDollarSign,
  },
];

const ServicesOverview = () => {
  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-0 my-10">
      <div className="text-center">
        <h6 className="text-sm text-green-800 font-semibold mb-2 bg-green-200 rounded-lg inline-block py-2 px-4">
          Our Services
        </h6>
        <h1 className="text-4xl text-center font-semibold text-green-700 my-6">
          Our Main Focus Areas
        </h1>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceOptions.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                className="bg-white shadow-xl p-6 text-center border border-gray-200 hover:border-green-700"
                key={item.id}
              >
                <div className="flex justify-center items-center mb-4 bg-green-200 rounded-full w-16 h-16 mx-auto shadow-md">
                  <IconComponent className="text-green-700 text-3xl" />
                </div>
                <div>
                  <h3 className="truncate text-lg font-semibold text-gray-800 hover:text-green-700 transition-colors cursor-pointer mb-4">
                    <Link
                      to="/service-details"
                      className="hover:text-green-700 transition-colors duration-300"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500 mb-4">{item.description}</p>
                  <Link
                    to={item.url}
                    className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-300"
                  >
                    {item.urlName}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesOverview;
