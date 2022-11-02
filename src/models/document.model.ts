import { SourceModel } from "./source.model";
import { AddressModel } from "./address.model";

export type DocumentModel = {
  id: string; //old ?

  docId: string;
  // source: SourceModel;
  image?: string | null;
  label: string;
  // people: PersonModel[];

  sourceItem: SourceModel; //this should replace the 'source' above
  addresses?: AddressModel[];
  personAtAddressItems?: PersonAtAddressModel[]; //this should get its own model { person:, address: } OR PersonModel gets an 'address' item
};

export type PersonAtAddressModel = { person: any; address: any };
