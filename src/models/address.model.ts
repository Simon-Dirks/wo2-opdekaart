import { DocumentModel } from "./document.model";
import { LngLatLike } from "mapbox-gl";
import { PersonModel } from "./person.model";

export type AddressModel = {
  addressId: string;
  label: string;
  houseLetter?: string;
  houseNumber?: string;
  houseNumberAddition?: string;
  streetName?: string;
  place?: string;
  coordinates: LngLatLike;
  documentCount: number;
  documents: DocumentModel[];
  filteredDocuments: DocumentModel[];
  persons: PersonModel[];
};
