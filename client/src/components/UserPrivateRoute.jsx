/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please sign in to sell your property!");
    }
  }, []);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default UserPrivateRoute;
