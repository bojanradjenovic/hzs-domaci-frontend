import React, { useEffect, useState } from "react";
import { Row, Col, Button, Container, Alert, Navbar, Dropdown } from "react-bootstrap"; // Bootstrap components
import { useParams, useNavigate, NavLink } from "react-router-dom"; // Navigation hooks
import LoadingSpinner from "./LoadingSpinner"; // Loading spinner component

const Lekcija = () => {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lekcija, setLekcija] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate();
  const { idLekcije } = useParams();

  useEffect(() => {
    const fetchLekcija = async () => {
      try {
        console.log("Sending GET request.");
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
        console.log("Received data:", data);
        setKorisnickoIme(data.korisnicko_ime);
        setLekcija(data.lekcija); /* Učitavanje dobijenih podataka u konstantu */
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLekcija();
  }, [idLekcije, currentToken]);

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

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      <Navbar bg="light" expand="lg" className="justify-content-between">
        <Container fluid>
          <Navbar.Text className="me-auto">Zdravo, {korisnickoIme}</Navbar.Text>
          <NavLink to="/" className="mx-auto">
            <Navbar.Brand className="ime">
            <span className="blue-text">m</span>Learning
            </Navbar.Brand>
          </NavLink>
          <NavLink to="/logout" className="ms-auto">
            Log out
          </NavLink>
        </Container>
      </Navbar>

      {/* Glavni deo */}

      <div style={{
        backgroundImage: 'url(../assets/blurovana2.jpg)', // Relative path to public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Container className="lekcija d-flex flex-column align-items-center justify-content-center">
      <Row>
        <Col>
          <h1 className="fw-bold">{lekcija.naziv}</h1> {/* Display the title */}
          <p>{lekcija.sadrzaj}</p> {/* Display the content */}
          <NavLink to={`/oblast/${lekcija.id_oblasti}`}>
            <Button variant="primary">Nazad</Button>
          </NavLink>
        </Col>
      </Row>
    </Container>
    </div>
    </>
  );
};

export default Lekcija;
