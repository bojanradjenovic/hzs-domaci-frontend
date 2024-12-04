import React, { useEffect, useState } from "react"; /* React */

import { Card, Row, Col, Spinner, Button, Container, Alert } from "react-bootstrap"; /* Bootstrap objekti */

import { NavLink } from "react-router-dom"; /* Navigacija */
import LoadingSpinner from "./LoadingSpinner";


const Predmeti = () => {
  /* Deklarisanje promenljivih */
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* getPredmeti */
  useEffect(() => { /* "useEffect is a React Hook that lets you synchronize a component with an external system." */
    const fetchPredmeti = async () => {
      /* Try-catch za hvatanje grešaka */
      try {
        console.log("Slanje GET zahteva.");
        const response = await fetch("http://100.71.17.102:5000/getPredmeti"); /* GET request */
        if (!response.ok) {
          throw new Error("Ne mogu da dobijem podatke o predmetima.");
        }
        const data = await response.json();
        console.log("Podaci dobijeni:", data);
        setPredmeti(data); /* Učitavanje dobijenih podataka u konstantu */
      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
        setError(error.message); /* Učitavanje greške u konstantu */
      } finally {
        setLoading(false); /* Završi animaciju učitavanja */
      }
    };

    fetchPredmeti(); /* Pozivanje same funkcije */
  }, []);

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
      <h1 className="text-center">Predmeti</h1>
      <Row>
        {predmeti.map((predmet) => (
          <Col 
            key={predmet.id_predmeta} 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            className="mb-4"
          >
            <Card>
              <Card.Body>
                <Card.Title>{predmet.naziv}</Card.Title>
                <NavLink to={`/predmet/${predmet.id_predmeta}`}>
                  <Button variant="primary">
                    Pogledaj oblasti
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

export default Predmeti;
