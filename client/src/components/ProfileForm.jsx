/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FileUpload } from ".";
import { Link } from "react-router-dom";

const ProfileForm = ({
  onSubmit,
  initialFormData,
  handleSignoutUser,
  handleDeleteUser,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [hideWhatsapp, setHideWhatsapp] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (initialFormData) setFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    if (formData?.localno === formData?.whatsappno) {
      setHideWhatsapp(true);
    } else {
      setHideWhatsapp(false);
    }
  }, [formData?.localno, formData?.whatsappno]);

  // ********* Handle Form Changes ********* //
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setHideWhatsapp(e.target.checked);
  };

  // ********* Handle Form Submit ********* //
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleFileUploaded = (downloadURL) => {
    setFormData({ ...formData, avatar: downloadURL });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg sm:rounded-lg p-8 mb-8"
    >
      <FileUpload
        formData={formData}
        setFormData={setFormData}
        onFileUploaded={handleFileUploaded}
      />

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-500 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullname}
            id="fullname"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-500 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            id="username"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-500 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            id="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label
              htmlFor="localno"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Local No
            </label>
            <input
              type="text"
              placeholder="Local Number"
              value={formData.localno}
              id="localno"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="whatsappno"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Whatsapp No
            </label>
            <input
              type="text"
              placeholder="WhatsApp Number"
              value={hideWhatsapp ? formData.localno : formData.whatsappno}
              id="whatsappno"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
              onChange={handleChange}
              disabled={hideWhatsapp}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hideWhatsapp"
            checked={hideWhatsapp}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="hideWhatsapp" className="text-sm text-gray-600">
            WhatsApp Number, Same as Local No
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Facebook
            </label>
            <input
              type="text"
              placeholder="Facebook username"
              id="facebook"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
              value={formData.facebook}
              onChange={handleChange}
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Linkedin
            </label>
            <input
              type="text"
              placeholder="Linkedin username"
              id="linkedin"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Instagram
            </label>
            <input
              type="text"
              placeholder="Instagram username"
              id="instagram"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-green-700"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-green-600 text-white py-3 mt-7 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

      <button
        type="button"
        className="w-full bg-green-600 text-white py-3 mt-3 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
      >
        <Link to="/sell-property" className="block w-full h-full">
          Sell Property
        </Link>
      </button>

      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer hover:text-red-800"
          onClick={handleDeleteConfirmation}
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

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white m-5 sm:rounded-lg shadow-lg max-w-md w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="sm:text-lg font-semibold text-gray-700 text-center">
                  Are you sure you want to delete your account?
                </h2>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    handleDeleteUser();
                    setShowDeleteConfirmation(false);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
