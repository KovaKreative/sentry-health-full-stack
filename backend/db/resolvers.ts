import { sortComments, generateId } from '../src/functions.js';

const createResolvers = function(doctors, patients, appointments, comments, patientFiles) {
  return {
    Query: {
      doctors: () => doctors,
      patients: () => patients,
      patientByName: (_, args: { name: string; }) => patients.find(p => p.name === args.name),
      appointments: () => appointments,
      comments: (_, args) => sortComments(comments, args.desc),
      appointmentsByPatient: (_, args: { id: string; }) => appointments.filter(a => a.patient_id === args.id),
      appointmentsByDoctor: (_, args: { id: string; }) => appointments.filter(a => a.doctor_id === args.id),
      patientFiles: () => patientFiles,
      patientFilesByPatient: (_, args: { id: string; }) => patientFiles.filter(f => f.patient_id === args.id),
      patientFileById: (_, args: { id: string; }) => patientFiles.find(f => f.id === args.id)
    },

    Doctor: {
      appointments(parent) {
        return appointments.filter(a => a.doctor_id === parent.id);
      }
    },

    Patient: {
      appointments(parent) {
        return appointments.filter(a => a.patient_id === parent.id);
      },
      files(parent) {
        return patientFiles.filter(f => f.patient_id === parent.id);
      }
    },

    Appointment: {
      patient(parent) {
        return patients.find(p => p.id === parent.patient_id);
      },
      doctor(parent) {
        return doctors.find(d => d.id === parent.doctor_id);
      },
      comments(parent, args) {
        const filteredComments = comments.filter(c => c.appointment_id === parent.id);
        return sortComments(filteredComments, args.desc);
      }
    },

    Comment: {
      appointment(parent) {
        return appointments.find(a => parent.appointment_id === a.id);
      }
    },

    PatientFile: {
      patient(parent) {
        return patients.find(p => parent.patient_id === p.id);
      }
    },

    Mutation: {
      deleteComment(_, args) {
        const index = comments.findIndex(c => c.id === args.id);
        let deletedComment = null;

        if (index >= 0) {
          deletedComment = comments.splice(index, 1)[0];
        }

        const filteredComments = comments.filter(c => c.appointment_id === deletedComment.appointment_id);
        return sortComments(filteredComments, args.desc);
      },
      updateComment(_, args) {
        const index = comments.findIndex(c => c.id === args.id);

        if (index >= 0) {
          const comment = comments[index];
          comment.body = args.body;
          comment.time = new Date(Date.now()).toString();
        }

        return comments[index];
      },
      addComment(_, args) {

        const newId = generateId();

        const newComment = {
          id: newId,
          time: new Date(Date.now()).toString(),
          ...args.comment
        };

        comments.push(newComment);

        return newComment;
      },
      addPatientFile(_, args) {
        const newId = generateId();
        patientFiles.push({ id: newId, filename: args.filename, patient_id: args.patient_id });
      }
    }
  };
};

export default createResolvers;