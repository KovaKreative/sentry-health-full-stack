<script setup>

import { getFile, getFiles } from '~/helpers/apiCalls';

import { downloadFileData } from '~/helpers/functions';

const props = defineProps(['patient', 'files']);

let files = ref([]);

onMounted(() => {
  getFiles(props.patient.id).then(data => {
    files.value = data;
  });
});

</script>
<template>
  <section>
    <h3>Files for {{ props.patient.name }}</h3>
    <ul v-if="files.length">
      <li v-for="file in files">
        <NuxtLink to="/" @click.prevent="getFile(file, downloadFileData)">{{ file.filename }}</NuxtLink>
      </li>
    </ul>
    <div v-else>{{ props.patient.name }} has no uploaded files.</div>
  </section>
</template>
<style lang="css"></style>