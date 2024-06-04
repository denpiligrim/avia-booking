const formValidator = (form) => {
  let isValid = true;
  const messages = [];

  form.forEach(el => {
    console.log(el.name);
    switch(el.name) {
      case "date":
        if (el.value === null) {
          console.log(el.value.$d);
          isValid = false;
          messages.push('Дата рейса');
        }
      case "time":
        if (el.value === null) {
          isValid = false;
          messages.push('Время рейса');
        }
      case "flight":
        if (!el.value) {
          isValid = false;
          messages.push('Номер рейса');
        }
      case "arrival":
        if (el.value.length === 0) {
          console.log(el.value);
          isValid = false;
          messages.push('Пункт отправления');
        }
      case "departure":
        if (el.value.length === 0) {
          console.log(el.value);
          isValid = false;
          messages.push('Пункт назначения');
        }
      case "passengers":
        el.value.forEach(el => {
          if (!el.firstName) {
            isValid = false;
            messages.push('Имя');
          }
          if (!el.lastName) {
            isValid = false;
            messages.push('Фамилия');
          }
          if (el.passengerCategory !== 2) {
            if (el.birthDate === null) {
              isValid = false;
              messages.push('Дата рождения');
            }
          }
        });
      default:
        break;
    }
  });

  return {
    isValid: isValid,
    messages: messages.filter((item, index) => messages.indexOf(item) === index)
  }
}
export default formValidator;