/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { app } from "../firebase";

const FileUpload = ({ formData, onFileUploaded }) => {
  const [filePerc, setFilePerc] = useState(null);
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  // ********* Handle File Upload ********* //
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
      () => {
        toast.error("Error uploading image. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            onFileUploaded(downloadURL);
            toast.success("Image uploaded to cloud successfully!");
          })
          .catch(() => {
            toast.error("Failed to get image URL. Please try again.");
          });
      }
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        onChange={handleFileChange}
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
      {filePerc > 0 && filePerc < 100 && (
        <span className="text-gray-700 text-xs">Uploading {filePerc}%</span>
      )}
    </div>
  );
};

export default FileUpload;
