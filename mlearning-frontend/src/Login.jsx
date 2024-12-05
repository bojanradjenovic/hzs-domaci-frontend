import React, { useEffect, useState } from "react"; /* React */
import { Row, Col } from "react-bootstrap";
import { Button, Form, Container, Spinner } from "react-bootstrap"; /* Bootstrap objekti */
import { useNavigate, NavLink } from "react-router-dom"; /* Navigacija bez interakcije korisnika */
import LoadingSpinner from "./LoadingSpinner"; /* Animacija učitavanja */
import './GeneralnoCard.css' /* CSS */

const Login = () => {
  /* Deklarisanje konstanta */
  const [korisnicko_ime, setKorisnicko_ime] = useState("");
  const [sifra, setSifra] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  /* Izvlačenje tokena iz kolačića */
  const allCookies = document.cookie;
  const currentToken = allCookies.split("=")[1];

  const navigate = useNavigate(); /* Navigacija */

  useEffect(() => {
    /* Provera da li je korisnik trenutno ulogovan */
    const tokenProvera = async () => {
      try {
        const response = await fetch("http://100.71.17.101:5000/tokenProvera", {
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

    setButtonLoading(true);

    const formData = new URLSearchParams();
    formData.append("korisnicko_ime", korisnicko_ime);
    formData.append("sifra", sifra);

    /* loginKorisnik */
    try {
      /* POST request */
      const response = await fetch("http://100.71.17.101:5000/loginKorisnik", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();
      
      /* Šalje korisnika na glavnu stranicu ako je uspešnp ulogovan */
      if(!response.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=Lax;`;
      navigate("/");
    } catch (error) {
      setErrorMessage("An error occurred during login");
    } finally {
      setButtonLoading(false); // Stop button loading animation
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
        <Row className="justify-content-left">
          <Col xs={12} sm={8} md={6} lg={6}>
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
                <Form.Label style={{marginTop:'10px'}}>Šifra</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Unesite šifru"
                  value={sifra}
                  onChange={(e) => setSifra(e.target.value)}
                />
              </Form.Group>
              <NavLink to="/signup" style={{ fontSize: '14px'
               }}>Nemate nalog? Registrujte se!</NavLink>
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
