<script setup>

const doctors = ref([]);
const patients = ref([]);
const appointments = ref([]);
const comments = ref([]);

async function getPatients(patientsArray) {

  try {
    const query = "query GetPatients{ patients { id, name } }";
    const response = await fetch(`http://localhost:4000/graphql?query=${query}`, { cors: "cors", headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    patientsArray.push(...resJson.data.patients);

  } catch (error) {
    alert(error);
  }

}

onMounted(() => {
  getPatients(patients.value);
});



// const doctorsData = [
//   {
//     id: '1',
//     name: 'Acula'
//   },
//   {
//     id: '2',
//     name: 'Dre'
//   }
// ];

// const patientsData = [
//   {
//     id: '1',
//     name: 'Aiman Payne',
//   },
//   {
//     id: '2',
//     name: 'Paul Monary',
//   },
//   {
//     id: '3',
//     name: 'Iris Coloboma',
//   }
// ];

// const appointmentsData = [
//   {
//     id: '1',
//     time: '2024-01-15T17:30:15+05:30',
//     doctor: doctorsData[1],
//     patient: patientsData[0]
//   },
//   {
//     id: '2',
//     time: '2024-01-16T17:30:15+05:30',
//     doctor: doctorsData[0],
//     patient: patientsData[1]
//   },
//   {
//     id: '3',
//     time: '2024-01-17T17:30:15+05:30',
//     doctor: doctorsData[0],
//     patient: patientsData[0]
//   },
// ];

// const commentsData = [
//   {
//     id: '1',
//     appointment: appointmentsData[0],
//     time: '2024-01-18T17:30:15+05:30',
//     body: 'The doctor was very nice. I\'m still in pain though.'
//   },
//   {
//     id: '2',
//     appointment: appointmentsData[1],
//     time: '2024-01-19T17:30:15+05:30',
//     body: 'The doctor was helpful, but drew too much blood.'
//   },
//   {
//     id: '3',
//     appointment: appointmentsData[2],
//     time: '2024-01-20T17:30:15+05:30',
//     body: 'The doctor and I didn\'t see eye to eye.'
//   },
// ];

// const doctors = ref(doctorsData);
// const patients = ref(patientsData);
// const appointments = ref(appointmentsData);
// const comments = ref(commentsData);

let patient = ref({ id: "", name: "" });

</script>

<template>
  <div>
    <h1>Assistant Panel</h1>
    <form v-if="patients.length > 0" class="patient-select">
      <select name="patient" v-model="patient">
        <option v-for="item in patients" :value="item">{{ item.name }}</option>
      </select>
      <div for="patient">Patient: {{ patient.name }}</div>
    </form>
    <div v-if="patient.id">
      <!-- File Upload -->
      <form>

      </form>
      <!-- Appointments -->
      <section>
        <h2>Appointments</h2>
        <div v-for="appointment in appointments.filter(apt => apt.patient.id === patient.id)">
          <div><b>Appointment Date:</b> {{ new Date(appointment.time).toString() }}</div>
          <div><b>Doctor:</b> Dr. {{ appointment.doctor.name }}</div>
          <h3>Comments:</h3>
          <div v-for="comment in comments.filter(com => com.appointment.id === appointment.id)">
            <div><b>{{ new Date(comment.time).toString() }}</b></div>
            <div>{{ comment.body }}</div>
          </div>
          <hr>
        </div>
      </section>
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