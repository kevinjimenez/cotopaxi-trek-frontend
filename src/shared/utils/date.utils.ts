import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime, {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 364, d: 'day' }, // hasta 364 días sigue en formato "X días" en vez de saltar a "meses"
    { l: 'y' },
    { l: 'yy', d: 'year' },
  ],
});
dayjs.locale('es');

export const formatDate = (value: string | Date | undefined, format: string = 'YYYY-MM-DD') => {
  if (!value) return '';

  const parsed = dayjs(value);

  if (!parsed.isValid()) return '';

  return parsed.format(format);
};

export const isAfterNow = (value: string | Date) => {
  if (!value) return false;

  const parsed = dayjs(value);

  if (!parsed.isValid()) return false;

  return parsed.isAfter(dayjs());
};

export const fromNow = (value: string | Date) => {
  if (!value)
    return {
      isAfter: false,
      label: '',
    };

  const parsed = dayjs(value);

  if (!parsed.isValid())
    return {
      isAfter: false,
      label: '',
    };

  const prefix = parsed.isAfter(dayjs()) ? 'Termina' : 'Terminó';

  return {
    isAfter: parsed.isAfter(dayjs()),
    label: `${prefix} ${parsed.fromNow()}`,
  };
};
