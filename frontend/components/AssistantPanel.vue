<script setup>

import Appointments from './Appointments.vue';
import FileManager from './FileManager.vue';

import { getPatients, getPatientData, uploadFile } from '~/helpers/apiCalls';
import { downloadFileData } from '~/helpers/functions';

let message = ref({
  patients: "Fetching patients...",
  data: "Fetching patient data...",
});

let patient = ref({ id: "", name: "" });

const patients = ref([]);
let patientData = ref(null);

const upload = ref(null);
let patientFile = ref(null);

function uploadPatientFile(file) {
  uploadFile(file, props.patient.id).then(data => {
    upload.value.value = "";
    patientFile.value = null;

    if (data !== null) {
      files.value = [...data];
    }
  });
}

onMounted(() => {
  
  getPatients(patients.value).finally(() => {
    if (!patients.length) {
      message.value.patients = "No patients found in Database.";
    }
  });
});

watch(patient, () => {
  message.value.data = "Fetching patient data...";
  patientData.value = null;
  getPatientData(patient.value.name, patientData).finally(() => {
    console.log(patientData.value);
    if (!patientData.value) {
      return message.value.data = "No patient data found.";
    }
  });
});

</script>

<template>
  <div>
    <h1>Assistant Panel</h1>
    <div class="flex flex-between">
      <div v-if="patients.length > 0" class="patient-select">
        <label for="patient">Patient:</label>
        <select name="patient" v-model="patient">
          <option v-for="item in patients" :value="item">{{ item.name }}</option>
        </select>
      </div>
      <div v-else>{{ message.patients }}</div>
    </div>
    <hr>
    <!-- File Upload -->
    <FileManager v-if="patientData" :patient="{ name: patientData.name, id: patientData.id }" />
    <!-- Appointments -->
    <div v-if="patientData">
      <div v-if="patient.id && !patientData">{{ message.data }}</div>
      <label for="patientFile">Upload:</label>
      <input name="patientFile" type="file" ref="upload" accept=".json" @change="e => patientFile = e.target.files[0]" />
      <button @click="uploadPatientFile(patientFile)" :disabled="!patientFile">Upload</button>
      <hr>
      <Appointments v-if="patientData" :appointments="patientData.appointments" />
      <button @click="downloadFileData(JSON.stringify(patientData))">Download Patient Data</button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.patient-select {
  display: flex;
  gap: 2em;
  width: 50%;
}
</style>