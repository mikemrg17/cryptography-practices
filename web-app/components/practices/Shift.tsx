"use client";

import { useState } from "react";
import { shiftText } from "./utils";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function Shift() {
  const [encrypedText, setEncryptedText] = useState("");
  const [decrypedText, setDecryptedText] = useState("");
  const [shift, setShift] = useState("3");

  const shiftMessage = (action: string) => {
    const shiftNumber = Number.parseInt(shift);
    const shiftedText = shiftText(encrypedText, action, shiftNumber);
    if (action === "encrypt") {
      setEncryptedText(shiftedText);
      return;
    }

    setDecryptedText(shiftedText.toLowerCase());
  };

  return (
    <div>
      <div>
        <Input
          className="w-fit"
          type="number"
          label="Corrimiento"
          labelPlacement="outside-left"
          value={shift}
          onValueChange={setShift}
        />
      </div>
      <div className="w-full h-full grid grid-cols-2">
        <div className="w-full h-full flex flex-col pt-3 space-y-10 items-center">
          <section>
            <h1 className="text-6xl text-blue-600 text-center">Cifrar</h1>
            <p className="mt-3 text-gray-400 text-center">
              Cifra un mensaje para que no sea legible a cualquiera.
            </p>
          </section>
          <section className="w-full flex flex-col justify-center items-center">
            <Textarea
              className="p-3 w-[75%] rounded-md"
              id="pdfText"
              value={encrypedText}
              onValueChange={setEncryptedText}
            />
            <Button
              className="text-white shadow-lg"
              color="primary"
              radius="full"
              variant="shadow"
              onClick={() => shiftMessage("encrypt")}
            >
              Cifrar
            </Button>
          </section>
        </div>
        <div className="w-full h-full flex flex-col pt-3 space-y-10 items-center">
          <section>
            <h1 className="text-6xl text-blue-600 text-center">Decifrar</h1>
            <p className="mt-3 text-gray-400 text-center">
              Decrifra un mensaje secreto
            </p>
          </section>
          <section className="w-full flex flex-col justify-center items-center">
            <Textarea
              className="p-3 w-[75%] rounded-md"
              id="pdfText"
              value={decrypedText}
              onValueChange={setDecryptedText}
            />
            <Button
              className="text-white shadow-lg"
              color="primary"
              radius="full"
              variant="shadow"
              onClick={() => shiftMessage("decrypt")}
            >
              Descifrar
            </Button>
          </section>
        </div>
      </div>
      <div className="text-xs text-gray-400">
        <ul className="list-disc">
          <li>Cifra usando el input de la izquierda</li>
          <li>Descifra usando el input de la derecha</li>
          <li>Cifrado de sustitución</li>
          <li>
            Corrimiento Cesar: <b>3</b>
          </li>
        </ul>
      </div>
    </div>
  );
}
