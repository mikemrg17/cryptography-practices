"use client";

import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { useState } from "react";

export default function DigitalSign() {
  const [file, setFile] = useState<File | null>(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [loadingSign, setLoadingSign] = useState(false);
  const [fileSigned, setFileSigned] = useState(false);
  const [signedFile, setSignedFile] = useState<File | null>(null);
  const [publicKey, setPublicKey] = useState(null);
  const [verifyingSign, setVerifyingSign] = useState(false);
  const [verifiedSign, setVerifiedSign] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSignedFileChange = (event: any) => {
    const file = event.target.files[0];
    setSignedFile(file);
  };

  const handlePrivateKeyChange = (event: any) => {
    const key = event.target.files[0];
    setPrivateKey(key);
  };

  const handlePublicKeyChange = (event: any) => {
    const key = event.target.files[0];
    setPublicKey(key);
  };

  const signFile = async () => {
    if (!file || !privateKey) {
      console.log("A file and a private key must be selected");
      return;
    }
    setLoadingSign(true);
    const endpoint = process.env.NEXT_PUBLIC_API_SIGNATURE;

    const formData = new FormData();

    formData.append("files", file);
    formData.append("files", privateKey);

    try {
      const response = await fetch(`${endpoint}/sign`, {
        method: "POST",
        headers: {
          Accept: "application/text",
        },
        body: formData,
      });

      if (response.ok) {
        const fileBlob = (await response?.blob()) ?? null;
        const fileUrl = URL.createObjectURL(fileBlob);

        const signedFileName = file?.name?.split(".")?.[0] ?? "file";

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `${signedFileName}_F.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setFileSigned(true);
        setLoadingSign(false);
        return;
      }

      setFileSigned(false);
      setLoadingSign(false);
      return;
    } catch (error) {
      console.error("Error:", error);
      setFileSigned(false);
      setLoadingSign(false);
      return;
    }
  };

  const dropzone = (file: string) => (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Selecciona</span> o arrastra
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Extensión preferible: .txt
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={
            file === "signedFile" ? handleSignedFileChange : handleFileChange
          }
        />
      </label>
    </div>
  );

  const fileSelected = (file: string = "toSign") => dropzone(file);

  const verifySign = async () => {
    if (!signedFile || !publicKey) {
      console.log("A signed file and a public key must be selected");
      return;
    }
    setVerifyingSign(true);
    const endpoint = process.env.NEXT_PUBLIC_API_SIGNATURE;

    const formData = new FormData();

    formData.append("files", signedFile);
    formData.append("files", publicKey);

    try {
      const response = await fetch(`${endpoint}/verify`, {
        method: "POST",
        headers: {
          Accept: "application/text",
        },
        body: formData,
      });

      if (response.ok) {
        setVerifyingSign(false);
        setVerifiedSign(true);
        return;
      }

      setVerifyingSign(false);
      setVerifiedSign(false);
      return;
    } catch (error) {
      setVerifyingSign(false);
      console.error("Error:", error);
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
        <Tab key="step1" title="Firmar archivo">
          <div>
            <p className="text-xs my-3 text-gray-500">Archivo a firmar:</p>
            {!file ? fileSelected() : <div>{file.name}</div>}
            <div>
              <p className="text-xs my-3 text-gray-500">Llave privada:</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handlePrivateKeyChange}
              />
            </div>
            <div className="mt-3">
              <Button
                onClick={signFile}
                color="primary"
                variant="shadow"
                size="sm"
                radius="full"
                isLoading={loadingSign}
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
                {loadingSign ? "Firmando archivo" : "Firmar archivo"}
              </Button>
              {fileSigned ? (
                <p className="text-green-500 text-xs mt-5">Archivo firmado</p>
              ) : null}
            </div>
          </div>
        </Tab>
        <Tab key="step2" title="Verificar archivo firmado">
          <div>
            <p className="text-xs my-3 text-gray-500">Archivo a verificar:</p>
            {!signedFile ? (
              fileSelected("signedFile")
            ) : (
              <div>{signedFile.name}</div>
            )}
            <div>
              <p className="text-xs my-3 text-gray-500">Llave pública:</p>
              <input
                type="file"
                className="text-gray-600"
                onChange={handlePublicKeyChange}
              />
            </div>
            <div className="mt-3">
              <Button
                onClick={verifySign}
                color="primary"
                variant="shadow"
                size="sm"
                radius="full"
                isLoading={verifyingSign}
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
                {verifyingSign ? "Verificando firma" : "Verificar firma"}
              </Button>
              {verifiedSign ? (
                <p className="text-green-500 text-xs mt-5">
                  Auntenticación correcta
                </p>
              ) : (
                <p className="text-red-500 text-xs mt-5">
                  Documento no autenticado
                </p>
              )}
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
