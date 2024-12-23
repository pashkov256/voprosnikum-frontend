export const testIsOpenByDate = (deadLine: string): boolean => {
    if (deadLine !== '') {
        const currentDate = new Date();
        const availableUntilDate = new Date(deadLine);

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
