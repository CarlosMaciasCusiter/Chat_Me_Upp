import React from "react";
import { Container, Nav, Navbar, Row } from "react-bootstrap";
import { useAuthDispatch } from "../../context/auth";
import Messages from "./Messages";
import Users from "./Users";

export default function Home({ history }) {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Chat Me Up</Navbar.Brand>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="" onClick={logout}>
            Logout
          </Nav.Link>
        </Container>
      </Navbar>
      <Container>
        <Row className="bg-white">
          <Users />
          <Messages />
        </Row>
      </Container>
    </>
  );
}
