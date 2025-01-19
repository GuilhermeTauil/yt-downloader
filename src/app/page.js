"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [downloads, setDownloads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Função para buscar os vídeos da pasta downloads
  const fetchDownloads = async () => {
    try {
      const response = await fetch("/api/listDownloads");
      const data = await response.json();
      if (response.ok) {
        setDownloads(data.files || []);
      } else {
        setError(data.error || "Erro ao carregar arquivos.");
      }
    } catch (err) {
      setError("Erro ao carregar arquivos.");
      console.error(err);
    }
  };

  // Chama a função de buscar vídeos quando a página é carregada
  useEffect(() => {
    fetchDownloads();
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!videoUrl) {
      setError("Por favor, insira um link.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erro ao baixar o vídeo.");
        setIsLoading(false);
        return;
      }

      // Exibir mensagem de sucesso
      setSuccessMessage("O download foi concluído com sucesso!");
      setIsLoading(false);

      // Atualiza a lista de vídeos sem recarregar a página
      fetchDownloads();
    } catch (err) {
      console.error(err);
      setError("Erro ao processar o download.");
      setIsLoading(false);
    }
  };

  const handleDownloadFile = (fileName) => {
    const url = `/downloads/${encodeURIComponent(fileName)}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <main style={{ textAlign: "center", padding: "50px" }}>
      <h1>Baixar Vídeos do YouTube</h1>
      <form onSubmit={handleDownload} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Insira o link do vídeo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Processando..." : "Baixar Vídeo"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
      {successMessage && (
        <p style={{ color: "green", marginTop: "20px" }}>{successMessage}</p>
      )}

      {/* Exibir vídeos baixados */}
      <div style={{ marginTop: "40px" }}>
        <h2>Vídeos Disponíveis</h2>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {downloads.map((fileName) => (
            <li key={fileName} style={{ marginBottom: "10px" }}>
              {fileName}
              <button
                onClick={() => handleDownloadFile(fileName)}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Baixar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Exibir animação de carregamento */}
      {isLoading && (
        <div style={{ marginTop: "20px" }}>
          <div className="loader"></div>
        </div>
      )}
    </main>
  );
}
