import {useMessage} from 'naive-ui';


const message = (msg, type) => {
    const _message = useMessage();
    return _message[type || 'info'](msg);
};

const errorMessage = (msg) => {
    return message(msg, 'error');

};

export default errorMessage;

export {message}