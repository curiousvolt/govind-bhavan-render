export const isStudentEmail = (email: string) => {
  return email.endsWith('.iitr.ac.in') && email !== 'govindbhavan@iitr.ac.in';
};

export const isAdminEmail = (email: string) => {
  return email === 'govindbhavan@iitr.ac.in';
};
