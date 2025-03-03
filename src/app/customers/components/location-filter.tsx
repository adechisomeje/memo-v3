"use client";

import { format } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calender } from "../../../../public/assets/icons/Calender";
import { MapPin } from "../../../../public/assets/icons/MapPin";
import { useState } from "react"; // Import useEffect
import { useQuery } from "@tanstack/react-query"; // Import useQueryClient
import { getLocations, LocationResponse } from "@/api/public";
import { useDeliveryDetails } from "@/store/deliveryDetails";
import useFormErrorStore from "@/store/customer";

const searchFormSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  onSubmit: (data: object) => void;
  className?: string;
  variant?: "default" | "sheet";
}

// Helper functions to extract location data
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

const LoadingSelectItem = () => (
  <SelectItem value="loading" disabled>
    Loading...
  </SelectItem>
);

export function SearchForm({
  onSubmit,
  className,
  variant = "default",
}: SearchFormProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const setDeliveryDetails = useDeliveryDetails(
    (state) => state.setDeliveryDetails
  );

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      country: "",
      state: "",
      city: "",
    },
    mode: "onSubmit",
  });

  // Single query for all location data
  const locationsQuery = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  console.log(locationsQuery);

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

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue("country", value);
    form.setValue("state", "");
    form.setValue("city", "");
    setSelectedState("");
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    form.setValue("state", value);
    form.setValue("city", "");
  };

  const onError = (errors: any) => {
    const errorKeys = Object.keys(errors).map((field) => field.toUpperCase());

    if (errorKeys.length === 3) {
      setFormError(true, "All fields on the form are required");
    } else {
      const missingFields = errorKeys.join(" and ");
      setFormError(
        true,
        `${missingFields} field${errorKeys.length > 1 ? "s" : ""} are required`
      );
    }
  };

  function handleSubmit(values: SearchFormValues) {
    resetFormError();
    setDeliveryDetails(values);
    onSubmit(values);
  }

  const renderLocationSelects = () => (
    <>
      {/* Country Select */}
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={handleCountryChange}
              value={field.value || "default"}
            >
              <FormControl>
                <SelectTrigger className="h-10 text-black border-r border-l-0 rounded-none border-y-0">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select a country
                </SelectItem>
                {locationsQuery.isLoading ? (
                  <LoadingSelectItem />
                ) : (
                  countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* State Select */}
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={handleStateChange}
              value={field.value || "default"}
              disabled={!selectedCountry}
            >
              <FormControl>
                <SelectTrigger className="h-10 text-black border-x-1 rounded-none border-y-0">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select a state
                </SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* City Select */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={field.onChange}
              value={field.value || "default"}
              disabled={!selectedState}
            >
              <FormControl>
                <SelectTrigger className="h-10 text-black border-x-1 rounded-none border-y-0 border-r-0">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select a city
                </SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  );

  if (variant === "sheet") {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn("flex flex-col h-full", className)}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Let&apos;s Find Vendors Near You
            </h2>
          </div>

          <div className="space-y-10 flex-1">
            {/* Location Selects */}
            <div className="mt-5 flex flex-col gap-10">
              {renderLocationSelects()}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white h-12"
          >
            Get Started
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="w-full px-5 md:px-7 lg:px-9">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, onError)}
          className={cn("max-w-6xl mx-auto relative", className)}
        >
          <div className="bg-white rounded-full shadow-lg p-2 md:p-3 !w-fit mx-auto">
            <div className="border-2 border-primary rounded-full grid  gap-2 md:gap-4 items-center">
              {/* Location Selects */}
              <div className="md:col-span-7 grid grid-cols-3 gap-2">
                {renderLocationSelects()}
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="flex justify-center mt-8">
            <Button size="lg" type="submit">
              Get Started
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
