import {DocumentModel} from "../../models/document.model";

interface PreviewModalState {
    shownDocuments: DocumentModel[]
    isShown: boolean;
}

export const previewModalModule = {
    namespaced: true,
    state() {
        return {
            shownDocuments: [],
            isShown: false,
        };
    },
    getters: {
        getIsShown(state: PreviewModalState) {
            return state.isShown;
        },
        getShownDocuments(state: PreviewModalState) {
            return state.shownDocuments;
        }
    },
    mutations: {
        setShownDocuments: (state: PreviewModalState, shownDocuments: DocumentModel[]) => {
            state.shownDocuments = shownDocuments;
        },
        setIsShown: (state: PreviewModalState, isShown: boolean) => {
            state.isShown = isShown;
        }
    }
};