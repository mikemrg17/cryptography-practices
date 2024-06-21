"use client";

import { Tabs, Tab } from "@nextui-org/tabs";

export default function Practice4() {
  const handleClick = async () => {
    console.log("click");
    const endpoint = process.env.NEXT_PUBLIC_API_KEYS;

    try {
      const response = await fetch(`${endpoint}`, {
        method: "POST",
      });

      if (response) {
        const fileBlob = (await response?.blob()) ?? null;
        const fileUrl = URL.createObjectURL(fileBlob);

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `test.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // console.error("Error getting keys");
        return;
      }

      return;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs disabledKeys={["music"]} aria-label="Disabled Options">
        <Tab key="photos" title="Photos">
          <p>Generación llaves</p>
          <button onClick={handleClick}>llaves</button>
        </Tab>
        <Tab key="music" title="Music">
          <p>Firmar</p>
        </Tab>
        <Tab key="videos" title="Videos">
          <p>Ver</p>
        </Tab>
      </Tabs>
    </div>
  );
}
