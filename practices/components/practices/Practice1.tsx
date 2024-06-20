"use client";

import { useState } from "react";

export default function Practice1() {
  const [encrypedText, setEncryptedText] = useState("");
  const [decrypedText, setDecryptedText] = useState("");

  const blobToText = async (blob: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  };

  const handleFile = async (file: any, action: any) => {
    const password = process.env.NEXT_PUBLIC_SECRET_PASSWORD;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    const endpoint =
      action === "encrypt"
        ? process.env.NEXT_PUBLIC_API_ENCRYPT
        : process.env.NEXT_PUBLIC_API_DECRYPT;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error capturing encrypted file");
        return;
      }

      const fileName = file?.name?.split(".")[0] ?? "file";
      const generatedFileName =
        action === "encrypt" ? `${fileName}_C` : `${fileName}_C_D`;

      const fileBlob = (await response?.blob()) ?? null;
      const fileUrl = URL.createObjectURL(fileBlob);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${generatedFileName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const textContent = await blobToText(fileBlob);
      if (action === "encrypt") {
        setEncryptedText(textContent);
      } else {
        setDecryptedText(textContent);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEncryptFileChange = async (event) => {
    const file = event.target.files[0];
    handleFile(file, "encrypt");
  };

  const handleDecryptFileChange = async (event) => {
    const file = event.target.files[0];
    handleFile(file, "decrypt");
  };

  return (
    <div className="w-full h-full grid grid-cols-2">
      <div className="w-full h-full flex flex-col pt-10 space-y-10 items-center">
        <section>
          <h1 className="text-6xl text-blue-600 text-center">Cifrar</h1>
          <p className="mt-3 text-gray-400 text-center">
            Cifra un mensaje para que no sea legible a cualquiera.
          </p>
        </section>
        <section>
          <input
            type="file"
            className="text-gray-600"
            onChange={() => handleEncryptFileChange}
          />
        </section>
        <section className="w-full text-center">
          <textarea
            className="bg-gray-800 text-gray-300 p-3 w-[75%] h-[25vh] rounded-md overflow-auto focus:border-blue-500"
            id="pdfText"
            value={encrypedText}
            readOnly
          />
        </section>
      </div>
      <div className="w-full h-full flex flex-col pt-10 space-y-10 items-center">
        <section>
          <h1 className="text-6xl text-blue-600 text-center">Decifrar</h1>
          <p className="mt-3 text-gray-400 text-center">
            Decrifra un mensaje secreto
          </p>
        </section>
        <section>
          <input
            type="file"
            className="text-gray-600"
            onChange={() => handleDecryptFileChange}
          />
        </section>
        <section className="w-full text-center">
          <textarea
            className="bg-gray-800 text-gray-300 p-3 w-[75%] h-[25vh] rounded-md overflow-auto"
            id="pdfText"
            value={decrypedText}
            readOnly
          />
        </section>
      </div>
    </div>
  );
}
