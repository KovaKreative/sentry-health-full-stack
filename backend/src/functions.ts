const generateId = function() {
  return `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
};

const sortComments = function(comments: { id: string, appointment_id: string, time: string, body: string; }[], desc) {
  const sortedComments = comments.toSorted((a, b) => {
    if (!desc) {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    }
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
  return sortedComments;
};

export { generateId, sortComments };