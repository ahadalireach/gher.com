import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signinSuccess } from "../redux/slices/userSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ********* Signin User (OAuth) ********* //
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/google`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: result.user.displayName,
            username: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      navigate("/profile");
      dispatch(signinSuccess(data));
      toast.success("Signin successfully.");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:bg-red-800 font-semibold"
    >
      Continue with Google
    </button>
  );
};
export default OAuth;
