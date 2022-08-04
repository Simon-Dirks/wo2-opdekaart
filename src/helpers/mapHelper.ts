import mapboxgl from "mapbox-gl";
import {MarkerPropertiesModel} from "../models/marker-properties.model";

export class MapHelper {
    static initializeFromGeoJson(map: any, geoJsonUrl: string): void {
        // @ts-ignore
        map.addSource('markers-source', {
            type: 'geojson',
            data: geoJsonUrl,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points
        });

        map.addLayer({
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

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'markers-source',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'markers-source',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': ['get', 'marker-color'],
                'circle-radius': 7,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        map.on('click', 'clusters', (e: any) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('markers-source').getClusterExpansionZoom(
                clusterId,
                (err: any, zoom: any) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer !important';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
    }

    static onMapMarkerClicked(map: any, e: any) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const streetName: string = MapHelper.getMarkerProperties(e).straatnaam;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup({closeButton: false, closeOnClick: true, closeOnMove: false})
            .setLngLat(coordinates)
            .setHTML(
                `${streetName}`
            )
            .addTo(map);
    }

    static getMarkerProperties(e: any): MarkerPropertiesModel {
        return e.features[0].properties;
    }
}