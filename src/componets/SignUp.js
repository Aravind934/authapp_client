import { Container, Button } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import Input from "./Forms/Input";
import { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import * as yup from "yup";
import CheckButtons from "./Forms/CheckButtons";
import TextError from "./TextError";
import { useMutation } from "@apollo/client";
import { REGISTER, VALIDATETOKEN } from "../graphql/Mutations";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { UserContext } from "../context/userContext";
import GoogleButton from "./GoogleButton";
function SignUp() {
    let [register] = useMutation(REGISTER);
    let userContext = useContext(UserContext);
    let [validateToken] = useMutation(VALIDATETOKEN);
    let [isHuman, setIsHuman] = useState(false);
    let navigate = useNavigate();
    const validationSchema = yup.object({
        username: yup.string().required("required"),
        email: yup.string().email("invalid email!").required("required"),
        gender: yup.string().required("required"),
        phone: yup
            .string()
            .required("required")
            .length(10, "invalid phone number!"),
        password: yup.string().required("required!").min(4),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match"),
    });
    const initialValues = {
        username: "",
        email: "",
        password: "",
        gender: "",
        phone: "",
        confirmPassword: "",
    };
    const submit = async (values) => {
        try {
            let {
                data: {
                    register: { success, message, user },
                },
            } = await register({ variables: values });
            if (!success) throw new Error(message);
            toast.success(message);
            localStorage.setItem("username", user?.username);
            localStorage.setItem("profile", user?.profile);
            userContext.setUser(user);
            navigate("/profile");
        } catch (err) {
            toast.error(err.message);
        }
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
                        <h6 className="mb-3">SIGN UP</h6>
                        <Form.Group className="mb-3">
                            <Field
                                name="username"
                                placeholder="Enter username"
                                component={Input}
                                label="Username"
                                type="text"
                            />
                            <ErrorMessage
                                component={TextError}
                                name="username"
                            />
                        </Form.Group>
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
                                name="phone"
                                placeholder="Enter phone number"
                                component={Input}
                                label="Phone"
                                type="text"
                            />
                            <ErrorMessage component={TextError} name="phone" />
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
                                name="confirmPassword"
                                placeholder="Re enter password"
                                component={Input}
                                label="Confirm password"
                                type="password"
                            />
                            <ErrorMessage
                                component={TextError}
                                name="confirmPassword"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Field
                                name="gender"
                                component={CheckButtons}
                                type="radio"
                                options={["Male", "Female"]}
                            />
                            <ErrorMessage component={TextError} name="gender" />
                        </Form.Group>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_SITE_KEY}
                            onChange={onChange}
                        />
                        <div className="d-grid gap-2 mb-4 mt-2">
                            <Button
                                type="submit"
                                className="submitBtn"
                                disabled={!formik.isValid || !isHuman}
                            >
                                Submit
                            </Button>
                        </div>
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

export default SignUp;
