export const formatDateTimeForInput = (dateString: string): string => {
    const date = new Date(dateString); // Дата автоматически преобразуется в локальное время
    const year = date.getFullYear(); // Локальный год
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Локальный месяц
    const day = String(date.getDate()).padStart(2, '0'); // Локальный день
    const hours = String(date.getHours()).padStart(2, '0'); // Локальный час
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Локальные минуты
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
