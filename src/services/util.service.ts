import { AddressModel } from "../models/address.model";

export class UtilService {
  public static labelMatchesSearch(
    label: string | undefined,
    search: string,
    searchIsLowered = false
  ) {
    if (!search || !label) {
      return true;
    }

    if (searchIsLowered) {
      return label.toLowerCase().includes(search);
    }

    return label.toLowerCase().includes(search.toLowerCase());
  }

  public static compareAddressesForSorting(
    a1: AddressModel,
    a2: AddressModel
  ): number {
    if (a1.streetName && a2.streetName) {
      const streetNameSort = a1.streetName?.localeCompare(a2.streetName);
      if (streetNameSort !== 0) {
        return streetNameSort;
      }
    }

    if (a1.houseNumber && a2.houseNumber) {
      const houseNumberSort = a1.houseNumber?.localeCompare(a2.houseNumber);
      return houseNumberSort;
    }
    return 0;
  }
}
