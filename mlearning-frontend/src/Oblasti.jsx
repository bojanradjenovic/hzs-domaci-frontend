import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Container, Alert, Navbar } from "react-bootstrap";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Oblasti = () => {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [oblasti, setOblasti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate();
  const idPredmeta = useParams();

  useEffect(() => {
    const fetchOblasti = async () => {
      try {
        const response = await fetch(`http://vm.radjenovic.dev/api/getOblasti?id_predmeta=${idPredmeta.idPredmeta}`, {
          method: "GET",
          headers: {
            "Authorization": `${currentToken}`
          }
        });
        const data = await response.json();
        if (!data.success) {
          navigate("/login");
          return;
        }
        if (!response.ok) {
          throw new Error(data.message || "Ne mogu da dobijem podatke o oblastima.");
        }
        setKorisnickoIme(data.korisnicko_ime);
        setOblasti(data.oblasti);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOblasti();
  }, [idPredmeta]);

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
          <NavLink to="/logout" className="ms-auto">
            Log out
          </NavLink>
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
          paddingTop: '80px',
        }}
      >
        <Container>
          <h1 className="modern-header text-center display-4">Oblasti</h1>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {oblasti.map((oblast) => (
              <Col key={oblast.id_oblasti}>
                <Card className="custom-card shadow-sm">
                  <Card.Body>
                    <Card.Title className="fw-bold">{oblast.naziv}</Card.Title>
                    <Card.Text>{oblast.opis}</Card.Text>
                    <NavLink to={`/oblast/${oblast.id_oblasti}`}>
                      <Button variant="primary">Pogledaj lekcije</Button>
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

export default Oblasti;
