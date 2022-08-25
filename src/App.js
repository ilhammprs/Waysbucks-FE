import {Route, Routes, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import Page from "./pages/Landing";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct"
import AddToping from "./pages/AddToping";
import Transaction from "./pages/Transaction";
import { API, setAuthToken } from "../src/components/config/api";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/useContext";


if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  let navigate = useNavigate();

  // Init user context 
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    // Redirect Auth
    if (state.isLogin === false) {
      navigate('/');
    } else {
      if (state.user.status === 'admin') {
        navigate('/transaction');
      } else if (state.user.status === 'customer') {
        navigate('/');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/log-check');

      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.token = localStorage.token;

      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
    }
  };

  useEffect(() => {
    if (localStorage.token)
    checkUser();
  }, []);

  return (
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/add-toping" element={<AddToping />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
  );
}

export default App;
