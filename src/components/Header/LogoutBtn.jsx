import { useDispatch } from "react-redux";
import authService from "../../services/authService";
import { logout } from "../../store/authSlice";


function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
     
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <button
      className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full hover:text-black"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
