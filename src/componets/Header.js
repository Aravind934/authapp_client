import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../graphql/Mutations";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";

function Header() {
    let [logoutUser] = useMutation(LOGOUT);
    let { user, setUser } = useContext(UserContext);
    let navigate = useNavigate();
    useEffect(() => {
        let user = {};
        user.username = localStorage.getItem("username");
        user.profile = localStorage.getItem("profile");
        user.username && setUser(user);
    }, [setUser]);

    const logout = () => {
        try {
            logoutUser().then(({ data: { logout: res } }) => {
                if (!res.success) throw new Error(res.message);
                toast.success(res.message);
                localStorage.removeItem("username");
                localStorage.removeItem("profile");
                setUser(null);
                navigate("/signIn");
            });
            // setUser(null);
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home" className="brand">
                    Auth app
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    className="toggleBtn"
                />
                <Navbar.Collapse id="responsive-navbar-nav" className="mr-5">
                    <Nav className="ms-auto nav">
                        {user && (
                            <NavLink to="/profile" className="nav-link">
                                Profile
                            </NavLink>
                        )}
                        {!user && (
                            <NavLink to="/signUp" className="nav-link">
                                Signup
                            </NavLink>
                        )}
                        {!user && (
                            <NavLink to="/signIn" className="nav-link">
                                Signin
                            </NavLink>
                        )}
                        {user && (
                            <button
                                className="logout nav-link"
                                onClick={logout}
                            >
                                logout
                            </button>
                        )}
                        {user && (
                            <img
                                src={user.profile}
                                alt="help"
                                className="avatar"
                            />
                        )}
                        {user && (
                            <span className="text-secondary mt-2" disabled>
                                {user.username}
                            </span>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
