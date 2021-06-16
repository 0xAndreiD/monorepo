export function timeAgo(prevDate: Date): string {
    const diff = Number(new Date()) - Number(prevDate);
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;
    switch (true) {
        case diff < minute:
            const seconds = Math.round(diff / 1000);
            return seconds < 1 ? '<1s' : `${seconds}s`;
        case diff < hour:
            return Math.round(diff / minute) + 'm';
        case diff < day:
            return Math.round(diff / hour) + 'h';
        case diff < month:
            return Math.round(diff / day) + 'd';
        case diff < year:
            return Math.round(diff / month) + 'm';
        case diff > year:
            return Math.round(diff / year) + 'y';
        default:
            return "";
    }
}
