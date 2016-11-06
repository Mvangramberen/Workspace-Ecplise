var naamApp = angular.module('naamApp', []);
naamApp.controller('naamCtrl', function($scope){
	
$scope.namen = ["micky","mathias","gilles","jens"];
$scope.naamToevoegen = function (){
	$scope.namen.push($scope.ingevuldeNaam);
	$scope.ingevuldeNaam = "";
};

$scope.verwijderNaam = function(naam){
	var index = $scope.namen.indexOf(naam);
	$scope.namen.splice(index, 1);
}

console.log("scope namen" + $scope.namen);
});

