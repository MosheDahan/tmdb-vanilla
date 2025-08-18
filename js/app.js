import { router } from './router.js';

function start() {
    console.log('[app] loaded');    // הודעת דיבוג - רואים בקונסולה

    router();                       // רינדור ראשוני של המסך המתאים ל-hash
    window.addEventListener('hashchange', router, { passive: true }); // כל שינוי hash => רינדור מחדש
}

start();











// console.log('[app] loaded');
