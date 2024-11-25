import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  Home,
  About,
  Contact,
  NotFound,
  UserSignUp,
  UserSignIn,
  AdminSignIn,
  UserProfile,
  SellProperty,
  PropertyInfo,
  UpdateProperty,
  Properties,
  AdminDashboard,
  AdminProfile,
  UserInfo,
  UpdateUser,
} from "./pages";
import {
  AdminPrivateRoute,
  Footer,
  Header,
  PropertyPrivateRoute,
  UserPrivateRoute,
} from "./components";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        {/*************** Global Pages **************/}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-up" element={<UserSignUp />} />
        <Route path="/sign-in" element={<UserSignIn />} />
        <Route path="/admin-signin" element={<AdminSignIn />} />
        <Route path="/property/:id" element={<PropertyInfo />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="*" element={<NotFound />} />

        {/********* User Related Pages **************/}
        <Route element={<UserPrivateRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route element={<PropertyPrivateRoute />}>
            <Route path="/sell-property" element={<SellProperty />} />
            <Route path="/update-property/:id" element={<UpdateProperty />} />
          </Route>
        </Route>

        {/********* Admin Related Pages **************/}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/admin/user-profile/:id" element={<UserInfo />} />
          <Route path="/admin/update-user/:id" element={<UpdateUser />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2500} />
    </>
  );
};

export default App;
