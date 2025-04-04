// const statusMap = {
//   0: "Plačano",
//   1: "Neplačano",
//   2: "Rok potekel",
// };

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
  return today.toISOString().split("T")[0];
}

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
