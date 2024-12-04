import React, { useState } from "react"; /* React */

import { Button, Form, Container } from "react-bootstrap"; /* Bootstrap objekti */

import { useNavigate } from "react-router-dom"; /* Navigacija bez interakcije korisnika */

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
        document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=Lax;`;
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
    <Container>
      <h2 className="text-center">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Korisničko ime</Form.Label>
          <Form.Control type="text" placeholder="Unesite korisničko ime" value={korisnicko_ime} onChange={(e) => setKorisnicko_ime(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Šifra</Form.Label>
          <Form.Control type="password" placeholder="Unesite šifru" value={sifra} onChange={(e) => setSifra(e.target.value)}/>
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