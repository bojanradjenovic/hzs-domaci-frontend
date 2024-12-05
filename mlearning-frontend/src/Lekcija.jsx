import React, { useEffect, useState } from "react";
import { Row, Col, Button, Container, Alert, Navbar } from "react-bootstrap";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Lekcija = () => {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lekcija, setLekcija] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate();
  const { idLekcije } = useParams();

  useEffect(() => {
    const checkIfAdmin = async () => {
      try {
        const response = await fetch("http://100.71.17.101:5000/checkIfAdmin", {
          method: "GET",
          headers: {
            "Authorization": `${currentToken}`
          }
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkIfAdmin();
  }, [currentToken]);

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
  }, [idLekcije, currentToken]);

  const handleDelete = async () => {
    const formData = new URLSearchParams();
    formData.append("id_lekcije", idLekcije);

    try {
      const response = await fetch("https://vm.radjenovic.dev/api/deleteLekcija", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `${currentToken}`
        },
        body: formData.toString()
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Lekcija uspešno obrisana!");
        navigate(`/oblast/${lekcija.id_oblasti}`);
      } else {
        alert("Greška pri brisanju lekcije: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Greška pri brisanju lekcije.");
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
          <Navbar.Text className="me-auto">Zdravo, {korisnickoIme}</Navbar.Text>
          <NavLink to="/" className="mx-auto">
            <Navbar.Brand className="ime">
              <span className="blue-text">m</span>Learning
            </Navbar.Brand>
          </NavLink>
          <NavLink to="/logout" className="ms-auto">Log out</NavLink>
        </Container>
      </Navbar>
      <div
        style={{
          backgroundImage: 'url(../assets/blurovana2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container className="lekcija d-flex flex-column align-items-center justify-content-center">
          <Row>
            <Col>
              <h1 className="fw-bold">{lekcija.naziv}</h1>
              <p>{lekcija.sadrzaj}</p>
              <div>
                <NavLink to={`/oblast/${lekcija.id_oblasti}`}>
                  <Button variant="primary" className="me-2">Nazad</Button>
                </NavLink>
                {isAdmin && (
                  <>
                    <NavLink to={`/izmeni/${idLekcije}`}>
                      <Button variant="warning" className="me-2">Izmeni</Button>
                    </NavLink>
                    <Button variant="danger" onClick={handleDelete}>Obriši</Button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Lekcija;
