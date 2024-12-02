const statusMap = {
  0: "Plačano",
  1: "Neplačano",
  2: "Rok potekel",
};

export const statuses = [
  {
    id: 0,
    name: "Plačano",
  },
  {
    id: 1,
    name: "Neplačano",
  },
  {
    id: 2,
    name: "Rok potekel",
  },
];

export function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${
    date < 10 ? `0${date}` : date
  }`;
}
