import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GET_PROFILE } from "../graphql/Queries";

function Profile() {
    let [user, setUser] = useState(null);
    let { data, error, loading, refetch } = useQuery(GET_PROFILE);
    let navigate = useNavigate();

    useEffect(() => {
        console.log(data?.getProfile);
        // if (!data?.getProfile?.success) navigate("/signIn");
        setUser(data?.getProfile?.user);
        if (!user) {
            refetch();
        }
        return () => setUser(null);
    }, [data]);

    if (error) console.log(error);
    if (loading) return <p>Loading...</p>;

    return (
        <Container>
            <Row>
                <Col>
                    <Card border="primary" className="mt-5">
                        <Card.Header>
                            <p className="text-center">{user?.username}</p>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <img
                                src={
                                    user?.profile === "user.svg"
                                        ? `${process.env.REACT_APP_SERVER_URL}/${user?.profile}`
                                        : `${user?.profile}`
                                }
                                alt="help"
                                className="img img-thumbnail"
                                height={"30%"}
                                width={"40%"}
                            />
                            <Card.Title className="mt-2">
                                {user?.email}
                            </Card.Title>
                            <Card.Text>
                                Phone : {user?.phone || "Not provided"}
                                <br />
                                Gender : {user?.gender || "Not provided"}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
