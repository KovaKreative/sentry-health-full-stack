<script setup>
const props = defineProps(['appointments']);

import { addComment, updateComment, removeComment } from '~/helpers/apiCalls';
import { toast } from 'vue3-toastify';


const commentTemplate = { appointmentId: null, body: "" };

let newComment = ref({ ...commentTemplate });

let buffer = "";
let editing = ref(null);

function saveNewComment(newCommentObject) {
  toast("Saving comment...", {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 2000
  });
  const comment = { appointment_id: newCommentObject.appointmentId, body: newCommentObject.body };

  const appointmentObject = props.appointments.find(appt => appt.id === newCommentObject.appointmentId);

  const newComment = {
    id: null,
    body: newCommentObject.body,
    time: Date().toString()
  };

  newCommentObject = { ...commentTemplate };

  const newCommentsLength = appointmentObject.comments.push(newComment);

  addComment(comment)
    .then(data => {
      const returnedComment = data;
      if (!data) {
        toast("Something went wrong.", {
          "theme": "auto",
          "type": "error",
          "position": "top-center",
          "autoClose": 4000
        });
        return appointmentObject.comments.pop();
      }
      toast("New comment saved successfully!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1000
      });
      appointmentObject.comments[newCommentsLength - 1].id = returnedComment.id;

    })
    .catch(() => {
      toast("Unable to save comment.", {
        "theme": "auto",
        "type": "error",
        "position": "top-center",
        "autoClose": 4000
      });
      return appointmentObject.comments.pop();
    });

}

async function saveComment(comment) {
  toast("Saving comment...", {
    "theme": "auto",
    "type": "info",
    "position": "top-center",
    "autoClose": 2000
  });
  editing.value = null;

  updateComment(comment)
    .then(data => {
      console.log(data);
      if (!data) {
        comment.body = buffer;
        buffer = "";
        return toast("Unable to save comment.", {
          "theme": "auto",
          "type": "error",
          "position": "top-center",
          "autoClose": 4000
        });;
      }
      toast("Comment updated successfully!", {
        "theme": "auto",
        "type": "success",
        "position": "top-center",
        "autoClose": 1000
      });
      comment.time = data.time;
    })
    .catch((err) => {
      console.log(err);
      toast("Unable to save comment.", {
        "theme": "auto",
        "type": "error",
        "position": "top-center",
        "autoClose": 4000
      });
    });

}

async function deleteComment(appointmentId, comment) {
  const appointmentObject = props.appointments.find(appt => appt.id === appointmentId);

  const commentsBuffer = [...appointmentObject.comments];

  const commentIndex = appointmentObject.comments.findIndex(c => c.id === comment.id);

  appointmentObject.comments.splice(commentIndex, 1);

  const newCommentList = await removeComment(comment);

  if (newCommentList === null) {
    toast("Unable to delete comment.", {
      "theme": "auto",
      "type": "error",
      "position": "top-center",
      "autoClose": 4000
    });
    return appointmentObject.comments = [...commentsBuffer];
  }
  toast("Comment deleted!", {
    "theme": "auto",
    "type": "success",
    "position": "top-center",
    "autoClose": 1000
  });
  appointmentObject.comments = newCommentList;
}

</script>
<template>
  <section>
    <h2>Appointments</h2>
    <div v-for="appointment in props.appointments">
      <div><b>Appointment ID:</b> {{ appointment.id }}</div>
      <div>
        <b>Appointment Date:</b> {{ new Date(appointment.time).toLocaleString('en-CA'), { timeZone: 'EST' } }}
      </div>
      <div class="flex">
        <div v-if="appointment.doctor"><b>Doctor:</b> Dr. {{ appointment.doctor.name }}</div>
        <div v-if="appointment.patient"><b>Patient:</b> {{ appointment.patient.name }}</div>
      </div>
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

      <button v-if="newComment.appointmentId !== appointment.id"
        @click="() => newComment.appointmentId = appointment.id">New Comment</button>
      <div v-else class="editing inline-form">
        <label for="new-comment">New Comment:</label>
        <input name="new-comment" class="inline-input" v-model="newComment.body" />
        <button @click="() => {
          saveNewComment(newComment);
          newComment = { ...commentTemplate };
        }" :disabled="!newComment.body.length">Save</button>
        <button @click="() => newComment = { ...commentTemplate }">Discard</button>
      </div>
      <hr>
    </div>
  </section>
</template>
<style lang="css" scoped>
.comment {
  margin-bottom: 1em;
}

.comment-body {
  border-left: #135 3px solid;
  padding-left: 1em;
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