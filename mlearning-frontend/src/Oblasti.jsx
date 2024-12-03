import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const Oblasti = () => {
  const [oblasti, setOblasti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id_predmeta } = useParams();  // Uzimamo ID predmeta iz URL-a
  const navigate = useNavigate();  // Koristimo useNavigate za navigaciju

  useEffect(() => {
    const fetchOblasti = async () => {
      try {
        console.log(`Slanje GET zahteva na: http://100.71.17.102/getOblasti/${id_predmeta}`);
        const response = await fetch(`http://100.71.17.102:5000/getOblasti?id_predmeta=${id_predmeta}`); // API URL za oblasti vezane za predmet
        if (!response.ok) {
          throw new Error('Ne mogu da dobijem podatke o oblastima');
        }
        const data = await response.json();
        console.log('Podaci dobijeni:', data);
        setOblasti(data);
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOblasti();
  }, [id_predmeta]);

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

  // Funkcija koja se poziva kada kliknete na dugme (Pogledaj lekcije)
  const handleLekcijeClick = (id_oblasti) => {
    navigate(`/lekcije/${id_oblasti}`);  // Navigacija na stranicu lekcija sa ID oblasti
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Oblasti za predmet {id_predmeta}</h1>
      <Row className="d-flex justify-content-center">
        {oblasti.map((oblast) => (
          <Col sm={12} md={6} lg={4} key={oblast.id_oblasti} className="mb-4 d-flex justify-content-center">
            <Card style={{ border: '1px solid #007bff', backgroundColor: '#f8f9fa' }}>
              <Card.Body>
                <Card.Title className="text-center">{oblast.naziv}</Card.Title>
                <Card.Text>{oblast.opis}</Card.Text>
                <div className="text-center">
                  <Button
                    variant="primary"
                    onClick={() => handleLekcijeClick(oblast.id_oblasti)}  // Dugme za navigaciju na lekcije
                  >
                    Pogledaj lekcije
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

export default Oblasti;
