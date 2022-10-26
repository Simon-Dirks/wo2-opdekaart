import { DataModel } from "../models/data.model";
import { TripleStoreDataModel } from "../models/triple-store-data.model";
import { SearchOptionModel } from "../models/search-option.model";
import { SourceRickModel } from "../models/source-rick.model";
import { AddressesGeoJsonModel } from "../models/addresses-geo-json.model";
import { store } from "../store";

export class DataRickService {
  private static _instance: DataRickService;

  private readonly BASE_URL =
    "https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/";
  private readonly POSTFIX = "/run?pageSize=10000";
  private readonly DOCUMENTS_QUERY_URL =
    this.BASE_URL + "wo2-documenten" + this.POSTFIX;
  private readonly ADDRESSES_QUERY_URL =
    this.BASE_URL + "wo2-adressen" + this.POSTFIX;
  private readonly ADDRESSES_PER_DOCUMENT_QUERY_URL =
    this.BASE_URL + "wo2-adressen-per-document" + this.POSTFIX;
  private readonly PERSONS_PER_DOCUMENT_QUERY_URL =
    this.BASE_URL + "wo2-personen-per-document" + this.POSTFIX;
  private readonly PERSONS_QUERY_URL =
    this.BASE_URL + "wo2-personen" + this.POSTFIX;
  private readonly SOURCES_QUERY_URL =
    this.BASE_URL + "wo2-brontypes" + this.POSTFIX;
  private readonly PERSON_ADDRESS_DOCUMENT_QUERY_URL =
    this.BASE_URL + "wo2-persoon-op-adres-per-document" + this.POSTFIX;

  constructor() {
    if (DataRickService._instance) {
      return DataRickService._instance;
    }
    DataRickService._instance = this;
  }

  private async _fetch(url): Promise<any> {
    const rawResponse = await fetch(url, {
      method: "get",
    }).catch((err) => {
      console.error(err);
    });
    if (!rawResponse) {
      console.log("ERROR: Could not retrieve data.");
      return Promise.reject();
    }
    const response = await rawResponse.json();

    return Promise.resolve(response);
  }

  private _retrieveFromTripleStore(queryUrl, numPages): Promise<any>[] {
    //, results) {
    // TODO: Dynamic check (run for loop until no results are returned anymore)
    const promises: Promise<any>[] = [];
    for (let pageIdx = 1; pageIdx <= numPages; pageIdx++) {
      const paginatedQueryUrl = queryUrl + `&page=${pageIdx}`;
      // console.log("Retrieving", paginatedQueryUrl);
      const promise: Promise<any> = this._fetch(paginatedQueryUrl);
      // TODO: Concat results to results parameter
      promises.push(promise);
    }

    return promises;
  }

  private _parseGeoJson(addresses: any): AddressesGeoJsonModel {
    console.log("Parsing GeoJSON...", addresses);

    const markersGeoJson: AddressesGeoJsonModel = {
      type: "FeatureCollection",
      features: [],
    };
    for (const address of addresses) {
      markersGeoJson.features.push({
        properties: address,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [5.097939670669287, 52.09408062362957], // TODO: Use actual coordinates
        },
      });
    }
    // markersGeoJson.features = addresses.map((address) => {
    //   return {
    //     properties: address,
    //     type: "Feature",
    //     geometry: {
    //       type: "Point",
    //       coordinates: [5, 2], // TODO: Use actual coordinates
    //     },
    //   };
    // });

    console.log("Finished parsing GeoJSON...", markersGeoJson);
    return markersGeoJson;
  }

  async retrieveAllDataFromTripleStore(): Promise<TripleStoreDataModel> {
    const data: TripleStoreDataModel = {};

    //sources
    data.sources = [];
    const sourcesPromises = this._retrieveFromTripleStore(
      this.SOURCES_QUERY_URL,
      1
    );
    sourcesPromises.forEach((promise) =>
      promise.then(
        (r) => (data.sources = r ? data.sources.concat(r) : data.sources)
      )
    );

    //documents
    data.documents = [];
    const documentsPromises = this._retrieveFromTripleStore(
      this.DOCUMENTS_QUERY_URL,
      2
    );
    documentsPromises.forEach((promise) =>
      promise.then(
        (r) => (data.documents = r ? data.documents.concat(r) : data.documents)
      )
    );

    //persons
    data.persons = [];
    const personsPromises = this._retrieveFromTripleStore(
      this.PERSONS_QUERY_URL,
      2
    );
    personsPromises.forEach((promise) =>
      promise.then(
        (r) => (data.persons = r ? data.persons.concat(r) : data.persons)
      )
    );

    //addresses
    data.addresses = [];
    const addressesPromises = this._retrieveFromTripleStore(
      this.ADDRESSES_QUERY_URL,
      2
    );
    addressesPromises.forEach((promise) =>
      promise.then(
        (r) => (data.addresses = r ? data.addresses.concat(r) : data.addresses)
      )
    );

    //addressesPerDocument
    data.addressesPerDocument = [];
    const addressesPerDocumentPromises = this._retrieveFromTripleStore(
      this.ADDRESSES_PER_DOCUMENT_QUERY_URL,
      2
    );
    addressesPerDocumentPromises.forEach((promise) =>
      promise.then(
        (r) =>
          (data.addressesPerDocument = r
            ? data.addressesPerDocument.concat(r)
            : data.addressesPerDocument)
      )
    );

    //personsPerAddressPerDocument
    data.personsPerAddressPerDocument = [];
    const personsPerAddressPerDocumentPromises = this._retrieveFromTripleStore(
      this.PERSON_ADDRESS_DOCUMENT_QUERY_URL,
      2
    );
    personsPerAddressPerDocumentPromises.forEach((promise) =>
      promise.then(
        (r) =>
          (data.personsPerAddressPerDocument = r
            ? data.personsPerAddressPerDocument.concat(r)
            : data.personsPerAddressPerDocument)
      )
    );

    const dataPromises = [
      ...sourcesPromises,
      ...documentsPromises,
      ...addressesPromises,
      ...personsPromises,
      ...addressesPerDocumentPromises,
      ...personsPerAddressPerDocumentPromises,
    ];
    await Promise.all(dataPromises);
    return data;
  }

  parseDataFromTripleStore(tripleStoreData: TripleStoreDataModel) {
    const parsedData: DataModel = {};

    //create lookup tables
    parsedData.sourcesById = Object.assign(
      {},
      ...tripleStoreData.sources.map((x) => ({
        [x.sourceId]: x,
      }))
    );

    parsedData.documentsById = Object.assign(
      {},
      ...tripleStoreData.documents.map((x) => ({
        [x.docId]: x,
      }))
    );

    parsedData.addressesById = Object.assign(
      {},
      ...tripleStoreData.addresses.map((x) => ({
        [x.addressId]: x,
      }))
    );

    parsedData.personsById = Object.assign(
      {},
      ...tripleStoreData.persons.map((x) => ({
        [x.personId]: x,
      }))
    );

    //create arrays
    parsedData.sources = Object.values(parsedData.sourcesById);
    parsedData.documents = Object.values(parsedData.documentsById);
    parsedData.addresses = Object.values(parsedData.addressesById);
    parsedData.persons = Object.values(parsedData.personsById);

    //link documentsById to sourcesById on key 'bronType'
    const items = parsedData.documentsById;
    const lut = parsedData.sourcesById;
    for (const id in items) {
      items[id]["sourceItem"] = lut[items[id]["sourceId"]];
    }

    //link addresses to documents (and the other vice versa)
    for (const item of tripleStoreData.addressesPerDocument) {
      const doc = parsedData.documentsById[item.docId];
      const address = parsedData.addressesById[item.addressId];

      //store address in list with address for certain document
      if (!doc.addresses) doc.addresses = [];
      doc.addresses.push(address);

      //store documents that are associated to this address
      if (!address.documents) address.documents = [];
      address.documents.push(doc);
    }

    // persons per address per document
    for (const item of tripleStoreData.personsPerAddressPerDocument) {
      // console.log("item",item); //alleen id's + een labeltje niet perse nodig is
      const doc = parsedData.documentsById[item.docId];
      const person = parsedData.personsById[item.personId];
      const address = parsedData.addressesById[item.addressId];

      //list of persons associated with address on certain document
      if (!doc.personAtAddressItems) doc.personAtAddressItems = [];
      doc.personAtAddressItems.push({
        person: person,
        address: address,
      });

      //be able to get a list of persons associated with an address on any document
      if (!address.persons) address.persons = [];
      address.persons.push(person);
    }

    //store documents per sourceType
    for (const source of parsedData.sources) {
      source.documents = parsedData.documents.filter((doc) => {
        return doc.sourceItem == source;
      });
    }

    //store addresses per sourceType
    for (const source of parsedData.sources) {
      source.addresses = parsedData.addresses.filter((address) => {
        for (const doc of source.documents) {
          if (
            doc.addresses?.find((o) => {
              return o == address;
            })
          )
            return true;
        }
        return false;
      });
    }

    // TODO: Parse address coordinates
    for (const address of parsedData.addresses) {
      address.documentCount = address.documents.length;
      address.coordinates = [5.097939670669287, 52.09408062362957];
      // console.log(address);
    }

    console.log("all addresses (unique):", parsedData.addresses.length);
    console.log("all documents:", parsedData.documents.length);
    console.log("all persons (mentions):", parsedData.persons.length);
    console.log("all sources:", parsedData.sources.length);

    return parsedData;
  }

  async init() {
    let parsedData: DataModel = {};

    console.log("loading");

    await this.retrieveAllDataFromTripleStore()
      .then(async (data) => {
        console.log("linking");

        parsedData = this.parseDataFromTripleStore(data);
        console.log("FINAL", parsedData);
        const searchTerm = "willem";
        const searchSources = [
          parsedData.sources[0],
          parsedData.sources[1],
          parsedData.sources[2],
        ];

        console.log(parsedData.sources);

        console.log("filtering");
        const filteredData = this.filterData(
          parsedData,
          searchTerm,
          SearchOptionModel.All,
          searchSources
        );

        const geoJson: AddressesGeoJsonModel = this._parseGeoJson(
          parsedData.addresses
        );
        // console.log("SETTING", geoJson);
        await store.dispatch("map/updateGeoJson", geoJson);

        console.log("filteredData", filteredData);

        console.log(
          'example: filterData(linkedData, "willem", "all", [linkedData.sources[1]])'
        );
      })
      .catch((err) => {
        console.log("error", err);
      });

    console.log(
      "%c Hallo Simon!!!",
      "font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"
    );
  }

  filterData(
    data: DataModel,
    searchTerm: string,
    searchOption: SearchOptionModel,
    selectedSources: SourceRickModel[]
  ) {
    console.log("SOURCES", selectedSources);
    if (!selectedSources) selectedSources = data.sources; //default = all sources

    console.log(
      `searching for '${searchTerm}' in '${searchOption}' of '${selectedSources.map(
        (o) => {
          return " " + o.label;
        }
      )}'`
    );

    //deze gaat álle adressen af en matcht ze met selectedSources[].addresses[]
    let filteredData = data.addresses.filter((address) => {
      if (selectedSources == data.sources) return true; //shortlane: all sources selected

      for (const source of selectedSources) {
        if (source.addresses?.indexOf(address) != -1) {
          return true;
        }
      }
      return false;
    });

    const doesAnyPersonContain = (persons, searchTerm) => {
      if (!persons) return false;
      for (const person of persons) {
        if (person.label?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
      }
      return false;
    };

    const doesAddressContain = (address, searchTerm) => {
      return address.label?.toLowerCase().includes(searchTerm.toLowerCase());
    };

    if (searchTerm) {
      //filter by all: either persons or addresses
      if (searchOption == SearchOptionModel.All) {
        filteredData = filteredData.filter((address) => {
          return (
            doesAnyPersonContain(address.persons, searchTerm) ||
            doesAddressContain(address, searchTerm)
          );
        });
      }

      //filter by person name
      else if (searchOption == SearchOptionModel.People) {
        filteredData = filteredData.filter((address) => {
          return doesAnyPersonContain(address.persons, searchTerm);
        });
      }

      //filter by address
      else if (searchOption == SearchOptionModel.Addresses) {
        filteredData = filteredData.filter((address) => {
          return doesAddressContain(address, searchTerm);
        });
      } else {
        throw new Error("Unknown searchOption: " + searchOption);
      }
    }

    return filteredData;
  }
}
