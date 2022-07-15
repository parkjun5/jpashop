fetch('/getLanguagesProperties', {
    method:'POST'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data === null) {
            return null;
        }
        localizationLanguages = data;
    })