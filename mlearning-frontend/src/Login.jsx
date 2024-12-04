import React, { useState } from "react"; /* React */

import { Card, Row, Col } from "react-bootstrap";

import { Button, Form, Container } from "react-bootstrap"; /* Bootstrap objekti */

import { useNavigate } from "react-router-dom"; /* Navigacija bez interakcije korisnika */

import './GeneralnoCard.css'

const Login = () => {
  /* Deklarisanje promenljivih */
  const [korisnicko_ime, setKorisnicko_ime] = useState("");
  const [sifra, setSifra] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); /* Navigacija bez interakcije korisnika */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Proverava da li su oba polja popunjena */
    if (!korisnicko_ime.trim() || !sifra.trim()) {
      setErrorMessage("Oba polja moraju biti popunjena.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("korisnicko_ime", korisnicko_ime);
    formData.append("sifra", sifra);

    try {
      const response = await fetch("http://100.71.17.102:5000/loginKorisnik", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=Lax`;
        console.log("Login successful", data);

        navigate("/"); /* Šalje na glavnu stranicu kada je login uspešan */
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred during login");
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url(../assets/knjige2.jpg)', // Putanja je relativna u odnosu na public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
    <Container className="login-container">
      <h2 className="modern-login" ><span class="blue-text">m</span>Learning<span class="log">.Login</span></h2>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={6}></Col>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Group controlId="formEmail">
          <Form.Label>Korisničko ime</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Unesite korisničko ime" 
            value={korisnicko_ime} 
            onChange={(e) => setKorisnicko_ime(e.target.value)} 
            className="input-field"
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Šifra</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Unesite šifru" 
            value={sifra} 
            onChange={(e) => setSifra(e.target.value)} 
            className="input-field"
          />
        </Form.Group>
        {errorMessage && <p className="danger text-danger">{errorMessage}</p>}
        <Button variant="primary" type="submit" className="submit-btn">
          Login
        </Button>
        </Form>
      </Row>
    </Container>
    </div>
  );
};

export default Login;