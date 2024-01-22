<script setup>

import { getFile, getFiles } from '~/helpers/apiCalls';
import { downloadFileData } from '~/helpers/functions';
import { toast } from 'vue3-toastify';

const props = defineProps(['patient', 'files']);

let files = ref([]);

onMounted(() => {
  toast(`Getting list of files for ${props.patient.name}...`, {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 1500
  });
  getFiles(props.patient.id)
    .then(data => {
      files.value.push(...data);
      if (!files.value.length) {
        return toast("No files found in database.", {
          "theme": "auto",
          "type": "warning",
          "position": "top-center",
          "autoClose": 2000
        });
      }

      toast("Patient files retrieved!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1500
      });
    })
    .catch(() => {
      toast("Unable to retrieve files from database.", {
        "theme": "auto",
        "type": "error",
        "position": "top-center",
        "autoClose": 4000
      });
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