function parseDate(dateString: string) {
    const [year, day, month] = dateString.split('-'); // Разделение строки даты
    return new Date(`${year}-${month}-${day}`);
}

export const quizDateActual = (availableUntil: string): boolean => {
    if (availableUntil !== '') {
        const currentDate = new Date();
        const availableUntilDate = parseDate(availableUntil);

        console.log("Available Until:", availableUntilDate);
        console.log("Current Date:", currentDate);

        // Сравнение по числу, месяцу и году
        const isEqual = currentDate.getFullYear() === availableUntilDate.getFullYear() &&
            currentDate.getMonth() === availableUntilDate.getMonth() &&
            currentDate.getDate() === availableUntilDate.getDate();

        // Проверка, если текущая дата меньше или равно доступной дате
        if (isEqual || currentDate < availableUntilDate) {
            return true; // Если равно или меньше
        }
        return false; // Если больше
    } else {
        return true; // Если availableUntil пуст, возвращаем true
    }
}
