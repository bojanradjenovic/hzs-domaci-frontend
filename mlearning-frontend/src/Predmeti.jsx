import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Container,
  Alert,
  Navbar,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Predmeti = () => {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPredmeti = async () => {
      try {
        const response = await fetch("http://100.71.17.101:5000/getPredmeti", {
          method: "GET",
          headers: {
            Authorization: `${currentToken}`,
          },
        });
        const data = await response.json();

        if (!data.success) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Ne mogu da dobijem podatke o predmetima.");
        }

        setKorisnickoIme(data.korisnicko_ime);
        setPredmeti(data.predmeti);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredmeti();
  }, [navigate, currentToken]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Navbar bg="light" expand="lg" className="justify-content-between">
        <Container fluid>
          <Navbar.Text className="me-auto">Zdravo, {korisnickoIme}</Navbar.Text>
          <NavLink to="/" className="mx-auto">
            <Navbar.Brand className="ime">
              <span className="blue-text">m</span>Learning
            </Navbar.Brand>
          </NavLink>
          <NavLink to="/logout" className="ms-auto">Log out</NavLink>
        </Container>
      </Navbar>

      <div
        style={{
          backgroundImage: 'url(../assets/blurovana2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container>
          <h1 className="modern-header text-center display-4">
            Pred<span className="blue-text">m</span>eti
          </h1>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {predmeti.map((predmet) => (
              <Col key={predmet.id_predmeta}>
                <Card className="custom-card shadow-sm">
                  <Card.Body>
                    <Card.Title className="fw-bold">{predmet.naziv}</Card.Title>
                    <Card.Text>{predmet.opis}</Card.Text>
                    <NavLink to={`/predmet/${predmet.id_predmeta}`}>
                      <Button variant="primary">Pogledaj oblasti</Button>
                    </NavLink>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Predmeti;
