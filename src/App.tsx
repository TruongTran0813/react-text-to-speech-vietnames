import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react";
import { Container, FloatingLabel, Form, Nav, Navbar } from "react-bootstrap";
import "./App.css";

export interface IVoices {
  name: string;
  description: string;
  code: string;
}
function App() {
  const [text, setText] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [voices, setVoices] = useState<IVoices[]>([]);
  const [voice, setVoice] = useState("");
  const [speed, setSpeed] = useState(1);
  const token_id = process.env.REACT_APP_TOKEN_ID || "";
  //Để có "token id" bạn có thể đăng ký tài khoản tại viettelgroup.ai, sau đó login, rồi vào menu token để tạo

  const url = "https://viettelgroup.ai/voice/api/tts/v1/rest/syn";

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://viettelgroup.ai/voice/api/tts/v1/rest/voices")
        .then((response) => response.json())
        .then((data) => {
          setVoices(data);
          setVoice(data[0].code);
        });
    };
    fetchData();
  }, []);

  const getData = async () => {
    const data = {
      text: text,
      voice,
      id: "3",
      without_filter: false,
      speed: speed,
      tts_return_option: 3,
    };

    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token_id,
      },
      body: JSON.stringify(data),
    });
    return response;
  };

  const convert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.focus();
    if (!text) {
      alert("Vui lòng nhập nội dung muốn chuyển đổi");
      return;
    }
    if (text.length > 500) {
      alert("Nội dung không quá 500 ký tự");
      return;
    }
    const data = await getData();

    const mediaSource = await new MediaSource();
    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(mediaSource);
    }
    mediaSource.addEventListener("sourceopen", sourceOpen);
    async function sourceOpen() {
      const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
      if (data.body) {
        const reader = data.body.getReader();

        let result;
        while (!(result = await reader.read()).done) {
          sourceBuffer.appendBuffer(result.value);
        }
        sourceBuffer.addEventListener("updateend", function (_) {
          mediaSource.endOfStream();
          //console.log(mediaSource.readyState); // ended
        });
        audioRef.current?.play();
        setText("");
      }
    }
  };
  return (
    <div className="App">
      <audio ref={audioRef}></audio>

      <Container className="h-100">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>Chuyển đổi văn bản thành tiếng nói</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="https://github.com/TruongTran0813">
                  Github
                </Nav.Link>
                <Nav.Link href="https://www.facebook.com/ku.p.truong/">
                  Facebook
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="row justify-content-center align-items-center h-75">
          <div className="col-12 col-md-10 col-sm-12 col-lg-8 col-xl-6">
            <h4 className="mb-4">
              Website dựa trên{" "}
              <a
                href="https://viettelgroup.ai/service/tts"
                rel="noreferrer"
                target="_blank"
              >
                ViettelAI (API TTS - Text To Speech)
              </a>
            </h4>
            <form onSubmit={convert}>
              <FloatingLabel
                controlId="floatingSelect1"
                label="Chọn giọng đọc"
                className="mb-3"
              >
                <Form.Select
                  onChange={(e) => setVoice(e.target.value)}
                  value={voice}
                >
                  {voices.map((v) => (
                    <option key={v.code} value={v.code}>
                      {v.name} - {v.description}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>

              <FloatingLabel
                controlId="floatingSelect2"
                label="Chọn tốt độ đọc"
                className="mb-3"
              >
                <Form.Select
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  value={speed}
                >
                  <option value={0.7}>-3</option>
                  <option value={0.8}>-2</option>
                  <option value={0.9}>-1</option>
                  <option value={1}>0</option>
                  <option value={1.1}>1</option>
                  <option value={1.2}>2</option>
                  <option value={1.3}>3</option>
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Nhập nội dung"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Nhập nội dung"
                  ref={inputRef}
                  required
                  value={text}
                  maxLength={500}
                  onChange={(e) => setText(e.target.value)}
                  style={{ height: "100px" }}
                />
              </FloatingLabel>

              <button type="submit" className="btn btn-primary">
                Chuyển
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
