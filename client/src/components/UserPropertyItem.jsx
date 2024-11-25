/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmationModal } from ".";

const UserPropertyItem = ({
  property,
  isSmallScreen,
  handleDeleteProperty,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteProperty(property._id);
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  return (
    <>
      <div
        key={property._id}
        className="border border-gray-300 rounded-lg shadow-md p-1 sm:p-4 flex flex-row justify-between items-center gap-1 sm:gap-4 bg-white transition-transform transform hover:shadow-xl"
      >
        <Link to={`/property/${property._id}`} className="flex-shrink-0">
          <img
            src={property.imageUrls[0]}
            alt="property cover"
            className="h-11 w-11 sm:h-16 sm:w-16 object-cover rounded-md border border-gray-200"
          />
        </Link>
        <div className="flex flex-row justify-between w-full items-center gap-1 sm:gap-4">
          <div className="flex-1">
            <Link
              to={`/property/${property._id}`}
              className="text-gray-800 hover:text-green-700 font-semibold text-sm sm:text-lg transition-colors truncate"
            >
              {isSmallScreen
                ? property.title.length > 12
                  ? `${property.title.substr(0, 12)}...`
                  : property.title
                : property.title.length > 50
                ? `${property.title.substr(0, 50)}...`
                : property.title}
            </Link>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <Link to={`/update-property/${property._id}`}>
            <button className="text-green-700 hover:bg-green-100 px-1 py-2 sm:p-2 rounded-md border border-green-700 text-sm transition-colors">
              Edit
            </button>
          </Link>
          <button
            onClick={handleDeleteConfirmation}
            className="text-red-700 hover:bg-red-100 px-1 py-2 sm:p-2 rounded-md border border-red-700 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Are you sure you want to delete this property?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default UserPropertyItem;
