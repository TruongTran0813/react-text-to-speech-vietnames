import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  FloatingLabel,
  Form,
  Nav,
  Navbar,
  Spinner,
} from "react-bootstrap";
import "./App.css";

export interface IVoices {
  name: string;
  description: string;
  code: string;
}
function App() {
  const [text, setText] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [voices, setVoices] = useState<IVoices[]>([]);
  const [voice, setVoice] = useState("");
  const [speed, setSpeed] = useState(1);
  const [isLoading, setLoading] = useState(false);
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

    if (!text) {
      alert("Vui lòng nhập nội dung muốn chuyển đổi");
      return;
    }
    if (text.length > 500) {
      alert("Nội dung không quá 500 ký tự");
      return;
    }
    setLoading(true);
    const data = await getData();
    if (data.body) {
      const reader = data.body.getReader();
      let arr: any[] = [];
      let result;
      while (!(result = await reader.read()).done) {
        arr.push(result.value);
      }
      const newArr = new Uint8Array(
        arr.reduce((acc, curr) => [...acc, ...curr], [])
      );
      const blob = new Blob([newArr], { type: "audio/mp3" });
      let url = window.URL.createObjectURL(blob);
      console.log(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    }
    setLoading(false);
  };
  const randomName = () => {
    var m = new Date();
    var dateString =
      m.getUTCFullYear() +
      ("0" + (m.getUTCMonth() + 1)).slice(-2) +
      ("0" + m.getUTCDate()).slice(-2) +
      ("0" + m.getUTCHours()).slice(-2) +
      ("0" + m.getUTCMinutes()).slice(-2) +
      ("0" + m.getUTCSeconds()).slice(-2);
    return dateString;
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
                  required
                  value={text}
                  maxLength={500}
                  onChange={(e) => setText(e.target.value)}
                  style={{ height: "100px" }}
                />
              </FloatingLabel>

              <div className="d-flex">
                {isLoading ? (
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                  >
                    <Spinner animation="border" variant="light" /> &nbsp; Đang
                    chuyển
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Chuyển
                  </button>
                )}
                {audioRef.current?.src && (
                  <>
                    <button
                      onClick={() => audioRef.current?.play()}
                      type="button"
                      className=" ms-4 btn btn-success"
                    >
                      Phát lại
                    </button>
                    <a
                      href={audioRef.current.src}
                      target="_blank"
                      rel="noreferrer"
                      download={`sound-${randomName()}.mp3`}
                      className=" ms-4 btn btn-warning"
                    >
                      Tải xuống âm thanh
                    </a>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
