import React, { useEffect, useState } from "react"; /* React */

import { Card, Row, Col, Spinner, Button, Container, Alert } from "react-bootstrap"; /* Bootstrap objekti */

import { NavLink } from "react-router-dom"; /* Navigacija */
import LoadingSpinner from "./LoadingSpinner";
import './GeneralnoCard.css';


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
      <h1 className="modern-header">Pred<span class="blue-text">m</span>eti</h1>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {predmeti.map((predmet) => (
          <Col key={predmet.id_predmeta}>
            <Card className="custom-card shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold">{predmet.naziv}</Card.Title>
                <Card.Text>{predmet.opis}</Card.Text>
                <Button variant="primary" href={`/predmet/${predmet.id_predmeta}`}>
                  Pogledaj oblasti
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </div>
  );
};

export default Predmeti;
