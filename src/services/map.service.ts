import mapboxgl, {LngLatBounds} from "mapbox-gl";
import {store} from "../store";
import {watch} from "vue";
import {AddressesGeoJsonModel} from "../models/addresses-geo-json.model";
import {AddressModel} from "../models/address.model";

export class MapService {
    private static _instance: MapService;

    // @ts-ignore
    private _map: mapboxgl.Map;
    private readonly _maxAddressesToShow = 50;

    constructor() {
        if (MapService._instance) {
            return MapService._instance
        }
        MapService._instance = this;

        watch(() => store.getters["map/getGeoJson"], (geoJson: AddressesGeoJsonModel) => {
            console.log('GeoJson updated:', geoJson);
            this._updateSourceData(geoJson);
        });
    }

    public async initialize(map: mapboxgl.Map): Promise<void> {
        this._map = map;

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
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
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
            filter: ['has', 'document_count'],
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

    public async updateFilter(filter: string) {
        store.commit("updateSearchTerm", filter);

        const geoJson = store.getters["map/getGeoJson"];
        const filteredGeoJson: AddressesGeoJsonModel = {"type": "FeatureCollection", "features": []};
        for (const feature of geoJson["features"]) {
            if (this._addressIsShownWithFilter(feature?.properties)) {
                filteredGeoJson.features.push(feature);
            }
        }
        this._updateSourceData(filteredGeoJson);
    }

    private _addressIsShownWithFilter(address: AddressModel): boolean {
        const filter: string = store.getters.getSearchTerm;
        if (!filter) {
            return true;
        }
        return address.label.toLowerCase().includes(filter.toLowerCase());
    }

    public getShownAddresses(): AddressModel[] {
        const geoJson = store.getters["map/getGeoJson"];
        if (!geoJson || !this._map || !('features' in geoJson)) {
            return [];
        }

        const mapBounds: LngLatBounds = this._map.getBounds();
        const filteredGeoJson = geoJson['features'].filter((feature: any) => {
            return this._addressIsShownWithFilter(feature?.properties) && mapBounds.contains(feature['geometry']['coordinates']);
        })
        // TODO: Handle showing more than a pre-defined number of addresses (scroll down to load additional items?)
        const shownAddresses: AddressModel[] = filteredGeoJson.slice(0, this._maxAddressesToShow).map((feature: any) => feature.properties);
        return shownAddresses;
    }

    private _updateSourceData(geoJson: AddressesGeoJsonModel): void {
        if (!this._map) {
            console.warn("Tried to update source data while map was not (yet) initialized");
            return;
        }

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
        // TODO: Fix issue with scans not showing properly when selecting single item
        const addressData: AddressModel = e.features[0].properties;
        return addressData;
    }

}