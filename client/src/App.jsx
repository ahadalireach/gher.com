import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  About,
  SellProperty,
  Home,
  Profile,
  Property,
  Properties,
  SignIn,
  SignUp,
  UpdateProperty,
  AdminSignIn,
  AdminDashboard,
  ProfileInfo,
  Contact,
  AdminProfile,
  UserProfileUpdate,
  NotFound,
  UserPropertyUpdate,
} from "./pages";
import {
  Header,
  Footer,
  PrivateRoute,
  AdminRoute,
  PropertyPrivateRoute,
} from "./components";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/property/:id" element={<Property />} />
        <Route path="/properties" element={<Properties />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route element={<PropertyPrivateRoute />}>
            <Route path="/sell-property" element={<SellProperty />} />
          </Route>
          <Route path="/update-property/:id" element={<UpdateProperty />} />
        </Route>
        <Route path="/admin-signin" element={<AdminSignIn />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route
            path="/admin/user-profile/update/:id"
            element={<UserProfileUpdate />}
          />
          <Route path="/admin/user-profile/:id" element={<ProfileInfo />} />
          <Route
            path="/admin/user-property/update/:id"
            element={<UserPropertyUpdate />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2500} />
    </>
  );
};

export default App;
