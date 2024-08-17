export class FileUtils {
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);//После загрузки скрипта
            script.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(script);
        });
    }
    static loadPageStyle(src, insertAfterElement) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        insertAfterElement.insertAdjacentElement('afterend',link);
        // document.head.insertBefore(link, insertAfterElement);
    }
}