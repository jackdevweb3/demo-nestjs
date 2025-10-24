export const checkSecKey = (secKey: string) => {

    if (!secKey || secKey.length == 0) {
        return false;
    }

    return secKey.toLowerCase().trim() === (process.env.SECRET_KEY || 'demoservice123456');
}