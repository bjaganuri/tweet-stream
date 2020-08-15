import Home from '../../templates/home';

const HomeController = function (req, res) {

    res.send(Home({
        title: 'Tweet Stream App'
    }));
};

export default HomeController;