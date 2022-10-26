import { DocumentModel } from "./document.model";
import { AddressModel } from "./address.model";

export type SourceModel = {
  id: string;
  label: string;

  documents: DocumentModel[];
  addresses: AddressModel[];
};
