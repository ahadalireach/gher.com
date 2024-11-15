/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

const UserProfileUpdate = () => {
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    localno: "",
    whatsappno: "",
  });
  const [hideWhatsapp, setHideWhatsapp] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user-profile/${id}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setFormData(data);
    } catch (error) {
      toast.error("Something went wrong, please try again later!");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id, navigate]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        toast.error("Error uploading image. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData((prevData) => ({ ...prevData, avatar: downloadURL }));
            toast.success("Image uploaded successfully!");
          })
          .catch(() => {
            toast.error("Failed to get image URL. Please try again.");
          });
      }
    );
  };

  useEffect(() => {
    if (formData?.localno === formData?.whatsappno) setHideWhatsapp(true);
  }, []);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleCheckboxChange = () => {
    setHideWhatsapp((prev) => {
      const newHideWhatsapp = !prev;
      setFormData((prevData) => ({
        ...prevData,
        whatsappno: newHideWhatsapp ? prevData.localno : prevData.whatsappno,
      }));
      return newHideWhatsapp;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      whatsappno: hideWhatsapp ? formData.localno : formData.whatsappno,
    };

    const countryCodePattern = /^\+\d+/;
    if (
      updatedFormData.localno &&
      !countryCodePattern.test(updatedFormData.localno)
    ) {
      toast.error("Please enter a valid country code for the local number.");
      return;
    }

    if (
      updatedFormData.whatsappno &&
      !countryCodePattern.test(updatedFormData.whatsappno)
    ) {
      toast.error("Please enter a valid country code for the WhatsApp number.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("Profile updated successfully!");
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        Update Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <div className="flex flex-col items-center">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            src={formData.avatar || "/default-avatar.png"}
            alt="Profile"
            className="rounded-full h-32 w-32 object-cover cursor-pointer mb-4 border-4 border-gray-300"
            onClick={() => fileRef.current.click()}
          />
          {filePerc > 0 && filePerc < 100 && (
            <span className="text-gray-700 text-xs">Uploading {filePerc}%</span>
          )}
        </div>
        <div className="space-y-4">
          {["fullname", "username", "email"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                id={field}
                placeholder={`Enter ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
                value={formData[field]}
                className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="localno"
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                Local No
              </label>
              <input
                type="text"
                id="localno"
                placeholder="Enter Local Number"
                value={formData.localno}
                className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="whatsappno"
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                WhatsApp No
              </label>
              <input
                type="text"
                id="whatsappno"
                placeholder="Enter WhatsApp Number"
                value={hideWhatsapp ? formData.localno : formData.whatsappno}
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
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {["facebook", "linkedin", "instagram"].map((field) => (
              <div key={field} className="flex-1">
                <label
                  htmlFor={field}
                  className="block text-gray-500 text-sm font-medium mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  id={field}
                  placeholder={`${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  } URL`}
                  value={formData[field]}
                  className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfileUpdate;
