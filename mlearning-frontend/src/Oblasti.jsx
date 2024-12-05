import React, { useEffect, useState } from "react"; /* React */

import { Card, Row, Col, Button, Container, Alert, Navbar, Dropdown } from "react-bootstrap"; /* Bootstrap objekti */

import { NavLink, useParams, useNavigate } from "react-router-dom"; /* Navigacija */

import LoadingSpinner from "./LoadingSpinner"; /* Animacija učitavanja */

const Oblasti = () => {
  /* Deklarisanje konstanta */
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [oblasti, setOblasti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Izvlačenje tokene iz kolačića */
  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate(); /* Navigacija */
  
  const idPredmeta = useParams(); /* Uzima id_predmeta za koji će tražiti oblasti iz URL-a */

  /* getOblasti */
  useEffect(() => { /* "useEffect is a React Hook that lets you synchronize a component with an external system." */
    const fetchOblasti = async () => {
      /* Try-catch za hvatanje grešaka */
      try {
        console.log(`Slanje GET zahteva.`);
        /* GET request */
        const response = await fetch(`http://100.71.17.102:5005/getOblasti?id_predmeta=${idPredmeta.idPredmeta}`, {
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
          throw new Error(data.message || "Ne mogu da dobijem podatke o oblastima.");
        }
        console.log("Podaci dobijeni:", data);
        setKorisnickoIme(data.korisnicko_ime)
        setOblasti(data.oblasti); /* Učitavanje dobijenih podataka u konstantu */
      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
        setError(error.message); /* Učitavanje greške u konstantu */
      } finally {
        setLoading(false); /* Završi animaciju učitavanja */
      }
    };

    fetchOblasti();
  }, [idPredmeta]);

  /* Prikazivanje animacije učitavanja */
  if (loading) {
    return (
      <LoadingSpinner />
    )
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
          <Navbar.Text className="me-auto">Zdravo {korisnickoIme}</Navbar.Text>
          <NavLink to="/" className="mx-auto">
            <Navbar.Brand>
              mLearning
            </Navbar.Brand>
          </NavLink>
          <NavLink to="/logout" className="ms-auto">
            Log out
          </NavLink>
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
        <h1 className="modern-header">Oblasti</h1>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {oblasti.map((oblast) => (
            <Col key={oblast.id_oblasti}>
              <Card className="custom-card shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold">{oblast.naziv}</Card.Title>
                  <Card.Text>{oblast.opis}</Card.Text>
                  <NavLink to={`/oblast/${oblast.id_oblasti}`}>
                    <Button variant="primary">
                      Pogledaj lekcije
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

export default Oblasti;
