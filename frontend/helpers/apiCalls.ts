async function getDoctors() {

  try {
    const query = "query GetDoctors{ doctors { id, name } }";
    const response = await fetch(`http://localhost:4000/api?query=${query}`, { headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    return [...resJson.data.doctors];

  } catch (error) {
    alert(error);
  }

}

async function getDoctorData(doctor_id: String) {
  try {
    const query = `query AppointmentsByDoctor($id: ID!, $desc: Boolean) {
      appointmentsByDoctor(id: $id) {
        id
        time
        patient {
          id
          name
        }
        comments(desc: $desc) {
          id
          time
          body
        }
      }
    }`;

    const variables = `{ "id": "${doctor_id}", "desc": false }`;
    const response = await fetch(`http://localhost:4000/api?query=${query}&variables=${variables}`, { headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    return [...resJson.data.appointmentsByDoctor];

  } catch (error) {
    alert(error);
    return null;
  }

}

async function getPatients() {
  const query = "query GetPatients{ patients { name, id } }";
  const response = await fetch(`http://localhost:4000/api?query=${query}`, { headers: { "apollo-require-preflight": "no" } });
  const resJson = await response.json();

  return [...resJson.data.patients];


}

async function getPatientData(patientName: String) {
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
  return { ...resJson.data.patientByName };


}

async function addComment(comment: { body: String, appointment_id: string; }) {
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
  return newComment;

}

async function updateComment(comment: { id: String, date: String, body: String; }) {
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

}

async function removeComment(comment: { id: String, date: String, body: String; }) {
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

}

async function getFiles(patientId: string) {
  const query = `query PatientFilesByPatient($id: ID!) {
      patientFilesByPatient(id: $id) {
        id
        filename
      }
    }`;

  const variables = `{ "id": "${patientId}" }`;
  const response = await fetch(`http://localhost:4000/api?query=${query}&variables=${variables}`, { headers: { "apollo-require-preflight": "no" } });
  const resJson = await response.json();

  return [...resJson.data.patientFilesByPatient];

}

async function getFile(file: { id: string, filename: string; }, callback: Function) {
  const response = await fetch(`http://localhost:4000/download/${file.id}`);
  const resJson = await response.json();

  callback(JSON.stringify(resJson), file.filename);

}

async function uploadFile(file: string | Blob, patientId: string) {
  const formData = new FormData();
  formData.append('patientId', patientId);
  formData.append('patientFile', file);

  const response = await fetch(`http://localhost:4000/upload`, {
    method: "POST",
    body: formData,
  });

  const resJson = await response.json();

  return resJson.patientFiles;

}



export { getDoctors, getDoctorData, getPatients, getPatientData, updateComment, addComment, removeComment, getFile, uploadFile, getFiles };