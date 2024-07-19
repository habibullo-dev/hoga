

   //single-thread worker for visiblity check
    setInterval(function() {
        if (document.visibilityState !== 'visible') {
            postMessage('');
        }
    }, 1000);


