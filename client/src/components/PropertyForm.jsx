/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { toast } from "react-toastify";

const PropertyForm = ({ initialFormData, onSubmit }) => {
  const [formData, setFormData] = useState(
    initialFormData || {
      imageUrls: [],
      title: "",
      description: "",
      area: "",
      address: "",
      type: "house",
      purpose: "rent",
      floors: 1,
      bedrooms: 1,
      bathrooms: 1,
      kitchens: 1,
      regularPrice: 0,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
      school: false,
      hospital: false,
      shoppingMalls: false,
      publicTransport: false,
      restaurants: false,
      playarea: false,
      internet: false,
      gym: false,
      pool: false,
      communityCenter: false,
    }
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (initialFormData) setFormData(initialFormData);
  }, [initialFormData]);

  // ********* Store Image to Firebase ********* //
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  // ********* Handle Image Upload Submissin ********* //
  const handleImageSubmit = () => {
    if (files.length > 6 || files.length + formData.imageUrls.length > 6) {
      toast.error("Maximum 6 images can be uploaded.");
      return;
    }

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploadLoading(true);
      const promises = [];
      for (var i = 0; i < files.length; i++)
        promises.push(storeImage(files[i]));

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploadLoading(false);
          toast.success(
            `Image${files.length > 1 ? "s" : ""} uploaded successfully.`
          );
          setFiles([]);
        })
        .catch(() => {
          setUploadLoading(false);
          toast.error("Please select images smaller than 2 MB.");
        });
    } else {
      if (files.length > 6) {
        toast.error("Maximum 6 images can be uploaded.");
        return;
      }
      if (files.length === 0 && formData.imageUrls.length === 0) {
        toast.error("Please select at least one image.");
        return;
      }
      setUploadLoading(false);
    }
  };

  // ********* Remove Image ********* //
  const handleImageRemove = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
    toast.info("Image removed successfully.");
  };

  // ********* Handle Property Input Change ********* //
  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === "sell" || id === "rent") {
      setFormData((prev) => ({ ...prev, purpose: id }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // ********* Submit Property Creation ********* //
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      await onSubmit(formData);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-700 my-6">
        Create Property
      </h1>
      <form
        className="flex flex-col bg-white shadow-lg rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-1 flex-col gap-6">
            <input
              onChange={handleChange}
              value={formData.title}
              type="text"
              placeholder="Title"
              className="border rounded-lg p-4 w-full border-gray-300 outline-none focus:border-green-700"
              id="title"
              maxLength="100"
              minLength="10"
              required
            />
            <textarea
              onChange={handleChange}
              value={formData.description}
              placeholder="Description"
              className="border rounded-lg p-4 w-full border-gray-300 outline-none focus:border-green-700"
              id="description"
              required
              rows={3}
            />
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <input
                onChange={handleChange}
                value={formData.area}
                type="text"
                placeholder="Area"
                className="w-full border rounded-lg p-4 border-gray-300 outline-none focus:border-green-700"
                id="area"
                required
              />
              <input
                onChange={handleChange}
                value={formData.address}
                type="text"
                placeholder="Address"
                className="w-full border rounded-lg p-4 border-gray-300 outline-none focus:border-green-700"
                id="address"
                required
              />
            </div>
            <div>
              <select
                className="border rounded-lg p-4 w-full border-gray-300 outline-none focus:border-green-700"
                onChange={handleChange}
                value={formData.type}
                id="type"
                required
              >
                <option value="house">House</option>
                <option value="flat">Flat</option>
                <option value="farmHouse">Farm House</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                {
                  label: "Sell",
                  id: "sell",
                  checked: formData.purpose === "sell",
                },
                {
                  label: "Rent",
                  id: "rent",
                  checked: formData.purpose === "rent",
                },
                {
                  label: "Parking Spot",
                  id: "parking",
                  checked: formData.parking,
                },
                {
                  label: "Furnished",
                  id: "furnished",
                  checked: formData.furnished,
                },
                { label: "Offer", id: "offer", checked: formData.offer },
              ].map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-600 checked:border-transparent focus:outline-none"
                    onChange={handleChange}
                    checked={option.checked}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-semibold cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <h5 className="font-normal text-gray-500">Nearby:</h5>
              {[
                { label: "School", id: "school", checked: formData.school },
                {
                  label: "Hospital",
                  id: "hospital",
                  checked: formData.hospital,
                },
                {
                  label: "Shopping Malls",
                  id: "shoppingMalls",
                  checked: formData.shoppingMalls,
                },
                {
                  label: "Public Transport",
                  id: "publicTransport",
                  checked: formData.publicTransport,
                },
                {
                  label: "Restaurants",
                  id: "restaurants",
                  checked: formData.restaurants,
                },
                {
                  label: "Internet",
                  id: "internet",
                  checked: formData.internet,
                },
                {
                  label: "Play Area",
                  id: "playarea",
                  checked: formData.playarea,
                },
                { label: "Gym", id: "gym", checked: formData.gym },
                { label: "Pool", id: "pool", checked: formData.pool },
                {
                  label: "Community Center",
                  id: "communityCenter",
                  checked: formData.communityCenter,
                },
              ].map((option) => (
                <div key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    className="hidden peer"
                    onChange={handleChange}
                    checked={option.checked}
                  />
                  <label
                    htmlFor={option.id}
                    className="peer-checked:bg-green-600 peer-checked:text-white px-4 py-2 rounded-lg border border-gray-300 cursor-pointer transition-all"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                {
                  label: "Floors",
                  id: "floors",
                  value: formData.floors,
                  min: 1,
                  max: 10,
                },
                {
                  label: "Beds",
                  id: "bedrooms",
                  value: formData.bedrooms,
                  min: 1,
                  max: 10,
                },
                {
                  label: "Baths",
                  id: "bathrooms",
                  value: formData.bathrooms,
                  min: 1,
                  max: 10,
                },
                {
                  label: "Kitchens",
                  id: "kitchens",
                  value: formData.kitchens,
                  min: 1,
                  max: 10,
                },
              ].map((input) => (
                <div key={input.id} className="flex items-center gap-2">
                  <input
                    type="number"
                    id={input.id}
                    value={input.value}
                    onChange={handleChange}
                    min={input.min}
                    max={input.max}
                    required
                    className="border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700 w-24"
                  />
                  <p className="text-sm font-semibold">{input.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-6 sm:gap-10 flex-col md:flex-row">
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formData.regularPrice}
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  required
                  className="border rounded-lg p-4 border-gray-300 outline-none focus:border-green-700 w-fit"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">Regular price</p>
                  <p className="text-xs text-gray-500">
                    {formData.purpose === "rent" ? "₨ / Month" : "₨"}
                  </p>
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    onChange={handleChange}
                    value={formData.discountPrice}
                    type="number"
                    id="discountPrice"
                    min="50"
                    max="10000000"
                    required
                    className="border rounded-lg p-4 border-gray-300 outline-none focus:border-green-700 w-fit"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">Discount price</p>
                    <p className="text-xs text-gray-500">
                      {formData.purpose === "rent" ? "₨ / Month" : "₨"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">Upload Images</h3>
              <p className="text-sm text-gray-500">
                The first image will be the cover (max 6 images).
              </p>
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                accept=".jpg,.png,.jpeg"
                multiple
                className="border-2 border-dashed p-4 rounded-lg text-gray-700 focus:border-green-600"
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                className="mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={uploadLoading}
              >
                {uploadLoading
                  ? "Uploading..."
                  : files.length === 1
                  ? "Upload Image"
                  : "Upload Images"}
              </button>
            </div>
            <div className="flex flex-wrap gap-5">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-28 h-24 sm:w-24 sm:h-20 border-2 border-gray-300 rounded-lg overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="w-28 h-24 sm:w-24 sm:h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-1 right-1 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitLoading}
          className={`w-full py-3 rounded-lg text-white sm:mt-6 font-semibold ${
            submitLoading
              ? "bg-green-700 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {submitLoading ? "Submitting..." : "Sell Property"}
        </button>
      </form>
    </main>
  );
};

export default PropertyForm;
