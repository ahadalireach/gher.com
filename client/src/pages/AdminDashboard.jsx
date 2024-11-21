import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader, SomethingWrong, UserCard } from "../components";

const AdminDashboard = () => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [users, setUsers] = useState([]);

  // ********* Fetch All Users ********* //
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/view-users`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      setUsers(data);
    } catch (error) {
      setLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
