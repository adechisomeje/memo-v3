"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Cake, filterPublicProducts, getCakeProducts } from "@/api/public";
import CakeCardSkeleton from "../components/cake-card-skeleton";
import { queryKeys } from "@/lib/queries";
import { Filter } from "../../../../public/assets/icons/Filter";
import { StarEmpty } from "../../../../public/assets/icons/StarRating";
import { useCakeCustomization } from "@/store/cakeCustomization";
import { useVendorStore } from "@/store/vendorStore";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const cakeCustomizationSchema = z.object({
  flavour: z.array(z.string()),
  layers: z.string().min(1, { message: "Please select number of layers" }),
  priceRange: z.string().optional(),
  size: z.string().optional(),
});

export type CakeCustomizationSchema = z.infer<typeof cakeCustomizationSchema>;

type ProductType = "cakes" | "gifts" | "flowers";

const CAKE_SIZES = [
  "7 inches",
  "8 inches",
  "9 inches",
  "10 inches",
  "11 inches",
  "12 inches",
];

const PRICE_RANGES = [
  { minPrice: 40001, maxPrice: 55000, label: "₦40,001 - ₦55,000" },
  { minPrice: 55001, maxPrice: 56000, label: "₦55,001 - ₦56,000" },
  { minPrice: 56001, maxPrice: 57000, label: "₦56,001 - ₦57,000" },
  { minPrice: 57001, maxPrice: 58000, label: "₦57,001 - ₦58,000" },
  { minPrice: 58001, maxPrice: 59000, label: "₦58,001 - ₦59,000" },
  { minPrice: 59001, maxPrice: 60000, label: "₦59,001 - ₦60,000" },
  { minPrice: 60001, maxPrice: 61000, label: "₦60,001 - ₦61,000" },
  { minPrice: 61001, maxPrice: 62000, label: "₦61,001 - ₦62,000" },
  { minPrice: 62001, maxPrice: 63000, label: "₦62,001 - ₦63,000" },
  { minPrice: 63001, maxPrice: 64000, label: "₦63,001 - ₦64,000" },
];

interface FilterParams {
  productType: string;
  country: string;
  state: string;
  city: string;
  page?: number;
  limit?: number;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryDate?: "string";
}

const ResultsPage = () => {
  const router = useRouter();

  let savedLocations: string = "{}";

  if (typeof window !== "undefined") {
    savedLocations = localStorage.getItem("delivery-storage") ?? "{}";
  }

  const parsedData = JSON.parse(savedLocations);
  const { country, state, city, date } =
    parsedData?.state?.deliveryDetails || {};

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedLayerPrice, setSelectedLayerPrice] = useState<number>(0);
  const [selectedLayer, setSelectedLayer] = useState<string>("1");

  // New state for filtering
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    minPrice?: number;
    maxPrice?: number;
  }>({});
  const [selectedSize, setSelectedSize] = useState<string>("");

  const setCustomization = useCakeCustomization(
    (state) => state.setCustomization
  );
  const setSelectedCake = useCakeCustomization(
    (state) => state.setSelectedCake
  );
  const setSelectedCakeId = useCakeCustomization(
    (state) => state.setSelectedCakeId
  );
  const selectedCake = useCakeCustomization((state) => state.selectedCake);
  const setVendorInfo = useVendorStore((state) => state.setVendorInfo);

  // Dynamic filtering query
  const { data: filteredProductsResponse, isLoading: isFilterLoading } =
    useQuery({
      queryKey: [
        queryKeys.filteredCakeProducts,
        selectedSize,
        selectedPriceRange.minPrice,
        selectedPriceRange.maxPrice,
        date,
      ],
      queryFn: () => {
        // Construct filter parameters dynamically
        const filterParams: FilterParams = {
          productType: "cake",
          country,
          state,
          city,
          page: 1,
          limit: 10,
          deliveryDate: date,
        };

        // Conditionally add size if selected
        if (selectedSize) {
          filterParams.size = selectedSize;
        }

        // Conditionally add price range if selected
        if (selectedPriceRange.minPrice !== undefined) {
          filterParams.minPrice = selectedPriceRange.minPrice;
        }
        if (selectedPriceRange.maxPrice !== undefined) {
          filterParams.maxPrice = selectedPriceRange.maxPrice;
        }
        if (date !== undefined) {
          filterParams.deliveryDate = date;
        }

        console.log("params are", filterParams);

        // Call the filter function with dynamic parameters
        return filterPublicProducts(
          filterParams.productType,
          filterParams.country,
          filterParams.state,
          filterParams.city,
          filterParams.page,
          filterParams.limit,
          filterParams.size,
          filterParams.minPrice,
          filterParams.maxPrice,
          filterParams.deliveryDate
        );
      },
      enabled: !!(selectedSize || selectedPriceRange.minPrice !== undefined),
      staleTime: 5 * 60 * 1000,
    });

  const { data: cakeProductsResponse, isLoading: isInitialLoading } = useQuery({
    queryKey: queryKeys.cakeProducts,
    queryFn: () => getCakeProducts(country, state, city, 1, 10, date),
    staleTime: 5 * 60 * 1000,
    enabled: !(selectedSize || selectedPriceRange.minPrice !== undefined),
  });

  const cakeProducts = filteredProductsResponse ?? cakeProductsResponse?.data;
  const isLoading = isFilterLoading || isInitialLoading;

  // Reset filters
  const resetFilters = () => {
    console.log("loggggggeedddd");
    setSelectedPriceRange({});
    setSelectedSize("");
    form.setValue("priceRange", "");
    form.setValue("size", "");
  };

  const handleProductSelect = (product: Cake, type: ProductType) => {
    console.log("Selecting product:", product);
    setSelectedCake(product);
    setSelectedCakeId(product._id);
    setSelectedLayerPrice(product.layerPrices[product?.layers]);

    const layerKey = product.layers
      ? product.layers.toString()
      : Object.keys(product.layerPrices)[0];

    // Make sure we have a string value with fallback to "1"
    setSelectedLayer(
      product.layerPrices && layerKey in product.layerPrices ? layerKey : "1"
    );

    setVendorInfo({
      vendorId: product.vendorId,
      name: product.vendorName,
      picture: product.vendorPicture,
      country: product.vendorCountry,
      state: product.vendorState,
      city: product.vendorCity,
    });

    console.log("layerprice", product.layerPrices[product?.layers]);

    if (type === "cakes") {
      setIsSheetOpen(true);
    } else {
      router.push(`/customers/checkout/${product._id}`);
    }
  };

  const form = useForm<CakeCustomizationSchema>({
    resolver: zodResolver(cakeCustomizationSchema),
    defaultValues: {
      flavour: [],
      layers: "",
      priceRange: "",
      size: "",
    },
  });

  useEffect(() => {
    console.log("helllo", cakeProducts);
  }, [filteredProductsResponse]);

  useEffect(() => {
    if (selectedCake) {
      const firstLayer = selectedCake.layerPrices
        ? Object.keys(selectedCake.layerPrices)[0]
        : String(selectedCake.layers);

      // Set default values for the form
      form.reset({
        flavour: selectedCake.flavours,
        layers: firstLayer,
      });
    }
  }, [selectedCake, form]);

  const handleCakeCustomization = async (data: CakeCustomizationSchema) => {
    const dataWithPrice: CakeCustomizationSchema & { price?: number } = {
      ...data,
      price: selectedLayerPrice,
    };

    setCustomization(dataWithPrice);

    setIsSheetOpen(false);
    router.push(`/customers/checkout/${selectedCake?._id}`);
  };

  const handleLayerChange = (layer: string) => {
    if (selectedCake && selectedCake.layerPrices) {
      const layerNumber = parseInt(layer);
      const priceForLayer = selectedCake.layerPrices[layerNumber];
      setSelectedLayerPrice(priceForLayer ?? selectedCake.price);
      setSelectedLayer(layer);
    }
    form.setValue("layers", layer);
  };

  async function onSubmit(data: CakeCustomizationSchema) {
    handleCakeCustomization(data);
  }

  // Add state for mobile filter dialog
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Add handler for Filter icon click
  const handleFilterClick = () => {
    setIsMobileFilterOpen(true);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-14">
        <main>
          <div className="flex justify-between items-center mt-8">
            <h1 className="text-[#640D0D] text-lg ">
              Choose Your Special{" "}
              <span className="font-semibold text-sm">Treat</span>
            </h1>
            {/* Add onClick handler to Filter icon */}
            <div onClick={handleFilterClick} className="cursor-pointer">
              <Filter />
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="flex items-center justify-between">
              <div className="md:flex gap-4 mt-8 hidden">
                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const [minPrice, maxPrice] = value
                            .split("-")
                            .map(Number);
                          setSelectedPriceRange({ minPrice, maxPrice });
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="gap-3 p-4 w-full *:text-[16px] *:leading-[21.72px] !outline-none">
                          <SelectValue placeholder="Price" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRICE_RANGES.map((range) => (
                            <SelectItem
                              key={range.minPrice}
                              value={`${range.minPrice}-${range.maxPrice}`}
                            >
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSize(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="gap-3 p-4 w-full *:text-[16px] *:leading-[21.72px] !outline-none">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {CAKE_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {(selectedPriceRange.minPrice || selectedSize) && (
                  <Button variant="outline" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {(selectedPriceRange.minPrice || selectedSize) && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing results for
                {selectedPriceRange.minPrice &&
                  ` Price: ₦${selectedPriceRange.minPrice} - ₦${selectedPriceRange.maxPrice}`}
                {selectedSize && ` Size: ${selectedSize}`}
              </div>
            )}

            <div className="w-full mb-10">
              <Tabs defaultValue="cakes" className="">
                <div className="lg:flex lg:justify-end justify-around">
                  <TabsList>
                    <TabsTrigger value="cakes">Cakes</TabsTrigger>
                    <TabsTrigger value="gifts">Gifts</TabsTrigger>
                    <TabsTrigger value="flowers">Flowers</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="cakes" className="w-full mt-8">
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <CakeCardSkeleton key={index} />
                      ))
                    ) : (cakeProducts?.products || cakeProducts?.cakes) &&
                      (cakeProducts?.cakes?.length ||
                        cakeProducts?.products?.length) > 0 ? (
                      (cakeProducts?.products
                        ? cakeProducts?.products
                        : cakeProducts?.cakes
                      )?.map((cake: Cake) => (
                        <div
                          key={cake._id}
                          onClick={() => handleProductSelect(cake, "cakes")}
                          className="cursor-pointer"
                        >
                          <Card className="overflow-hidden">
                            <div className="aspect-[4/3] relative overflow-hidden">
                              <Image
                                src={
                                  cake.thumbnail ||
                                  "/assets/images/cake-sample.svg"
                                }
                                alt={cake.vendorName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="py-4 px-0">
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Size:
                                    </span>
                                    <span className="font-semibold text-sm">
                                      {cake.size}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Layers:
                                    </span>
                                    <span className="font-semibold text-sm">
                                      {Object.keys(cake.layerPrices)[0]}{" "}
                                      Layer(s)
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Price:
                                    </span>
                                    <span className="font-semibold text-sm">
                                      ${cake.price}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Delivery estimate:
                                    </span>
                                    <span className="font-semibold text-sm">
                                      $120
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="text-sm font-medium">
                                      TOTAL:
                                    </span>
                                    <span className="font-bold">
                                      ${cake.price + 120}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 pt-3 border-t">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={cake.vendorPicture}
                                      alt={cake.vendorName}
                                    />
                                    <AvatarFallback>
                                      {cake.vendorName
                                        .split(" ")
                                        .map((word: string) => word[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h3 className="text-sm font-medium">
                                      {cake.vendorName}
                                    </h3>
                                    <div className="flex items-center gap-1">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <StarEmpty
                                            key={i}
                                            className={` ${
                                              i > 5
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm font-medium">
                                        {cake.vendorAverageRating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))
                    ) : (
                      <div className=" col-span-4 flex flex-col justify-center items-center py-10 gap-3">
                        <Image
                          src="/assets/icons/no-data.svg"
                          alt="No results"
                          width={300}
                          height={300}
                        />
                        <p className="mt-8">
                          No cake products available. Please try again later.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="gifts">
                  {/* Add gifts content here */}
                </TabsContent>
                <TabsContent value="flowers">
                  {/* Add flowers content here */}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <Pagination className="my-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-[640px] p-6 sm:p-10">
          <SheetHeader className="flex items-center sm:flex-row sm:gap-8">
            <div className="relative w-full h-48 mb-4">
              <Image
                src={
                  selectedCake?.thumbnail || "/assets/images/cake-sample.svg"
                }
                alt="Selected cake"
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className=" w-1/2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="font-semibold text-sm">
                  ${selectedLayerPrice}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Delivery estimate:
                </span>
                <span className="font-semibold text-sm">$120</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">TOTAL:</span>
                <span className="font-bold">${selectedLayerPrice + 120}</span>
              </div>

              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/assets/images/naomi.png" />
                  <AvatarFallback>
                    {selectedCake?.vendorName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">
                    {selectedCake?.vendorName}
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {selectedCake?.vendorAverageRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-8"
            >
              <FormField
                control={form.control}
                name="layers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium text-lg">
                      Layers
                    </FormLabel>
                    <Select
                      onValueChange={handleLayerChange}
                      defaultValue={selectedCake?.layers.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="p-4 sm:p-6">
                          <SelectValue placeholder="Select number of layers" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCake &&
                          selectedCake.layerPrices &&
                          Object.entries(selectedCake.layerPrices).map(
                            ([layer, price]) => (
                              <SelectItem key={layer} value={layer}>
                                {layer} Layers (${price})
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Replace the existing FormField for flavors with this updated code */}
              <FormField
                control={form.control}
                name="flavour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium text-lg">
                      Flavour
                    </FormLabel>
                    <FormControl>
                      {selectedCake?.layers === 1 || selectedLayer === "1" ? (
                        // Radio buttons for single layer cakes
                        <RadioGroup
                          value={field.value[0] || ""}
                          onValueChange={(value) => {
                            field.onChange([value]); // Wrap in array since the field expects array
                          }}
                          className="flex flex-wrap gap-3"
                        >
                          {selectedCake?.flavours.map((flavour: string) => (
                            <div
                              key={flavour}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                id={`flavour-${flavour}`}
                                value={flavour}
                              />
                              <Label
                                htmlFor={`flavour-${flavour}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {flavour}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        // Original checkbox implementation for multi-layer cakes
                        <div className="flex flex-wrap gap-3">
                          {selectedCake?.flavours.map((flavour: string) => (
                            <div
                              key={flavour}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`flavour-${flavour}`}
                                checked={field.value.includes(flavour)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, flavour]
                                    : field.value.filter((f) => f !== flavour);
                                  field.onChange(newValue);
                                }}
                              />
                              <Label
                                htmlFor={`flavour-${flavour}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {flavour}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-10">
                Proceed at: <p>(${selectedLayerPrice})</p>
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Add mobile filter dialog */}
      <Dialog
        open={isMobileFilterOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Dialog is closing
            resetFilters();
          }
          setIsMobileFilterOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Price Range</Label>
              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const [minPrice, maxPrice] = value
                          .split("-")
                          .map(Number);
                        setSelectedPriceRange({ minPrice, maxPrice });
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICE_RANGES.map((range) => (
                          <SelectItem
                            key={range.minPrice}
                            value={`${range.minPrice}-${range.maxPrice}`}
                          >
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSize(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAKE_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {(selectedPriceRange.minPrice || selectedSize) && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultsPage;
