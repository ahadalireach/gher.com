import { Routes, Route } from "react-router-dom";
import { UserSignUp, UserSignIn, UserProfile } from "./pages";
import { ToastContainer } from "react-toastify";
import { UserPrivateRoute } from "./components";

const App = () => {
  return (
    <>
      <Routes>
        {/*************** Global Pages **************/}
        <Route path="/sign-up" element={<UserSignUp />} />
        <Route path="/sign-in" element={<UserSignIn />} />

        {/********* User Related Pages **************/}
        <Route element={<UserPrivateRoute />}>
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>

      <ToastContainer position="bottom-right" autoClose={2500} />
    </>
  );
};

export default App;
