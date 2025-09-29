export function formatUTCtoLocalDate(utcTimestamp: any) {
  const date = new Date(utcTimestamp);

  // Options for formatting the date
  const options = { month: "long", day: "numeric", year: "numeric" };

  // Format the date using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat("en-IN", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}
export function formateDateOnly(localDate: any) {
  // console.log(localDate, "date,=======================");

  const date = new Date(localDate);

  // Options for formatting the date
  const options = { month: "long", day: "numeric", year: "numeric" };

  // Format the date using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat("en-IN", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}

export function formatDate(dateString: any) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatTimeOnly(utcTimestamp: string | number | Date): string {
  const date = new Date(utcTimestamp);

  // Options for formatting the time
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the time using toLocaleTimeString
  const formattedTime = date.toLocaleTimeString("en-US", options);

  return formattedTime;
}

export function formatLastSeen(utcDate: Date | string): string {
  // console.log(typeof utcDate, "typeof utcDate");
  // console.log(utcDate, "utcDate");

  // Convert string to Date if needed
  if (typeof utcDate === "string") {
    utcDate = new Date(utcDate);
  }

  if (!(utcDate instanceof Date) || isNaN(utcDate.getTime())) {
    return "";
  }

  const lastSeenDate = new Date(utcDate);
  const now = new Date();

  const diffInMinutes = Math.floor(
    (now.getTime() - lastSeenDate.getTime()) / (1000 * 60),
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30); // Approximation for months

  if (diffInMinutes < 1) {
    return "Last Seen Just now";
  } else if (diffInMinutes < 60) {
    return `Last Seen ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `Last Seen ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 30) {
    return `Last Seen ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInMonths < 12) {
    return `Last Seen ${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInMonths / 12);
    return `Last Seen ${years} year${years > 1 ? "s" : ""} ago`;
  }
}

export function formatRelativeTime(utcDateString: Date) {
  const date = new Date(utcDateString);
  const now = new Date();

  // Convert to local time
  const localDate = new Date(
    date.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  );
  const localNow = new Date(
    now.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  );

  // Extracting date parts
  const dateDay = localDate.getDate();
  const nowDay = localNow.getDate();
  const dateMonth = localDate.getMonth();
  const nowMonth = localNow.getMonth();
  const dateYear = localDate.getFullYear();
  const nowYear = localNow.getFullYear();

  // Format time (e.g., 7:02 PM)
  const formattedTime = localDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (dateYear === nowYear && dateMonth === nowMonth) {
    if (dateDay === nowDay) {
      return `Today, ${formattedTime}`;
    } else if (dateDay === nowDay - 1) {
      return `Yesterday, ${formattedTime}`;
    }
  }

  // Return full date if not today or yesterday
  return (
    localDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
    `, ${formattedTime}`
  );
}


export const formatTime = (isoString: any): string => {
  const date = new Date(isoString);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert to 12-hour format
  return `${hours}:${minutes} ${ampm}`;
};
