import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const downloadsDir = path.resolve("downloads"); // Pasta de downloads

  try {
    // Lê os arquivos na pasta downloads
    const files = fs.readdirSync(downloadsDir).filter(
      (file) => file.endsWith(".mp4") // Filtra apenas os arquivos de vídeo
    );

    // Retorna a lista de arquivos
    return NextResponse.json({ files });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao listar os arquivos." },
      { status: 500 }
    );
  }
}
