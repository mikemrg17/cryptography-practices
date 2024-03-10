"use client"

import Header from "./components/Header/Header"
import { useState } from "react"

export default function Home() {

  const [text, setText] = useState("")

  const handleFileChange = async (event) => {
    const file = event.target.files[0]

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(process.env.NEXT_PUBLIC_API, {
      method: "POST",
      body: formData,
    })

    console.log(response)

  }


  return (
    <div className="w-[100vw] h-[100vh] bg-gray-50">
      <Header />
      <main className="w-full h-[80%] grid grid-cols-2">
        <div className="flex justify-center pt-10">
          <div className="flex flex-col space-y-10">
            <section>
              <h1 className="text-6xl text-red-600 text-center">Encrypt</h1>
              <p className="mt-3 text-gray-400 text-center">Encrypt a message so only the person you want can read it.</p>
            </section>
            <section>
              <input type="file" onChange={handleFileChange} />
            </section>
          </div>
        </div>
        <div className="flex justify-center pt-10">
          <div className="space-y-10">
            <section>
              <h1 className="text-6xl text-red-600 text-center">Decrypt</h1>
              <p className="mt-3 text-gray-400 text-center">Decrypt a secret message.</p>
            </section>
            <section>
              <textarea className="bg-white shadow-sm" id="pdfText" cols={30} rows={10} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
