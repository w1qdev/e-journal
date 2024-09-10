import { createElement, Fragment } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { ERROR_MESSAGES } from '@/constants/error-messages.ts';
import { getErrorMessage } from '@/utils/get-error-message';
import { QueryExtraOptions } from '@/types/app.types.ts';
import { notification } from '@/utils/ant-context.ts';
import { Tag } from 'antd';
import { isDev } from '@/utils/mode.ts';
import { API, HOST } from '@/constants/api.ts';

export const axiosInstance = axios.create({
    baseURL: isDev ? `/${API}` : `${HOST}/${API}`,
    withCredentials: true,
});

export const axiosBaseQuery = () => {
    return async (args: AxiosRequestConfig, _: unknown, extraOptions?: QueryExtraOptions) => {
        try {
            const { data } = await axiosInstance(args);
            return { data };
        } catch (e) {
            const message = getErrorMessage(e);

            const parsedMessage = ERROR_MESSAGES[message.text];
            if (parsedMessage) message.text = parsedMessage;

            if (!extraOptions || extraOptions.showErrorNotification === true) {
                notification.open({
                    message: createElement(Fragment, null, [
                        createElement(Tag, { color: 'error', bordered: false, key: 'status' }, [
                            message.status,
                        ]),
                        message.url,
                    ]),
                    description: message.text,
                    duration: 5,
                });
            }

            return { error: message };
        }
    };
};
