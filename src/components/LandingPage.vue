<script setup lang="ts">
// import { useLoadingBar } from "naive-ui";
// import { DataService } from "../services/data.service";
import { Ref, ref } from "vue";

// const loadingBar = useLoadingBar();

const isLoading: Ref<boolean> = ref(false);

// loadingBar.start();

// async function loadData() {
//   isLoading.value = true;
//   const dataService: DataService = new DataService();
//   await dataService
//     .updateFromServer()
//     .then(() => {
//       isLoading.value = false;
//       console.log("done loading");
//       console.log(dataService);
//       loadingBar.finish();
//     })
//     .catch(() => {
//       loadingBar.error();
//     });
// }

// loadData();
</script>

<template>
  <!-- h-screen w-screen -->
  <div class="p-4">
    <h1 class="text-2xl mb-2">WO2 op de kaart</h1>
    <p class="pb-4">
      Het Utrechts Archief heeft zo’n 3300 archiefbronnen (met daarin vaak
      honderden of duizenden documenten en afbeeldingen) over gebeurtenissen in
      de Tweede Wereldoorlog. Een groot deel van deze bronnen is digitaal
      toegankelijk en online doorzoekbaar op naam en adres.
    </p>
    <p>
      Zoekt u naar een persoon die in Utrecht leefde tijdens de oorlogsjaren?
      Bent u benieuwd wat tijdens de Tweede Wereldoorlog is gebeurd op uw adres,
      in uw buurt of in uw omgeving? Via deze WO2 kaart kunt u zoeken op zo'n
      20.000 Utrechtse adressen en personen.
    </p>

    <img
      v-if="isLoading"
      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
      width="200"
    />
    <p v-if="isLoading">De gegevens worden geladen. Even geduld a.u.b.</p>
    <button
      v-if="!isLoading"
      class="mt-4 bg-primary px-4 py-2 rounded-full text-white hover:bg-red-800 transition-colors"
      @click="$router.push('map')"
    >
      Naar de kaart!
    </button>
  </div>
</template>

<style scoped>
div {
  max-width: 800px;
}
</style>
