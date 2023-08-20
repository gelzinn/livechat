const HaveAnySpecialCharacter = (string: string) => {
  const newString = string.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g);
  let haveAnySpecialCharacter = false;

  if (newString && newString.length > 0) {
    haveAnySpecialCharacter = true;
  } else {
    haveAnySpecialCharacter = false;
  }

  return haveAnySpecialCharacter;
};

export default HaveAnySpecialCharacter;
