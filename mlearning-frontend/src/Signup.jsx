import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";

const Signup = () => {
  const [korisnicko_ime, setKorisnickoIme] = useState("");
  const [sifra, setSifra] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [datumRodjenja, setDatumRodjenja] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear());
  const minDateString = minDate.toISOString().split('T')[0];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    let valid = true;

    form.querySelectorAll('input').forEach((input) => {
      if (!input.checkValidity()) {
        valid = false;
        if (input.validity.valueMissing) {
          input.setCustomValidity('Molimo vas da popunite ovo polje.');
        } else if (input.validity.patternMismatch) {
          if (input.type === 'email') {
            input.setCustomValidity('Molimo unesite validnu e-mail adresu (primer@domen.com).');
          } else if (input.id === 'formTelefon') {
            input.setCustomValidity('Broj telefona mora sadržavati samo cifre (10-15 cifara).');
          }
        }
      } else {
        input.setCustomValidity('');
      }
    });

    if (!valid) {
      form.reportValidity();
      return;
    }

    if (!ime || !prezime || !datumRodjenja || !telefon || !email || !korisnicko_ime.trim() || !sifra.trim()) {
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
      const response = await fetch("https://vm.radjenovic.dev/api/registerKorisnik", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Nalog uspešno kreiran!');
        setSuccessMessage(data.message || "Uspešno registrovan!");
        setKorisnickoIme("");
        setSifra("");
        navigate("/login");
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
    <div
      style={{
        backgroundImage: "url('../assets/signup2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <Container className="signup-container">
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <h2 className="modern-login"><span className="blue-text">Registracija</span></h2>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="formIme" className="mb-3">
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unesite ime"
                  value={ime}
                  onChange={(e) => setIme(e.target.value)}
                  onInput={(e) => e.target.setCustomValidity('')}
                  className="input2-field"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPrezime" className="mb-3">
                <Form.Label>Prezime</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unesite prezime"
                  value={prezime}
                  onChange={(e) => setPrezime(e.target.value)}
                  onInput={(e) => e.target.setCustomValidity('')}
                  className="input2-field"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDatumRodjenja" className="mb-3">
                <Form.Label>Datum rođenja</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Unesite datum rođenja"
                  value={datumRodjenja}
                  onChange={(e) => setDatumRodjenja(e.target.value)}
                  onInput={(e) => e.target.setCustomValidity('')}
                  max={minDateString}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTelefon" className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unesite broj telefona"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  onInput={(e) => e.target.setCustomValidity('')}
                  pattern="^[0-9]{10,15}$"
                  title="Broj telefona mora sadržati samo cifre (10-15 cifara)."
                  className="input2-field"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Unesite email adresu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInput={(e) => e.target.setCustomValidity('')}
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  title="E-mail adresa mora sadržati @ i odgovarajući format (npr. primer@domen.com)."
                  className="input2-field"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Korisničko ime</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unesite korisničko ime"
                  value={korisnicko_ime}
                  onChange={(e) => setKorisnickoIme(e.target.value)}
                  onInput={(e) => e.target.setCustomValidity('')}
                  className="input2-field"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Šifra</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Unesite šifru"
                  value={sifra}
                  onChange={(e) => setSifra(e.target.value)}
                  onInput={(e) => e.target.setCustomValidity('')}
                  className="input2-field"
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="submit2-btn"
              >
                {loading ? 'Registracija...' : 'Registruj se'}
              </Button>
              <NavLink to="/login" style={{ fontSize: '14px' }}>
                Imate nalog? Ulogujte se!
              </NavLink>
              {errorMessage && <p className="danger text-danger">{errorMessage}</p>}
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
