/* eslint-disable react/prop-types */
const ConfirmationModal = ({ isOpen, title, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white m-5 sm:rounded-lg shadow-lg max-w-md w-full">
        <div className="p-8">
          <h2 className="text-center sm:text-lg font-semibold text-gray-700 mb-6">
            {title}
          </h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
