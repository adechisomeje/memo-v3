"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, validateName } from "@/lib/utils";
import { ReviewButton } from "../../components/review-button";
import { ProductCard } from "../../components/product-card";
import { StarEmpty } from "../../../../../public/assets/icons/StarRating";
import { useMutation } from "@tanstack/react-query";
import { CreateOrderResponse, userCreateOrder } from "@/api/orders";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { useCakeCustomization } from "@/store/cakeCustomization";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CakeData,
  getCakeProductsByVendor,
  getVendorReviews,
} from "@/api/public";
import { useVendorStore } from "@/store/vendorStore";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

import { useDeliveryDetails } from "@/store/deliveryDetails";

interface CartItem {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

interface CountryCode {
  code: string;
  dial_code: string;
  name: string;
}

const countryCodes: CountryCode[] = [
  { code: "NG", dial_code: "+234", name: "Nigeria" },
  { code: "GH", dial_code: "+233", name: "Ghana" },
  { code: "KE", dial_code: "+254", name: "Kenya" },
];

const formSchema = z.object({
  note: z.string().optional(),
  recipientName: z
    .string()
    .min(2, {
      message: "First Name must be at least 2 characters",
    })
    .refine(validateName, {
      message: "First Name must contain only alphabets",
    }),
  address: z.string().min(2, {
    message: "Address is required",
  }),
  countryCode: z.string().min(2, {
    message: "Please select a country code",
  }),
  recipientPhone: z
    .string()
    .min(12, {
      message: "Please enter a valid phone number",
    })
    .refine(
      (val) => {
        return countryCodes.some((code) => val.startsWith(code.dial_code));
      },
      {
        message: "Invalid phone number format",
      }
    )
    .refine(
      (val) => {
        const number = val.replace(/^\+\d{2,3}/, "");
        return /^\d{9,10}$/.test(number);
      },
      {
        message: "Phone number must be 9-10 digits after country code",
      }
    ),
});

const PhoneNumberInput = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+234");

  const formatPhoneNumber = (value: string, countryCode: string) => {
    let cleaned = value.replace(/[^\d]/g, "");

    if (countryCode === "+234" && cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    return cleaned;
  };

  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name="countryCode"
        render={({ field }) => (
          <FormItem className="w-[120px]">
            <FormControl>
              <Select
                onValueChange={(value) => {
                  setSelectedCountryCode(value);
                  field.onChange(value);
                  // Update the full phone number when country code changes
                  const currentPhone = form.getValues("recipientPhone");
                  const formattedPhone = formatPhoneNumber(currentPhone, value);
                  form.setValue("recipientPhone", `${value}${formattedPhone}`);
                }}
                defaultValue="+234"
              >
                <SelectTrigger className="w-full p-6">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.dial_code}>
                      <span className="flex items-center gap-2">
                        {country.dial_code}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="recipientPhone"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <div className="relative">
                <Input
                  type="tel"
                  className={cn("w-full p-6", "pl-4")}
                  placeholder="Phone Number"
                  value={field.value.replace(selectedCountryCode, "")} // Show only the number part
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const formattedPhone = formatPhoneNumber(
                      rawValue,
                      selectedCountryCode
                    );
                    // Store the full number with country code
                    field.onChange(`${selectedCountryCode}${formattedPhone}`);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const CheckOutPage = () => {
  const deliveryDetails = useDeliveryDetails((state) => state.deliveryDetails);
  const [otherItems, setOtherItems] = useState<CartItem[]>([]);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [savedFormData, setSavedFormData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const router = useRouter();
  const selectedCake = useCakeCustomization((state) => state.selectedCake);
  const cakeCustomization = useCakeCustomization(
    (state) => state.customization
  );
  const setSelectedCake = useCakeCustomization(
    (state) => state.setSelectedCake
  );
  const setSelectedCakeId = useCakeCustomization(
    (state) => state.setSelectedCakeId
  );
  const vendorId = useVendorStore((state) => state.selectedVendorId);

  // Add loading state
  const [isLoadingCake, setIsLoadingCake] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set up payment success listener using window events
  useEffect(() => {
    // Function to handle payment success message from the payment iframe
    const handlePaymentMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "string") {
        if (
          event.data.includes("success") ||
          event.data.includes("status=successful") ||
          event.data.includes("payment_successful")
        ) {
          handlePaymentSuccess();
        }
      }
    };

    window.addEventListener("message", handlePaymentMessage);

    return () => {
      window.removeEventListener("message", handlePaymentMessage);
    };
  }, []);

  // Get cake ID from URL if not found in state
  useEffect(() => {
    const fetchCakeData = async () => {
      if (!selectedCake) {
        const pathParts = window.location.pathname.split("/");
        const cakeId = pathParts[pathParts.length - 1];
        if (cakeId) {
          try {
            console.log("Trying to fetch cake data for ID:", cakeId);
            const cakeResponse = await getCakeProductsByVendor(cakeId);
            if (cakeResponse && cakeResponse.length > 0) {
              const cakeData = cakeResponse[0];
              console.log("Found cake data:", cakeData);
              setSelectedCake(cakeData);
              setSelectedCakeId(cakeData._id);
              // **Update vendor store here**
              // setVendorInfo({
              //   vendorId: cakeData.vendorId,
              //   name: cakeData.vendorName,
              //   picture: cakeData.vendorPicture,
              //   country: cakeData.vendorCountry,
              //   state: cakeData.vendorState,
              //   city: cakeData.vendorCity,
              // })
            } else {
              setErrorMessage(
                "Couldn't find the cake data. Please return to selection."
              );
            }
          } catch (error) {
            console.error("Error fetching cake data:", error);
            setErrorMessage("An error occurred loading the cake data.");
          }
        }
      }
      setIsLoadingCake(false);
    };
    fetchCakeData();
  }, [selectedCake, setSelectedCake, setSelectedCakeId]);

  const handlePaymentSuccess = () => {
    handleClosePayment();
    router.replace("/customers/success");
  };

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setOtherItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (index: number) => {
    setOtherItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Calculate total price based on selected layers
  const calculateTotalPrice = () => {
    if (!selectedCake || !cakeCustomization) return 0;
    const layersNumber = parseInt(cakeCustomization.layers.toString());
    const layerPrice =
      selectedCake?.layerPrices[layersNumber] || selectedCake?.price;
    const deliveryFee = selectedCake.deliveryInfo?.deliveryPrice ?? 0;
    return layerPrice + deliveryFee;
  };

  const totalPrice = calculateTotalPrice();
  const totalWithOtherItems =
    totalPrice + otherItems.reduce((sum, item) => sum + item.price, 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      address: "",
      recipientName: "",
      countryCode: "+234",
      recipientPhone: "+234",
    },
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("checkoutFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.expiry && parsedData.expiry > new Date().getTime()) {
          setSavedFormData(parsedData.formData);

          // Important: Reset form with the saved values
          form.reset({
            note: parsedData.formData.note || "",
            address: parsedData.formData.address || "",
            recipientName: parsedData.formData.recipientName || "",
            countryCode: parsedData.formData.countryCode || "+234",
            recipientPhone: parsedData.formData.recipientPhone || "+234",
          });
        } else {
          sessionStorage.removeItem("checkoutFormData");
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  console.log("saved data", savedFormData);

  const handleClosePayment = () => {
    setPaymentUrl(null);
    setIsPaymentOpen(false);
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.target as HTMLIFrameElement;
      const iframeUrl = iframe.contentWindow?.location.href;

      if (iframeUrl) {
        if (
          iframeUrl.includes("success") ||
          iframeUrl.includes("status=successful")
        ) {
          handlePaymentSuccess();
        }
      }
    } catch (error) {
      // Cross-origin error is expected for security reasons
      console.log("Cannot access iframe URL due to same-origin policy", error);
    }
  };

  const mutation = useMutation({
    mutationFn: userCreateOrder,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log("values", form.getValues());
        if (error.response?.status === 401) {
          const storageData = {
            formData: form.getValues(),
            expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
          };
          sessionStorage.setItem(
            "checkoutFormData",
            JSON.stringify(storageData)
          );
          localStorage.setItem("redirectAfterSignIn", window.location.pathname);
          toast.info("You have to be signed in first");
          router.push("/sign-in");
          return;
        }
        toast.error(
          error.response?.data?.message ||
            "Something went wrong with the request."
        );
      } else {
        toast.error(error.message ?? "Something went wrong");
      }
    },
    onSuccess: (data: CreateOrderResponse) => {
      setPaymentUrl(data.data.authorization_url);
      setIsPaymentOpen(true);
      // Clear the stored form data since payment is initiated
      sessionStorage.removeItem("checkoutFormData");
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedCake || !cakeCustomization || !deliveryDetails) {
      toast.error(
        "Missing required data. Please go back and select a cake and delivery details."
      );
      console.log("values are", form.getValues());
      return;
    }

    const storageData = {
      formData: data,
      expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    };
    sessionStorage.setItem("checkoutFormData", JSON.stringify(storageData));

    const layersNumber = parseInt(cakeCustomization.layers.toString());

    const additionalProducts = otherItems.map((item) => ({
      productId: item.id,
      productCategory: "cake",
      quantity: item.quantity,
    }));

    mutation.mutate({
      productId: selectedCake._id,
      productCategory: "cake",
      note: data.note || "",
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      layers: layersNumber,
      size: selectedCake.size,
      topping: selectedCake.topping,
      flavours: cakeCustomization.flavour,
      deliveryAddress: {
        address: data.address,
        city: deliveryDetails.city,
        state: deliveryDetails.state,
        country: deliveryDetails.country,
      },
      deliveryDate: new Date(deliveryDetails.date!).toISOString(),
      additionalProducts,
    });
  };
  // Log vendor ID for debugging
  useEffect(() => {
    console.log("Selected Vendor ID:", vendorId);
  }, [vendorId]);

  const { data: vendorProducts } = useQuery({
    queryKey: [queryKeys.vendorProducts, vendorId],
    queryFn: () => {
      return vendorId ? getCakeProductsByVendor(vendorId) : null;
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch vendor reviews when vendorId changes
  useEffect(() => {
    const fetchVendorReviews = async () => {
      if (vendorId) {
        try {
          const reviewData = await getVendorReviews(vendorId);
          setReviewCount(reviewData.stats.totalReviews);
        } catch (error) {
          console.error("Error fetching vendor reviews:", error);
        }
      }
    };

    fetchVendorReviews();
  }, [vendorId]);

  // Update the check for selected cake to include loading state
  if (isLoadingCake) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Loading Cake Data</h2>
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!selectedCake) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Missing Information</h2>
        <p>
          {errorMessage ||
            "Please select a cake and delivery details before proceeding to checkout."}
        </p>
        <Button
          onClick={() => router.push("/customers/results")}
          className="mt-8"
        >
          Return to Cake Selection
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-10">
        <main className="max-w-7xl mx-auto py-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left column with cake image */}
            <div>
              <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 max-w-lg mx-auto">
                <Image
                  src={selectedCake.thumbnail}
                  alt={selectedCake.vendorName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {otherItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden aspect-square"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <X
                      onClick={() => removeFromCart(index)}
                      className="absolute top-1 right-1 bg-primary text-white cursor-pointer rounded-full p-1 text-xs"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <h2 className="font-bold">Cake Specs:</h2>
                <p className="text-sm">
                  Classic cake with {selectedCake.topping} frosting
                </p>
                {cakeCustomization && (
                  <div className="mt-1 text-sm">
                    <p className="font-semibold">
                      {selectedCake.size} {cakeCustomization.flavour}
                    </p>
                    <p>
                      {parseInt(cakeCustomization.layers.toString())} layered
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 bg-[#FFFBFA] p-5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">Location:</span>
                    <span className="text-sm">
                      {deliveryDetails?.city}, {deliveryDetails?.state},{" "}
                      {deliveryDetails?.country}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">
                      Delivery Date:
                    </span>
                    <span className="text-sm">{deliveryDetails?.date}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Delivery Address"
                                className="w-full p-6"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="recipientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Recipient Name"
                                  className="w-full p-6"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <PhoneNumberInput form={form} />
                      </div>

                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="E.g Happy Birthday Jane"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        disabled={mutation.isPending}
                        type="submit"
                        className="w-full mt-10"
                        size="lg"
                      >
                        {mutation.isPending ? (
                          <div className="flex items-center justify-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          </div>
                        ) : (
                          <>
                            PROCEED TO PAY ({formatPrice(totalWithOtherItems)}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
                <div className="space-y-4 bg-[#FFFBFA] p-5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage className="p-4">
                        {selectedCake?.vendorPicture ||
                          "/assets/images/naomi.png"}
                      </AvatarImage>
                      <AvatarFallback>
                        {selectedCake?.vendorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {selectedCake.vendorName}
                      </div>
                      <div className="flex items-center gap-1">
                        {Array(5)
                          .fill(null)
                          .map((_, i) => (
                            <StarEmpty
                              key={i}
                              className={` ${
                                i < 4
                                  ? "fill-primary"
                                  : "fill-muted stroke-muted-foreground"
                              }`}
                            />
                          ))}
                        {/* <span className="text-sm text-gray-500">(1k+)</span> */}
                      </div>
                    </div>
                  </div>

                  <ReviewButton
                    // use selected vendor id here
                    vendorId={vendorId}
                    reviewCount={reviewCount}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Other Items from Vendor</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {vendorProducts
                ?.filter((data: CakeData) => data._id !== selectedCake?._id)
                .map((data: CakeData) => (
                  <ProductCard
                    key={data._id}
                    id={data._id}
                    image={data.thumbnail}
                    title={data.vendorName}
                    description={`${data.size} - ${data.topping}`}
                    price={data.price}
                    onAdd={() =>
                      addToCart({
                        id: data._id,
                        image: data.thumbnail,
                        title: data.vendorName,
                        description: `${data.size} - ${data.topping}`,
                        price: data.price,
                      })
                    }
                  />
                ))}
            </div>
          </div>
        </main>
      </div>

      {paymentUrl && (
        <Dialog
          open={isPaymentOpen}
          onOpenChange={(open) =>
            open ? setIsPaymentOpen(true) : handleClosePayment()
          }
        >
          <DialogContent
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            className="max-w-3xl h-[80vh] p-0 flex flex-col"
          >
            <DialogHeader className="p-4 flex justify-between items-center border-b">
              <DialogTitle className="font-semibold">
                Complete Payment
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 relative">
              <iframe
                src={paymentUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="payment"
                onLoad={handleIframeLoad}
                // Add this script to attempt to communicate with parent window
                srcDoc={`
                  <html>
                    <head>
                      <script>
                        // Listen for URL changes
                        function checkForSuccessAndNotify() {
                          if (window.location.href.includes('success') || 
                              window.location.href.includes('status=successful')) {
                            // Send message to parent
                            window.parent.postMessage('payment_successful', '*');
                          }
                        }
                        
                        // Check on page load
                        window.addEventListener('load', checkForSuccessAndNotify);
                        
                        // Check on URL changes
                        const originalPushState = history.pushState;
                        history.pushState = function() {
                          originalPushState.apply(this, arguments);
                          checkForSuccessAndNotify();
                        };
                        
                        const originalReplaceState = history.replaceState;
                        history.replaceState = function() {
                          originalReplaceState.apply(this, arguments);
                          checkForSuccessAndNotify();
                        };
                      </script>
                    </head>
                    <body>
                      <script>
                        // Redirect to the payment URL
                        window.location.href = "${paymentUrl}";
                      </script>
                    </body>
                  </html>
                `}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CheckOutPage;
