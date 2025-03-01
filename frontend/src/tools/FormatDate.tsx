import {format} from 'date-fns';

export const FormatDate = (dateString: string) => {

  if (dateString === null) return '';

    const date = new Date(dateString);
  return format(date, "EEEE, MMM d HH:mm");
}   