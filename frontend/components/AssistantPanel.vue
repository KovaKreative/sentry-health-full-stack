<script setup>

import Appointments from './Appointments.vue';

import { getPatients, getPatientData, addComment, updateComment, removeComment } from '~/helpers/apiCalls';

let patient = ref({ id: "", name: "" });

const patients = ref([]);
let patientData = ref(null);

// let newCommentBody = ref(null);

// let buffer = "";
// let editing = ref(null);


// async function saveNewComment(appointmentId, body) {
//   const comment = { appointment_id: appointmentId, body };

//   newCommentBody.value = null;

//   const appointmentObject = patientData.value.appointments.find(appt => appt.id === appointmentId);

//   const newComment = {
//     id: null,
//     body,
//     time: Date.now()
//   };

//   const newCommentsLength = appointmentObject.comments.push(newComment);

//   console.log(appointmentObject.comments);

//   const returnedComment = await addComment(comment);


//   if (returnedComment === null) {
//     return appointmentObject.comments.pop();
//   }

//   appointmentObject.comments[newCommentsLength - 1].id = returnedComment.id;

// }

// async function saveComment(comment) {
//   editing.value = null;

//   const response = await updateComment(comment);

//   if (response === null) {
//     comment.body = buffer;
//     buffer = "";
//     return;
//   }

//   comment.time = response.time;

// }

// async function deleteComment(appointmentId, comment) {
//   const newCommentList = await removeComment(comment);
//   console.log(patientData.value);
//   const appointmentObject = patientData.value.appointments.find(appt => appt.id === appointmentId);
//   appointmentObject.comments = newCommentList;
// }

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
    <form v-if="patients.length > 0" class="patient-select">
      <label for="patient">Patient:</label>
      <select name="patient" v-model="patient">
        <option v-for="item in patients" :value="item">{{ item.name }}</option>
      </select>
    </form>
    <div v-if="patientData">
      <!-- File Upload -->
      <form>

      </form>
      <!-- Appointments -->
      <Appointments v-if="patientData" :appointments="patientData.appointments" />
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