const { gql } = require("@apollo/client");

export const GET_PROFILE = gql`
    {
        getProfile {
            message
            success
            user {
                username
                email
                gender
                phone
                profile
            }
        }
    }
`;
