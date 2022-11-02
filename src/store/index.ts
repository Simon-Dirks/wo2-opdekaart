import { createStore } from "vuex";
import { previewModalModule } from "./preview-modal";
import { AddressModel } from "../models/address.model";
import { SourceModel } from "../models/source.model";
import { SearchOptionModel } from "../models/search-option.model";
import { DataModel } from "../models/data.model";
import { LngLatBounds } from "mapbox-gl";
import { DocumentModel } from "../models/document.model";

export interface State {
  allData: DataModel | null;
  filteredAddresses: AddressModel[] | null;
  filteredDocuments: DocumentModel[] | null;
  // filteredAddressesById: { [name: string]: AddressModel } | null;
  selectedAddress: AddressModel | null;
  searchTerm: string;
  searchOption: SearchOptionModel;
  shownSourceIds: Set<string>;
  // shownSources: Set<SourceModel>;
  sources: SourceModel[];
  mapBounds: LngLatBounds | null;
}

export const store = createStore<State>({
  modules: {
    //   map: mapStoreModule,
    previewModal: previewModalModule,
  },
  state() {
    return {
      allData: null,
      filteredAddresses: null,
      // filteredAddressesById: null,
      filteredDocuments: null,
      selectedAddress: null,
      searchTerm: "",
      searchOption: SearchOptionModel.All,
      shownSourceIds: new Set<string>([]),
      // shownSources: new Set<SourceModel>([]),
      sources: [],
      mapBounds: null,
    };
  },
  getters: {
    getAllData(state) {
      return state.allData;
    },
    getFilteredAddresses(state) {
      return state.filteredAddresses;
    },
    // getFilteredAddressesById(state) {
    //   return state.filteredAddressesById;
    // },
    getFilteredDocuments(state) {
      return state.filteredDocuments;
    },
    getSelectedItem(state) {
      return state.selectedAddress;
    },
    getSearchTerm(state) {
      return state.searchTerm;
    },
    getSearchOption(state) {
      return state.searchOption;
    },
    getShownSourceIds(state): Set<string> {
      return state.shownSourceIds;
    },
    getSourceIdIsShown:
      (state) =>
      (sourceId: string): boolean => {
        return state.shownSourceIds.has(sourceId);
      },
    getSources(state): SourceModel[] {
      return state.sources;
    },
    getShownSources(state, getters): SourceModel[] {
      return state.sources.filter((source) => {
        return getters.getSourceIdIsShown(source.sourceId);
      });
    },
    getMapBounds(state): LngLatBounds | null {
      return state.mapBounds;
    },
  },
  mutations: {
    setAllData(state: State, allData: DataModel) {
      state.allData = allData;
    },
    setFilteredAddresses(state: State, filteredAddresses: AddressModel[]) {
      state.filteredAddresses = filteredAddresses;
    },
    // setFilteredAddressesById(
    //   state: State,
    //   filteredAddressesById: { [name: string]: AddressModel }
    // ) {
    //   state.filteredAddressesById = filteredAddressesById;
    // },
    setFilteredDocuments(state: State, filteredDocuments: DocumentModel[]) {
      state.filteredDocuments = filteredDocuments;
    },
    setSearchOption(state: State, searchOption: SearchOptionModel) {
      state.searchOption = searchOption;
    },
    setSearchTerm(state: State, searchTerm: string) {
      console.log("setSearchTerm", searchTerm);
      state.searchTerm = searchTerm;
    },
    setMapBounds(state: State, mapBounds: LngLatBounds) {
      state.mapBounds = mapBounds;
    },
    setShownSourceIds(state: State, shownSourceIds: Set<string>) {
      state.shownSourceIds = shownSourceIds;
    },
    // setShownSources(state: State, shownSources: Set<SourceModel>) {
    //   console.log("setShownSources", shownSources);
    //   state.shownSources = shownSources;
    // },
    selectAddress(state: State, selectedAddress: AddressModel) {
      state.selectedAddress = selectedAddress;
    },
    // deselectAddress(state: State) {
    //   state.selectedAddress = null;
    // },
    setSources(state: State, sources: SourceModel[]) {
      state.sources = sources;
    },
  },
});
