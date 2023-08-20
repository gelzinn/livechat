const HaveAnyNumber = (string: string) => {
  const newString = string.replace(/\D/g, "");
  let haveAnyNumber = false;
  if (newString.length > 0) {
    haveAnyNumber = true;
  } else {
    haveAnyNumber = false;
  }

  return haveAnyNumber;
};

export default HaveAnyNumber;
