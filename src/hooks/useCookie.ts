
type SetCookie = (name: string, value: string, days?: number) => void;

const useCookie = () => {
    const setCookie: SetCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
    };

    const removeCookie = (name: string) => {
        document.cookie = `${name}=; Max-Age=0; path=/`;
    };

    return { setCookie ,removeCookie };
};

export {useCookie}