import axios from 'axios';

interface ErrorMessage {
    text: string;
    status?: number;
    url?: string;
}

export const getErrorMessage = (error: unknown): ErrorMessage => {
    const message: ErrorMessage = {
        text: 'Неизвестная ошибка',
    };

    if (axios.isAxiosError(error)) {
        if (error.response) {
            const { data, status } = error.response;
            message.status = status;

            if (error.config?.url) message.url = error.config.url;

            if (!data) return message;

            if (data.message) {
                message.text = data.message;
                return message;
            }

            if (typeof data === 'string') {
                message.text = data;
                return message;
            }

            message.text = JSON.stringify(data);
            return message;
        }
    }

    if (error instanceof Error && error.message) {
        message.text = error.message;
    }

    return message;
};
