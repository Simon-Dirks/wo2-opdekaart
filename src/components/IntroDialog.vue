<template>
  <teleport to="body">
  <div @click="$emit('close')"></div>
  <dialog open>
    <header>
      <slot name="header">
        <h2>Utrechtse WO2 Kaart</h2>
      </slot>
    </header>
    <section>
      <p>
        Zoekt u naar een persoon die in Utrecht leefde tijdens de oorlogsjaren?
        Bent u benieuwd wat tijdens de Tweede Wereldoorlog is gebeurd op uw
        adres, in uw buurt of in uw omgeving? Via deze WO2 kaart kunt u zoeken
        in zo'n 20.000 Utrechtse adressen en personen.
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
        @click="$emit('close')"
      >
        Naar de kaart!
      </button>
    </section>
    <!-- <menu>
        <slot name="actions">
          <base-button @click="$emit('close')">close</base-button>
        </slot>
      </menu> -->
  </dialog>
  </teleport>
</template>

<script>
export default {
  emits: ["close"],
  props: ["is-loading"],
};
</script>

<style scoped>
div {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  border:1px solid red;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 1000;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
}

header {
  background-color: silver;
  color: white;
  width: 100%;
  padding: 1rem;
}

header h2 {
  margin: 0;
}

section {
  padding: 1rem;
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>
