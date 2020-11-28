function parseDate(year: number, month: number, date: number, sep: string, centuryNum: number): { valid: boolean; date?: Date } {
    // decrease the month by 1 since months start with 0 in JavaScript
    month--;
    if (date > 60) {
        date -= 60;
    }

    // get century (i.e. 2019 -> 20)
    let currentCentury = parseInt(new Date().getFullYear().toString().slice(0, 2)) * 100;

    // if the century in the personal number is the current century and the separator is + return false
    // this is because the + separator is used to differentiate between centuries
    if (!centuryNum) {
        const testDate = new Date(Date.UTC(currentCentury + year, month, date));
        // if the personal number date is larger than the current date it must mean that the personal number is referring to the previous century
        if (testDate > new Date()) {
            currentCentury -= 100;
        }
        // as mentioned before the '+' separator is used to differentiate between centuries
        if (sep === "+") {
            currentCentury -= 100;
        }
    } else {
        currentCentury = centuryNum * 100;
    }

    const validDate = new Date(Date.UTC(currentCentury + year, month, date));

    // checks if it is the same date as the input date
    if (parseInt(validDate.getUTCFullYear().toString().slice(2, 4)) === year && validDate.getUTCMonth() === month && validDate.getUTCDate() === date) {
        return { valid: true, date: validDate };
    }

    // if it is not any of those the date input is incorrect
    return { valid: false };
}

export { parseDate };
