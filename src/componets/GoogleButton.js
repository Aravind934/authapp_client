import React, { useContext, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";
import { useMutation } from "@apollo/client";
import { SIGUP_WITH_GOOGLE } from "../graphql/Mutations";
import { useNavigate } from "react-router-dom";

function GoogleButton() {
    let [registerWithGoogle] = useMutation(SIGUP_WITH_GOOGLE);
    let userContext = useContext(UserContext);
    let navigate = useNavigate();
    const clientId =
        "https://558511611530-dfka7on3ivq9l1pduuo800lrr1o4t4ig.apps.googleusercontent.com/";
    const responseGoogle = ({
        profileObj: {
            email,
            givenName: username,
            googleId: id,
            imageUrl: profile,
        },
    }) => {
        try {
            registerWithGoogle({
                variables: { username, email, id, profile },
            }).then(({ data: { registerWithGoogle: res } }) => {
                if (!res.success) return toast.error(res.message);
                toast.success(res.message);
                localStorage.setItem("username", res?.user?.username);
                localStorage.setItem("profile", res?.user?.profile);
                userContext.setUser(res?.user);
                navigate("/profile");
            });
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: "",
            });
        };
        gapi.load("client:auth2", initClient);
    }, []);

    return (
        <div>
            <GoogleLogin
                clientId="558511611530-dfka7on3ivq9l1pduuo800lrr1o4t4ig.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
            />
        </div>
    );
}

export default GoogleButton;
