import { ActionContext } from "vuex";
import { State } from "../index";

interface PaginationState {
  page: number;
}

export const paginationModule = {
  namespaced: true,
  state() {
    return {
      page: 0,
    };
  },
  getters: {
    getCurrentPage(state: PaginationState): number {
      return state.page;
    },
    getStartElemIdx(state: PaginationState, getters: any): number {
      return state.page * getters.getElemCount;
    },
    getEndElemIdx(state: PaginationState, getters: any): number {
      return getters.getStartElemIdx + getters.getElemCount;
    },
    getElemCount(state: PaginationState): number {
      return parseInt(import.meta.env.VITE_RESULTS_PER_PAGE);
    },
    prevPageIsAvailable(state: PaginationState): boolean {
      return state.page - 1 >= 0;
    },
    nextPageIsAvailable:
      (state: PaginationState, getters: any) =>
      (maxElements: number): boolean => {
        return getters.getStartElemIdx + getters.getElemCount < maxElements;
      },
    getFinalPageNum:
      (state: PaginationState, getters: any) =>
      (maxElements: number): number => {
        return Math.floor(maxElements / getters.getElemCount);
      },
  },
  actions: {
    goToPrevPage: (context: ActionContext<PaginationState, State>) => {
      if (context.getters.prevPageIsAvailable) {
        context.commit("setPage", context.state.page - 1);
      }
    },
    goToNextPage: (context: ActionContext<PaginationState, State>) => {
      if (context.getters.nextPageIsAvailable) {
        context.commit("setPage", context.state.page + 1);
      }
    },
  },
  mutations: {
    setPage(state: PaginationState, pageNum: number) {
      state.page = pageNum;
    },
  },
};
