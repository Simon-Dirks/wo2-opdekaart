<template>
  <div
    :class="[
      isShownFullscreen ? 'grid grid-cols-6 text-white grid-flow-dense' : '',
    ]"
    v-if="document"
  >
    <div
      class="col-span-6 h-full flex-initial bg-black md:col-start-3 md:col-span-4"
      :class="[isShownFullscreen ? 'p-4' : '']"
    >
      <div class="flex-auto">
        <button
          @click="openModal"
          class="w-full"
          :class="isShownFullscreen ? 'cursor-default' : 'cursor-pointer'"
        >
          <div class="overflow-hidden">
            <img
              v-lazy="{
                src: getImageUrl(document.image),
                lifecycle: {
                  loaded: () => {
                    if (!swiper) {
                      return;
                    }

                    swiper.updateAutoHeight();
                  },
                  error: (el) => {
                    if (!swiper) {
                      return;
                    }
                    el.addEventListener('load', () => {
                      swiper.updateAutoHeight();
                    });
                  },
                },
              }"
              alt=""
              class="w-full h-full max-h-[80vh] !object-contain select-none"
              loading="lazy"
              ref="imageRef"
            />

            <div v-if="!isShownFullscreen">
              <p class="p-0 m-0 text-left font-mono text-xs mt-2">
                {{ document.sourceItem.label }}
              </p>
            </div>
          </div>
        </button>
      </div>
      <div
        class="text-left drop-shadow flex-[0_1_20px]"
        v-if="isShownFullscreen"
      >
        <p>
          <a :href="getDocumentUrl(document.docId)" target="_blank">
            {{ document.label }}</a
          >
        </p>
      </div>
    </div>

    <div
      class="col-span-6 overflow-y-auto max-h-[90vh] px-6 flex-initial md:col-span-2 p-4"
      v-if="isShownFullscreen"
    >
      <div
        v-if="peopleMatchingSearch && peopleMatchingSearch.length > 0"
        class="mb-4"
      >
        <h2 class="text-2xl">Zoekresultaat</h2>
        <div
          class="grid grid-cols-2"
          v-for="personAtAddress in peopleMatchingSearch"
        >
          <button
            @click="onPersonClicked(personAtAddress.person.label)"
            class="text-left italic"
          >
            {{ personAtAddress.person.label }}
          </button>

          <button
            @click="onPersonClicked(personAtAddress.address.label)"
            class="text-left italic"
          >
            {{ personAtAddress.address.label }}
          </button>
        </div>
      </div>
      <div>
        <div>
          <h1 v-if="shownAddress" class="text-2xl font-bold mb-6">
            {{ shownAddress?.label }}
          </h1>
        </div>

        <div class="mb-8 text-sm">
          <p class="font-bold">{{ document.sourceItem.label }}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. At
            deserunt esse facilis hic, inventore quo similique soluta. Excepturi
            ipsum perferendis quos. Accusantium eaque enim error iusto minima
            quod voluptas voluptates.
          </p>
          <!--          <button @click="onShareScanCommentsClicked">-->
          <!--            <em> Fout melden </em>-->
          <!--          </button>-->
        </div>
        <div class="grid grid-cols-2">
          <h2 class="font-bold mb-1">Persoon</h2>
          <h2 class="font-bold mb-1">Adres</h2>
        </div>

        <div>
          <div
            class="grid grid-cols-2"
            v-for="personAtAddress in props.document.personAtAddressItems"
          >
            <div>
              <button
                @click="onPersonClicked(personAtAddress.person.label)"
                class="text-left"
              >
                {{ personAtAddress.person.label }}
              </button>
            </div>

            <div>
              <button
                @click="onPersonClicked(personAtAddress.address.label)"
                class="text-left"
              >
                {{ personAtAddress.address.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import { useSwiper } from "swiper/vue";
import { DocumentModel, PersonAtAddressModel } from "../models/document.model";
import { useStore } from "vuex";
import Panzoom from "@panzoom/panzoom";
import { SearchOptionModel } from "../models/search-option.model";
import { UtilService } from "../services/util.service";
import { AddressModel } from "../models/address.model";

const imageRef: Ref<any> = ref(null);
const store = useStore();

onMounted(() => {
  if (props.isShownFullscreen) {
    const panzoom = Panzoom(imageRef.value, {
      contain: "outside",
      animate: true,
      cursor: "default",
    });
    imageRef.value.addEventListener("wheel", panzoom.zoomWithWheel);
  }
});

const props = defineProps({
  address: { type: Object as PropType<AddressModel | null>, required: false },
  documents: {
    type: Object as PropType<DocumentModel[] | undefined>,
    required: true,
  },
  document: { type: Object as PropType<DocumentModel>, required: true },
  slideIndex: { type: Number, required: false },
  isShownFullscreen: { type: Boolean, required: false },
});

const openModal = () => {
  store.dispatch("previewModal/show", {
    address: props.address,
    documents: props.documents,
    initialSlideIndex: props.slideIndex ?? 0,
  });
};

const getImageUrl = (imgUrl: string | undefined | null): string => {
  if (!imgUrl) {
    return "https://via.placeholder.com/350x150";
  }

  const imgId: string = imgUrl.replace(
    "https://proxy.archieven.nl/thumb/39/",
    ""
  );
  const url = `https://proxy.archieven.nl/${
    props.isShownFullscreen ? "download" : "thumb"
  }/39/`;
  return url + imgId;
};

const swiper = useSwiper();

const documentRefersToPeople: boolean =
  props.document?.personAtAddressItems !== undefined &&
  props.document.personAtAddressItems.length > 0;

const getDocumentUrl = (documentId: string): string => {
  if (!documentId) {
    return "https://hetutrechtsarchief.nl/";
  }

  const documentGuid: string = documentId.replace(
    "https://hetutrechtsarchief.nl/id/doc/",
    ""
  );
  return "https://hetutrechtsarchief.nl/collectie/" + documentGuid;
};

const onPersonClicked = (personLabel: string) => {
  store.commit("setSearchTerm", personLabel);
  store.dispatch("previewModal/close");
};

const onShareScanCommentsClicked = () => {
  alert("Fout melden");
};

const peopleMatchingSearch: ComputedRef<PersonAtAddressModel[] | undefined> =
  computed(() => {
    if (props.document.personAtAddressItems) {
      const search: string = store.getters["getSearchTerm"];
      if (!search) {
        return [];
      }

      const searchOption: SearchOptionModel = store.getters["getSearchOption"];
      const matchingPeople: PersonAtAddressModel[] =
        props.document.personAtAddressItems.filter(
          (personAtAddressItem: PersonAtAddressModel) => {
            if (searchOption === SearchOptionModel.Addresses) {
              return UtilService.labelMatchesSearch(
                personAtAddressItem.address.label,
                search
              );
            }
            if (searchOption === SearchOptionModel.People) {
              return UtilService.labelMatchesSearch(
                personAtAddressItem.person.label,
                search
              );
            }
            return (
              UtilService.labelMatchesSearch(
                personAtAddressItem.person.label,
                search
              ) ||
              UtilService.labelMatchesSearch(
                personAtAddressItem.address.label,
                search
              )
            );
          }
        );

      return matchingPeople;
    }
  });

const shownAddress: ComputedRef<AddressModel> = computed(
  () => store.getters["previewModal/getShownAddress"]
);
</script>

<style>
.image-slide img {
  object-fit: contain !important;
  width: 100%;
}

.image-slide .n-image {
  justify-content: space-around;
}

.zoom-transition {
  transition: -moz-transform ease 200ms;
  transition: -ms-transform ease 200ms;
  transition: -o-transform ease 200ms;
  transition: -webkit-transform ease 200ms;
  transition: transform ease 200ms;
}
</style>
