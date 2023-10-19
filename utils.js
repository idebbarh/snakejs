export function timeDelay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
