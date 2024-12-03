import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const Lekcije = () => {
  const [lekcije, setLekcije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id_oblasti } = useParams();  // Uzimamo ID oblasti iz URL-a

  useEffect(() => {
    const fetchLekcije = async () => {
      try {
        console.log(`Slanje GET zahteva na: http://100.71.17.102/getLekcije/${id_oblasti}`);
        const response = await fetch(`http://100.71.17.102:5000/getLekcije?id_oblasti=${id_oblasti}`);
        if (!response.ok) {
          throw new Error('Ne mogu da dobijem podatke o lekcijama');
        }
        const data = await response.json();
        console.log('Podaci dobijeni:', data);
        setLekcije(data);
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLekcije();
  }, [id_oblasti]);

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

  return (
    <div className="container mt-4">
      <h1 className="text-center">Lekcije za oblast {id_oblasti}</h1>
      <Row className="d-flex justify-content-center">
        {lekcije.map((lekcija) => (
          <Col sm={12} md={6} lg={4} key={lekcija.id_lekcije} className="mb-4 d-flex justify-content-center">
            <Card style={{ border: '1px solid #007bff', backgroundColor: '#f8f9fa' }}>
              <Card.Body>
                <Card.Title className="text-center">{lekcija.naziv}</Card.Title>
                <Card.Text>{lekcija.opis}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Lekcije;  // Obavezno staviti export default
