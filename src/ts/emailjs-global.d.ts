declare global {
    var emailjs: {
        send: (
            serviceID: string,
            templateID: string,
            templateParams: object,
            userID?: string
        ) => Promise<any>;
        init: (userID: string) => void;
    };
}

export {};
