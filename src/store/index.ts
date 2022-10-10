import { createStore } from "vuex";
import { mapStoreModule } from "./map";
import { previewModalModule } from "./preview-modal";
import { paginationModule } from "./pagination";
import { AddressModel } from "../models/address.model";
import { SourceModel } from "../models/source.model";
import { SearchOptionModel } from "../models/search-option.model";

export interface State {
  selectedAddress: AddressModel | null;
  searchTerm: string;
  searchOption: SearchOptionModel;
  shownSourceIds: Set<string>;
  sources: SourceModel[];
}

export const store = createStore<State>({
  modules: {
    map: mapStoreModule,
    previewModal: previewModalModule,
    pagination: paginationModule,
  },
  state() {
    return {
      selectedAddress: null,
      searchTerm: "",
      shownSourceIds: new Set<string>([]),
      sources: [],
      searchOption: SearchOptionModel.All,
    };
  },
  getters: {
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
  },
  mutations: {
    setSearchTerm(state: State, searchTerm: string) {
      state.searchTerm = searchTerm;
    },
    setSearchOption(state: State, searchOption: SearchOptionModel) {
      state.searchOption = searchOption;
    },
    setShownSourceIds(state: State, shownSourceIds: Set<string>) {
      state.shownSourceIds = shownSourceIds;
    },
    selectAddress(state: State, selectedAddress: AddressModel) {
      state.selectedAddress = selectedAddress;
    },
    deselectAddress(state: State) {
      state.selectedAddress = null;
    },
    setSources(state: State, sources: SourceModel[]) {
      state.sources = sources;
    },
  },
});
