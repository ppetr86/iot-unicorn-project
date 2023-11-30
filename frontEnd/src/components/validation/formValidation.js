export default function FormValidation(state) {
  let newTerrarium;

  if (state.newTerrarium) {
    ({ newTerrarium } = state);
  } else {
    newTerrarium = { ...state };
  }

  const errors = {
    name:
      !newTerrarium.name || newTerrarium.name.trim() === ""
        ? "Please enter a valid terrarium name."
        : false,

    animalType:
      !newTerrarium.animalType || newTerrarium.animalType.trim() === ""
        ? "Please enter a valid animal type."
        : false,

    description:
      !newTerrarium.description || newTerrarium.description.trim() === ""
        ? "Please enter a valid description."
        : false,

    hardwarioCode:
      !newTerrarium.hardwarioCode || newTerrarium.hardwarioCode.trim() === ""
        ? "Please enter a valid hardwario code."
        : false,

    temperatureMin:
      newTerrarium.targetLivingConditions.temperature.min === "" ||
      isNaN(newTerrarium.targetLivingConditions.temperature.min) ||
      newTerrarium.targetLivingConditions.temperature.min < -100 ||
      newTerrarium.targetLivingConditions.temperature.min > 100
        ? "Out of range (+-100°C) or invalid"
        : false,

    temperatureMax:
      newTerrarium.targetLivingConditions.temperature.max === "" ||
      isNaN(newTerrarium.targetLivingConditions.temperature.max) ||
      newTerrarium.targetLivingConditions.temperature.max < -100 ||
      newTerrarium.targetLivingConditions.temperature.max > 100
        ? "Out of range (+-100°C) or invalid"
        : newTerrarium.targetLivingConditions.temperature.max <=
          newTerrarium.targetLivingConditions.temperature.min
        ? "Maximum temp can not be lower o equal to minimum temp"
        : false,
  };

  const allErrorsFalse = Object.values(errors).every(
    (error) => error === false
  );

  if (allErrorsFalse) {
    false;
  } else {
    return errors;
  }
}
