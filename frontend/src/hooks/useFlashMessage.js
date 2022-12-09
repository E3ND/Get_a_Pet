import bus from '../utils/bus'

// Criando o evento flash messages
export default function useFlashMessage() {
    function setFlashMessage(msg, type) {
        bus.emit('flash', {
            message: msg,
            type: type,
        })
    }

    return { setFlashMessage }
}