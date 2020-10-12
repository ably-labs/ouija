export async function wait(duration: number) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(true);
        }, duration);
    });
}