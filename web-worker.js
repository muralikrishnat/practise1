(function(win) {
    var App1 = {
        Data: {
            EmployeeData: null
        },
        init: function() {
            $('div.emp-search-module').on('keyup', 'input.input-search', function(e) {
                var $resultContainer = $(this).closest('div.emp-search-module').find('div.search-result');
                App1.search($(this).val(), $resultContainer);
            });
        },
        loadData: function() {
            $.get('/assets/ldap_data.json', function(data) {
                App1.Data.EmployeeData = data;
                var $resultContainer = $('div.emp-search-module').find('div.search-result');
                var resultString = '';
                if (window.Worker) {
                    var searchWorker = new Worker('js/renderings/searchworker.js');
                    var workerData = {
                        EmployeeList: App1.Data.EmployeeData.employees,
                        searchKey: ''
                    };
                    searchWorker.postMessage(workerData);
                    searchWorker.onmessage = function(e) {
                        $resultContainer.html(e.data);
                    };
                } else {
                    for (var i = 0; i < App1.Data.EmployeeData.employees.length; i++) {
                        resultString = App1.performData(resultString, App1.Data.EmployeeData.employees[i]);
                    }
                }
                $resultContainer.html(resultString);
            });
        },
        performData: function(resultString, EmployeeItem) {
            return resultString + '<div>' + EmployeeItem.firstName + '  ' + EmployeeItem.lastName + ' ' + EmployeeItem.mobile +'</div>';
        },
        search: function(searchKey, resultContainer) {
            if (window.Worker) {
                //lucky we have Web workers in job
                var searchWorker = new Worker('js/renderings/searchworker.js');
                var workerData = {
                    EmployeeList: App1.Data.EmployeeData.employees,
                    searchKey: searchKey
                };
                searchWorker.postMessage(workerData);
                searchWorker.onmessage = function(e) {
                    resultContainer.html(e.data);
                };

            } else {
                //old method fallback method for web workers
                var resultString = '';
                if (App1.Data.EmployeeData) {
                    for (var i = 0; i < App1.Data.EmployeeData.employees.length; i++) {
                        if (App1.Data.EmployeeData.employees[i].firstName.toUpperCase().indexOf(searchKey.toUpperCase()) == 0) {
                            resultString = App1.performData(resultString, App1.Data.EmployeeData.employees[i]);
                        }
                    }
                }
                resultContainer.html(resultString);
            }
        }
    };

    window.App1 = App1;
})(window);

$(document).ready(function() {
    if (window.App1) {
        App1.loadData();
        App1.init();
    }

});


/*


self.addEventListener('message', function(e) {
    var resultString = '';
    for (var i = 0; i < e.data.EmployeeList.length; i++) {
        if (e.data.searchKey.length == 0) {
            resultString = resultString + '<div style="padding-left:30px;">' + e.data.EmployeeList[i].firstName + '  ' + e.data.EmployeeList[i].lastName + ' <span style="font-weight:bold;padding-left:30px;">' + e.data.EmployeeList[i].mobile +'</span><span style="font-style:italic;padding-left:30px;">'+e.data.EmployeeList[i].email+'</span><span style="padding-left:30px;">'+e.data.EmployeeList[i].seatloc+'</span><span style="padding-left:30px;">'+e.data.EmployeeList[i].workloc+'</span><span style="padding-left:30px;">'+e.data.EmployeeList[i].telephone+'</span></div>';
        } else {
            if (e.data.EmployeeList[i].firstName.toUpperCase().indexOf(e.data.searchKey.toUpperCase()) == 0) {
                resultString = resultString + '<div style="padding-left:30px;">' + e.data.EmployeeList[i].firstName + '  ' + e.data.EmployeeList[i].lastName + ' <span style="font-weight:bold;padding-left:30px;">' + e.data.EmployeeList[i].mobile +'</span><span style="font-style:italic;padding-left:30px;">'+e.data.EmployeeList[i].email+'</span><span style="padding-left:30px;">'+e.data.EmployeeList[i].seatloc+'</span><span style="padding-left:30px;">'+e.data.EmployeeList[i].workloc+'</span><span style="padding-left:30px;">'+e.data.EmployeeList[i].telephone+'</span></div>';
            }
        }
    }
    self.postMessage(resultString);
}, false);


*/