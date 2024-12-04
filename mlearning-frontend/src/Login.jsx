import React, { useEffect, useState } from "react"; /* React */

import { Button, Form, Container, Alert } from "react-bootstrap"; /* Bootstrap objekti */

import { useNavigate } from "react-router-dom"; /* Navigacija bez interakcije korisnika */

import LoadingSpinner from "./LoadingSpinner"; /* Animacija učitavanja */

const Login = () => {
  /* Deklarisanje konstanta */
  const [korisnicko_ime, setKorisnicko_ime] = useState("");
  const [sifra, setSifra] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);

  /* Izvlačenje tokena iz kolačića */
  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate(); /* Navigacija */

  useEffect(() => {
    /* Provera da li je korisnik trenutno ulogovan */
    const tokenProvera = async () => {
      try {
        const response = await fetch("http://100.71.17.102:5005/tokenProvera", {
          method: "GET",
          headers: {
            Authorization: `${currentToken}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Greša pri proveri tokena:", error);
      } finally {
        setLoading(false);
        setUserChecked(true);
      }
    };

    tokenProvera();
  }, [navigate]);

  /* Prikazivanje animacije učitavanja */
  if (loading || !userChecked) {
    return <LoadingSpinner />;
  }

  /* Funkcija koje se pokreće klikom na dugme */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Prikazivanje greške prilikom unosa podataka */
    if (!korisnicko_ime.trim() || !sifra.trim()) {
      setErrorMessage("Oba polja moraju biti popunjena.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("korisnicko_ime", korisnicko_ime);
    formData.append("sifra", sifra);

    /* loginKorisnik */
    try {
      /* POST request */
      const response = await fetch("http://100.71.17.102:5000/loginKorisnik", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();
      
      /* Šalje korisnika na glavnu stranicu ako je uspešnp ulogovan */
      if (response.ok) {
        document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=Lax;`;
        navigate("/");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login");
    }
  };

  return (
    <Container>
      <h2 className="text-center">Login</h2>
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
        {errorMessage && <p className="danger text-danger">{errorMessage}</p>}
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
