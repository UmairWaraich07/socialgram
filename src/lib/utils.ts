import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (dateString: string): string => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  const timeDifference = currentDate.getTime() - inputDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes === 1) {
    return "1 minute ago";
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return "1 hour ago";
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days === 1) {
    return "1 day ago";
  } else {
    return `${days} days ago`;
  }
};
export const timeAgoComments = (dateString: string): string => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  const timeDifference = currentDate.getTime() - inputDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s ago`;
  } else if (minutes === 1) {
    return "1m ago";
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours === 1) {
    return "1h ago";
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days === 1) {
    return "1h ago";
  } else {
    return `${days}h ago`;
  }
};

export function parseTags(inputString: string): string[] {
  // Split the input string by commas
  const tagsArray: string[] = inputString.split(",");

  // Map over the array to trim whitespace and convert to lowercase
  const formattedTags: string[] = tagsArray.map((tag) =>
    tag.trim().toLowerCase()
  );

  return formattedTags;
}

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};
