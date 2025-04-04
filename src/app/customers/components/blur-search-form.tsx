"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLocations, LocationResponse } from "@/api/public";
import { useDeliveryDetails } from "@/store/deliveryDetails";
import useFormErrorStore from "@/store/customer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SelectInput from "./Select";

const searchFormSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  date: z.date(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface BlurSearchFormProps {
  onSubmit: (data: object) => void;
  isFetching: boolean;
}

const extractCountries = (data: LocationResponse["data"]) => {
  return Object.keys(data);
};

const extractStates = (data: LocationResponse["data"], country: string) => {
  return Object.keys(data[country]?.states || {});
};

const extractCities = (
  data: LocationResponse["data"],
  country: string,
  state: string
) => {
  return data[country]?.states[state]?.cities || [];
};

export function BlurSearchForm({ onSubmit, isFetching }: BlurSearchFormProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const setDeliveryDetails = useDeliveryDetails(
    (state) => state.setDeliveryDetails
  );

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    mode: "onSubmit",
  });

  // Single query for all location data
  const locationsQuery = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  const locationData = locationsQuery.data?.data || {};
  const countries = extractCountries(locationData);
  const states = selectedCountry
    ? extractStates(locationData, selectedCountry)
    : [];
  const cities =
    selectedCountry && selectedState
      ? extractCities(locationData, selectedCountry, selectedState)
      : [];

  const setFormError = useFormErrorStore((state) => state.setFormError);
  const resetFormError = useFormErrorStore((state) => state.resetFormError);

  const handleCountryChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value; // Handle single value
    setSelectedCountry(selectedValue);
    form.setValue("country", selectedValue);
    form.setValue("state", "");
    form.setValue("city", "");
    setSelectedState("");
  };

  const handleStateChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value; // Handle single value
    setSelectedState(selectedValue);
    form.setValue("state", selectedValue);
    form.setValue("city", "");
  };

  const handleCityChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value; // Handle single value
    setSelectedCity(selectedValue);
    form.setValue("city", selectedValue);
  };

  const onError = (errors: object) => {
    const errorKeys = Object.keys(errors).map((field) => field.toUpperCase());

    if (errorKeys.length === 4) {
      setFormError(true, "All fields on the form are required");
    } else {
      const missingFields = errorKeys.join(" and ");
      setFormError(
        true,
        `${missingFields} field${errorKeys.length > 1 ? "s" : ""} ${
          errorKeys.length === 1 ? "is" : "are"
        } required`
      );
    }
  };

  function handleSubmit(values: SearchFormValues) {
    resetFormError();
    setDeliveryDetails({
      ...values,
      date: values.date ? format(values.date, "yyyy-MM-dd") : "",
    });
    onSubmit(values);
  }

  return (
    <div className="w-full h-[70%] my-auto translate-y-[5%] z-10 bg-[rgba(245,244,244,0.18)] rounded-[15px] backdrop-blur-[60px]">
      <div className="bg-[rgba(245,244,244,0.54)] w-full h-[60px] flex items-center justify-center rounded-tl-[15px] rounded-tr-[15px]">
        <p className="text-base text-white font-medium text-center">
        Want to send a gift? Tell us where to send it
        </p>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onError)}
        className="w-full py-5 px-6 gap-4 flex flex-col"
      >
        <SelectInput
          label="Country"
          placeholder="Select Country"
          name="country"
          options={countries.map((country) => ({
            label: country,
            value: country,
          }))}
          onChange={handleCountryChange}
          value={selectedCountry}
        />

        <div className="flex w-full items-center justify-between gap-4 *:!w-1/2 *:!min-w-1/2">
          <SelectInput
            label="State"
            placeholder={selectedCountry ? "Lagos" : "Select State"}
            name="state"
            options={states.map((state) => ({
              label: state,
              value: state,
            }))}
            onChange={handleStateChange}
            value={selectedState}
            disabled={!selectedCountry}
          />

          <SelectInput
            label="City"
            placeholder={selectedState ? "Ikeja" : "Select City"}
            name="city"
            options={cities.map((city) => ({
              label: city,
              value: city,
            }))}
            onChange={handleCityChange}
            value={selectedCity}
            disabled={!selectedState}
          />
        </div>

        <div className="w-full">
          <label className="text-white font-bold text-base mb-4 block">
            Delivery Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`text-white flex-1 flex items-center justify-between min-h-[60px] max-h-[60px] w-full rounded-[8px] border bg-transparent px-6 py-1 text-base transition-colors placeholder:text-neutral-30 focus-visible:outline-none focus-visible:ring-1 focus:border-accent-10 ${
                  form.watch("date")
                    ? "border-accent-primary"
                    : "border-neutral-90"
                } hover:border-accent-primary cursor-pointer`}
              >
                <span className="text-white">
                  {form.watch("date")
                    ? format(form.watch("date"), "PPP")
                    : "Pick a delivery date"}
                </span>
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={form.watch("date")}
                onSelect={(date) => {
                  if (date) form.setValue("date", date);
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button size="lg" type="submit" className="mt-4" disabled={isFetching}>
          {isFetching ? "Loading..." : "Get Started"}
        </Button>
      </form>
    </div>
  );
}
