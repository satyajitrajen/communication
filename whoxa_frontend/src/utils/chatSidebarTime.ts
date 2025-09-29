// @ts-nocheck
export default function chatSidebarTime(utcTime) {
  const utcDate = new Date(utcTime);
  const now = new Date();

  // Check if the UTC time is today
  if (
    utcDate.getUTCFullYear() === now.getUTCFullYear() &&
    utcDate.getUTCMonth() === now.getUTCMonth() &&
    utcDate.getUTCDate() === now.getUTCDate()
  ) {
    // Return local time
    // const localTime = new Date(utcTime).toLocaleTimeString(undefined, {
    //     timeStyle: 'short',
    //   });
    // return utcDate.toLocaleTimeString(undefined, {
    //   timeStyle: "short",
    // });
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return new Intl.DateTimeFormat("en-US", options).format(utcDate);
  } else {
    // Check if the UTC time is yesterday
    now.setDate(now.getDate() - 1);
    if (
      utcDate.getUTCFullYear() === now.getUTCFullYear() &&
      utcDate.getUTCMonth() === now.getUTCMonth() &&
      utcDate.getUTCDate() === now.getUTCDate()
    ) {
      return "Yesterday";
    } else {
      // Return date in dd-mm-yyyy format
      const dd = String(utcDate.getUTCDate()).padStart(2, "0");
      const mm = String(utcDate.getUTCMonth() + 1).padStart(2, "0"); // January is 0!
      const yyyy = utcDate.getUTCFullYear();

      return `${dd}/${mm}/${yyyy}`;
    }
  }
}


// Example usage:
// const utcTime = "2023-11-09T07:18:20.000Z";
// const localTime = convertUtcToLocal(utcTime);
// console.log(localTime);
