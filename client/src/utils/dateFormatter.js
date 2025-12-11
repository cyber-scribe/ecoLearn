export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const formatDateTime = (date) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const formatShortDate = (date) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    today.getDate() === compareDate.getDate() &&
    today.getMonth() === compareDate.getMonth() &&
    today.getFullYear() === compareDate.getFullYear()
  );
};