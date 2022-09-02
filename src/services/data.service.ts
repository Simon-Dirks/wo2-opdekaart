import {DocumentForAddressModel} from "../models/triple-store/document-for-address.model";
import {TripleStorePersonModel} from "../models/triple-store/triple-store-person.model";
import {TripleStoreDocumentModel} from "../models/triple-store/triple-store-document.model";
import {TripleStoreAddressModel} from "../models/triple-store/triple-store-address.model";
import {DocumentModel} from "../models/document.model";
import {AddressModel} from "../models/address.model";
import {PersonModel} from "../models/person.model";
import {LngLatLike} from "mapbox-gl";
import {store} from "../store";
import {AddressesGeoJsonModel} from "../models/addresses-geo-json.model";

export class DataService {
    private static _instance: DataService;
    private readonly DOCUMENTS_QUERY_URL: string = 'https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-documenten/run?pageSize=10000';
    private readonly ADDRESSES_QUERY_URL: string = 'https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-adressen/run';
    private readonly DOCUMENTS_FOR_ADDRESSES_QUERY_URL: string = 'https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-adressen-per-document/run';
    private readonly PEOPLE_QUERY_URL: string = 'https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/wo2-personen/run';

    constructor() {
        if (DataService._instance) {
            return DataService._instance
        }
        DataService._instance = this;
    }

    public async updateFromServer(): Promise<void> {
        console.log("Retrieving markers...");

        let documents: TripleStoreDocumentModel[] = [];
        // TODO: Dynamic check (run for loop until no results are returned anymore)
        // TODO: Optimize by running all requests asynchronously
        for (let documentPageIdx = 1; documentPageIdx <= 2; documentPageIdx++) {
            const documentsPage: TripleStoreDocumentModel[] = await this._fetch(this.DOCUMENTS_QUERY_URL + `&page=${documentPageIdx}`);
            documents = documents.concat(documentsPage);
        }

        const people: TripleStorePersonModel[] = await this._fetch(this.PEOPLE_QUERY_URL);
        const addresses: TripleStoreAddressModel[] = await this._fetch(this.ADDRESSES_QUERY_URL);
        const documentsForAddresses: DocumentForAddressModel[] = await this._fetch(this.DOCUMENTS_FOR_ADDRESSES_QUERY_URL);

        const parsedDocuments: DocumentModel[] = this._parseDocuments(documents, people);
        store.commit("map/setDocuments", parsedDocuments);

        const parsedAddresses: AddressModel[] = this._parseAddresses(addresses, documentsForAddresses);
        const geoJson: AddressesGeoJsonModel = this._parseGeoJson(parsedAddresses);
        store.commit("map/setGeoJson", geoJson)

        return Promise.resolve();
    }

    private _parseDocuments(tripleStoreDocuments: TripleStoreDocumentModel[], tripleStorePeople: TripleStorePersonModel[]): DocumentModel[] {
        const peopleForDocuments: { [documentId: string]: PersonModel[] } = {};
        for (const tripleStorePerson of tripleStorePeople) {
            const personDocumentId: string = tripleStorePerson.doc;
            if (!(personDocumentId in peopleForDocuments)) {
                peopleForDocuments[personDocumentId] = [];
            }

            peopleForDocuments[tripleStorePerson.doc].push({
                id: tripleStorePerson.persoon,
                label: tripleStorePerson.label,
                occupation: tripleStorePerson.beroep,
                birthDate: tripleStorePerson.geboortedatum,
                birthPlace: tripleStorePerson.geboortedatum
            });
        }

        const documents: DocumentModel[] = [];
        for (const tripleStoreDocument of tripleStoreDocuments) {
            const documentId: string = tripleStoreDocument.doc;
            const document: DocumentModel = {
                id: documentId,
                imageUrl: tripleStoreDocument.image,
                label: tripleStoreDocument.label,
                people: peopleForDocuments[documentId],
                source: {
                    id: tripleStoreDocument.bronType,
                    label: 'LABEL' // TODO: Set label based on source type ID
                }
            }
            documents.push(document);
        }
        return documents;
    }

    private _parseAddresses(tripleStoreAddresses: TripleStoreAddressModel[], documentsForAddresses: DocumentForAddressModel[]): AddressModel[] {
        const addresses: AddressModel[] = [];

        const documentIdsPerAddress: { [addressId: string]: string[] } = {};
        for (const documentForAddress of documentsForAddresses) {
            if (!(documentForAddress.adres in documentIdsPerAddress)) {
                documentIdsPerAddress[documentForAddress.adres] = [];
            }

            documentIdsPerAddress[documentForAddress.adres].push(documentForAddress.doc);
        }

        for (const tripleStoreAddress of tripleStoreAddresses) {
            const addressId: string = tripleStoreAddress.adres;
            let documentIds: string[] = [];
            if (addressId in documentIdsPerAddress) {
                documentIds = documentIdsPerAddress[addressId];
            }

            const address: AddressModel = {
                id: addressId,
                label: tripleStoreAddress.label,
                coordinates: this._parseGeoCoords(tripleStoreAddress.geo),
                place: tripleStoreAddress.woonplaats,
                streetName: tripleStoreAddress.straatnaam,
                documentIds: documentIds,
                documentCount: documentIds.length,
                houseLetter: tripleStoreAddress.huisletter,
                houseNumber: tripleStoreAddress.huisnummer,
                houseNumberAddition: tripleStoreAddress.huisnummer_toevoeging,
            }
            addresses.push(address);
        }
        return addresses;
    }

    private _parseGeoJson(addresses: AddressModel[]): AddressesGeoJsonModel {
        const markersGeoJson: AddressesGeoJsonModel = {
            "type": "FeatureCollection",
            "features": []
        };

        for (const address of addresses) {
            markersGeoJson['features'].push({
                properties: address,
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: address?.coordinates
                }
            })
        }
        return markersGeoJson;
    }

    private _parseGeoCoords(geo: string | undefined): LngLatLike {
        if (!geo) {
            console.warn("No coordinates passed... Using center of the Netherlands.");
            return [5.2793703, 52.2129919];
        }

        if (geo.includes('polygon')) {
            console.warn("Polygon coordinates passed... Using center of the Netherlands.");
            return [5.2793703, 52.2129919];
        }


        const coordsStr: string[] = geo.replace('POINT (', '').replace(')', '').split(' ');
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
            method: 'get',
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