import React, { useEffect, useState } from "react"; /* React */

import { Card, Row, Col, Button, Container, Alert, Navbar, Dropdown } from "react-bootstrap"; /* Bootstrap objekti */

import { NavLink, useParams, useNavigate } from "react-router-dom"; /* Navigacija */

import LoadingSpinner from "./LoadingSpinner"; /* Animacija učitavanja */

const Lekcije = () => {
  /* Deklarisanje konstanta */
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lekcije, setLekcije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Izvlačenje tokene iz kolačića */
  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate(); /* Navigacija */

  const idOblasti = useParams();  /* Uzima id_oblasti za koji će tražiti lelkcije iz URL-a */

  /* getLekcije */
  useEffect(() => { /* "useEffect is a React Hook that lets you synchronize a component with an external system." */
    const fetchLekcije = async () => {
      /* Try-catch za hvatanje grešaka */
      try {
        console.log("Slanje GET zahteva.");
        /* GET request */
        const response = await fetch(`http://100.71.17.101:5000/getLekcije?id_oblasti=${idOblasti.idOblasti}`, {
          method: "GET",
          headers: {
            "Authorization": `${currentToken}`
        }});
        const data = await response.json();
        /* Šalje na login ako korisnik nije ulogovan */
        if (!data.success) {
          navigate("/login"); 
          return;
        }
        if (!response.ok) {
          throw new Error("Ne mogu da dobijem podatke o predmetima.");
        }
        console.log("Podaci dobijeni:", data);
        setKorisnickoIme(data.korisnicko_ime);
        setLekcije(data.lekcije); /* Učitavanje dobijenih podataka u konstantu */
      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
        setError(error.message); /* Učitavanje greške u konstantu */
      } finally {
        setLoading(false); /* Završi animaciju učitavanja */
      }
    };

    fetchLekcije(); /* Pozivanje same funkcije */
  }, [idOblasti]);

  /* Prikazivanje animacije učitavanja */
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  /* Prikazivanje greške pri unosu podataka */
  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      {/* Navbar deo */}
      <Navbar bg="light" expand="lg" className="justify-content-between">
        <Container fluid>
          <Navbar.Text className="me-auto">Zdravo, {korisnickoIme}</Navbar.Text>
          <NavLink to="/" className="mx-auto">
          <Navbar.Brand className="ime">
            <span className="blue-text">m</span>Learning
            </Navbar.Brand>
          </NavLink>

          {/* Dropdown for the right side */}
          <Dropdown className="ms-auto">
            <Dropdown.Toggle variant="secondary" id="dropdown-custom-components">
              Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to="/kreiraj">
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
      {/* Glavni deo */}
      <div
      style={{
        backgroundImage: 'url(../assets/blurovana2.jpg)', // Putanja je relativna u odnosu na public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container>
        <h1 className="modern-header">Lekcije</h1>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {lekcije.map((lekcija) => (
            <Col key={lekcija.id_lekcije}>
              <Card className="custom-card shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold">{lekcija.naziv}</Card.Title>
                  <Card.Text>{lekcija.opis}</Card.Text>
                  <NavLink to={`/lekcija/${lekcija.id_lekcije}`}>
                    <Button variant="primary">
                      Pogledaj lekciju
                    </Button>
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

export default Lekcije;  // Obavezno staviti export default
