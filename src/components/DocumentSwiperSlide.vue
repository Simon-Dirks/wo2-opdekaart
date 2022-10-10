<template>
  <div
    :class="[
      isShownFullscreen ? 'grid grid-cols-6 text-white grid-flow-dense' : '',
    ]"
    v-if="document"
  >
    <div
      class="col-span-6 h-full flex-initial"
      :class="[documentRefersToPeople ? 'md:col-start-3 md:col-span-4' : '']"
    >
      <div class="flex-auto">
        <button
          @click="openModal"
          class="w-full"
          :class="isShownFullscreen ? 'cursor-default' : 'cursor-pointer'"
        >
          <div
            class="absolute flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.5)] opacity-0 hover:opacity-100 transition-opacity text-white"
            v-if="!isShownFullscreen"
          >
            <p class="p-0 m-0">{{ document.source.label }}</p>
          </div>

          <div class="overflow-hidden">
            <img
              v-lazy="{
                src: getImageUrl(document.imageUrl),
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
          </div>
        </button>
      </div>
      <div
        class="text-center drop-shadow flex-[0_1_20px]"
        v-if="isShownFullscreen"
      >
        <p>
          <a :href="getDocumentUrl(document.id)" target="_blank">
            {{ document.label }}</a
          >
        </p>
        <p>Bron: {{ document.source.label }}</p>
        <button @click="onShareScanCommentsClicked">
          <em> Fout melden </em>
        </button>
      </div>
    </div>

    <div
      class="col-span-6 max-h-[90vh] overflow-y-auto flex-initial md:col-span-2"
      v-if="isShownFullscreen && documentRefersToPeople"
    >
      <div v-if="peopleMatchingSearch.length > 0" class="mb-4">
        <h2 class="text-2xl">Zoekresultaat</h2>
        <ul class="list-disc">
          <li v-for="person in peopleMatchingSearch">
            <button
              @click="onPersonClicked(person.label)"
              class="text-left italic"
            >
              {{ person.label }} ({{ person.addressLabel }})
            </button>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-2xl">Personen</h2>
        <ul class="list-disc">
          <li v-for="person in props.document.people">
            <button @click="onPersonClicked(person.label)" class="text-left">
              {{ person.label }} ({{ person.addressLabel }})
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, PropType, ref, Ref } from "vue";
import { useSwiper } from "swiper/vue";
import { DocumentModel } from "../models/document.model";
import { useStore } from "vuex";
import { PersonModel } from "../models/person.model";
import { UtilService } from "../services/util.service";
import Panzoom from "@panzoom/panzoom";

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
  documents: { type: Object as PropType<DocumentModel[]>, required: true },
  document: { type: Object as PropType<DocumentModel>, required: true },
  isShownFullscreen: { type: Boolean, required: false },
});

const openModal = () => {
  store.commit("previewModal/setShownDocuments", props.documents);
  store.commit("previewModal/setIsShown", true);
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
  props.document?.people && props.document.people.length > 0;

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
  store.commit("previewModal/setIsShown", false);
};

const onShareScanCommentsClicked = () => {
  alert("Fout melden");
};

const peopleMatchingSearch: ComputedRef<PersonModel[]> = computed(() => {
  if (props.document.people) {
    const search: string = store.getters["getSearchTerm"];
    const matchingPeople: PersonModel[] = props.document.people.filter(
      (person: PersonModel) =>
        UtilService.labelMatchesSearch(person.label, search) ||
        UtilService.labelMatchesSearch(person.addressLabel, search)
    );

    return matchingPeople;
  }
});
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
