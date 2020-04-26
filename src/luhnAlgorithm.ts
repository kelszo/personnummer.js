// this is just Luhn's algorithm, more on wikipedia
function luhnAlgorithm(input: string | number) {
    let sum = 0;
    if (typeof input === "number") {
        input = "" + input;
    }

    const l = input.length;

    for (let i = 0; i < l; i++) {
        let v = parseInt(input[i]);
        v *= 2 - (i % 2);
        if (v > 9) {
            v -= 9;
        }

        sum += v;
    }

    return (10 - (sum % 10)) % 10;
}

export { luhnAlgorithm };
