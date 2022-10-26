import { PersonModel } from "./person.model";
import { SourceModel } from "./source.model";
import { AddressModel } from "./address.model";

export type DocumentModel = {
  id: string;
  source: SourceModel;
  imageUrl?: string | null;
  label: string;
  people: PersonModel[];

  sourceItem: SourceModel; //this should replace the 'source' above
  addresses?: AddressModel[];
  personAtAddressItems?: any; //this should get its own model { person:, address: } OR PersonModel gets an 'address' item
};
