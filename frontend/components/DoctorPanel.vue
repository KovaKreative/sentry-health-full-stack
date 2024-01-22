<script setup>

import Appointments from './Appointments.vue';
import FileManager from './FileManager.vue';

import { getDoctors, getDoctorData } from '~/helpers/apiCalls';
import { toast } from 'vue3-toastify';

const doctors = ref([]);
const doctor = ref(null);
const appointments = ref([]);


onMounted(() => {
  toast("Getting list of doctors from database...", {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 1500
  });
  getDoctors(doctors.value)
    .then(data => {
      doctors.value.push(...data);
      if (!doctors.value.length) {
        toast("No doctors found in database.", {
          "theme": "auto",
          "type": "warning",
          "position": "top-center",
          "autoClose": 4000
        });
      }
      toast("Doctors retrieved!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1500
      });
    })
    .catch(() => {
      toast("Unable to retrieve list of doctors from database.", {
        "theme": "auto",
        "type": "error",
        "position": "top-center",
        "autoClose": 4000
      });
    });
});

watch(doctor, () => {
  appointments.value = [];
  toast("Getting doctor appointments...", {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 1500
  });
  getDoctorData(doctor.value.id)
    .then(data => {
      appointments.value.push(...data);
      if (!appointments.value.length) {
        return toast("No appointments found.", {
          "theme": "auto",
          "type": "warning",
          "position": "top-center",
          "autoClose": 4000
        });
      }
      toast("Appointments retrieved!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1500
      });
    })
    .catch(() => {
      toast("Unable to retrieve appointments from database.", {
        "theme": "auto",
        "type": "error",
        "position": "top-center",
        "autoClose": 4000
      });
    });
});

</script>

<template>
  <div>
    <h1>Doctor Panel</h1>
    <form v-if="doctors.length > 0" class="doctor-select">
      <label for="doctor">Doctor:</label>
      <select name="doctor" v-model="doctor">
        <option v-for="item in doctors" :value="item">Dr. {{ item.name }}</option>
      </select>
    </form>
    <hr>
    <div class="flex flex-wrap">
      <FileManager v-for="appointment of appointments"
        :patient="{ id: appointment.patient.id, name: appointment.patient.name }" />
    </div>
    <Appointments v-if="appointments.length > 0" :appointments="appointments" />
  </div>
</template>

<style lang="css">
.doctor-select {
  display: flex;
  gap: 2em;
  width: 50%;
}
</style>