function isPastDate(dateString: string): boolean {
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    return inputDate > currentDate;
}

export default isPastDate
