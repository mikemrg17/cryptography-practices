"use client";

import React from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { TABS } from "./constants";

export default function Home() {
  return (
    <section className="flex flex-col gap-4 p-4">
      <Tabs
        aria-label="Options"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none border-b border-divider",
          cursor: "w-full bg-blue-600",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-blue-600",
        }}
        items={TABS}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {React.createElement(item.content)}
          </Tab>
        )}
      </Tabs>
    </section>
  );
}
