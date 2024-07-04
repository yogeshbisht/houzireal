"use client";

import React from "react";
import PropertyCard from "@/components/property/property-card";
import { useGetPropertiesQuery } from "@/app/services/property.service";

const SearchResultsList = () => {
  const { data: properties, isLoading, isError } = useGetPropertiesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading properties</div>;
  }

  if (!properties) {
    return <div>No properties found</div>;
  }

  return (
    <div className="property-grid pt-8">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          display="search"
          propertyDetails={property}
        />
      ))}
    </div>
  );
};

export default SearchResultsList;
