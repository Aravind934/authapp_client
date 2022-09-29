import { Container, Button } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import Input from "./Forms/Input";
import { Form } from "react-bootstrap";
import * as yup from "yup";
import CheckButtons from "./Forms/CheckButtons";
import TextError from "./TextError";
import ReCAPTCHA from "react-google-recaptcha";
import { useMutation } from "@apollo/client";
import { useState, useEffect, useContext } from "react";
import { LOGIN, VALIDATETOKEN } from "../graphql/Mutations";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import GoogleButton from "./GoogleButton";
function SignIn() {
    let [validateToken] = useMutation(VALIDATETOKEN);
    let userContext = useContext(UserContext);
    let [login] = useMutation(LOGIN);
    let navigate = useNavigate();
    let [isHuman, setIsHuman] = useState(false);
    const validationSchema = yup.object({
        email: yup.string().email("invalid email!").required("required"),
        password: yup.string().required("required!").min(4),
    });
    const initialValues = {
        email: "",
        password: "",
        rememberMe: false,
    };
    const submit = (values) => {
        login({ variables: values }).then(({ data: { login: res } }) => {
            if (!res.success) {
                toast.error(res.message);
                return null;
            }
            toast.success(res.message);
            localStorage.setItem("username", res?.user?.username);
            localStorage.setItem("profile", res?.user?.profile);
            userContext.setUser(res?.user);
            navigate("/profile");
        });
    };
    const onChange = (values) => {
        validateToken({ variables: { token: values } }).then(
            ({ data: { validToken } }) => {
                if (!validToken.success) toast.error("You can't cheat us bot");
                setIsHuman(validToken.success);
            }
        );
    };

    useEffect(() => {
        return () => setIsHuman(false);
    }, []);

    return (
        <Container className="formContainer">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submit}
            >
                {(formik) => (
                    <FormikForm className="form shadow border rounded mb-5">
                        <h6 className="mb-3">SIGN IN</h6>
                        <Form.Group className="mb-3">
                            <Field
                                name="email"
                                placeholder="Enter email"
                                component={Input}
                                label="Email"
                                type="text"
                            />
                            <ErrorMessage component={TextError} name="email" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                name="password"
                                placeholder="Enter password"
                                component={Input}
                                label="Password"
                                type="password"
                            />
                            <ErrorMessage
                                component={TextError}
                                name="password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                name="rememberMe"
                                component={CheckButtons}
                                type="checkbox"
                                options={["rememberMe"]}
                                label="Remember me?"
                            />
                        </Form.Group>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_SITE_KEY}
                            onChange={onChange}
                        />
                        <div className="d-grid gap-2 mt-2">
                            <Button
                                type="submit"
                                className="submitBtn"
                                disabled={!formik.isValid || !isHuman}
                            >
                                Submit
                            </Button>
                        </div>
                        <p
                            className="text-secondary text-decoration-none text-end mt-2 forgotPass"
                            onClick={() => navigate("/forgotPassword")}
                        >
                            Forgot Password?
                        </p>
                        <div className="position-relative orParent">
                            <hr />
                            <div className="or border">OR</div>
                        </div>
                        <Form.Group className="mt-3 text-center">
                            <GoogleButton />
                        </Form.Group>
                    </FormikForm>
                )}
            </Formik>
        </Container>
    );
}

export default SignIn;
