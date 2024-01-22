<script setup>

import Appointments from './Appointments.vue';
import FileManager from './FileManager.vue';

import { getPatients, getPatientData, uploadFile } from '~/helpers/apiCalls';
import { downloadFileData } from '~/helpers/functions';

import { toast } from 'vue3-toastify';

let patient = ref({ id: "", name: "" });

const patients = ref([]);
let patientData = ref(null);

const upload = ref(null);
let patientFile = ref(null);

let filesComponentKey = ref(0);

function uploadPatientFile(file) {
  toast("Uploading file...", {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 1000
  });
  uploadFile(file, patientData.value.id)
    .then(data => {
      upload.value.value = "";
      patientFile.value = null;

      filesComponentKey.value++;

      if (!data) {
        toast("Something went wrong. The file may have still been uploaded.", {
          "theme": "auto",
          "type": "warning",
          "position": "top-center",
          "autoClose": 4000
        });
      }

      toast("File uploaded successfully!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1000
      });
    });
}

onMounted(() => {
  toast("Getting patients...", {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 1000
  });
  getPatients(patients.value)
    .then(data => {
      patients.value.push(...data);
      if (!patients.value.length) {
        return toast("No patients found in the database...", {
          "theme": "auto",
          "type": "warning",
          "position": "top-center",
          "autoClose": 3000
        });
      }
      toast("Patients retrieved successfully!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1000
      });
    })
    .catch(() => {
      toast("Unable to retrieve patients from the database...", {
        "theme": "auto",
        "type": "error",
        "position": "top-center",
        "autoClose": 3000
      });
    });
});

watch(patient, () => {
  toast("Getting patient data...", {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 1000
  });
  patientData.value = null;
  getPatientData(patient.value.name, patientData)
    .then(data => {
      patientData.value = data;
      if (!patientData.value) {
        return toast("No patient data found.", {
          "theme": "auto",
          "type": "warning",
          "position": "top-center",
          "autoClose": 3000
        });
      }
      toast("Patient data retrieved successfully!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1000
      });
    })
    .catch(() => {
      toast("Unable to retrieve patient data.", {
        "theme": "auto",
        "type": "error",
        "position": "top-center",
        "autoClose": 2000
      });
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
    </div>
    <hr>
    <!-- File Upload -->
    <FileManager :key="filesComponentKey" v-if="patientData" :patient="{ name: patientData.name, id: patientData.id }" />
    <!-- Appointments -->
    <div v-if="patientData">
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