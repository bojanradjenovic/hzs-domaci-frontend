import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Container, Alert, Navbar, Dropdown } from "react-bootstrap";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Lekcije = () => {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lekcije, setLekcije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate();
  const idOblasti = useParams();

  useEffect(() => {
    const fetchLekcije = async () => {
      try {
        const response = await fetch(`http://vm.radjenovic.dev/api/getLekcije?id_oblasti=${idOblasti.idOblasti}`, {
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
          throw new Error("Ne mogu da dobijem podatke o predmetima.");
        }
        setKorisnickoIme(data.korisnicko_ime);
        setLekcije(data.lekcije);
      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLekcije();
  }, [idOblasti]);

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
          <Dropdown className="ms-auto">
            <Dropdown.Toggle variant="secondary" id="dropdown-custom-components">
              Menu
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to={`/kreiraj/${idOblasti.idOblasti}`}>
                Kreiraj
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as={NavLink} to="/logout">
                Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
      <div
        style={{
          backgroundImage: 'url(../assets/blurovana2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container>
          <h1 className="modern-header text-center display-4">Lekcije</h1>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {lekcije.map((lekcija) => (
              <Col key={lekcija.id_lekcije}>
                <Card className="custom-card shadow-sm">
                  <Card.Body>
                    <Card.Title className="fw-bold">{lekcija.naziv}</Card.Title>
                    <Card.Text>{lekcija.opis}</Card.Text>
                    <NavLink to={`/lekcija/${lekcija.id_lekcije}`}>
                      <Button variant="primary">Pogledaj lekciju</Button>
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

export default Lekcije;
