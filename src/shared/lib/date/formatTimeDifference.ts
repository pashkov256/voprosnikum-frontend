export function formatTimeDifference(dateStart: string, completedAt: string): string {
    const start = new Date(dateStart);
    const completed = new Date(completedAt);
    let difference = completed.getTime() - start.getTime();
    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    let result = '';

    // Если есть часы, добавляем их
    if (hours > 0) {
        result += `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        // Если часов нет, выводим только минуты и секунды
        result += `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    return result;
}
