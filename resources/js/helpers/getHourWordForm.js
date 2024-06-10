const getHourWordForm = (hours) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return hours + " " + ["час", "часа", "часов"][
    (hours % 100 > 4 && hours % 100 < 20) ? 2 : cases[(hours % 10 < 5) ? hours % 10 : 5]
  ];
}
export default getHourWordForm;