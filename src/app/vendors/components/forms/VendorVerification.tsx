import { Icons } from "@/components/icons/Icon";
import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CountryCode {
  code: string;
  country: string;
}

const countryCodes: CountryCode[] = [
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+234", country: "Nigeria" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
];

const statesByCountry: Record<string, string[]> = {
  "+1": ["Alabama", "Alaska", "Arizona", "California", "New York", "Texas"],
  "+44": ["England", "Scotland", "Wales", "Northern Ireland"],
  "+234": ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Kaduna"],
  "+91": ["Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Gujarat"],
  "+61": ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  "+49": ["Bavaria", "Berlin", "Hamburg", "Hesse", "Lower Saxony"],
  "+33": ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Occitanie"],
  "+86": ["Beijing", "Shanghai", "Guangdong", "Sichuan", "Zhejiang"],
  "+81": ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Okinawa"],
  "+27": ["Western Cape", "Gauteng", "KwaZulu-Natal", "Eastern Cape"],
};

const citiesByState: Record<string, string[]> = {
  Alabama: ["Birmingham", "Montgomery", "Huntsville", "Mobile"],
  Alaska: ["Anchorage", "Fairbanks", "Juneau"],
  Arizona: ["Phoenix", "Tucson", "Mesa"],
  California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
  Texas: ["Houston", "Dallas", "Austin", "San Antonio"],

  England: ["London", "Manchester", "Birmingham", "Liverpool"],
  Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
  Wales: ["Cardiff", "Swansea", "Newport"],
  "Northern Ireland": ["Belfast", "Londonderry", "Lisburn"],

  Lagos: ["Ikeja", "Surulere", "Lekki", "Victoria Island"],
  Abuja: ["Maitama", "Wuse", "Garki"],
  Kano: ["Fagge", "Tarauni", "Gwale"],
  Rivers: ["Port Harcourt", "Bonny", "Obio-Akpor"],
  Oyo: ["Ibadan", "Ogbomosho", "Oyo"],
  Kaduna: ["Kaduna North", "Kaduna South", "Zaria"],

  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Delhi: ["New Delhi", "Dwarka", "Saket", "Rohini"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],

  "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
  Victoria: ["Melbourne", "Geelong", "Ballarat"],
  Queensland: ["Brisbane", "Gold Coast", "Cairns"],
  "Western Australia": ["Perth", "Fremantle", "Albany"],

  Bavaria: ["Munich", "Nuremberg", "Augsburg"],
  Berlin: ["Berlin"],
  Hamburg: ["Hamburg"],
  Hesse: ["Frankfurt", "Wiesbaden", "Darmstadt"],
  "Lower Saxony": ["Hanover", "Braunschweig", "Oldenburg"],

  "Île-de-France": ["Paris", "Versailles", "Boulogne-Billancourt"],
  "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Cannes"],
  Occitanie: ["Toulouse", "Montpellier", "Perpignan"],

  Beijing: ["Beijing"],
  Shanghai: ["Shanghai"],
  Guangdong: ["Guangzhou", "Shenzhen", "Dongguan"],
  Sichuan: ["Chengdu", "Mianyang", "Luzhou"],
  Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou"],

  Tokyo: ["Shibuya", "Shinjuku", "Ginza"],
  Osaka: ["Namba", "Umeda", "Tennoji"],
  Kyoto: ["Higashiyama", "Arashiyama", "Fushimi"],
  Hokkaido: ["Sapporo", "Asahikawa", "Hakodate"],
  Okinawa: ["Naha", "Ishigaki", "Nago"],

  "Western Cape": ["Cape Town", "Stellenbosch", "Paarl"],
  Gauteng: ["Johannesburg", "Pretoria", "Soweto"],
  "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay"],
  "Eastern Cape": ["Port Elizabeth", "East London", "Mthatha"],
};

interface VendorVerificationProps {
  onClose: () => void;
  isDrawerOpen: boolean;
}

const VendorVerification: React.FC<VendorVerificationProps> = ({
  onClose,
  isDrawerOpen,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>("+234");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const states = statesByCountry[selectedCountryCode] || [];

  const cities = citiesByState[selectedState] || [];

  const router = useRouter();

  if (!isDrawerOpen) {
    return null;
  } else
    return (
      <Drawer onClose={onClose} title="Vendor Signup" width="40%">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col">
            <h6 className="text-2xl !leading-[48px] font-semibold text-accent-20">
              Start selling with Memo
            </h6>
            <p className="text-base !leading-[21.82px] font-normal text-accent-10">
              Join our platform to sell smarter, earn more, and efficiently run
              your online business
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Business name"
              className="h-[60px]"
            />
            <Input
              type="text"
              placeholder="Instagram @"
              className="h-[60px] mt-2"
            />
            <div className="*:w-1/2 flex items-center gap-[18px]">
              <Input
                type="text"
                placeholder="First name"
                className="h-[60px]"
              />
              <Input type="text" placeholder="Last name" className="h-[60px]" />
            </div>
            <div className="flex items-center gap-[18px] justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "w-[30%]  h-[60px] flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                    "placeholder:text-[#919191]",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "md:text-sm"
                  )}
                >
                  <span
                    className={`text-base !leading-[21.82px] font-normal  ${
                      selectedCountryCode ? "text-accent-0" : "text-[#919191]"
                    }`}
                  >
                    {" "}
                    {selectedCountryCode}
                  </span>
                  <Icons.ChevronDownGray />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-56 overflow-y-auto">
                  {countryCodes.map((item) => (
                    <DropdownMenuItem
                      key={item.code}
                      onClick={() => {
                        setSelectedCountryCode(item.code);
                        setSelectedState("");
                      }}
                    >
                      <Phone className="mr-2" size={16} />
                      <span>{item.code}</span>
                      <span className="ml-2 text-gray-500">{item.country}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                type="tel"
                className={cn(
                  "flex-1 h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
                  "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                  "placeholder:text-[#919191]",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "md:text-sm"
                )}
                placeholder="Phone"
              />
            </div>
            <Input
              type="email"
              placeholder="Email address"
              className="h-[60px]"
            />
            <div className="space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "flex-1 flex items-center justify-between h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                    "placeholder:text-[#919191]",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "md:text-sm"
                  )}
                >
                  <span
                    className={`text-base !leading-[21.82px] font-normal  ${
                      selectedState ? "text-accent-0" : "text-[#919191]"
                    }`}
                  >
                    {" "}
                    {selectedState || "State"}
                  </span>
                  <Icons.ChevronDownGray />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-56 overflow-y-auto !min-w-[400px] w-full">
                  {states.map((state) => (
                    <DropdownMenuItem
                      key={state}
                      onClick={() => setSelectedState(state)}
                    >
                      {state}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "flex-1 flex items-center justify-between h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                    "placeholder:text-[#919191]",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "md:text-sm"
                  )}
                >
                  <span
                    className={`text-base !leading-[21.82px] font-normal  ${
                      selectedState ? "text-accent-0" : "text-[#919191]"
                    }`}
                  >
                    {selectedCity || "City"}
                  </span>
                  <Icons.ChevronDownGray />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-56 overflow-y-auto !min-w-[400px] w-full">
                  {cities.map((city) => (
                    <DropdownMenuItem
                      key={city}
                      onClick={() => setSelectedCity(city)}
                    >
                      {city}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => {
                onClose();
                router.push(`/vendors?email-verification`);
              }}
              className="hover:bg-[#DE3633] mt-[10px]"
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </Drawer>
    );
};

export default VendorVerification;
