import { DocumentModel } from "./document.model";
import { AddressModel } from "./address.model";

export type SourceModel = {
  sourceId: string;
  label: string;
  description: string;

  selected: boolean;

  documents: DocumentModel[];
  addresses: AddressModel[];
};
