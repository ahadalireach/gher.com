/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentAdmin } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!currentUser && !currentAdmin) {
      toast.error("Please sign in to access this page.");
    }
  }, []);

  if (!currentUser && !currentAdmin) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default UserPrivateRoute;
