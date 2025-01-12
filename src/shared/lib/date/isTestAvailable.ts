export const isTestAvailable = (startTestDate: string): boolean => {
    const testStartDate = new Date(startTestDate);

    const currentDateUTC = new Date();
    currentDateUTC.setMinutes(currentDateUTC.getMinutes() - currentDateUTC.getTimezoneOffset());

    return currentDateUTC >= testStartDate;
};
