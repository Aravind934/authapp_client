import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import Input from "./Forms/Input";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "../graphql/Mutations";
import { toast } from "react-toastify";

function ForgotPassword() {
    let [forgotPassword] = useMutation(FORGOT_PASSWORD);
    let initialValues = {
        email: "",
        password: "",
        confirmPassword: "",
    };
    let validationSchema = yup.object({
        email: yup.string().email().required("required"),
        password: yup.string().required("required").min(4),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match"),
    });
    let navigate = useNavigate();
    const submit = (values) => {
        try {
            forgotPassword({ variables: values }).then(
                ({ data: { forgotPassword: res } }) => {
                    console.log(res);
                    if (res.success === false) {
                        toast.error(res.message);
                        return null;
                    }
                    toast.success(res.message);
                }
            );
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <Container className="formContainer">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submit}
            >
                {(formik) => (
                    <FormikForm className="form shadow border rounded mb-5">
                        <h6 className="mb-3">FORGOT PASSWORD</h6>
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
                                name="confirmPassword"
                                placeholder="Confirm password"
                                component={Input}
                                label="Confirm password"
                                type="password"
                            />
                            <ErrorMessage
                                component={TextError}
                                name="confirmPassword"
                            />
                        </Form.Group>
                        <div className="d-grid gap-2 mt-2">
                            <Button
                                type="submit"
                                className="submitBtn"
                                disabled={!formik.isValid}
                            >
                                Submit
                            </Button>
                        </div>
                        <div className="mt-2">
                            <p
                                className="text-center bTL"
                                onClick={() => navigate("/signIn")}
                            >
                                Back to login?
                            </p>
                        </div>
                    </FormikForm>
                )}
            </Formik>
        </Container>
    );
}

export default ForgotPassword;
