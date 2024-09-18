export default function formatTimestamp(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
  return date.toLocaleString(); // Converts to a readable string
}
