<script setup>

const doctors = ref([]);

let patient = ref({ id: "", name: "" });

const patients = ref([]);
let patientData = ref(null);

let newCommentBody = ref(null);

let buffer = "";
let editing = ref(null);

async function getDoctors(doctorsArray) {

  try {
    const query = "query GetPatients{ patients { id, name } }";
    const response = await fetch(`http://localhost:4000/graphql?query=${query}`, { cors: "cors", headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    doctorsArray.push(...resJson.data.patients);

  } catch (error) {
    alert(error);
  }

}

async function getPatients(patientsArray) {
  console.log("Getting all patients");
  try {
    const query = "query GetPatients{ patients { name } }";
    const response = await fetch(`http://localhost:4000/api?query=${query}`, { cors: "cors", headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    patientsArray.push(...resJson.data.patients);

  } catch (error) {
    alert(error);
  }

}

async function getPatientData(patientName) {
  try {
    const query = `query PatientByName($name: String!, $desc: Boolean) {
      patientByName(name: $name) {
        id
        name
        appointments {
          id
          time
          doctor {
            name
          }
          comments(desc: $desc) {
            id
            time
            body
          }
        }
      }
    }`;

    const variables = `{ "name": "${patientName}", "desc": false }`;
    const response = await fetch(`http://localhost:4000/api?query=${query}&variables=${variables}`, { headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    patientData.value = { ...resJson.data.patientByName };

  } catch (error) {
    alert(error);
    return null;
  }

}

async function updateComment(comment) {
  try {
    const query = `mutation Mutation($id: ID!, $body: String!) {
      updateComment(id: $id, body: $body) {
        id
        time
        body
      }
    }`;
    const variables = { "id": comment.id, "body": comment.body };

    const response = await fetch(`http://localhost:4000/api`, {
      method: "POST",
      body: JSON.stringify({
        "query": query,
        "variables": variables
      }),
      headers: {
        "Content-Type": "application/json",
        "apollo-require-preflight": "no"
      }
    });
    const resJson = await response.json();
    return resJson.data.updateComment;

  } catch (error) {
    alert(error);
    return null;
  }

}

async function addComment(comment) {
  try {
    const query = `mutation AddComment($comment: AddCommentInput!) {
      addComment(comment: $comment) {
        id
        time
        body
      }
    }`;
    const variables = { "comment": { "appointment_id": comment.appointment_id, "body": comment.body } };

    const response = await fetch(`http://localhost:4000/api`, {
      method: "POST",
      body: JSON.stringify({
        "query": query,
        "variables": variables
      }),
      headers: {
        "Content-Type": "application/json",
        "apollo-require-preflight": "no"
      }
    });

    const resJson = await response.json();
    const newComment = resJson.data.addComment;
    console.log("Comment saved successfully to database:", newComment);
    return newComment;

  } catch (error) {
    alert(error);
    return null;
  }

}

async function removeComment(comment) {
  try {
    const query = `mutation DeleteComment($id: ID!, $desc: Boolean) {
      deleteComment(id: $id, desc: $desc) {
        id
        time
        body
      }
    }`;
    const variables = { "id": comment.id, desc: false };

    const response = await fetch(`http://localhost:4000/api`, {
      method: "POST",
      body: JSON.stringify({
        "query": query,
        "variables": variables
      }),
      headers: {
        "Content-Type": "application/json",
        "apollo-require-preflight": "no"
      }
    });

    const resJson = await response.json();
    const commentsList = resJson.data.deleteComment;
    return commentsList;

  } catch (error) {
    alert(error);
    return null;
  }

}

async function saveNewComment(appointmentId, body) {
  const comment = { appointment_id: appointmentId, body };

  newCommentBody.value = null;

  const appointmentObject = patientData.value.appointments.find(appt => appt.id === appointmentId);

  const newComment = {
    id: null,
    body,
    time: Date.now()
  }

  const newCommentsLength = appointmentObject.comments.push(newComment);

  console.log(appointmentObject.comments);
  
  const returnedComment = await addComment(comment);

  
  if (returnedComment === null) {
    return appointmentObject.comments.pop();
  }

  appointmentObject.comments[newCommentsLength - 1].id = returnedComment.id;

}

async function saveComment(comment) {
  editing.value = null;

  const response = await updateComment(comment);

  console.log("Buffer", buffer.value);
  
  if (response === null) {
    comment.body = buffer;
    buffer = "";
    return;
  }

  comment.time = response.time;

}

async function deleteComment(appointmentId, comment) {
  const newCommentList = await removeComment(comment);
  console.log(patientData.value);
  const appointmentObject = patientData.value.appointments.find(appt => appt.id === appointmentId);
  appointmentObject.comments = newCommentList;
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
      <section>
        <h2>Appointments</h2>
        <div v-for="appointment in patientData.appointments">
          <div><b>Appointment ID:</b> {{ appointment.id }}</div>
          <div><b>Appointment Date:</b> {{ new Date(appointment.time).toLocaleString('en-CA'), { timeZone: 'EST' } }}
          </div>
          <div><b>Doctor:</b> Dr. {{ appointment.doctor.name }}</div>
          <h3>Comments:</h3>
          <div class="comment" v-for="comment in appointment.comments">
            <div v-if="comment.id" class="flex flex-between">
              <div><i>{{ new Date(comment.time).toLocaleString('en-CA', { timeZone: 'EST' }) }}</i></div>
              <div>
                <button class="link-style" @click="() => {
                  buffer = comment.body;
                  editing = comment;
                }">Edit</button>
                <button class="link-style" @click="deleteComment(appointment.id, comment)">Delete</button>
              </div>
            </div>

            <div v-if="editing === comment" class="editing inline-form">
              <input class="inline-input" v-model="comment.body" />
              <button @click="saveComment(comment)">Save</button>
              <button @click="() => {
                comment.body = buffer;
                editing = null;
              }">Discard</button>
            </div>
            <div v-else class="comment-body">{{ comment.body }}</div>
          </div>

          <button v-if="newCommentBody === null" @click="() => newCommentBody = ''">New Comment</button>
          <div v-else class="editing inline-form">
            <label for="new-comment">New Comment:</label>
            <input name="new-comment" class="inline-input" v-model="newCommentBody" />
            <button @click="saveNewComment(appointment.id, newCommentBody)"
              :disabled="!newCommentBody.length">Save</button>
            <button @click="() => newCommentBody = null">Discard</button>
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

.comment {
  margin-bottom: 1em;
}

.comment-body {
  border-left: #135 3px solid;
  padding-left: 1em;
}

.flex {
  display: flex;
}

.flex-between {
  justify-content: space-between;
}

.link-style {
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  color: #135;
}

.link-style:hover {
  color: rgb(21, 78, 135);
}

.inline-form {
  display: flex;
  justify-content: space-between;
  gap: 0.5em;
}

.inline-input {
  flex: 2;
}
</style>