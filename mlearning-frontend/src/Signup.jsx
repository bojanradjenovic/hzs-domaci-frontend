import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [korisnicko_ime, setKorisnickoIme] = useState("");
  const [sifra, setSifra] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!korisnicko_ime.trim() || !sifra.trim()) {
      setErrorMessage("Oba polja moraju biti popunjena.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new URLSearchParams();
    formData.append("korisnicko_ime", korisnicko_ime);
    formData.append("sifra", sifra);

    try {
      const response = await fetch("http://100.71.17.102:5000/registerKorisnik", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message || "Uspešno registrovan!");
        setKorisnickoIme("");
        setSifra("");
        navigate("/login")
      } else {
        setErrorMessage(data.message || "Došlo je do greške pri registraciji.");
      }
    } catch (error) {
      setErrorMessage("Greška u mreži. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "50px" }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="text-center mb-4">Registracija</h2>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Korisničko ime</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unesite korisničko ime"
                value={korisnicko_ime}
                onChange={(e) => setKorisnickoIme(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Šifra</Form.Label>
              <Form.Control
                type="password"
                placeholder="Unesite šifru"
                value={sifra}
                onChange={(e) => setSifra(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Registracija..." : "Registruj se"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
