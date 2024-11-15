/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  SellPropertyPage,
  AboutPage,
  PropertyInfoPage,
  PropertiesPage,
  UserSignUpPage,
  UserSignInPage,
  UpdatePropertyPage,
  AdminSignInPage,
  AdminDashboardPage,
  ProfileInfo,
  ContactPage,
  AdminProfilePage,
  UserProfileUpdate,
  NotFoundPage,
  UserPropertyUpdate,
  UserProfilePage,
} from "./pages";
import {
  Header,
  Footer,
  UserPrivateRoute,
  AdminPrivateRoute,
  PropertyPrivateRoute,
} from "./components";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/sign-up" element={<UserSignUpPage />} />
        <Route path="/sign-in" element={<UserSignInPage />} />

        <Route path="/property/:id" element={<PropertyInfoPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route element={<UserPrivateRoute />}>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route element={<PropertyPrivateRoute />}>
            <Route path="/sell-property" element={<SellPropertyPage />} />
          </Route>
          <Route path="/update-property/:id" element={<UpdatePropertyPage />} />
        </Route>
        <Route path="/admin-signin" element={<AdminSignInPage />} />

        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin-profile" element={<AdminProfilePage />} />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2500} />
    </>
  );
};

export default App;
