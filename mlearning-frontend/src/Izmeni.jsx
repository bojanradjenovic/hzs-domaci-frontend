import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Navbar } from "react-bootstrap";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Izmeni = () => {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lekcija, setLekcija] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate();
  const { idLekcije } = useParams();

  // Fetch the lesson data
  useEffect(() => {
    const fetchLekcija = async () => {
      try {
        const response = await fetch(`http://100.71.17.101:5000/getLekcija?id_lekcije=${idLekcije}`, {
          method: "GET",
          headers: {
            "Authorization": `${currentToken}`
          }
        });
        const data = await response.json();
        if (!data.success) {
          navigate("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Unable to fetch lesson data.");
        }
        setKorisnickoIme(data.korisnicko_ime);
        setLekcija(data.lekcija);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLekcija();
  }, [idLekcije, currentToken, navigate]);

  // Handle form submission to modify the lesson
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id_lekcije", idLekcije);
      formData.append("id_oblasti", lekcija.id_oblasti);
      formData.append("naziv", lekcija.naziv);
      formData.append("opis", lekcija.opis);
      formData.append("sadrzaj", lekcija.sadrzaj);

      const response = await fetch("http://100.71.17.101:5000/modifyLekcija", {
        method: "POST",
        headers: {
          "Authorization": `${currentToken}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess("Lesson updated successfully!");
        setTimeout(() => navigate(`/lekcija/${idLekcije}`), 2000); // Redirect after success
      } else {
        throw new Error(data.message || "Failed to update lesson.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Navbar bg="light" expand="lg" className="justify-content-between">
        <Container fluid>
          <Navbar.Text className="me-auto">Zdravo {korisnickoIme}</Navbar.Text>
          <NavLink to="/" className="mx-auto">
            <Navbar.Brand>mLearning</Navbar.Brand>
          </NavLink>
          <NavLink to="/logout" className="ms-auto">
            Log out
          </NavLink>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h1 className="fw-bold">Izmeni Lekciju</h1>
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3" controlId="formNaziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control
              type="text"
              placeholder="Unesite naziv lekcije"
              value={lekcija.naziv || ""}
              onChange={(e) => setLekcija({ ...lekcija, naziv: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formOpis">
            <Form.Label>Opis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Unesite opis lekcije"
              value={lekcija.opis || ""}
              onChange={(e) => setLekcija({ ...lekcija, opis: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSadrzaj">
            <Form.Label>Sadržaj</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Unesite sadržaj lekcije"
              value={lekcija.sadrzaj || ""}
              onChange={(e) => setLekcija({ ...lekcija, sadrzaj: e.target.value })}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="me-2">
            Izmeni
          </Button>
          <NavLink to={`/lekcija/${idLekcije}`}>
            <Button variant="secondary">Nazad</Button>
          </NavLink>
        </Form>
      </Container>
    </>
  );
};

export default Izmeni;
