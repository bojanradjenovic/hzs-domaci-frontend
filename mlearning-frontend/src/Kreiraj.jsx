import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const Kreiraj = () => {
  const [lekcija, setLekcija] = useState({
    naziv: '',
    opis: '',
    sadrzaj: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { idOblasti } = useParams();

  /* Izvlačenje tokene iz kolačića */
  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const handleChange = (value, field) => {
    setLekcija({
      ...lekcija,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!lekcija.naziv.trim() || !lekcija.opis.trim() || !lekcija.sadrzaj.trim()) {
      setErrorMessage('Sva polja moraju biti popunjena.');
      return;
    }

    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('id_oblasti', idOblasti);
    formData.append('naziv', lekcija.naziv);
    formData.append('opis', lekcija.opis);
    formData.append('sadrzaj', lekcija.sadrzaj);
    console.log(formData)
    console.log(formData.toString());

    try {
      const response = await fetch('http://100.71.17.101:5000/createLekcija', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          "Authorization": currentToken
        },
        body: formData.toString()
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Došlo je do greške prilikom kreiranja lekcije.');
        return;
      }

      alert('Lekcija uspešno kreirana!');
      setLekcija({ naziv: '', opis: '', sadrzaj: '' });
      navigate(`/oblast/${idOblasti}`);

    } catch (error) {
      setErrorMessage('Došlo je do greške prilikom slanja podataka.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h2>Kreiraj Lekciju</h2>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formNaziv">
              <Form.Label>Naziv Lekcije</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unesite naziv lekcije"
                value={lekcija.naziv}
                onChange={(e) => handleChange(e.target.value, 'naziv')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formOpis">
              <Form.Label>Opis Lekcije</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unesite opis lekcije"
                value={lekcija.opis}
                onChange={(e) => handleChange(e.target.value, 'opis')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group controlId="formSadrzaj">
              <Form.Label>Sadržaj Lekcije</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Unesite sadržaj lekcije"
                value={lekcija.sadrzaj}
                onChange={(e) => handleChange(e.target.value, 'sadrzaj')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="visually-hidden">Loading...</span>
            </>
          ) : (
            'Kreiraj'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Kreiraj;
