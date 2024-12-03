import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';

const Login = () => {
  const [korisnicko_ime, setKorisnicko_ime] = useState('');
  const [sifra, setSifra] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('korisnicko_ime', korisnicko_ime);
    formData.append('sifra', sifra);

    try {
      const response = await fetch('http://100.71.17.102:5000/loginKorisnik', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        // Set cookie (expire in 1 hour)
        document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=Lax`;
        console.log('Login successful', data);
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred during login');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Korisničko ime</Form.Label>
          <Form.Control
            type="text"
            placeholder="Unesite korisničko ime"
            value={korisnicko_ime}
            onChange={(e) => setKorisnicko_ime(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Šifra</Form.Label>
          <Form.Control
            type="password"
            placeholder="Unesite šifru"
            value={sifra}
            onChange={(e) => setSifra(e.target.value)}
          />
        </Form.Group>

        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;