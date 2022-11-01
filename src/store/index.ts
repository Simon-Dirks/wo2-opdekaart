import { ActionContext, createStore } from "vuex";
import { mapStoreModule } from "./map";
import { previewModalModule } from "./preview-modal";
import { AddressModel } from "../models/address.model";
import { SourceModel } from "../models/source.model";
import { SearchOptionModel } from "../models/search-option.model";
import { DataModel } from "../models/data.model";
import { AddressesGeoJsonModel } from "../models/addresses-geo-json.model";

export interface State {
  allData: DataModel | null;
  filteredAddresses: AddressModel[] | null;
  // selectedAddress: AddressModel | null;
  searchTerm: string;
  searchOption: SearchOptionModel;
  shownSourceIds: Set<string>;
  // shownSources: Set<SourceModel>;
  sources: SourceModel[];
}

export const store = createStore<State>({
  // modules: {
  //   map: mapStoreModule,
  //   previewModal: previewModalModule,
  // },
  state() {
    return {
      allData: null,
      filteredAddresses: null,
      // selectedAddress: null,
      searchTerm: "",
      shownSourceIds: new Set<string>([]),
      // shownSources: new Set<SourceModel>([]),
      sources: [],
      searchOption: SearchOptionModel.All,
    };
  },
  getters: {
    getAllData(state) {
      return state.allData;
    },
    getFilteredAddresses(state) {
      return state.filteredAddresses;
    },
    // getSelectedItem(state) {
    //   return state.selectedAddress;
    // },
    getSearchTerm(state) {
      return state.searchTerm;
    },
    getSearchOption(state) {
      return state.searchOption;
    },
    getShownSourceIds(state): Set<string> {
      return state.shownSourceIds;
    },
    // getShownSources(state): Set<SourceModel> {
    //   console.log("getShownSources", state.shownSources);
    //   return state.shownSources;
    // },
    getSourceIdIsShown:
      (state) =>
      (sourceId: string): boolean => {
        return state.shownSourceIds.has(sourceId);
      },
    getSources(state): SourceModel[] {
      return state.sources;
    },
  },
  mutations: {
    setAllData(state: State, allData: DataModel) {
      state.allData = allData;
    },
    setFilteredAddresses(state: State, filteredAddresses: AddressModel[]) {
      state.filteredAddresses = filteredAddresses;
    },
    setSearchOption(state: State, searchOption: SearchOptionModel) {
      state.searchOption = searchOption;
    },
    setSearchTerm(state: State, searchTerm: string) {
      state.searchTerm = searchTerm;
    },
    setShownSourceIds(state: State, shownSourceIds: Set<string>) {
      state.shownSourceIds = shownSourceIds;
    },
    // setShownSources(state: State, shownSources: Set<SourceModel>) {
    //   console.log("setShownSources", shownSources);
    //   state.shownSources = shownSources;
    // },
    // selectAddress(state: State, selectedAddress: AddressModel) {
    //   state.selectedAddress = selectedAddress;
    // },
    // deselectAddress(state: State) {
    //   state.selectedAddress = null;
    // },
    setSources(state: State, sources: SourceModel[]) {
      console.log("setSources", sources);
      state.sources = sources;
    },
  },
});
