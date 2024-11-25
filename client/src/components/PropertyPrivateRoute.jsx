import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const PropertyPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentAdmin } = useSelector((state) => state.admin);

  if (!currentUser?.isUpdated && !currentAdmin) {
    toast.error(
      "Please update your complete profile before selling your property."
    );
    return <Navigate to="/profile" />;
  }

  return <Outlet />;
};

export default PropertyPrivateRoute;
