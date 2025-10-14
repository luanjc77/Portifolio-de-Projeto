import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import WelcomePage from "./Pages/Welcome";
import JourneyStartPage from "./Pages/JourneyStart";
import RegisterPage from "./Pages/Register"; 
import LoginPage from "./Pages/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<WelcomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route> 
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/jornada" element={<JourneyStartPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;