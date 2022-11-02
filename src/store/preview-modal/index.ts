import { DocumentModel } from "../../models/document.model";
import { ActionContext } from "vuex";
import { State } from "../index";
import { AddressModel } from "../../models/address.model";

interface PreviewModalState {
  shownAddress: AddressModel | null;
  shownDocuments: DocumentModel[];
  isShown: boolean;
  initialSlideIndex: number;
}

export const previewModalModule = {
  namespaced: true,
  state() {
    return {
      shownDocuments: [],
      isShown: false,
    };
  },
  actions: {
    show: (
      context: ActionContext<PreviewModalState, State>,
      {
        address,
        documents,
        initialSlideIndex,
      }: {
        address: AddressModel | null;
        documents: DocumentModel[];
        initialSlideIndex: number;
      }
    ) => {
      context.commit("setIsShown", true);
      context.commit("setShownAddress", address);
      context.commit("setShownDocuments", documents);
      context.commit("setInitialSlideIndex", initialSlideIndex);
    },
    close: (context: ActionContext<PreviewModalState, State>) => {
      context.commit("setIsShown", false);
      context.commit("setInitialSlideIndex", 0);
      context.commit("setShownAddress", null);
    },
  },
  getters: {
    getIsShown(state: PreviewModalState) {
      return state.isShown;
    },
    getShownAddress(state: PreviewModalState) {
      return state.shownAddress;
    },
    getShownDocuments(state: PreviewModalState) {
      return state.shownDocuments;
    },
    getInitialSlideIndex(state: PreviewModalState) {
      return state.initialSlideIndex;
    },
  },
  mutations: {
    setShownDocuments: (
      state: PreviewModalState,
      shownDocuments: DocumentModel[]
    ) => {
      state.shownDocuments = shownDocuments;
    },
    setIsShown: (state: PreviewModalState, isShown: boolean) => {
      state.isShown = isShown;
    },
    setShownAddress: (
      state: PreviewModalState,
      address: AddressModel | null
    ) => {
      state.shownAddress = address;
    },
    setInitialSlideIndex: (
      state: PreviewModalState,
      initialSlideIndex: number
    ) => {
      state.initialSlideIndex = initialSlideIndex;
    },
  },
};
