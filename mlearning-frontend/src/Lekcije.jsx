import React, { useEffect, useState } from "react"; /* React */

import { Card, Row, Col, Spinner, Button, Container, Alert } from "react-bootstrap"; /* Bootstrap objekti */

import { NavLink, useParams } from "react-router-dom"; /* Navigacija */
import LoadingSpinner from "./LoadingSpinner";

const Lekcije = () => {
  /* Deklarisanje promenljivih */
  const [lekcije, setLekcije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const idOblasti = useParams();  /* Uzima id_oblasti za koji će tražiti lelkcije iz URL-a */

  /* getLekcije */
  useEffect(() => { /* "useEffect is a React Hook that lets you synchronize a component with an external system." */
    const fetchLekcije = async () => {
      /* Try-catch za hvatanje grešaka */
      try {
        console.log("Slanje GET zahteva.");
        const response = await fetch(`http://100.71.17.102:5000/getLekcije?id_oblasti=${idOblasti.idOblasti}`); /* GET request */
        if (!response.ok) {
          throw new Error("Ne mogu da dobijem podatke o lekcijama");
        }
        const data = await response.json();
        console.log("Podaci dobijeni:", data);
        setLekcije(data); /* Učitavanje dobijenih podataka u konstantu */
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
          <Col key={lekcija.id_lekcije}>
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
