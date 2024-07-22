
   //single-thread worker for visiblity check
    setInterval(function() {  
        if (workerMsgInterval===true){
            postMessage('');
        }
    }, 1000);
