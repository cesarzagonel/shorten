export default async function geolocation(address: string) {
  const data = await (await fetch(`http://ip-api.com/json/${address}`)).json();
  return data as { country: string; regionName: string; city: string };
}
