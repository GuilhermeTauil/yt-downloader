import { spawn } from "child_process";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Função para garantir que a pasta de downloads exista
const downloadFolder = path.join(process.cwd(), "downloads");
if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder);
}

export async function POST(req) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "URL inválida!" }, { status: 400 });
    }

    // Caminho absoluto para o yt-dlp
    const ytDlpPath = path.join(
      "C:",
      "Users",
      "Guilherme",
      "Desktop",
      "pojetos",
      "Site",
      "youtube-downloader",
      "bin",
      "yt-dlp.exe"
    );

    // Caminho de saída para o vídeo
    const outputPath = path.join(downloadFolder, "%(title)s.%(ext)s");

    // Usando spawn para chamar o yt-dlp
    const ytDlp = spawn(ytDlpPath, ["-f", "mp4", "-o", outputPath, videoUrl]);

    // Retorna ao cliente imediatamente que o download foi iniciado
    ytDlp.on("spawn", () => {
      console.log("Download iniciado...");
    });

    ytDlp.on("close", (code) => {
      if (code === 0) {
        console.log("Download concluído com sucesso!");

        // Renomear o arquivo baixado
        const downloadedFilePath = path.join(
          downloadFolder,
          "O ARQUIVO - Como baixar videos do YouTube.mp4"
        );

        // Mover o arquivo para a pasta public
        const publicPath = path.join(
          process.cwd(),
          "public",
          "downloads",
          "O ARQUIVO - Como baixar videos do YouTube.mp4"
        );

        // Verifique se a pasta "downloads" existe dentro de "public"
        const publicFolder = path.dirname(publicPath);
        if (!fs.existsSync(publicFolder)) {
          fs.mkdirSync(publicFolder, { recursive: true });
        }

        // Mover o arquivo
        fs.renameSync(downloadedFilePath, publicPath);
        console.log("Arquivo movido para a pasta pública.");
      } else {
        console.error(`yt-dlp saiu com código ${code}`);
      }
    });

    return NextResponse.json({ message: "Download iniciado!" });
  } catch (error) {
    console.error("Erro no servidor:", error.message);
    return NextResponse.json(
      { error: "Erro ao processar o vídeo." },
      { status: 500 }
    );
  }
}
