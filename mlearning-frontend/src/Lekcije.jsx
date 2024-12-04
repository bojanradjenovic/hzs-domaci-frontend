import React, { useEffect, useState } from "react"; /* React */

import { Card, Row, Col, Spinner, Button, Container, Alert } from "react-bootstrap"; /* Bootstrap objekti */

import { NavLink, useParams, useNavigate } from "react-router-dom"; /* Navigacija */

import LoadingSpinner from "./LoadingSpinner"; /* Animacija učitavanja */

const Lekcije = () => {
  /* Deklarisanje konstanta */
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
        const response = await fetch(`http://100.71.17.102:5005/getLekcije?id_oblasti=${idOblasti.idOblasti}`, {
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
    <Container>
    <h1 className="text-center">Lekcije</h1>
    <Row>
      {lekcije.map((lekcija) => (
        <Col 
          key={lekcija.id_lekcije} 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3} 
          className="mb-4"
        >
          <Card>
            <Card.Header>
              <Card.Title>{lekcija.naziv}</Card.Title>
            </Card.Header>
            <Card.Body>
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
  );
};

export default Lekcije;  // Obavezno staviti export default
