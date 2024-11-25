import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  ConfirmationModal,
  Loader,
  SomethingWrong,
  UserCard,
} from "../components";

const AdminDashboard = () => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [users, setUsers] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ********* Fetch Users ********* //
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/view-users`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setIsError(true);
        toast.error(data.message || "Failed to fetch users");
        return;
      }
      setUsers(data);
    } catch (error) {
      setIsError(true);
      toast.error("Error connecting to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ********* Handle User Deletion ********* //
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Failed to delete user");
        return;
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User  deleted successfully.");
    } catch (error) {
      toast.error("Error deleting user.");
    }
  };

  // ********* Handle Delete Confirmation ********* //
  const handleDeleteConfirmation = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      handleDeleteUser(selectedUserId);
    }
    setShowDeleteConfirmation(false);
    setSelectedUserId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSelectedUserId(null);
  };

  // ********* Fetch Users on Component Mount ********* //
  useEffect(() => {
    fetchUsers();
  }, []);

  // ********* Render Loading or Error State ********* //
  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <SomethingWrong
        title="Oops!"
        subtitle="Something went wrong while fetching users."
        description="Sorry, we failed to connect to the server. Please try again later."
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl border border-green-300">
        {users.length === 0 ? (
          <p className="text-center text-lg sm:text-xl text-gray-800 bg-blue-50 p-6 rounded-lg shadow-xl border-2 border-blue-200">
            Oops! We couldn’t find any users. Please try again later.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                handleDeleteUser={handleDeleteConfirmation}
              />
            ))}
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Are you sure you want to delete this account?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AdminDashboard;
