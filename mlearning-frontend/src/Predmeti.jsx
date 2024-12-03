import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Button } from 'react-bootstrap';  // Importujemo Button iz react-bootstrap
import { useNavigate } from 'react-router-dom';  // Za navigaciju

const Predmeti = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Koristimo useNavigate za navigaciju

  // Funkcija koja će izvršiti GET zahtev za predmete
  useEffect(() => {
    const fetchPredmeti = async () => {
      try {
        console.log('Slanje GET zahteva na: http://100.71.17.102/getPredmeti');
        const response = await fetch('http://100.71.17.102:5000/getPredmeti'); // API URL za predmete
        if (!response.ok) {
          throw new Error('Ne mogu da dobijem podatke o predmetima');
        }
        const data = await response.json();
        console.log('Podaci dobijeni:', data);
        setPredmeti(data); // Spremamo podatke u stanje
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        setError(error.message); // Ako se dogodi greška, spremaj je
      } finally {
        setLoading(false); // Završeno učitavanje
      }
    };

    fetchPredmeti(); // Pozivamo funkciju za dobijanje predmeta
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Funkcija koja se poziva kada kliknete na dugme (Pogledaj oblasti)
  const handleButtonClick = (id) => {
    navigate(`/oblasti/${id}`);  // Navigacija na stranicu oblasti sa ID predmeta
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Predmeti</h1> {/* Centriramo naslov */}
      <Row className="d-flex justify-content-center">  {/* Centriramo red */}
        {predmeti.map((predmet) => (
          <Col sm={12} md={6} lg={4} key={predmet.id_predmeta} className="mb-4 d-flex justify-content-center">
            <Card
              style={{
                border: '1px solid #007bff',
                backgroundColor: '#f8f9fa',
              }}
            >
              <Card.Body>
                <Card.Title className="text-center">{predmet.naziv}</Card.Title> {/* Centriramo naziv predmeta */}
                {/* Dugme koje vodi na oblasti */}
                <div className="text-center">
                  <Button
                    variant="primary"
                    onClick={() => handleButtonClick(predmet.id_predmeta)}
                  >
                    Pogledaj oblasti
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Predmeti;
