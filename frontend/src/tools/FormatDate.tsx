import {format} from 'date-fns';

export const FormatDate = (dateString: string) => {
    const date = new Date(dateString);
  return format(date, "EEEE, MMM d HH:mm");
}   