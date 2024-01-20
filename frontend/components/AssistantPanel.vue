<script setup>

import Appointments from './Appointments.vue';

import { getPatients, getPatientData } from '~/helpers/apiCalls';

let patient = ref({ id: "", name: "" });

const patients = ref([]);
let patientData = ref(null);

const upload = ref(null);
let patientFile = ref(null);

async function uploadFile(event) {

  const formData = new FormData();
  formData.append('patientFile', event);

  try {
    const response = await fetch(`http://localhost:4000/upload`, {
      method: "POST",
      body: formData,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // }
    });

    const resJson = await response.json();
    console.log("Successfully uploaded file:", resJson);

    if (resJson.success) {
      upload.value.value = "";
      patientFile = null;
    }

    return resJson.success;

  } catch (error) {
    alert(error);
    return null;
  }

}

function downloadPatientData(patientData) {
  const file = new Blob([JSON.stringify(patientData)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const suffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${patientData.name.replaceAll(' ', '_')}-${suffix}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(patientData);
}

onMounted(() => {
  getPatients(patients.value);
});

watch(patient, () => {
  patientData.value = null;
  getPatientData(patient.value.name, patientData);
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
        <button v-if="patientData" @click="downloadPatientData(patientData)">Download Patient Data</button>
      </div>
      <!-- File Upload -->
      <div>
        <label for="patientFile">Upload:</label>
        <input name="patientFile" type="file" ref="upload" accept=".json" @change="e => patientFile = e.target.files[0]" />
        <button @click="uploadFile(patientFile)" :disabled="!patientFile">Upload</button>
      </div>
    </div>
    <hr>
    <!-- Appointments -->
    <Appointments v-if="patientData" :appointments="patientData.appointments" />


  </div>
</template>

<style lang="css" scoped>
.patient-select {
  display: flex;
  gap: 2em;
  width: 50%;
}
</style>