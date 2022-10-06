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
import CachedPeople from "../assets/cached-data/people.json";
import { TripleStoreSourceModel } from "../models/triple-store/triple-store-source.model";

export class DataService {
  private static _instance: DataService;
  private readonly DOCUMENTS_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-documenten/run?pageSize=10000";
  private readonly ADDRESSES_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-adressen/run";
  private readonly DOCUMENTS_FOR_ADDRESSES_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-adressen-per-document/run?pageSize=10000";
  private readonly PEOPLE_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-personen/run";
  private readonly SOURCES_QUERY_URL: string =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-brontypes/run";

  constructor() {
    if (DataService._instance) {
      return DataService._instance;
    }
    DataService._instance = this;
  }

  public async updateFromServer(useCachedData: boolean = true): Promise<void> {
    console.log("Retrieving data...");

    let documents: TripleStoreDocumentModel[] = [];
    let people: TripleStorePersonModel[] = [];
    let addresses: TripleStoreAddressModel[] = [];
    let documentsForAddresses: DocumentForAddressModel[] = [];
    let sources: TripleStoreSourceModel[] = [];

    if (useCachedData) {
      sources = CachedSources;
      // @ts-ignore
      documents = CachedDocuments;
      people = CachedPeople as TripleStorePersonModel[];
      addresses = CachedAddresses;
      documentsForAddresses = CachedDocumentsForAddresses;
    } else {
      // TODO: Dynamic check (run for loop until no results are returned anymore)
      // TODO: Optimize by running all requests asynchronously
      const documentsPromises: Promise<void | TripleStoreDocumentModel[]>[] =
        [];
      for (let documentPageIdx = 1; documentPageIdx <= 2; documentPageIdx++) {
        const documentsPagePromise: Promise<void | TripleStoreDocumentModel[]> =
          this._fetch(
            this.DOCUMENTS_QUERY_URL + `&page=${documentPageIdx}`
          ).then((retrievedDocumentsPage: TripleStoreDocumentModel[]) => {
            documents = documents.concat(retrievedDocumentsPage);
          });
        documentsPromises.push(documentsPagePromise);
      }

      const sourcesPromise: Promise<void | TripleStoreSourceModel[]> =
        this._fetch(this.SOURCES_QUERY_URL).then(
          (retrievedSources: TripleStoreSourceModel[]) => {
            sources = retrievedSources;
          }
        );

      // TODO: Retrieve all people (paginated)
      const peoplePromise: Promise<void | TripleStorePersonModel[]> =
        this._fetch(this.PEOPLE_QUERY_URL).then(
          (retrievedPeople: TripleStorePersonModel[]) => {
            people = retrievedPeople;
          }
        );
      const addressesPromise: Promise<void | TripleStoreAddressModel[]> =
        this._fetch(this.ADDRESSES_QUERY_URL).then(
          (retrievedAddresses: TripleStoreAddressModel[]) => {
            addresses = retrievedAddresses;
          }
        );

      const documentsForAddressesPromises: Promise<
        void | DocumentForAddressModel[]
      >[] = [];
      for (let pageIdx = 1; pageIdx <= 2; pageIdx++) {
        const documentsForAddressesPromise: Promise<
          void | DocumentForAddressModel[]
        > = this._fetch(
          this.DOCUMENTS_FOR_ADDRESSES_QUERY_URL + `&page=${pageIdx}`
        ).then((documentsForAddressesPage: DocumentForAddressModel[]) => {
          documentsForAddresses = documentsForAddresses.concat(
            documentsForAddressesPage
          );
        });
        documentsForAddressesPromises.push(documentsForAddressesPromise);
      }

      const dataPromises: Promise<any>[] = [
        sourcesPromise,
        peoplePromise,
        addressesPromise,
        ...documentsPromises,
        ...documentsForAddressesPromises,
      ];
      await Promise.all(dataPromises);
    }

    console.log("Finished retrieving data!");

    const parsedSources: SourceModel[] = this._parseSources(sources);

    const parsedDocuments: DocumentModel[] = this._parseDocuments(
      documents,
      people,
      parsedSources
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
    sources: SourceModel[]
  ): DocumentModel[] {
    console.log("Parsing documents...");
    const peopleForDocuments: { [documentId: string]: PersonModel[] } = {};
    for (const tripleStorePerson of tripleStorePeople) {
      const personDocumentId: string = tripleStorePerson.doc;
      // console.log(personDocumentId);
      if (!(personDocumentId in peopleForDocuments)) {
        peopleForDocuments[personDocumentId] = [];
      }

      peopleForDocuments[personDocumentId].push({
        id: tripleStorePerson.persoon,
        label: tripleStorePerson.label,
        occupation: tripleStorePerson.beroep,
        birthDate: tripleStorePerson.geboortedatum,
        birthPlace: tripleStorePerson.geboortedatum,
        addressId: tripleStorePerson.adres,
        addressLabel: tripleStorePerson.adresLabel,
      });
    }

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
