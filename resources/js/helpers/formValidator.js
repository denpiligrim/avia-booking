const formValidator = (form) => {
    let isValid = true;
    const messages = [];

    form.forEach(el => {
        switch (el.name) {
            case "firstName":
                if (el.value.length === 0) {

                    break;
                }
            default:
                break;
        }
    });

    return {
        isValid: isValid,
        messages: messages
    }
}