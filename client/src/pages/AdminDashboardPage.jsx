import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Error deleting user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl border border-green-300">
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="relative border border-gray-300 p-6 flex flex-col items-center space-y-4 bg-white rounded-lg shadow-lg"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="User"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
                />
                <h1 className="text-2xl font-semibold text-gray-800">
                  {user.fullname}
                </h1>
                <p className="text-gray-600">
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:text-green-600 transition-colors"
                  >
                    {user.email}
                  </a>
                </p>

                <div className="flex flex-col gap-4 w-full">
                  <div className="flex gap-4 w-full">
                    <Link
                      to={`/admin/user-profile/update/${user._id}`}
                      className="w-full"
                    >
                      <button className="w-full text-green-700 hover:bg-green-100 px-4 py-2 rounded-md text-sm transition-colors  border border-green-700">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-700 hover:bg-red-100 px-4 py-2 rounded-md text-sm transition-colors  border border-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <Link
                    to={`/admin/user-profile/${user._id}`}
                    className="w-full bg-green-700 text-white text-center border-2 border-green-700 py-2 px-4 rounded-lg hover:bg-green-800 hover:border-green-800 transition-colors duration-300 font-semibold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
