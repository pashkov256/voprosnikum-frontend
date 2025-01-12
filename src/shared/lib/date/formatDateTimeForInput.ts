// export const formatDateTimeForInput = (dateString: string): string => {
//     const date = new Date(dateString); // Дата автоматически преобразуется в локальное время
//     const year = date.getUTCFullYear(); // UTC год
//     const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTC месяц
//     const day = String(date.getUTCDate()).padStart(2, '0'); // UTC день
//     const hours = String(date.getUTCHours()).padStart(2, '0'); // UTC час
//     const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // UTC минуты
//     console.log(`${year}-${month}-${day}T${hours}:${minutes}`);
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
// };
export const formatDateTimeForInput = (dateString:string) => {
    if (!dateString) return ""; // Если дата пустая, возвращаем пустую строку
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Проверяем, является ли дата корректной
        console.error("Invalid date value:", dateString);
        return "";
    }
    return date.toISOString().slice(0, 16); // Обрезаем до формата "yyyy-MM-ddThh:mm"
};
