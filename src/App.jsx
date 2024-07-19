import { useState, useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { Footer, Header ,GotoTop  } from "./components";
import { Outlet } from "react-router-dom";
import authService from "./services/authService";


function App() {
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return !loading ? (
    <>
      
      <Header />
      <div className="content-between bg-white">
        <div className="w-full block">
          <main>
            <Outlet />
          </main>{
            authStatus &&(

              <GotoTop/>
            )
          }
          <Footer />
        </div>
      </div>
    </>
  ) : null;
}

export default App;
