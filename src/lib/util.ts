import { formatDate } from 'date-fns'

function totalDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Co-created with Phind LLM model
 * and also, apparently, from https://github.com/nikitavoloboev/ts/blob/c80915ae2049fb08f144f34ec52043b15c1a6fcf/scripts/getAge.ts
 */
export function differenceSinceDate(since: Date) {
  const now = new Date();

  let years = now.getFullYear() - since.getFullYear();
  let months = now.getMonth() - since.getMonth();
  let days = now.getDate() - since.getDate();

  // When now month is less than since month,
  // or now month and since month are the same, but now day is less than since day,
  // subtract a year.
  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  // When now day is less than since day,
  // add back now's previous month's days
  if (days < 0) {
    days += totalDaysInMonth(now.getFullYear(), now.getMonth() - 1);
    months--;
  }

  return { years, months, days };
}

export function padLeftWithZeroes(number: number, count = 2) {
  return Math.floor(number).toString().padStart(count, "0");
}

export function prettyJoin(array: string[]) {
  return array.map((item, index) => {
    let suffix: string;
    if (index === array.length - 2) {
      suffix = ' and ';
    } else if (index !== array.length - 1) {
      suffix =', ';
    } else {
      suffix = '';
    }

    return item + suffix;
  }).join('');
}

export function getPatchNoteLink(patchNoteDate: Date) {
  return (
    "https://overwatch.blizzard.com/en-us/news/patch-notes/live/" +
    `${formatDate(patchNoteDate, 'yyyy/MM')}` +
    `#patch-${formatDate(patchNoteDate, 'yyyy-MM-dd')}`
  )
}

export function *range(start: number, end: number, step: number = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }

  return end;
}

export function sum(iter: Iterable<number>): number {
  let r = 0;
  for (const value of iter) {
    r += value;
  }
  return r;
}

export function min(iter: Iterable<number>): number {
  let r: number | null = null;
  for (const value of iter) {
    r = r == null || value > r ? value : r;
  }
  return r ?? 0;
}

export function max(iter: Iterable<number>): number {
  let r: number | null = null;
  for (const value of iter) {
    r = r == null || value < r ? value : r;
  }
  return r ?? 0;
}
