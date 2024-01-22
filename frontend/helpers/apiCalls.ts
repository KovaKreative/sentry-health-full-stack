async function getDoctors(doctorsArray: { id: String, name: String; }[]) {

  try {
    const query = "query GetDoctors{ doctors { id, name } }";
    const response = await fetch(`http://localhost:4000/api?query=${query}`, { headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    doctorsArray.push(...resJson.data.doctors);

  } catch (error) {
    alert(error);
  }

}

async function getDoctorData(doctor_id: String, appointments: { value: unknown[]; }) {
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

    appointments.value = [...resJson.data.appointmentsByDoctor];

  } catch (error) {
    alert(error);
    return null;
  }

}

async function getPatients(patientsArray: { id: String, name: String; }[]) {
  try {
    const query = "query GetPatients{ patients { name, id } }";
    const response = await fetch(`http://localhost:4000/api?query=${query}`, { headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    patientsArray.push(...resJson.data.patients);

  } catch (error) {
    alert(error);
  }

}

async function getPatientData(patientName: String, patientData: { value: unknown; }) {
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

async function addComment(comment: { body: String, appointment_id: string; }) {
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

async function updateComment(comment: { id: String, date: String, body: String; }) {
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

async function removeComment(comment: { id: String, date: String, body: String; }) {
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

async function getFiles(patientId: string) {
  try {
    const query = `query PatientFilesByPatient($id: ID!) {
      patientFilesByPatient(id: $id) {
        id
        filename
      }
    }`;

    const variables = `{ "id": "${patientId}" }`;
    const response = await fetch(`http://localhost:4000/api?query=${query}&variables=${variables}`, { headers: { "apollo-require-preflight": "no" } });
    const resJson = await response.json();

    console.log(resJson);

    return [...resJson.data.patientFilesByPatient];

  } catch (error) {
    alert(error);
    return null;
  }
}

async function getFile(file: { id: string, filename: string; }, callback: Function) {
  try {
    const response = await fetch(`http://localhost:4000/download/${file.id}`);
    const resJson = await response.json();

    callback(JSON.stringify(resJson), file.filename);

  } catch (error) {
    alert(error);
    return null;
  }
}

async function uploadFile(file: string | Blob, patientId: string) {

  const formData = new FormData();
  formData.append('patientId', patientId);
  formData.append('patientFile', file);

  try {
    const response = await fetch(`http://localhost:4000/upload`, {
      method: "POST",
      body: formData,
    });

    const resJson = await response.json();

    return resJson.patientFiles;

  } catch (error) {
    alert(error);
    return null;
  }

}



export { getDoctors, getDoctorData, getPatients, getPatientData, updateComment, addComment, removeComment, getFile, uploadFile, getFiles };