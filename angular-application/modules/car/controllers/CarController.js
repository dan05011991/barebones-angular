var CarController = function(list, $scope) {
    var self = this;

    self.list = list;

    var columnDefs = [
            {headerName: "Model", field: "makeModel"},
            {headerName: "MPG", field: "mpg"},
            {headerName: "CYL", field: "cyl"},
            {headerName: "DISP", field: "disp"},
            {headerName: "HP", field: "hp"},
            {headerName: "DRAT", field: "drat"},
            {headerName: "WT", field: "wt"},
            {headerName: "QSEC", field: "qsec"},
            {headerName: "VS", field: "vs"},
            {headerName: "AM", field: "am"},
            {headerName: "GEARS", field: "gear"},
            {headerName: "CARBON", field: "carb"},
        ];

    var currentRowHeight = 10;

        $scope.gridOptions = {
            columnDefs: columnDefs,
               defaultColDef: {
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100,
                    sortable: true,
                    resizable: true,
                    filter: true,
                    flex: 1,
                    minWidth: 100
                },
            rowData: list[0],
            onGridReady: function(params) {

                params.api.sizeColumnsToFit();
            },
            pagination: true,
            paginationPageSize: 20
        };

};

module.exports = ['list', '$scope', CarController];
