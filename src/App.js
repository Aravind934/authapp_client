import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./componets/Header";
import SignUp from "./componets/SignUp";
import SignIn from "./componets/SignIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./componets/Profile";
import { useState } from "react";
import { UserContext } from "./context/userContext";
import ForgotPassword from "./componets/ForgotPassword";
function App() {
    let [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/signIn" element={<SignIn />} />
                    <Route path="/signIn" element={<Profile />} />
                    <Route
                        path="/profile"
                        element={user?.username ? <Profile /> : <SignIn />}
                    />
                    <Route
                        path="/forgotPassword"
                        element={<ForgotPassword />}
                    />
                    <Route path="*" element={<Profile />} />
                </Routes>
                <ToastContainer theme="colored" />
            </Router>
        </UserContext.Provider>
    );
}

export default App;
