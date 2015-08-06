/**
 * Created by mobinni on 22/04/15.
 */
var app = angular.module('exampleApp', [
    'materialDatePicker'
]);

app.controller('MainCtrl', function ($scope, $timeout) {
    $scope.config = {color1: '#0093de'};

    $scope.dateMin = moment().year(2005).month(0).date(0).format('DD/MM/YYYY');
    $scope.dateMax = moment().add(1, 'days').format('DD/MM/YYYY');

    $scope.arrows = {
        year: {
            left: 'images/white_arrow_left.svg',
            right: 'images/white_arrow_right.svg'
        },
        month: {
            left: 'images/grey_arrow_left.svg',
            right: 'images/grey_arrow_right.svg'
        }
    }
    $scope.header = {
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
    }

    $scope.submitAction = function(){
        console.log('submit');
    };
})
