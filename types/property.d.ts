import React from "react";

export interface PropertyInfo {
  id: string;
  description: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  garages: number;
  balcony?: boolean;
  area: number;
  images: string[];
  propertyType: string;
  autoSearch: boolean;
  addedOn: Date;
  addedBy: string;
}

export interface PropertyFeature {
  title: string;
  value?: any;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface GetPropertyParams {
  count: number;
  hasMore: boolean;
  properties: PropertyInfo[];
}

export interface PropertyQueryParams {
  page?: number;
  limit?: number;
  address?: string;
  sort?: string;
  type?: string;
  beds?: string;
  baths?: string;
  priceMin?: string;
  priceMax?: string;
}
