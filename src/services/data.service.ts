import { DocumentForAddressModel } from "../models/triple-store/document-for-address.model";
import { TripleStorePersonModel } from "../models/triple-store/triple-store-person.model";
import { TripleStoreDocumentModel } from "../models/triple-store/triple-store-document.model";
import { TripleStoreAddressModel } from "../models/triple-store/triple-store-address.model";
import { DocumentModel } from "../models/document.model";
import { AddressModel } from "../models/address.model";
import { PersonModel } from "../models/person.model";
import { LngLatLike } from "mapbox-gl";
import { store } from "../store";
import { AddressesGeoJsonModel } from "../models/addresses-geo-json.model";
import { SourceModel } from "../models/source.model";

import CachedSources from "../assets/cached-data/sources.json";
import CachedAddresses from "../assets/cached-data/addresses.json";
import CachedDocuments from "../assets/cached-data/documents.json";
import CachedDocumentsForAddresses from "../assets/cached-data/documents-for-addresses.json";
import CachedPeopleForDocumentAddresses from "../assets/cached-data/people-for-document-addresses.json";
import CachedPeople from "../assets/cached-data/people.json";
import { TripleStoreSourceModel } from "../models/triple-store/triple-store-source.model";
import { PersonForDocumentAddress } from "../models/triple-store/person-for-document-address";

export class DataService {
  private static _instance: DataService;
  private readonly DOCUMENTS_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-documenten/run?pageSize=10000";
  private readonly ADDRESSES_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-adressen/run?pageSize=10000";
  private readonly DOCUMENTS_FOR_ADDRESSES_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-adressen-per-document/run?pageSize=10000";
  private readonly PEOPLE_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-personen/run?pageSize=10000";
  private readonly SOURCES_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-brontypes/run?pageSize=10000";
  private readonly PEOPLE_FOR_DOCUMENT_ADDRESSES_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-persoon-op-adres-per-document/run?pageSize=10000";

  constructor() {
    if (DataService._instance) {
      return DataService._instance;
    }
    DataService._instance = this;
  }

  private _retrieveFromTripleStore(
    queryUrl: string,
    numPages: number,
    results: any[]
  ): Promise<void | any>[] {
    // TODO: Dynamic check (run for loop until no results are returned anymore)

    const promises: Promise<void | any[]>[] = [];
    for (let pageIdx = 1; pageIdx <= numPages; pageIdx++) {
      const paginatedQueryUrl: string = queryUrl + `&page=${pageIdx}`;
      // console.log("Retrieving", paginatedQueryUrl);
      const promise: Promise<void | any[]> = this._fetch(paginatedQueryUrl);
      // TODO: Concat results to results parameter
      promises.push(promise);
    }
    return promises;
  }

  public async updateFromServer(useCachedData: boolean = false): Promise<void> {
    console.log("Retrieving data...");

    let documents: TripleStoreDocumentModel[] = [];
    let people: TripleStorePersonModel[] = [];
    let addresses: TripleStoreAddressModel[] = [];
    let documentsForAddresses: DocumentForAddressModel[] = [];
    let peopleForDocumentAddresses: PersonForDocumentAddress[] = [];
    let sources: TripleStoreSourceModel[] = [];

    if (useCachedData) {
      sources = CachedSources;
      // @ts-ignore
      documents = CachedDocuments;
      people = CachedPeople as TripleStorePersonModel[];
      addresses = CachedAddresses;
      documentsForAddresses = CachedDocumentsForAddresses;
      peopleForDocumentAddresses = CachedPeopleForDocumentAddresses;
    } else {
      const documentsPromises: Promise<void | TripleStoreDocumentModel[]>[] =
        this._retrieveFromTripleStore(this.DOCUMENTS_QUERY_URL, 1, documents);
      // TODO: Avoid code duplication and handle this inside the retrieval function
      documentsPromises.forEach((documentPromise) =>
        documentPromise.then((r) => (documents = documents.concat(r)))
      );

      const sourcesPromises: Promise<void | TripleStoreSourceModel[]>[] =
        this._retrieveFromTripleStore(this.SOURCES_QUERY_URL, 1, sources);
      sourcesPromises.forEach((promise) =>
        promise.then((r) => (sources = sources.concat(r)))
      );

      const peoplePromises: Promise<void | TripleStorePersonModel[]>[] =
        this._retrieveFromTripleStore(this.PEOPLE_QUERY_URL, 2, people);
      peoplePromises.forEach((promise) =>
        promise.then((r) => (people = people.concat(r)))
      );

      const addressesPromises: Promise<void | TripleStoreAddressModel[]>[] =
        this._retrieveFromTripleStore(this.ADDRESSES_QUERY_URL, 1, addresses);
      addressesPromises.forEach((promise) =>
        promise.then((r) => (addresses = addresses.concat(r)))
      );

      const documentsForAddressesPromises: Promise<
        void | DocumentForAddressModel[]
      >[] = this._retrieveFromTripleStore(
        this.DOCUMENTS_FOR_ADDRESSES_QUERY_URL,
        2,
        documentsForAddresses
      );
      documentsForAddressesPromises.forEach((promise) =>
        promise.then(
          (r) => (documentsForAddresses = documentsForAddresses.concat(r))
        )
      );

      const peopleForDocumentAddressesPromises: Promise<
        void | TripleStorePersonModel[]
      >[] = this._retrieveFromTripleStore(
        this.PEOPLE_FOR_DOCUMENT_ADDRESSES_QUERY_URL,
        2,
        peopleForDocumentAddresses
      );
      peopleForDocumentAddressesPromises.forEach((promise) =>
        promise.then(
          (r) =>
            (peopleForDocumentAddresses = peopleForDocumentAddresses.concat(r))
        )
      );

      const dataPromises: Promise<any>[] = [
        ...sourcesPromises,
        ...peoplePromises,
        ...addressesPromises,
        ...peopleForDocumentAddressesPromises,
        ...documentsPromises,
        ...documentsForAddressesPromises,
      ];

      await Promise.all(dataPromises);
    }

    console.log("People for document addresses", peopleForDocumentAddresses);

    console.log("Finished retrieving data!");

    const parsedSources: SourceModel[] = this._parseSources(sources);

    const parsedDocuments: DocumentModel[] = this._parseDocuments(
      documents,
      people,
      parsedSources,
      peopleForDocumentAddresses
    );
    // store.commit("map/setDocuments", parsedDocuments);

    const parsedAddresses: AddressModel[] = this._parseAddresses(
      addresses,
      parsedDocuments,
      documentsForAddresses
    );

    console.log("Sources:", parsedSources);
    console.log("Documents:", parsedDocuments);
    console.log("Addresses:", parsedAddresses);
    console.log("Documents per address:", documentsForAddresses);
    const geoJson: AddressesGeoJsonModel = this._parseGeoJson(parsedAddresses);
    // console.log("SETTING", geoJson);
    await store.dispatch("map/updateGeoJson", geoJson);
    await store.commit("setSources", parsedSources);

    return Promise.resolve();
  }

  private _parseDocuments(
    tripleStoreDocuments: TripleStoreDocumentModel[],
    tripleStorePeople: TripleStorePersonModel[],
    sources: SourceModel[],
    peopleForDocumentAddresses: PersonForDocumentAddress[]
  ): DocumentModel[] {
    console.log("Parsing documents...");
    const peopleForDocuments: { [documentId: string]: PersonModel[] } = {};
    for (const personForDocumentAddress: PersonForDocumentAddress of peopleForDocumentAddresses) {
      const docId: string = personForDocumentAddress.doc;
      const addressId: string = personForDocumentAddress.adres;
      const addressLabel: string = personForDocumentAddress.adresLabel;
      const personId: string = personForDocumentAddress.persoonsvermelding;
      const person: TripleStorePersonModel = tripleStorePeople.find(
        (p) => p.persoon === personId
      );
      if (!person) {
        console.warn(
          "Could not find person with ID",
          personId,
          tripleStorePeople
        );
      }

      if (!(docId in peopleForDocuments)) {
        peopleForDocuments[docId] = [];
      }

      peopleForDocuments[docId].push({
        id: person.persoon,
        label: person.label,
        occupation: person.beroep,
        birthDate: person.geboortedatum,
        birthPlace: person.geboortedatum,
        addressId: addressId,
        addressLabel: addressLabel,
      });
    }

    // console.log(peopleForDocuments);

    const documents: DocumentModel[] = [];
    for (const tripleStoreDocument of tripleStoreDocuments) {
      const documentId: string = tripleStoreDocument.doc;
      const sourceId: string = tripleStoreDocument.bronType;

      const source: SourceModel | undefined = sources.find(
        (source) => source.id === sourceId
      );

      if (!source) {
        console.warn("Unknown 'bronType'", sourceId);
        continue;
      }

      const document: DocumentModel = {
        id: documentId,
        imageUrl: tripleStoreDocument.image,
        label: tripleStoreDocument.label,
        people: peopleForDocuments[documentId],
        source: source,
      };

      documents.push(document);
    }
    // console.log("Finished parsing documents...");
    return documents;
  }

  private _parseSources(tripleStoreSources: TripleStoreSourceModel[]) {
    console.log("Parsing sources...");
    const sources: SourceModel[] = [];

    for (const tripleStoreSource of tripleStoreSources) {
      const sourceModel: SourceModel = {
        id: tripleStoreSource.bronType,
        label: tripleStoreSource.label,
      };
      sources.push(sourceModel);
    }

    // console.log("Finished parsing sources...");
    return sources;
  }

  private _parseAddresses(
    tripleStoreAddresses: TripleStoreAddressModel[],
    documents: DocumentModel[],
    documentsForAddresses: DocumentForAddressModel[]
  ): AddressModel[] {
    console.log("Parsing addresses...");

    const addresses: AddressModel[] = [];

    const documentsPerAddress: { [addressId: string]: DocumentModel[] } = {};
    for (const documentForAddress of documentsForAddresses) {
      if (!(documentForAddress.adres in documentsPerAddress)) {
        documentsPerAddress[documentForAddress.adres] = [];
      }

      const document: DocumentModel | undefined = documents.find(
        (doc) => doc.id === documentForAddress.doc
      );
      if (document) {
        documentsPerAddress[documentForAddress.adres].push(document);
      }
    }

    for (const tripleStoreAddress of tripleStoreAddresses) {
      const addressId: string = tripleStoreAddress.adres;
      let documents: DocumentModel[] = [];
      if (addressId in documentsPerAddress) {
        documents = documentsPerAddress[addressId];
      }

      const address: AddressModel = {
        id: addressId,
        label: tripleStoreAddress.label,
        coordinates: this._parseGeoCoords(tripleStoreAddress.geo),
        place: tripleStoreAddress.woonplaats,
        streetName: tripleStoreAddress.straatnaam,
        documents: documents,
        documentCount: documents.length,
        houseLetter: tripleStoreAddress.huisletter,
        houseNumber: tripleStoreAddress.huisnummer,
        houseNumberAddition: tripleStoreAddress.huisnummer_toevoeging,
      };
      addresses.push(address);
    }
    // console.log("Finished parsing addresses!");
    return addresses;
  }

  private _parseGeoJson(addresses: AddressModel[]): AddressesGeoJsonModel {
    console.log("Parsing GeoJSON...");
    const markersGeoJson: AddressesGeoJsonModel = {
      type: "FeatureCollection",
      features: [],
    };

    for (const address of addresses) {
      markersGeoJson["features"].push({
        properties: address,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: address?.coordinates,
        },
      });
    }
    // console.log("Finished parsing GeoJSON...");
    return markersGeoJson;
  }

  private _parseGeoCoords(geo: string | undefined): LngLatLike {
    if (!geo) {
      console.warn("No coordinates passed... Using center of the Netherlands.");
      return [5.2793703, 52.2129919];
    }

    if (geo.includes("polygon")) {
      console.warn(
        "Can not handle polygon coordinates... Using center of the Netherlands instead.",
        geo
      );
      return [5.2793703, 52.2129919];
    }

    const coordsStr: string[] = geo
      .replace("POINT (", "")
      .replace(")", "")
      .split(" ");
    // @ts-ignore
    const coords: LngLatLike = coordsStr.map((coord: string) => {
      const coordNum: number = parseFloat(coord);
      if (!coordNum) {
        console.log(geo, coord, coordNum);
      }
      return coordNum;
    });
    return coords;
  }

  private async _fetch(url: string): Promise<any> {
    const rawResponse: void | Response = await fetch(url, {
      method: "get",
    }).catch((err) => {
      console.error(err);
    });
    if (!rawResponse) {
      // TODO: Use more beautiful alert box
      alert("ERROR: Could not retrieve data.");
      return Promise.reject();
    }
    const response: any = await rawResponse.json();

    return Promise.resolve(response);
  }
}
