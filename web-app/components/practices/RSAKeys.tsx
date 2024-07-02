"use client";

import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useState } from "react";
import JSZip from "jszip";

export default function RSAKeys() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadFile = (blob: Blob, fileName: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const generateKeyPair = async () => {
    setLoading(true);
    const endpoint = process.env.NEXT_PUBLIC_API_GENERATE_KEYS;

    try {
      const response = await fetch(`${endpoint}`, {
        method: "POST",
      });

      if (response.ok) {
        const fileBlob = (await response?.blob()) ?? null;
        const fileUrl = URL.createObjectURL(fileBlob);

        const zip = new JSZip();
        const zipContent = await zip.loadAsync(fileBlob);
        const publicKeyFile = zipContent.file("public.pem");
        const privateKeyFile = zipContent.file("private.pem");

        if (publicKeyFile && privateKeyFile) {
          const publicKeyText = await publicKeyFile.async("text");
          const privateKeyText = await privateKeyFile.async("text");

          setPublicKey(publicKeyText);
          setPrivateKey(privateKeyText);

          const publicBlob = new Blob([publicKeyText], { type: "text/plain" });
          const privateBlob = new Blob([privateKeyText], {
            type: "text/plain",
          });

          downloadFile(publicBlob, "public.pem");
          downloadFile(privateBlob, "private.pem");
        } else {
          console.error("Error: .pem files not found in the zip");
        }
        setLoading(false);
        return;
      }

      console.error("Error getting keys");
      setLoading(false);
      return;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return;
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center space-x-4">
        <p className="text-sm">Genera un par de llaves con RSA:</p>
        <Button
          onClick={generateKeyPair}
          color="primary"
          variant="shadow"
          size="sm"
          radius="full"
          isLoading={loading}
          spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }
        >
          {loading ? "Generando" : "Generar"}
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-2">
        <div className="w-full h-full flex flex-col pt-3 space-y-10 items-center">
          <section>
            <h1 className="text-5xl text-blue-600 text-center">
              Llave pública
            </h1>
            <p className="mt-3 text-gray-400 text-center">
              Usa esta llave para que solo la persona correcta pueda accesar
            </p>
          </section>
          <section className="w-full flex flex-col justify-center items-center">
            <Textarea
              className="p-3 w-[75%] rounded-md"
              id="pdfText"
              value={publicKey}
            />
          </section>
        </div>
        <div className="w-full h-full flex flex-col pt-3 space-y-10 items-center">
          <section>
            <h1 className="text-5xl text-blue-600 text-center">
              Llave privada
            </h1>
            <p className="mt-3 text-gray-400 text-center">
              Usa esta llave para acceder a archivos confidenciales
            </p>
          </section>
          <section className="w-full flex flex-col justify-center items-center">
            <Textarea
              className="p-3 w-[75%] rounded-md"
              id="pdfText"
              value={privateKey}
            />
          </section>
        </div>
      </div>
      <div className="text-xs text-gray-400">
        <ul className="list-disc">
          <li>
            Algoritmo: <b>RSA</b>
          </li>
        </ul>
      </div>
    </div>
  );
}
