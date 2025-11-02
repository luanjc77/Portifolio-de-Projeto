import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import WelcomePage from "./Pages/Welcome";
import StartPage from "./Pages/Start";
import RegisterPage from "./Pages/Register"; 
import LoginPage from "./Pages/Login";
import UserPage from "./Pages/User";
import DeepWebPage from "Pages/DeepWeb";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<WelcomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route> 
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/inicio" element={<StartPage />}></Route>
          <Route path="/deep-web" element={<DeepWebPage />}></Route>
      <Route path="/home" element={<HomePage />}></Route>
      <Route path="/user" element={<UserPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;