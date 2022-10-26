import { AddressModel } from "./address.model";
import { SourceModel } from "./source.model";
import { DocumentModel } from "./document.model";
import { PersonModel } from "./person.model";

export type DataModel = {
  addresses: AddressModel[];
  addressesById: { [name: string]: AddressModel };
  documents: DocumentModel[];
  documentsById: { [name: string]: DocumentModel };
  persons: PersonModel[];
  personsById: { [name: string]: PersonModel };
  sources: SourceModel[];
  sourcesById: { [name: string]: SourceModel };
  // geojson?: any;
};
