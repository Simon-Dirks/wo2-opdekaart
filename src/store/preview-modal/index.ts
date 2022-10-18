import { DocumentModel } from "../../models/document.model";
import { ActionContext } from "vuex";
import { State } from "../index";

interface PreviewModalState {
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
        documents,
        initialSlideIndex,
      }: { documents: DocumentModel[]; initialSlideIndex: number }
    ) => {
      context.commit("setIsShown", true);
      context.commit("setShownDocuments", documents);
      context.commit("setInitialSlideIndex", initialSlideIndex);
    },
    close: (context: ActionContext<PreviewModalState, State>) => {
      context.commit("setIsShown", false);
      context.commit("setInitialSlideIndex", 0);
    },
  },
  getters: {
    getIsShown(state: PreviewModalState) {
      return state.isShown;
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
    setInitialSlideIndex: (
      state: PreviewModalState,
      initialSlideIndex: number
    ) => {
      state.initialSlideIndex = initialSlideIndex;
    },
  },
};
