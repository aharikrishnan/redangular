var sheet = angular.module('sheet', []);

sheet
  .filter('alpha', function(){
    var _alpha = function(num){
      var toAlpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return toAlpha[parseInt(num, 10)] || '?';
    };
    return _alpha;
  })
  .filter('humanize', function(alphaFilter){
    var _humanize = function(cell){
      var columnName = cell.hasOwnProperty('ix')? alphaFilter(cell.ix) : '?';
      var rowName = cell.hasOwnProperty('iy')? cell.ix : '!';
      var cellName = columnName+rowName;
      return cellName;
    };
    return _humanize;
  })

  .service('gridService', ['gridFactory', function(gridFactory){

    var initGrid = function(grid, cx, cy){
      for(var i =0; i< cy; i++){
        var row = grid[i] || gridFactory.createRow();
        for(var j=0; j<cx; j++){
          row[j] = row[j] || gridFactory.createCell({ix: j, iy: i})
        }
        grid[i] = row;
      }
    };

    var addRows = function(grid, cx, cy){
      var row = gridFactory.createRow();
      for(var j =0; j< cx; j++){
        var cell = gridFactory.createCell({ix:j, iy: cy, data: null})
        row.push(cell);
      }
      grid.push(row)
      cy++;
      return cy;
    };

    var addColumns = function(grid, cx, cy){
      for(var i =0; i<cy; i++){
        var j = cx;
        var row = grid[i] || gridFactory.createRow();
        row[j] = row[j] || gridFactory.createCell({ix: j, iy: i, data:null})
        grid[i] = row;
      }
      cx++;
      return cx;
    };

    var range = function(count){
      return new Array(parseInt(count, 10));
    };

    return {
      range: range,
      initGrid: initGrid,
      addRows: addRows,
      addColumns: addColumns
    };
  }])

  .factory('gridFactory', function(){
    return {
      createRow: function(){
        return [];
      },
      createCell: function(cellData){
        return {
          ix: cellData.ix,
          iy: cellData.iy,
          data: cellData.data
        }
      }
    };
  })

  .controller('sheetController', ['$scope', 'gridFactory', 'gridService', function($scope, gridFactory, gridService){
    $scope.grid = [];
    $scope.cx = 16;
    $scope.cy = 16;

    gridService.initGrid($scope.grid, $scope.cx, $scope.cy);

    $scope.range= gridService.range;

    $scope.addRows = function(){
      $scope.cy = gridService.addRows($scope.grid, $scope.cx, $scope.cy);
    };

    $scope.addColumns = function(){
      $scope.cx = gridService.addColumns($scope.grid, $scope.cx, $scope.cy);
    };
  }]);

