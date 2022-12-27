export default async (task, options = {
    timeout: 30000,
    delay: 1000,
    onTaskFailed: () => { }
}) => {
    const wait = () => {
        return new Promise(resolve => setTimeout(() => resolve(), options.delay));
    };

    const timeoutMoment = new Date().getTime() + options.timeout;

    while (true) {
        try {
            return await task();
        } catch (error) {
            options.onTaskFailed(error);
        }
        await wait();

        if (timeoutMoment < new Date().getTime()) {
            const error = new Error(`E_POLLING_TIMEOUT: Polling time out exceeded ${options.timeout}ms`);

            error.code  = 'E_POLLING_TIMEOUT';

            throw error;
        }
    }
};
