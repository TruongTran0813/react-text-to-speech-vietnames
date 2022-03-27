import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./App.css";
import { SpeechToText } from "./SpeechToText";
import { TextToSpeech } from "./TextToSpeech";

function App() {
  const [isTextToSpeech, setTextToSpeech] = useState(true);
  return (
    <div className="App">
      <Container className="h-100">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>Chuyển đổi văn bản thành tiếng nói</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="https://github.com/TruongTran0813/react-text-to-speech-vietnames">
                  Github
                </Nav.Link>
                <Nav.Link href="https://www.facebook.com/ku.p.truong/">
                  Facebook
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-sm-12 col-lg-8 col-xl-6">
            <button
              className="btn btn-success my-2"
              onClick={() => setTextToSpeech(!isTextToSpeech)}
            >
              Chuyển sang {isTextToSpeech ? "Speech To Text" : "Text To Speech"}
            </button>
            {isTextToSpeech ? <TextToSpeech /> : <SpeechToText />}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
