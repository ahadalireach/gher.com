/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ProfileForm = ({
  onSubmit,
  initalFormData,
  handleSignoutUser,
  handleDeleteUser,
}) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState(initalFormData);
  const [loading, setLoading] = useState(false);
  const [hideWhatsapp, setHideWhatsapp] = useState(false);
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (initalFormData) setFormData(initalFormData);
  }, [initalFormData]);

  useEffect(() => {
    if (formData?.localno === formData?.whatsappno) setHideWhatsapp(true);
  }, [formData?.localno, formData?.whatsappno]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.id === "username") {
      setFormData({
        ...formData,
        [e.target.id]: value.replace(/\s+/g, "").toLowerCase(),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: value,
      });
    }
  };

  const handleCheckboxChange = () => {
    setHideWhatsapp(!hideWhatsapp);
    if (!hideWhatsapp) {
      setFormData({
        ...formData,
        whatsappno: formData.localno,
      });
    } else {
      setFormData({
        ...formData,
        whatsappno: formData.whatsappno,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 space-y-6"
    >
      <div className="flex flex-col items-center">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser?.avatar}
          alt="Profile"
          className="rounded-full h-32 w-32 object-cover cursor-pointer mb-4 border-4 border-gray-300"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="fullname"
            className="block text-gray-500 text-sm font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullname}
            id="fullname"
            className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-gray-500 text-sm font-medium mb-1"
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            id="username"
            className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-gray-500 text-sm font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            id="email"
            className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
            onChange={handleChange}
          />
        </div>

        <div className="">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="facebook"
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                Local No
              </label>
              <input
                type="text"
                placeholder="Local Number"
                value={formData.localno}
                id="localno"
                className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="whatsappno"
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                Whatsapp No
              </label>
              <input
                type="text"
                placeholder="WhatsApp Number"
                value={hideWhatsapp ? formData.localno : formData.whatsappno}
                id="whatsappno"
                className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                onChange={handleChange}
                disabled={hideWhatsapp}
              />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="hideWhatsapp"
              checked={hideWhatsapp}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="hideWhatsapp" className="text-gray-600 text-sm">
              WhatsApp Number, Same as Local No
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex-1">
            <label
              htmlFor="facebook"
              className="block text-gray-500 text-sm font-medium mb-1"
            >
              Facebook
            </label>
            <input
              type="text"
              placeholder="Facebook URL"
              id="facebook"
              className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
              value={formData.facebook}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="linkedin"
              className="block text-gray-500 text-sm font-medium mb-1"
            >
              Linkedin
            </label>
            <input
              type="text"
              placeholder="LinkedIn URL"
              id="linkedin"
              className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="instagram"
              className="block text-gray-500 text-sm font-medium mb-1"
            >
              Instagram
            </label>
            <input
              type="text"
              placeholder="Instagram URL"
              id="instagram"
              className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer hover:text-red-800"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          className="text-red-700 cursor-pointer hover:text-red-800"
          onClick={handleSignoutUser}
        >
          Sign out
        </span>
      </div>
    </form>
  );
};

export default ProfileForm;
