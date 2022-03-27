import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

export const SpeechToText = () => {
  const [loadingFile, setLoadingFile] = useState(false);
  const [text, setText] = useState<string[]>([]);
  const token_id = process.env.REACT_APP_TOKEN_ID || "";
  const url = "https://viettelgroup.ai/voice/api/asr/v1/rest/decode_file";

  const handleSetFile = async (file: File) => {
    if (file.type !== "audio/mpeg") {
      alert("Vui lòng chọn file âm thanh");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoadingFile(true);
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        //"Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary",
        token: token_id,
      },
      body: formData,
    }).then((res) => res.json());
    setLoadingFile(false);
    if (response && response.length > 0) {
      let newText: string[] = [];
      response.forEach((e: any) => {
        let result = e.result.hypotheses;

        result.forEach((v: any) => {
          newText.push(v.transcript);
        });
      });
      setText(newText);
    }
  };
  console.log(text);
  return (
    <>
      <h4 className="mb-4">
        Website dựa trên{" "}
        <a
          href="https://viettelgroup.ai/service/asr"
          rel="noreferrer"
          target="_blank"
        >
          ViettelAI (API ASR - Speech To Text)
        </a>
      </h4>
      <div className="my-3">
        <label className="btn btn-primary">
          {loadingFile ? (
            <Spinner animation="border" variant="light" />
          ) : (
            `Tải file`
          )}
          <input
            type="file"
            className="d-none"
            onChange={(e) => e.target.files && handleSetFile(e.target.files[0])}
          />
        </label>
      </div>
      <div
        className="asr-editor"
        placeholder="Ghi âm trực tiếp, tải file ghi âm sẵn hoặc sử dụng file mẫu để trải nghiệm"
      >
        {text.map((t) => (
          <>
            {t}
            <br />
          </>
        ))}
      </div>
    </>
  );
};
