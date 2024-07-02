"use client";

import { useState } from "react";
import { blobToText } from "./utils";
import { Textarea } from "@nextui-org/input";

export default function Marley() {
  const [encrypedText, setEncryptedText] = useState("");
  const [decrypedText, setDecryptedText] = useState("");

  const handleFile = async (file: File, action: string) => {
    const password = process.env.NEXT_PUBLIC_SECRET_PASSWORD;

    const formData: any = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    const endpoint = `${process.env.NEXT_PUBLIC_AES_API}/${action}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error processing file");
        return;
      }

      const fileName = file?.name?.split(".")?.[0] ?? "file";
      const generatedFileName =
        action === "encrypt" ? `${fileName}_C` : `${fileName}_D`;

      const fileBlob = (await response?.blob()) ?? null;
      if (fileBlob) {
        const fileUrl = URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `${generatedFileName}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const textContent = (await blobToText(fileBlob)) as string;
        if (action === "encrypt") {
          setEncryptedText(textContent);
          return;
        }

        setDecryptedText(textContent);
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEncryptFileChange = async (event: any) => {
    const file = event.target.files[0];
    await handleFile(file, "encrypt");
  };

  const handleDecryptFileChange = async (event: any) => {
    const file = event.target.files[0];
    await handleFile(file, "decrypt");
  };

  return (
    <div>
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
              onChange={handleEncryptFileChange}
            />
          </section>
          <section className="w-full flex justify-center">
            <Textarea
              className="p-3 w-[75%] rounded-md"
              value={encrypedText}
              isReadOnly
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
              onChange={handleDecryptFileChange}
            />
          </section>
          <section className="w-full flex justify-center">
            <Textarea
              className="p-3 w-[75%] h-[25vh] rounded-md"
              value={decrypedText}
              readOnly
            />
          </section>
        </div>
      </div>
      <div className="text-xs text-gray-400">
        <ul className="list-disc">
          <li>Cifra usando el input de la izquierda</li>
          <li>Descifra usando el input de la derecha</li>
          <li>
            Algoritmo: <b>AES-256</b>
          </li>
        </ul>
      </div>
    </div>
  );
}
