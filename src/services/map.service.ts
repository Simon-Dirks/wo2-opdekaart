import geojsonExtent from "@mapbox/geojson-extent";
import mapboxgl, {LngLatBounds} from "mapbox-gl";

import {store} from "../store";
import {AddressesGeoJsonModel} from "../models/addresses-geo-json.model";
import {AddressModel} from "../models/address.model";
import {DocumentModel} from "../models/document.model";
import {PersonModel} from "../models/person.model";
import {watch} from "vue";

export class MapService {
    private static _instance: MapService;

    // @ts-ignore
    private _map: mapboxgl.Map;
    public get map() {
        return this._map;
    }

    constructor() {
        if (MapService._instance) {
            return MapService._instance
        }
        MapService._instance = this;

        watch(() => store.getters["map/getFilteredGeoJson"], (filteredGeoJson: AddressesGeoJsonModel) => {
            console.log("GeoJson updated:", filteredGeoJson);

            const geoJsonHasFeatures: boolean = filteredGeoJson.features.length > 0;
            if (geoJsonHasFeatures && this._map) {
                const markersBounds: LngLatBounds = geojsonExtent(filteredGeoJson);
                this._map.fitBounds(markersBounds);
            }

            this._updateSourceData(filteredGeoJson);
        });

        watch(() => store.getters["getSearchTerm"], () => {
            void this.updateFilter();
        })
    }

    public async initialize(map: mapboxgl.Map): Promise<void> {
        this._map = map;

        this._map.dragRotate.disable();

        // @ts-ignore
        this._map.addSource('markers-source', {
            type: 'geojson',
            data: undefined,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points,
            clusterProperties: {
                "document_count": ["+", ["get", "documentCount"]]
            }
        });


        this._map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'markers-source',
            filter: ['has', 'document_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'document_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'document_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        this._map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'markers-source',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{document_count}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        this._map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'markers-source',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#D72F19',
                'circle-radius': 7,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        this._map.addLayer({
            'id': 'poi-labels',
            'type': 'symbol',
            'source': 'markers-source',
            'layout': {
                'text-field': [
                    'format',
                    ['get', 'streetName'], {'font-scale': 0.8},
                    ' ',
                    ['get', 'houseNumber'], {'font-scale': 0.8},
                ],

                // 'get', 'streetName'],
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-font': [
                    'Open Sans Semibold',
                    'Arial Unicode MS Bold'
                ],
                // 'text-size': .8,
                'text-radial-offset': 0.5,
                'text-justify': 'auto'
            }
        });

        this._map.on('click', 'clusters', (e: any) => {
            const features = this._map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            // @ts-ignore
            const clusterId = features[0].properties.cluster_id;
            // @ts-ignore
            this._map.getSource('markers-source').getClusterExpansionZoom(
                clusterId,
                (err: any, zoom: any) => {
                    if (err) return;

                    this._map.easeTo({
                        center: (features[0].geometry as any).coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        this._map.on('mouseenter', 'clusters', () => {
            this._map.getCanvas().style.cursor = 'pointer !important';
        });
        this._map.on('mouseleave', 'clusters', () => {
            this._map.getCanvas().style.cursor = '';
        });

        this._map.on('click', 'unclustered-point', (e: any) => {
            e.preventDefault();

            this._onMapAddressClicked(e);

            const addressData: AddressModel = this._getAddressData(e);
            console.log(addressData);
            store.commit("selectAddress", addressData);
        });

        this._map.on('click', (e: any) => {
            if (e.defaultPrevented) {
                return;
            }
            store.commit("deselectAddress");
        });

        store.commit("map/setIsInitialized", true);
    }

    public async updateFilter() {
        // TODO: Move to store?
        const geoJson = store.getters["map/getGeoJson"];
        const filteredGeoJson: AddressesGeoJsonModel = {"type": "FeatureCollection", "features": []};
        for (const feature of geoJson["features"]) {
            const filteredFeature = JSON.parse(JSON.stringify(feature));

            const address: AddressModel = filteredFeature?.properties;
            const filteredAddress = this._getFilteredAddress(address);

            const filteredAddressHasNoDocuments: boolean = !filteredAddress?.documents || filteredAddress.documents.length < 0;
            if (!filteredAddress || filteredAddressHasNoDocuments) {
                continue;
            }

            filteredFeature.properties = filteredAddress;
            filteredGeoJson.features.push(filteredFeature);
        }
        store.commit("map/setFilteredGeoJson", filteredGeoJson);
    }

    private _getFilteredAddress(address: AddressModel): AddressModel | undefined {
        // TODO: Move to store?
        const searchFilter: string = store.getters.getSearchTerm;
        const searchFilterLowered: string = searchFilter.toLowerCase();
        const addressLabelMatchesSearch: boolean = address.label.toLowerCase().includes(searchFilterLowered);

        const filteredAddress: AddressModel = address;
        filteredAddress.documents = filteredAddress.documents.filter((document) => {
            return store.getters.getSourceIdIsShown(document.source.id)
        });
        filteredAddress.documentCount = filteredAddress.documents.length;
        if (filteredAddress.documentCount <= 0) {
            return undefined;
        }

        if (addressLabelMatchesSearch) {
            return filteredAddress;
        }

        const documentsThatMatchPeopleSearch: DocumentModel[] = filteredAddress?.documents.filter((doc: DocumentModel) => {
            if (!doc.people) {
                return false;
            }
            const documentPeopleThatMatchSearch: PersonModel[] = doc?.people.filter((person: PersonModel) => person.label.toLowerCase().includes(searchFilterLowered));
            return documentPeopleThatMatchSearch.length > 0;
        });
        const addressDocumentsMatchesPeopleSearch: boolean = documentsThatMatchPeopleSearch.length > 0;

        if (!addressDocumentsMatchesPeopleSearch) {
            return undefined;
        }

        filteredAddress.documents = documentsThatMatchPeopleSearch;
        filteredAddress.documentCount = filteredAddress.documents.length;
        return filteredAddress;
    }

    private _updateSourceData(geoJson: AddressesGeoJsonModel): void {
        if (!this._map) {
            console.warn("Tried to update source data while map was not (yet) initialized");
            return;
        }

        console.log("Updating map data", geoJson);
        (this._map.getSource('markers-source') as any).setData(geoJson);
    }

    private _onMapAddressClicked(e: any) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const label: string = this._getAddressData(e).label;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup({closeButton: false, closeOnClick: true, closeOnMove: false})
            .setLngLat(coordinates)
            .setHTML(
                `${label}`
            )
            .addTo(this._map);
    }

    private _getAddressData(e: any): AddressModel {
        const addressData: AddressModel = JSON.parse(JSON.stringify(e.features[0].properties as AddressModel));
        addressData.documents = JSON.parse(addressData.documents.toString());
        return addressData;
    }

}