/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaLinkedin, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const SellerInfo = ({ property, onError }) => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactno: "",
    message: "",
  });

  // ********* Handle Input Change ********* //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ********* Fetch Seller Info ********* //
  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/user-info/${property.userRef}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user info");
      }
      const data = await res.json();
      toast.error(data.message);
      setSellerInfo(data);
    } catch (error) {
      console.error("Error fetching seller info:", error);
      onError(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [property.userRef]);

  // ********* Handle Form Submit ********* //
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, contactno, message } = formData;
    if (!name || !email || !contactno || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const templateParams = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerContactNo: formData.contactno,
      customerMessage: formData.message,
      propertyTitle: property.title,
      propertyAddress: property.address,
      propertyArea: property.area,
      propertyBedrooms: property.bedrooms,
      propertyBathrooms: property.bathrooms,
      propertyPrice: property.offer
        ? (property.discountPrice || 0).toLocaleString("en-US")
        : (property.regularPrice || 0).toLocaleString("en-US"),
      propertyDescription: property.description,
      sellerName: sellerInfo?.fullname,
      sellerEmail: sellerInfo?.email,
      sellerWhatsApp: sellerInfo?.whatsappno,
      sellerLocalNo: sellerInfo?.localno,
    };

    const serviceID = "service_qycyx02";
    const templateID = "template_hdz7ef4";
    const userID = "7fWtiqQrwNqT9pZCz";

    setSubmitLoading(true);

    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then(() => {
        setSubmitLoading(false);
        toast.success("Your message has been sent successfully!");
        setFormData({
          name: "",
          email: "",
          contactno: "",
          message: "",
        });
      })
      .catch(() => {
        setSubmitLoading(false);
        toast.error("Failed to send your message. Please try again later.");
      });
  };

  return (
    <div className="mx-auto flex flex-col gap-6">
      <div className="border border-gray-300 p-6 flex flex-col items-center space-y-2">
        <img
          src={sellerInfo?.avatar}
          alt="Seller"
          className="w-24 h-24 rounded-full object-cover border border-gray-200"
        />

        <p className="text-xl font-semibold text-gray-800">
          {sellerInfo?.fullname}
        </p>

        <p className="text-gray-600 flex items-center hover:text-green-700 cursor-pointer">
          <a target="_blank" href={`mailto:${sellerInfo?.email}`}>
            {sellerInfo?.email}
          </a>
        </p>

        <div className="flex">
          {sellerInfo?.facebook && (
            <a
              href={`https://www.facebook.com/${sellerInfo?.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 cursor-pointer"
            >
              <FaFacebook className="text-gray-500 text-xl hover:text-green-700" />
            </a>
          )}
          {sellerInfo?.linkedin && (
            <a
              href={`https://www.linkedin.com/in/${sellerInfo?.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 cursor-pointer"
            >
              <FaLinkedin className="text-gray-500 text-xl hover:text-green-700" />
            </a>
          )}
          {sellerInfo?.instagram && (
            <a
              href={
                sellerInfo?.instagram.startsWith("http")
                  ? sellerInfo?.instagram
                  : `https://www.instagram.com/${sellerInfo?.instagram}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 cursor-pointer"
            >
              <FaInstagram className="text-gray-500 text-xl hover:text-green-700" />
            </a>
          )}
        </div>

        <div className="flex gap-3">
          <a
            href={`https://api.whatsapp.com/send/?phone=${
              sellerInfo?.whatsappno
            }&text=${encodeURIComponent(
              `Hi, I am interested in your ${property.title} listed at ${
                property.offer
                  ? (property.discountPrice || 0).toLocaleString("en-US")
                  : (property.regularPrice || 0).toLocaleString("en-US")
              } for sale in ${property.address}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-green-700 border-2 border-green-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            WhatsApp
          </a>

          <a
            href={`tel:${sellerInfo?.localno}`}
            target="_blank"
            className="w-full bg-green-700 text-white border-2 border-green-700 py-2 px-4 rounded-lg hover:bg-green-800 hover:border-green-800 transition-colors duration-300 font-semibold"
          >
            Call
          </a>
        </div>
      </div>

      <div className="border border-gray-300 p-6">
        <h2 className="text-lg mb-4 text-gray-800 flex font-semibold">
          <div className="w-1 h-8 bg-green-700 mr-3 rounded-sm" />
          Drop Message
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contactno"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Contact No
            </label>
            <input
              type="text"
              id="contactno"
              name="contactno"
              value={formData.contactno}
              onChange={handleInputChange}
              placeholder="Enter your contact number"
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your message"
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors duration-300 font-semibold"
          >
            {submitLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      <div className="border border-gray-300 p-6">
        <h2 className="text-lg mb-4 text-gray-800 flex font-semibold">
          <div className="w-1 h-8 bg-green-700 mr-3 rounded-sm" />
          Follow Me
        </h2>
        <div className="flex items-start justify-between gap-6">
          <a
            href="https://www.linkedin.com/in/ahadalireach"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-300 hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.facebook.com/ahadalireach"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-300 hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/ahadalireach"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-300 hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
          >
            <FaInstagram />
          </a>
          <a
            href="https://github.com/ahadalireach"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-300 hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
