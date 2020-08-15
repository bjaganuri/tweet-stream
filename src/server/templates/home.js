const Home = ({ title }) => {
    return (`
        <!DOCTYPE html>
        <html>
            <head>
                <title>${title}</title>
                <meta charset= 'UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <style>
                    .v-center {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .loader {
                        border: 1em solid #f3f3f3;
                        border-radius: 50%;
                        border-top: 1em solid #4272d7;
                        width: 10em;
                        height: 10em;
                        -webkit-animation: spin 2s linear infinite;
                        animation: spin 2s linear infinite;
                    }
                    
                    @-webkit-keyframes spin {
                        0% { -webkit-transform: rotate(0deg); }
                        100% { -webkit-transform: rotate(360deg); }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
                <link rel="shortcut icon" href="data:image/x-icon;" type="image/x-icon">
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"/>
                <link rel='stylesheet' href='/static/css/main.bundle.css' />
            </head>
            <body>
                <div id='root'>
                    <div class= 'v-center'>
                        <div class='loader'></div>
                    </div>
                </div>
                <script src='/static/js/main.bundle.js' defer></script>
            </body>
        </html>
    `);
};

export default Home;