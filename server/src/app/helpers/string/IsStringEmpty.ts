const IsStringEmpty = (string: string) => {
  let isStringEmpty = false;

  if (string.trim().replace(" ", "") === "") {
    isStringEmpty = true;
  } else {
    isStringEmpty = false;
  }

  return isStringEmpty;
};

export default IsStringEmpty;
