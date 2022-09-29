import { gql } from "@apollo/client";

export const REGISTER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $phone: String!
        $gender: String!
    ) {
        register(
            username: $username
            email: $email
            password: $password
            phone: $phone
            gender: $gender
        ) {
            success
            message
            user {
                username
                profile
            }
        }
    }
`;

export const VALIDATETOKEN = gql`
    mutation ($token: String!) {
        validToken(token: $token) {
            success
            message
        }
    }
`;

export const LOGIN = gql`
    mutation ($email: String!, $password: String!, $rememberMe: Boolean) {
        login(email: $email, password: $password, rememberMe: $rememberMe) {
            success
            message
            user {
                username
                profile
            }
        }
    }
`;

export const LOGOUT = gql`
    mutation {
        logout {
            success
            message
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation ($email: String!, $password: String!) {
        forgotPassword(email: $email, password: $password) {
            success
            message
        }
    }
`;

export const SIGUP_WITH_GOOGLE = gql`
    mutation (
        $email: String!
        $username: String!
        $profile: String!
        $id: String!
    ) {
        registerWithGoogle(
            email: $email
            username: $username
            profile: $profile
            id: $id
        ) {
            success
            message
            user {
                username
                profile
            }
        }
    }
`;
