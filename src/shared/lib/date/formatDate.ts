export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getUTCFullYear(); // Год в UTC
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяц в UTC
    const day = String(date.getUTCDate()).padStart(2, '0'); // День в UTC
    const hours = String(date.getUTCHours()).padStart(2, '0'); // Часы в UTC
    const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Минуты в UTC

    return `${year}-${day}-${month} ${hours}:${minutes}`;
}
