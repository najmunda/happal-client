export function createEmptyForm(formIndex) {
  return {
    index: formIndex,
    sentence: "",
    target: "",
    def: "",
  };
}

export function formatDate(dateISOString) {
  const date = new Date(dateISOString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function getEndTodayUTC() {
  // Return date of early day (client timezone)
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
}

export function msToDHM(milisecond) {
  // Turn milisecond to XdXhXm (day, hour, minute)
  let timeStr = ""
  if (milisecond >= 86400000) {
    timeStr += Math.floor(milisecond / 86400000) + 'd';
    milisecond %= 86400000;
  }
  if (milisecond >= 3600000) {
    timeStr += Math.floor(milisecond / 3600000) + 'h';
    milisecond %= 3600000;
  }
  if (milisecond >= 60000) {
    timeStr += Math.floor(milisecond / 60000) + 'm';
  }
  return timeStr;
}

export function getFirstPath(pathString = "") {
  const arr = [...pathString.matchAll(/^\/([a-z]+)\/?/g)];
  return arr.length ? arr[0][1] : '';
}