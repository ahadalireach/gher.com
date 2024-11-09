import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  const { currentAdmin } = useSelector((state) => state.admin);

  if (!currentAdmin) {
    return <Navigate to="/admin-signin" />;
  }

  return <Outlet />;
};

export default AdminRoute;
