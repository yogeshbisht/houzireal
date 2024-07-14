"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertySearchType, SelectOptionType } from "@/types";
import {
  SearchInputValidatorType,
  searchInputValidator,
} from "@/lib/validators";
import { PropertyQueryParams } from "@/types/property";
import { BED_OPTIONS, STANDARD_PROPERTY_OPTIONS } from "@/constants/search";
import { rentPrices, salePrices } from "@/utilities/property-utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type SearchInputFormProps = {
  initialSearchQuery: PropertyQueryParams;
  searchType: PropertySearchType;
  onSearchInput: (searchParams: PropertyQueryParams) => void;
};

const SearchInputForm = ({
  initialSearchQuery,
  searchType,
  onSearchInput,
}: SearchInputFormProps) => {
  const memoizedSalePrices = useMemo(() => salePrices(), []);
  const memoizedRentPrices = useMemo(() => rentPrices(), []);

  const minPriceList =
    searchType === "sale" ? memoizedSalePrices : memoizedRentPrices;
  const [maxPriceList, setMaxPriceList] = useState<SelectOptionType[]>([]);

  const getPropertyTypeOptions = (searchType: PropertySearchType) => {
    if (searchType === "sale") {
      return [...STANDARD_PROPERTY_OPTIONS, { value: "Multi Family" }];
    }

    return [
      ...STANDARD_PROPERTY_OPTIONS,
      { value: "Apartment" },
      { value: "Efficiency" },
    ];
  };

  const form = useForm<SearchInputValidatorType>({
    resolver: zodResolver(searchInputValidator),
    defaultValues: {
      address: initialSearchQuery.address || "",
      propertyType: initialSearchQuery.type
        ? initialSearchQuery.type.split(",")
        : [],
      beds: initialSearchQuery.beds || "any",
      baths: initialSearchQuery.baths || "any",
      priceMin: initialSearchQuery.priceMin || "any",
      priceMax: initialSearchQuery.priceMax || "any",
    },
  });

  const selectedPropertyType = form.watch("propertyType");
  const selectedPriceMin = form.watch("priceMin");
  const selectedPriceMax = form.watch("priceMax");

  useEffect(() => {
    let selectedPriceMinIndex = minPriceList.findIndex(
      (price) => price.value === selectedPriceMin
    );

    selectedPriceMinIndex =
      selectedPriceMinIndex < 0 ? 0 : selectedPriceMinIndex;

    const maxPrices = minPriceList.slice(selectedPriceMinIndex + 1);
    if (
      maxPrices.length > 0 &&
      maxPrices[maxPrices.length - 1].value !== "any"
    ) {
      maxPrices.push({ text: "Any", value: "any" });
    }

    setMaxPriceList(maxPrices);
    if (
      selectedPriceMin !== "any" &&
      selectedPriceMax !== "any" &&
      Number(selectedPriceMax) <= Number(selectedPriceMin)
    ) {
      const nextPrice = minPriceList[selectedPriceMinIndex + 1];
      form.setValue("priceMax", nextPrice ? nextPrice.value : "any");
    }
  }, [form, selectedPriceMin, selectedPriceMax, minPriceList]);

  const onSubmit = (data: SearchInputValidatorType) => {
    const { address, propertyType, beds, baths, priceMin, priceMax } = data;
    const searchParams = {
      address,
      type: propertyType.join(","),
      beds: beds === "any" ? "" : beds,
      baths: baths === "any" ? "" : baths,
      priceMin: priceMin === "any" ? "" : priceMin,
      priceMax: priceMax === "any" ? "" : priceMax,
    };

    onSearchInput(searchParams);
  };

  const onClearSearch = () => {
    form.reset({
      address: "",
      propertyType: [],
      beds: "any",
      baths: "any",
      priceMin: "any",
      priceMax: "any",
    });
    onSearchInput({});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-7 md:col-span-5 xl:col-span-4">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address"
                    {...field}
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyType"
            render={() => (
              <FormItem className="col-span-7 sm:col-span-5 md:col-span-4 xl:col-span-3 3xl:col-span-2">
                <FormLabel>Property Type</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      {selectedPropertyType.length
                        ? `${selectedPropertyType.length} type selected`
                        : "Select property type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-4 pb-2">
                    {getPropertyTypeOptions(searchType).map((option) => (
                      <FormField
                        key={option.value}
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem className="mb-2 flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.value}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          <div className="col-span-5 grid grid-cols-2 gap-1 sm:col-span-4 md:col-span-3 xl:col-span-2">
            <FormField
              control={form.control}
              name="beds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beds</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select beds" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BED_OPTIONS.map((bed) => (
                        <SelectItem
                          key={bed.text}
                          value={bed.value}
                          className="text-sm"
                        >
                          {bed.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baths</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select baths" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BED_OPTIONS.map((bath) => (
                        <SelectItem
                          key={bath.text}
                          value={bath.value}
                          className="text-sm"
                        >
                          {bath.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-10 grid grid-cols-2 gap-1 sm:col-span-7 md:col-span-5 xl:col-span-3">
            <FormField
              control={form.control}
              name="priceMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Min</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select price min" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {minPriceList.map((price) => (
                        <SelectItem
                          key={price.text}
                          value={price.value}
                          className="text-sm"
                        >
                          {price.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Max</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select price max" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {maxPriceList.map((price) => (
                        <SelectItem
                          key={price.text}
                          value={price.value}
                          className="text-sm"
                        >
                          {price.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-start sm:justify-center">
          <Button variant="brand" type="submit" className="w-full max-w-60">
            Search
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 mt-4 text-right sm:mt-0">
          <Button onClick={onClearSearch}>Clear</Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchInputForm;
