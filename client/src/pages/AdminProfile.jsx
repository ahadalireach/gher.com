import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  adminSignoutStart,
  adminSignoutSuccess,
  adminSignoutFailure,
  updateAdminStart,
  updateAdminSuccess,
  updateAdminFailure,
} from "../redux/slices/adminSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const AdminProfile = () => {
  const { currentAdmin, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: currentAdmin.fullname,
    username: currentAdmin.username,
    email: currentAdmin.email,
    avatar: currentAdmin.avatar,
  });
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const fileRef = useRef(null);

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
            setFormData({ ...formData, avatar: downloadURL });
            toast.success("Image uploaded to cloud successfully!");
          })
          .catch((error) => {
            toast.error("Failed to get image URL. Please try again.");
          });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
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
      dispatch(updateAdminStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update/${currentAdmin._id}`,
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
      if (data.success === false) {
        dispatch(updateAdminFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(updateAdminSuccess(data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(updateAdminFailure(error.message));
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleSignoutAdmin = async () => {
    dispatch(adminSignoutStart());
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/signout`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);

      if (!res.ok) {
        const errorData = await res.json();
        dispatch(adminSignoutFailure(errorData.message));
        toast.error(errorData.message || "Failed to sign out");
        return;
      }

      const data = await res.json();

      if (!data.success) {
        dispatch(adminSignoutFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(adminSignoutSuccess());
      navigate("/");
      toast.success("Signed out successfully!");
    } catch (error) {
      dispatch(adminSignoutFailure(error.message));
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        Admin Profile
      </h1>
      <form
        className="bg-white shadow-lg rounded-lg p-8 space-y-6"
        onSubmit={handleSubmit}
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
            src={formData.avatar || currentAdmin.avatar}
            alt="Profile"
            className="rounded-full h-32 w-32 object-cover cursor-pointer mb-4 border-4 border-gray-300"
          />
          {filePerc > 0 && filePerc < 100 && (
            <span className="text-gray-700 text-xs">Uploading {filePerc}%</span>
          )}
        </div>
        <div className="flex flex-col gap-6">
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

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none font-semibold"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          <Link to="/admin-dashboard" className="w-full">
            <button className="w-full bg-green-700 text-white py-3 rounded-lg transform hover:bg-green-800 focus:outline-none font-semibold">
              Admin Dashboard
            </button>
          </Link>

          <div className="flex justify-center">
            <span
              className="text-red-700 cursor-pointer hover:text-red-800"
              onClick={handleSignoutAdmin}
            >
              Sign out
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
