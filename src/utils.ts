export function isAlpha(str: string) {
    let code = str.charCodeAt(0);
    if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) {
        return false;
    }
    return true;
}

export function isNumber(str: string) {
    const code = str.charCodeAt(0);
    if (!(code > 47 && code < 58)) {
        return false;
    }
    return true;
}

export function popAll<T>(array: Array<T>) {
    while (array.length) {
        array.pop();
    }
}
