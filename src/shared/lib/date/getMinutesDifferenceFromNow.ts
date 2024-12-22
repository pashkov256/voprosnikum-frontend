export function getMinutesDifferenceFromNow(targetDate: string): number {
    const targetTime = new Date(targetDate);

    if (isNaN(targetTime.getTime())) {
        throw new Error("Invalid date format");
    }

    const now = new Date();

    const differenceInMs =now.getTime() - targetTime.getTime()  ;

    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));

    return differenceInMinutes;
}
