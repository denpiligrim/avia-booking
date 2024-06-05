const formValidator = (form) => {
  let isValid = true;
  const messages = [];

  form.forEach(el => {
    if (el.name === "date") {
      if (!el.value) {
        isValid = false;
        messages.push('Дата рейса');
      }
    } else if (el.name === "time") {
      if (!el.value) {
        isValid = false;
        messages.push('Время рейса');
      }
    } else if (el.name === "flight") {
      if (!el.value) {
        isValid = false;
        messages.push('Номер рейса');
      }
    } else if (el.name === "arrival") {
      if (el.value.length === 0) {
        console.log(el.value);
        isValid = false;
        messages.push('Пункт отправления');
      }
    } else if (el.name === "departure") {
      if (el.value.length === 0) {
        console.log(el.value);
        isValid = false;
        messages.push('Пункт назначения');
      }
    } else if (el.name === "passengers") {
      for (let i = 0; i < el.value.length; i++) {
        const elem = el.value[i];
        if (!elem.firstName) {
          isValid = false;
          messages.push('Имя');
        }
        if (!elem.lastName) {
          isValid = false;
          messages.push('Фамилия');
        }
        if (elem.passengerCategory !== 2) {
          if (elem.birthDate === null) {
            isValid = false;
            messages.push('Дата рождения');
          }
        }
      }
    }
  });

  return {
    isValid: isValid,
    messages: messages.filter((item, index) => messages.indexOf(item) === index)
  }
}
export default formValidator;