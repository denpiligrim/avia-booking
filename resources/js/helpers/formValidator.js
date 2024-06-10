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
        isValid = false;
        messages.push('Пункт отправления');
      }
    } else if (el.name === "departure") {
      if (el.value.length === 0) {
        isValid = false;
        messages.push('Пункт назначения');
      }
    } else if (el.name === "passengers") {
      const hasAdult = el.value.find(item => item.passengerCategory === 2);
      if (!hasAdult) {
        isValid = false;
        messages.push('Добавьте хотя бы 1 взрослого пассажира');
      }
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
    } else if (el.name === "guests" && el.name.length > 0) {
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
      }
    } else if (el.name === "cars" && el.name.length > 0) {
      for (let i = 0; i < el.value.length; i++) {
        const elem = el.value[i];
        if (!elem.later) {
          if (!elem.number) {
            isValid = false;
            messages.push('Номер автомобиля');
          }
          if (!elem.model) {
            isValid = false;
            messages.push('Марка автомобиля');
          }
        }
      }
    } else if (el.name === "name") {
      if (el.value.length === 0) {
        isValid = false;
        messages.push('Имя');
      }
    } else if (el.name === "phone") {
      if (!el.value || el.value.replace(/[^\d+]/g, "").length !== 12) {
        isValid = false;
        messages.push('Телефон');
      }
    } else if (el.name === "email") {
      if (!el.value || !el.value.includes('@') || !el.value.includes('.')) {
        isValid = false;
        messages.push('Email');
      }
    }
  });

  return {
    isValid: isValid,
    messages: messages.filter((item, index) => messages.indexOf(item) === index)
  }
}
export default formValidator;