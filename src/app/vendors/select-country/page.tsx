"use client";
import { Icons } from "@/components/icons/Icon";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import nigeria from "@/../../public/assets/images/nigeria.png";
import algeria from "@/../../public/assets/images/algeria.png";
import egypt from "@/../../public/assets/images/egypt.png";
import morocco from "@/../../public/assets/images/morrocco.png";

interface pageProps {}

const SelectCountry = ({}: pageProps) => {
  const router = useRouter();

  const countries = [
    { name: "Nigeria", image: nigeria },
    { name: "Algeria", image: algeria },
    { name: "Egypt", image: egypt },
    { name: "Morocco", image: morocco },
  ];

  const handleCountrySelect = (countryName: string) => {
    console.log(`Selected country: ${countryName}`);
    router.push(`/vendors?${countryName.toLowerCase()}`);
  };

  return (
    <section className="flex flex-col gap-16 w-11/12 max-w-6xl mx-auto min-h-screen mt-9">
      <header className="text-center flex flex-col justify-center items-center gap-4">
        <Icons.MemoVendor />
        <p className="text-3xl leading-tight font-semibold text-black">
          Memo empowers vendors to grow their business by connecting them with
          instant buyers.
        </p>
        <p className="text-2xl pb-2 w-fit font-bold text-black relative after:absolute after:content-[''] after:w-3/5 after:h-1 after:bg-black after:rounded-sm after:bottom-0 after:left-1/2 after:-translate-x-1/2">
          Choose your country
        </p>
      </header>
      <div className="w-full grid grid-cols-4 mx-auto justify-between  gap-y-16">
        {countries.map((country, index) => (
          <button
            key={index}
            className="py-[26px] justify-self-center px-[48px] w-fit gap-3 text-[18px] leading-[24.55px] font-normal text-black rounded-xl border-2 border-transparent hover:border-black flex items-center justify-center"
            onClick={() => handleCountrySelect(country.name)}
          >
            <Image
              src={country.image}
              alt={country.name}
              className="object-contain w-[60px] h-[60px]"
            />
          </button>
        ))}
        {countries.map((country, index) => (
          <button
            key={index}
            className="py-[26px] justify-self-center px-[48px] w-fit gap-3 text-[18px] leading-[24.55px] font-normal text-black rounded-xl border-2 border-transparent hover:border-black flex items-center justify-center"
            onClick={() => handleCountrySelect(country.name)}
          >
            <Image
              src={country.image}
              alt={country.name}
              className="object-contain w-[60px] h-[60px]"
            />
          </button>
        ))}
        {countries.map((country, index) => (
          <button
            key={index}
            className="py-[26px] justify-self-center px-[48px] w-fit gap-3 text-[18px] leading-[24.55px] font-normal text-black rounded-xl border-2 border-transparent hover:border-black flex items-center justify-center"
            onClick={() => handleCountrySelect(country.name)}
          >
            <Image
              src={country.image}
              alt={country.name}
              className="object-contain w-[60px] h-[60px]"
            />
          </button>
        ))}
        {countries.map((country, index) => (
          <button
            key={index}
            className="py-[26px] justify-self-center px-[48px] w-fit gap-3 text-[18px] leading-[24.55px] font-normal text-black rounded-xl border-2 border-transparent hover:border-black flex items-center justify-center"
            onClick={() => handleCountrySelect(country.name)}
          >
            <Image
              src={country.image}
              alt={country.name}
              className="object-contain w-[60px] h-[60px]"
            />
          </button>
        ))}
        {countries.map((country, index) => (
          <button
            key={index}
            className="py-[26px] justify-self-center px-[48px] w-fit gap-3 text-[18px] leading-[24.55px] font-normal text-black rounded-xl border-2 border-transparent hover:border-black flex items-center justify-center"
            onClick={() => handleCountrySelect(country.name)}
          >
            <Image
              src={country.image}
              alt={country.name}
              className="object-contain w-[60px] h-[60px]"
            />
          </button>
        ))}
        {countries.map((country, index) => (
          <button
            key={index}
            className="py-[26px] justify-self-center px-[48px] w-fit gap-3 text-[18px] leading-[24.55px] font-normal text-black rounded-xl border-2 border-transparent hover:border-black flex items-center justify-center"
            onClick={() => handleCountrySelect(country.name)}
          >
            <Image
              src={country.image}
              alt={country.name}
              className="object-contain w-[60px] h-[60px]"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default SelectCountry;
