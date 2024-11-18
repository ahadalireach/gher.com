/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please sign in to access this page.");
    }
  }, []);

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default UserPrivateRoute;
