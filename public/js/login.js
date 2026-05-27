const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('erro') === 'true') {
            document.getElementById('error-message').style.display = 'block';
        }