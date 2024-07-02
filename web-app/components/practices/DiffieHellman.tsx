"use client";

import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import JSZip from "jszip";

export default function DiffieHellman() {
  const [file, setFile] = useState<File | null>(null);
  const [gnFile, setGnFile] = useState<File | null>(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [secret, setSecret] = useState(null);

  const handleGNFileChange = (event: any) => {
    const file = event.target.files[0];
    setGnFile(file);
  };

  const handlePrivateKeyChange = (event: any) => {
    const key = event.target.files[0];
    setPrivateKey(key);
  };

  const handlePublicKeyChange = (event: any) => {
    const key = event.target.files[0];
    setPublicKey(key);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSecretChange = (event: any) => {
    const file = event.target.files[0];
    setSecret(file);
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const generateSecretAndKeys = async () => {
    try {
      setLoading(true);
      const endpoint = process.env.NEXT_PUBLIC_API_DIFFIE_HELLMAN;
      const response = await fetch(`${endpoint}/generate-keys-with-pg`, {
        method: "POST",
      });

      if (response.ok) {
        const fileBlob = (await response?.blob()) ?? null;
        const fileUrl = URL.createObjectURL(fileBlob);

        const zip = new JSZip();
        const zipContent = await zip.loadAsync(fileBlob);
        const gn = zipContent.file("pg.pem");
        const publicKeyFile = zipContent.file("public.pem");
        const privateKeyFile = zipContent.file("private.pem");

        if (gn && publicKeyFile && privateKeyFile) {
          const gnText = await gn.async("text");
          const publicKeyText = await publicKeyFile.async("text");
          const privateKeyText = await privateKeyFile.async("text");

          const gnBlob = new Blob([gnText], { type: "text/plain" });
          const publicBlob = new Blob([publicKeyText], { type: "text/plain" });
          const privateBlob = new Blob([privateKeyText], {
            type: "text/plain",
          });

          downloadFile(gnBlob, "pg.pem");
          downloadFile(publicBlob, "public.pem");
          downloadFile(privateBlob, "private.pem");
        } else {
          console.error("Error: .pem files not found in the zip");
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      return;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return;
    }
  };

  const generateKeysFromGN = async () => {
    if (!gnFile) {
      console.log("A file must be upladed");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", gnFile);
      const endpoint = process.env.NEXT_PUBLIC_API_DIFFIE_HELLMAN;
      const response = await fetch(`${endpoint}/generate-keys-from-pg`, {
        method: "POST",
        headers: {
          Accept: "application/text",
        },
        body: formData,
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

      setLoading(false);
      return;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return;
    }
  };

  const generateSecret = async () => {
    if (!gnFile || !privateKey || !publicKey) {
      console.log("file and keys must be upladed");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("files", gnFile);
      formData.append("files", privateKey);
      formData.append("files", publicKey);
      const endpoint = process.env.NEXT_PUBLIC_API_DIFFIE_HELLMAN;
      const response = await fetch(`${endpoint}/generate-shared-secret`, {
        method: "POST",
        headers: {
          Accept: "application/text",
        },
        body: formData,
      });

      if (response.ok) {
        const fileBlob = (await response?.blob()) ?? null;
        if (fileBlob) {
          const fileUrl = URL.createObjectURL(fileBlob);
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = `secret.der`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setLoading(false);
          return;
        }
        setLoading(false);
      }

      setLoading(false);
      return;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return;
    }
  };

  const encryptFile = async () => {
    if (!file || !secret) {
      console.log("2 files must be upladed");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("files", file);
      formData.append("files", secret);
      const endpoint = process.env.NEXT_PUBLIC_AES_API;
      const response = await fetch(`${endpoint}/encrypt-pass-file`, {
        method: "POST",
        headers: {
          Accept: "application/text",
        },
        body: formData,
      });

      if (response.ok) {
        const fileBlob = (await response?.blob()) ?? null;
        const fileName = file?.name?.split(".")?.[0] ?? "file";
        if (fileBlob) {
          const fileUrl = URL.createObjectURL(fileBlob);
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = `${fileName}_C.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setLoading(false);
          return;
        }
        setLoading(false);
      }

      setLoading(false);
      return;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return;
    }
  };

  const decryptFile = async () => {
    if (!file || !secret) {
      console.log("2 files must be upladed");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("files", file);
      formData.append("files", secret);
      const endpoint = process.env.NEXT_PUBLIC_AES_API;
      const response = await fetch(`${endpoint}/decrypt-pass-file`, {
        method: "POST",
        headers: {
          Accept: "application/text",
        },
        body: formData,
      });

      if (response.ok) {
        const fileBlob = (await response?.blob()) ?? null;
        const fileName = file?.name?.split(".")?.[0] ?? "file";
        if (fileBlob) {
          const fileUrl = URL.createObjectURL(fileBlob);
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = `${fileName}_D.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setLoading(false);
          return;
        }
        setLoading(false);
      }

      setLoading(false);
      return;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs
        classNames={{
          tabList: "w-full relative p-0",
          cursor: "w-full",
          tab: "px-0",
          tabContent:
            "group-data-[selected=true]:text-gray-400 dark:group-data-[selected=true]:text-gray-100",
        }}
      >
        <Tab key="step1" title="Generar nuevo secreto compartido">
          <div className="flex flex-col">
            <p className="text-sm">Genera números g y n</p>
            <p className="text-sm">Genera llave privada (a) y pública (Ka)</p>
            <div className="mt-3">
              <Button
                onClick={generateSecretAndKeys}
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
          </div>
        </Tab>
        <Tab key="step2" title="Generar llaves a partir de g y n">
          <div className="flex flex-col">
            <p className="text-sm">Genera llave privada (b) y pública (Kb)</p>
            <div>
              <p className="text-xs my-3 text-gray-500">Archivo con g y n:</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handleGNFileChange}
              />
            </div>
            <div className="mt-3">
              <Button
                onClick={generateKeysFromGN}
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
          </div>
        </Tab>
        <Tab key="step3" title="Generar secreto">
          <div className="flex flex-col">
            <p className="text-sm">Genera la llave secreta</p>
            <div>
              <p className="text-xs my-3 text-gray-500">Archivo con g y n:</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handleGNFileChange}
              />
            </div>
            <div>
              <p className="text-xs my-3 text-gray-500">Llave privada (a):</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handlePrivateKeyChange}
              />
            </div>
            <div>
              <p className="text-xs my-3 text-gray-500">Llave pública (Kb)</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handlePublicKeyChange}
              />
            </div>
            <div className="mt-3">
              <Button
                onClick={generateSecret}
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
          </div>
        </Tab>
        <Tab key="step4" title="Cifrar archivo con secreto">
          <div className="flex flex-col">
            <p className="text-sm">Cifra un archivo con un secreto</p>
            <div>
              <p className="text-xs my-3 text-gray-500">Archivo a descifrar:</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <p className="text-xs my-3 text-gray-500">Secreto (.der):</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handleSecretChange}
              />
            </div>
            <div className="mt-3">
              <Button
                onClick={decryptFile}
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
                {loading ? "Cifrando" : "Cifrar"}
              </Button>
            </div>
          </div>
        </Tab>
        <Tab key="step5" title="Descifrar archivo con secreto">
          <div className="flex flex-col">
            <p className="text-sm">
              Descrifra un archivo cifrado con un secreto
            </p>
            <div>
              <p className="text-xs my-3 text-gray-500">Archivo a descifrar:</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <p className="text-xs my-3 text-gray-500">Secreto (.der):</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handleSecretChange}
              />
            </div>
            <div className="mt-3">
              <Button
                onClick={decryptFile}
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
                {loading ? "Descifrando" : "Descifrar"}
              </Button>
            </div>
          </div>
        </Tab>
      </Tabs>
      <div className="text-xs text-gray-400">
        <ul className="list-disc">
          <li>
            Servicios:
            <ul className="list-disc">
              <li>Confidencialidad</li>
              <li>No repudio</li>
              <li>Integridad</li>
              <li>Autenticación</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
