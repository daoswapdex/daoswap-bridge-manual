<template>
  <v-card class="d-flex justify-center align-center" flat height="100%" tile>
    <v-card class="pa-20 ma-20">
      <v-card-title class="text-h1">
        404
      </v-card-title>
      <v-card-subtitle>
        {{ address }}
      </v-card-subtitle>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "NoFound",
  data: () => ({
    //
  }),
  computed: {
    address() {
      return this.$store.state.web3.address;
    }
  }
};
</script>
