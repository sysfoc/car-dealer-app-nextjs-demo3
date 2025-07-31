"use client";
import React, { useState } from "react";
import { Label, TextInput, Button, Modal } from "flowbite-react";
import * as Icons from "react-icons/fa";

const Page = () => {
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("FaFacebookF");
  const [search, setSearch] = useState("");

  const iconKeys = Object.keys(Icons).filter((key) =>
    key.toLowerCase().includes(search.toLowerCase()),
  );

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    setIsIconPickerOpen(false);
  };

  const SelectedIconComponent = Icons[selectedIcon];

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold">Edit Social Media Items</h2>
      <div>
        <form className="mt-5 flex flex-col gap-3">
          <div>
            <Label htmlFor="url">URL:</Label>
            <TextInput id="url" placeholder="https://www.facebook.com/" />
          </div>
          <div>
            <p className="text-sm">Selected Icon:</p>
            <div className="mt-3">
              {SelectedIconComponent && <SelectedIconComponent fontSize={25} />}
            </div>
            <div className="mt-5">
              <Button onClick={() => setIsIconPickerOpen(true)} color={"dark"}>
                Choose Icon
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="order">Order:</Label>
            <TextInput id="order" type="number" placeholder="1" />
          </div>
          <div>
            <Button className="mt-3 w-full" color={"dark"}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      <Modal show={isIconPickerOpen} onClose={() => setIsIconPickerOpen(false)}>
        <Modal.Header>Choose an Icon</Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder="Search Icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          <div className="grid max-h-60 grid-cols-4 gap-4 overflow-y-auto">
            {iconKeys.map((iconKey) => {
              const IconComponent = Icons[iconKey];
              return (
                <div
                  key={iconKey}
                  className="flex cursor-pointer flex-col items-center gap-2"
                  onClick={() => handleIconSelect(iconKey)}
                >
                  <IconComponent fontSize={25} />
                  <span className="text-xs">{iconKey}</span>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Page;
