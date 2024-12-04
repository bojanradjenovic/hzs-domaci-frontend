import React, { useEffect, useState } from "react"; /* React */

import { Card, Row, Col, Spinner, Button } from "react-bootstrap"; /* Bootstrap objekti */

import { useNavigate } from "react-router-dom"; /* Navigacija */


const Predmeti = () => {
  /* Deklarisanje promenljivih */
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); /* Navigacija */

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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  /* Prikazivanje greške pri unosu podataka */
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  /* Funkcija koja se pokreće klikom na dugme */
  const handleButtonClick = (nazivPredmeta, idPredmeta) => {
    var nazivPredmetaLowerReplaced = nazivPredmeta.replace(/\s+/g, "-").toLowerCase();
    navigate(`/${nazivPredmetaLowerReplaced}`, { state: { idPredmeta, nazivPredmeta, nazivPredmetaLowerReplaced } });  /* Salje korisnika na /ime_predmeta */
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Predmeti</h1>
      <Row>
        {predmeti.map((predmet) => (
          <Col key={predmet.id_predmeta}>
            <Card>
              <Card.Body>
                <Card.Title>{predmet.naziv}</Card.Title>
                <Button variant="primary" onClick={() => handleButtonClick(predmet.naziv, predmet.id_predmeta)}>
                  Pogledaj oblasti
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Predmeti;
