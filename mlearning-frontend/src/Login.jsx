import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Container, Spinner } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import './GeneralnoCard.css';

const Login = () => {
  const [korisnicko_ime, setKorisnicko_ime] = useState("");
  const [sifra, setSifra] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate();

  useEffect(() => {
    const tokenProvera = async () => {
      try {
        const response = await fetch("https://vm.radjenovic.dev/api/tokenProvera", {
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

  if (loading || !userChecked) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!korisnicko_ime.trim() || !sifra.trim()) {
      setErrorMessage("Oba polja moraju biti popunjena.");
      return;
    }

    setButtonLoading(true);

    const formData = new URLSearchParams();
    formData.append("korisnicko_ime", korisnicko_ime);
    formData.append("sifra", sifra);

    try {
      const response = await fetch("http://100.71.17.101:5000/loginKorisnik", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=Lax;`;
      navigate("/");
    } catch (error) {
      setErrorMessage("An error occurred during login");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url(../assets/knjige2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container className="login-container">
        <h2 className="modern-login">
          <span className="blue-text">m</span>Learning
          <span className="log">.Login</span>
        </h2>
        <Row className="justify-content-start">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Form onSubmit={handleSubmit} className="login-form">
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
                <Form.Label style={{ marginTop: '10px' }}>Šifra</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Unesite šifru"
                  value={sifra}
                  onChange={(e) => setSifra(e.target.value)}
                />
              </Form.Group>
              <NavLink to="/signup" style={{ fontSize: '14px' }}>Nemate nalog? Registrujte se!</NavLink>
              {errorMessage && <p className="danger text-danger">{errorMessage}</p>}
              <Button
                variant="primary"
                type="submit"
                className="submit-btn"
                disabled={buttonLoading}
              >
                {buttonLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
