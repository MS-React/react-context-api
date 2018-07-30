export function handleErrors(response) {
  if (response.statusText !== 'OK') {
    throw Error(response.statusText);
  }
  return response;
}
