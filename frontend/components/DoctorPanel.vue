<script setup>

import Appointments from './Appointments.vue';


import { getDoctors, getDoctorData } from '~/helpers/apiCalls';

const doctors = ref([]);
const doctor = ref(null);
const appointments = ref([]);

onMounted(() => {
  getDoctors(doctors.value);
});

watch(doctor, () => {
  getDoctorData(doctor.value.id, appointments);
  console.log(appointments);
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
    <Appointments v-if="appointments.length > 0" :appointments="appointments" />
  </div>
</template>

<style lang="css">
.doctor-select {
  display: flex;
  gap: 2em;
  width: 50%;
}</style>