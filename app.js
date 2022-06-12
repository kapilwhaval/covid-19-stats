const app = angular.module('covid-app', []);

app.controller('worldwide-cases', ($scope, $http, $rootScope) => {

    $rootScope.formatTime = (time) => moment(time).format('DD MMM YYYY, hh:mm a')
    $rootScope.currentYear = new Date().getFullYear();
    $scope.loading = true;
    $http.get('https://covid19.mathdro.id/api')
        .then(res => {
            $scope.error = false;
            $scope.worldWideData = res.data;
            $scope.loading = false;
        })
        .catch(err => {
            $scope.error = true;
            $scope.loading = false;
        })
})

app.controller('countrywide-cases', ($scope, $http, $rootScope) => {

    $scope.countries = [];
    $scope.loadingCountries = true;
    $scope.selectedCountry = null;
    $scope.selectedCountryData = null;
    $scope.loadingCountryData = false;

    $rootScope.numDifferentiation = (value) => {
        var val = Math.abs(value)
        if (val >= 10000000) {
            val = (val / 10000000).toFixed(2) + ' Cr';
        } else if (val >= 100000) {
            val = (val / 100000).toFixed(2) + ' L';
        } else if (val >= 1000) {
            val = (val / 1000).toFixed(2) + ' T'
        }
        return val;
    }

    $http.get('https://api.covid19api.com/countries')
        .then(res => {
            $scope.countries = res.data;
            $scope.loadingCountries = false;
        })
        .catch(err => {
            $scope.loadingCountries = false;
        })

    $scope.selectCountry = (country) => {
        $scope.error = false;
        $scope.loadingCountryData = true;
        $scope.selectedCountry = country;
        $http.get(`https://covid19.mathdro.id/api/countries/${country}`)
            .then(res => {
                $scope.error = false;
                $scope.selectedCountryData = res.data;
                $scope.loadingCountryData = false;
            })
            .catch(err => {
                $scope.error = err.data.error.message || 'Something went wrong';
                $scope.loadingCountryData = false;
            })
    }

})