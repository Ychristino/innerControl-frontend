const monetaryFormat = (value) => {
    const numeric = parseFloat(value);
    if (isNaN(numeric)) return "R$ 0,00";
    return numeric.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // pega apenas YYYY-MM-DD
};

export { monetaryFormat, formatDate };