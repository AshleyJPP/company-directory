$(document).ready(function() {
    
    function toggleFilterButton() {
        var isDepartmentsActive = $('#departmentsBtn').hasClass('active');
        var isLocationsActive = $('#locationsBtn').hasClass('active');
        var isFilterDisabled = isDepartmentsActive || isLocationsActive;
        $("#filterBtn").prop('disabled', isFilterDisabled);
        console.log("Departments active: " + isDepartmentsActive + ", Locations active: " + isLocationsActive);
        console.log("Filter button should be " + (isFilterDisabled ? "disabled" : "enabled"));
    }

    toggleFilterButton();

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
        toggleFilterButton();
    });
    $("#refreshBtn").click(function() {
        if ($("#personnelBtn").hasClass('active')) {
            refreshAllData();
        } else if ($("#departmentsBtn").hasClass('active')) {
            refreshAllDepartments();
        } else if ($("#locationsBtn").hasClass('active')) {
            refreshAllLocations();
        }
    });
    $("#filterBtn").click(function() {
        if (!$(this).prop('disabled')) {
            fetchAndPopulateDepartmentsDropdown('#filterDepartment');
            fetchAndPopulateLocationsDropdown('#filterLocation');
            $('#filterModal').modal('show');
        }
    });
    $("#applyFilterBtn").click(function() {
        var selectedDepartment = $("#filterDepartment").val();
        var selectedLocation = $("#filterLocation").val();
        filterTable(selectedDepartment, selectedLocation);
        $('#filterModal').modal('hide');
    });
    $("#filterDepartment").change(function() {
        if ($(this).val() !== "all") {
            $("#filterLocation").val("all");
        }
    });

    $("#filterLocation").change(function() {
        if ($(this).val() !== "all") {
            $("#filterDepartment").val("all");
        }
    });

});
  

$("#addBtn").click(function() {
    if ($("#personnelBtn").hasClass("active")) {
        $('#addPersonModal').modal('show');
    } else if ($("#departmentsBtn").hasClass("active")) {
        $('#addDepartment').modal('show');
    } else if ($("#locationsBtn").hasClass("active")) {
        $('#addLocation').modal('show');
    }
});

$('#departmentsBtn').click(fetchAndPopulateDepartments);


$('#editDepartmentModal').on('show.bs.modal', function (event) {
    $.ajax({
        url: "/project2/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        success: function(response) {
            if (response.data && response.data.length > 0) {
                var dropdown = $('#editDepartmentDropdown'); 
                dropdown.empty(); 
                $.each(response.data, function(index, department) {
                    var option = $('<option>', {
                        value: department.id,
                        text: department.name
                    });
                    dropdown.append(option);
                });
            } else {
                console.error('No departments returned from the server');
            }
        },
        error: function(error) {
            console.error('Error fetching departments:', error);
        }
    });
});

function fetchAndPopulateDepartments() {
    $.ajax({
        url: '/project2/php/getAllDepartments.php',
        method: 'GET',
        success: function(response) {
            if(response.status.code === "200") {
                populateDepartments(response.data);
            } else {
                console.error("Error fetching departments:", response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
}



$(document).ready(function() {
    $("#searchInp").on("keyup", function() {
        performSearch();
    });

    function performSearch() {
        var search = $("#searchInp").val().toLowerCase();
        var activeTab = $(".tab-pane.active");
        var rowsToSearch = activeTab.find("table tbody tr");

        if (!search) {
            rowsToSearch.show();
            return;
        }

        rowsToSearch.hide();

        rowsToSearch.filter(function() {
            var row = $(this);
            return row.text().toLowerCase().indexOf(search) > -1;
        }).show();
    }
});

function filterTable(departmentId, locationId) {
        $.ajax({
        url: '/project2/php/filterButton.php',
        type: 'GET',
        data: {
            department: departmentId,
            location: locationId
        },
        dataType: 'json',
        success: function(response) {
    if (response.status.code === 200) {
        if (response.data && response.data.length > 0) {
            updateTableWithFilteredData(response.data);
        } else {
            $('#noDataModal').modal('show');
        }
    } else {
        console.error("Error filtering table:", response.status.description);
    }
},
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error filtering table: ' + textStatus + ' - ' + errorThrown);
        }
    });
}

function updateTableWithFilteredData(filteredData) {
    var tableBody = $("#personnelTable tbody");
    tableBody.empty(); 
    if (filteredData.length === 0) {
        tableBody.append('<tr><td colspan="4" class="text-center">No data found for the applied filters.</td></tr>');
        return;
    }
$.each(filteredData, function (index, employee) {
    var formattedName = employee.lastName + ", " + employee.firstName;
    var newRow = "<tr data-employee-id='" + employee.id + "'>" +
                    "<td class='align-middle text-nowrap employeeName'>" + formattedName + "</td>" +
                    "<td>" + employee.email + "</td>" +
                    "<td>" + employee.department + "</td>" + 
                    "<td>" + employee.location + "</td>" +
                    "<td class='text-end text-nowrap'>" +
                        "<button type='button' class='btn btn-primary btn-sm editPersonnelBtn' data-bs-toggle='modal' data-bs-target='#editPersonnelModal' data-id='" + employee.id + "'><i class='fa-solid fa-pencil fa-fw'></i></button> " +
                        "<button type='button' class='btn btn-danger btn-sm deletePersonnelBtn' data-id='" + employee.id + "'><i class='fa-solid fa-trash fa-fw'></i></button>" +
                    "</td>" +
                "</tr>";
    tableBody.append(newRow);
});
}



function populateDepartments(departments) {
    if (!Array.isArray(departments)) {
        console.error('Expected departments to be an array but got:', departments);
        return;
    }

    $("#departmentsTable tbody").empty();

    departments.forEach(function(department) {
        var row = $("<tr></tr>")
            .attr("data-department-id", department.id)
            .append($("<td></td>").text(department.name).addClass("align-middle text-nowrap departmentName"))
            .append($("<td></td>").text(department.locationName).addClass("align-middle text-nowrap departmentLocation"))  
            .append($("<td></td>").addClass("text-end text-nowrap").html('<button type="button" class="btn btn-primary btn-sm editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + department.id + '" data-name="' + department.name + '"><i class="fa-solid fa-pencil fa-fw"></i></button> <button type="button" class="btn btn-danger btn-sm removeDepartmentBtn" data-id="' + department.id + '"><i class="fa-solid fa-trash fa-fw"></i></button>')) 

        $("#departmentsTable tbody").append(row);
    });
}

var departmentsData;

function populateLocationsTable(locations) {
    if (!Array.isArray(locations)) {
        console.error('Expected locations to be an array but got:', locations);
        return;
    }

    $("#locationsTable tbody").empty();

    locations.forEach(function(location) {
        var row = $("<tr></tr>")
            .attr("data-location-id", location.id)
            .append($("<td></td>").text(location.name).addClass("align-middle text-nowrap locationName"))
            .append($("<td></td>").addClass("text-end text-nowrap").html('<button type="button" class="btn btn-primary btn-sm editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + location.id + '"><i class="fa-solid fa-pencil fa-fw"></i></button> <button type="button" class="btn btn-danger btn-sm deleteLocationBtn" data-id="' + location.id + '"><i class="fa-solid fa-trash fa-fw"></i></button>'));

        $("#locationsTable tbody").append(row);
    });
}

function populateLocationDropdown(locations) {
    var dropdown = $('#addDepartmentLocation');
    dropdown.empty();
    dropdown.append('<option selected="true" disabled>Choose Location</option>');
    dropdown.prop('selectedIndex', 0);
    $.each(locations, function (key, location) {
        dropdown.append($('<option></option>').attr('value', location.id).text(location.name));
    });
}

$("#addPersonForm").submit(function(event) {
    event.preventDefault();

    var employeeData = {
        firstName: $("#addPersonFirstName").val(),
        lastName: $("#addPersonLastName").val(),
        jobTitle: $("#addPersonJobTitle").val(),
        email: $("#addPersonEmailAddress").val(),
        departmentID: $("#addPersonDepartment").val()
    };

    $.ajax({
        url: "/project2/php/addPersonnel.php",
        type: "POST",
        data: employeeData,
        dataType: "json", 
        success: function(response) {
            if(response.status === 'success') {
                $('#addPersonModal').modal('hide');
                addEmployeeToTable(response.employee);
                sortPersonnelTable();
            } else {
                console.error("Server responded with an error:", response.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error adding employee:", textStatus, errorThrown);
        }
    });
});

function sortPersonnelTable() {
    var rows = $('#personnelTable tbody tr').get();
    rows.sort(function(a, b) {
        var A = $(a).children('td').eq(0).text().toUpperCase();
        var B = $(b).children('td').eq(0).text().toUpperCase();
        if(A < B) {
            return -1;
        }
        if(A > B) {
            return 1;
        }
        return 0;
    });

    $.each(rows, function(index, row) {
        $('#personnelTable').children('tbody').append(row);
    });
}

var locationName = $("#addDepartmentLocation option:selected").text();


$("#addDepartmentForm").submit(function(event) {
    event.preventDefault();
    event.stopPropagation();
    var departmentData = {
        name: $("#addDepartmentNameInput").val(),
        locationID: $("#addDepartmentLocation").val()
    };
    var locationName = $("#addDepartmentLocation option:selected").text();
    $.ajax({
        url: "/project2/php/insertDepartment.php",
        type: "POST",
        data: departmentData,
        dataType: "json",
        success: function(response) {
            if(response.status.code == 200) {
                $('#addDepartment').modal('hide');
                var newDepartment = "<tr data-department-id='" + response.data.id + "'>" + 
                    "<td class='align-middle text-nowrap departmentName'>" + response.data.name + "</td>" + 
                    "<td class='align-middle text-nowrap departmentLocation'>" + response.data.locationName + "</td>" + 
                    "<td class='text-end text-nowrap'>" + 
                    "<button type='button' class='btn btn-primary btn-sm editDepartmentBtn' data-bs-toggle='modal' data-bs-target='#editDepartmentModal' data-id='" + response.data.id + "'><i class='fa-solid fa-pencil fa-fw'></i></button> " + 
                    "<button type='button' class='btn btn-danger btn-sm removeDepartmentBtn' data-id='" + response.data.id + "'><i class='fa-solid fa-trash fa-fw'></i></button>" + 
                    "</td></tr>";
                insertDepartmentAlphabetically(newDepartment); 
                } else {
                console.error("Server responded with an error:", response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error adding department:", textStatus, errorThrown);
        }
    });
});

$('#addDepartment').on('show.bs.modal', function (event) {
    fetchAndPopulateLocationsDropdown("#addDepartmentLocation");
});


function insertDepartmentAlphabetically(newDepartment) {
    var rows = $('#departmentsTable tbody tr').get();
    var inserted = false;

    for (var i = 0; i < rows.length; i++) {
        var currentName = $(rows[i]).find('.departmentName').text().trim();
        var newName = $(newDepartment).find('.departmentName').text().trim();

        if (newName.localeCompare(currentName) < 0) {
            $(rows[i]).before(newDepartment);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        $('#departmentsTable tbody').append(newDepartment);
    }
}

$('#addDepartment').on('show.bs.modal', function (event) {
    fetchAndPopulateLocationsDropdown("#addDepartmentLocation");
});



function fetchLocations() {
    $.ajax({
        url: '/project2/php/getAllLocations.php', 
        type: 'GET',
        dataType: 'json', 
        success: function(response) {
            if (response.data && Array.isArray(response.data)) {
                populateLocationsTable(response.data);
            } else {
                console.error("Invalid response structure:", response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching locations:", textStatus, errorThrown);
        }
    });
}

$(document).ready(function() {
    fetchLocations();
    $("#addLocationForm").on("submit", function(e) {
        e.preventDefault(); 
        var locationName = $("#addLocationName").val(); 
        $.ajax({
            url: '/project2/php/addLocation.php', 
            type: 'POST',
            dataType: 'json',
            data: {
                locationName: locationName 
            },
            success: function(response) {
                
                if(response.status.code === 200) {
                    $('#addLocation').modal('hide'); 
                    fetchLocations();
                } else {
                    console.error("Error:", response.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX error:", textStatus, errorThrown);
                
            }
        });
    });
});





$(document).ready(function() {
    $('#addBtn').click(function() {
        if ($('#personnelBtn').hasClass('active')) {
            $('#addPersonModal').modal('show');
        } else if ($('#departmentsBtn').hasClass('active')) {
            $('#addDepartment').modal('show');
        } else if ($('#locationsBtn').hasClass('active')) {
            $('#addLocation').modal('show');
        }
    });
});

$("#editPersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
    url:
      "/project2/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
success: function (result) {
    
    if (result && result.status && result.data && result.data.personnel && result.data.personnel.length > 0) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
            
            $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
            $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
            $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
            $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
            $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

            if (result.data.department) {
                $("#editPersonnelDepartment").html("");

                $.each(result.data.department, function () {
                    $("#editPersonnelDepartment").append(
                        $("<option>", {
                            value: this.id,
                            text: this.name
                        })
                    );
                });

                $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
            } else {
                console.error('Departments data is missing in the response');
                
            }
        } else {
            console.error('Received non-success status code:', resultCode);
            $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
        }
    } else {
        console.error('Unexpected response structure:', result);
        $("#editPersonnelModal .modal-title").text("Error: Unexpected response from server");

    }
},
error: function (jqXHR, textStatus, errorThrown) {
    console.error('AJAX error:', textStatus, errorThrown);
    $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
}

  });
});


$(document).ready(function() {
    $("#editPersonnelForm").on("submit", function (e) {
        e.preventDefault();

        var employeeID = $("#editPersonnelEmployeeID").val();
        var firstName = $("#editPersonnelFirstName").val();
        var lastName = $("#editPersonnelLastName").val();
        var jobTitle = $("#editPersonnelJobTitle").val();
        var emailAddress = $("#editPersonnelEmailAddress").val();
        var department = $("#editPersonnelDepartment").val();
        var data = {
            id: employeeID,
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: emailAddress,
            departmentId: department
        };

        $.ajax({
            url: '/project2/php/editPersonnel.php',
            type: 'POST',
            data: data,
            dataType: 'json', 
            success: function(response) {
                if(response.statusCode == 200) {
                    $("#editPersonnelModal").modal('hide');
                    updateEmployeeInTable(response.data);
                } else {
                    console.error('Error updating personnel:', response.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX error:', textStatus, errorThrown);
            }
        });
    });
});

function sortPersonnelRowAlphabetically(row) {
    var rows = $('#personnelTable tbody tr').get();
    var currentName = $(row).find('.employeeName').text().trim();

    $(row).remove(); 
    var inserted = false;
    for (var i = 0; i < rows.length; i++) {
        var compareName = $(rows[i]).find('.employeeName').text().trim();

        if (currentName.localeCompare(compareName) < 0) {
            $(rows[i]).before(row);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        $('#personnelTable tbody').append(row);
    }
}

function updateEmployeeInTable(employee) {
    var row = $('tr[data-employee-id="' + employee.id + '"]');
    row.find('.employeeName').text(employee.lastName + ', ' + employee.firstName);
    row.find('.employeeJobTitle').text(employee.jobTitle);
    row.find('.employeeEmail').text(employee.email);
    sortPersonnelRowAlphabetically(row);
}


$("#editDepartmentForm").on("submit", function(e) {
    e.preventDefault();

    var departmentId = $("#editDepartmentId").val(); 
    var departmentName = $("#editDepartmentNameInput").val();
    var locationId = $("#editDepartmentLocation").val();
    $.ajax({
        url: '/project2/php/editDepartment.php',
        method: 'POST',
        data: {
            id: departmentId,
            name: departmentName,
            locationID: locationId
        },
        success: function(response) {
            if (response.status.code === "200") {
                var updatedDepartment = response.data;
                var departmentRow = $("#departmentsTable").find("tr[data-department-id='" + updatedDepartment.id + "']");
                if (departmentRow.length) {
                    departmentRow.find(".departmentName").text(departmentName);
                    departmentRow.find(".departmentLocation").text($("#editDepartmentLocation option:selected").text());
                }
                $("#editDepartmentForm").trigger("reset");
                $('#editDepartmentModal').modal('hide');
                fetchAndPopulateDepartments();
            } else {
                console.error("Server responded with status code", response.status.code);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX request failed:", textStatus, errorThrown);
        }
    });
});


$(document).on('click', '.editDepartmentBtn', function() {
    var departmentId = $(this).data('id');

    $.ajax({
        url: '/project2/php/getDepartmentByID.php',
        type: 'GET',
        data: {
            id: departmentId
        },
        dataType: 'json',
        success: function(response) {
            if(response.status.code == 200 && response.data) {
                var department = response.data[0];
                $("#editDepartmentId").val(department.id);
                $("#editDepartmentNameInput").val(department.name);
                $("#editDepartmentLocation").val(department.locationID);
                $('#editDepartmentModal').modal('show');
            } else {
                console.error("Error fetching department data:", response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching department data:", textStatus, errorThrown);
        }
    });
    return false;
});

    
$(document).on('click', '.editLocationBtn', function() {
    var locationId = $(this).data('id');
    var locationName = $(this).closest('tr').find('.locationName').text();
    $("#editLocationNameInput").val(locationName);
    var modal = $('#editLocationModal');
    modal.find('input#editLocationId').val(locationId);
    $('#editLocationModal').modal('show');
});

$("#editLocationForm").on("submit", function(e) {
    e.preventDefault(); 
    var locationId = $("#editLocationId").val();
    var locationName = $("#editLocationNameInput").val();
    $.ajax({
        url: '/project2/php/editLocation.php',
        method: 'POST',
        data: {
            id: locationId,
            name: locationName
        },
        success: function(response) {
            try {
                var jsonResponse = JSON.parse(response);
                if(jsonResponse.status === "success") {
                    $("tr[data-location-id='" + locationId + "']").find(".locationName").text(locationName);
                    $('#editLocationModal').modal('hide');
                    fetchLocations();
                } else {
                    console.error("Server responded with status:", jsonResponse.status);
                }
            } catch (e) {
                console.error("Error parsing response JSON:", e);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error updating location:", textStatus, errorThrown);
        }
    });
});

$('#confirmDeleteDepartment').click(function() {
    var departmentId = $('#deleteDepartmentModal').data('departmentId');
    $.ajax({
        url: '/project2/php/deleteDepartmentByID.php',
        method: 'POST',
        data: {
            id: departmentId, 
        },
        success: function(response) {
            if(response.status.code === "200") {
                $("tr[data-department-id='" + departmentId + "']").remove();
                $('#deleteDepartmentModal').modal('hide');
            } else {
                console.error("Error deleting department:", response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error removing department:", textStatus, errorThrown);
        }
    });
});

function createDepartmentRow(department) {
    var row = $("<tr></tr>")
        .attr("data-department-id", department.id)
        .append($("<td></td>").text(department.name).addClass("align-middle text-nowrap departmentName"))
        .append($("<td></td>").text(department.location).addClass("align-middle text-nowrap departmentLocation"))
        .append($("<td></td>").addClass("text-end text-nowrap").html('<button type="button" class="btn btn-primary btn-sm editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + department.id + '"><i class="fa-solid fa-pencil fa-fw"></i></button> <button type="button" class="btn btn-danger btn-sm removeDepartmentBtn" data-id="' + department.id + '"><i class="fa-solid fa-trash fa-fw"></i></button>'));

    $('#departmentsTable tbody').append(newDepartment);
}



$.ajax({
    url: '/project2/php/getAll.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        populatePersonnel(response.data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + textStatus + ' - ' + errorThrown);
    }
    
    
});

function refreshAllData() {
    $.ajax({
        url: '/project2/php/getAll.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            populatePersonnel(response.data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
}

function refreshAllDepartments() {
    $.ajax({
        url: '/project2/php/getAllDepartments.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            populateDepartments(response.data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
}

function refreshAllLocations() {
    $.ajax({
        url: '/project2/php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response && response.data) {
                populateLocationsTable(response.data);
            } else {
                console.error('Unexpected response format:', response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
}



$('#editDepartmentBtn').click(function() {
    $('#editDepartmentModal').modal('show');
});

function populatePersonnel(employees) {
    $("#personnelTable tbody").empty();

    employees.forEach(function(employee) {
        var row = $("<tr></tr>")
            .attr("data-employee-id", employee.id)
            .append($("<td></td>").text(employee.lastName + ', ' + employee.firstName).addClass("align-middle text-nowrap employeeName"))
            .append($("<td></td>").text(employee.jobTitle).addClass("align-middle text-nowrap d-none d-md-table-cell employeeJobTitle"))
            .append($("<td></td>").text(employee.email).addClass("align-middle text-nowrap d-none d-md-table-cell employeeEmail"))
            .append($("<td></td>").text(employee.department).addClass("align-middle text-nowrap d-none d-md-table-cell"))
            .append($("<td></td>").text(employee.location).addClass("align-middle text-nowrap d-none d-md-table-cell employeeLocation"))
            .append($("<td></td>").addClass("text-end text-nowrap").html('<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + employee.id + '"><i class="fa-solid fa-pencil fa-fw"></i></button> <button type="button" class="btn btn-danger btn-sm deletePersonnelBtn" data-id="' + employee.id + '"><i class="fa-solid fa-trash fa-fw"></i></button>'));
        $("#personnelTable tbody").append(row);
    });
}

function addEmployeeToTable(employee) {
    var row = $("<tr></tr>")
        .attr("data-employee-id", employee.id)
        .append($("<td></td>").text(employee.lastName + ', ' + employee.firstName).addClass("align-middle text-nowrap employeeName"))
        .append($("<td></td>").text(employee.jobTitle).addClass("align-middle text-nowrap d-none d-md-table-cell employeeJobTitle"))
        .append($("<td></td>").text(employee.email).addClass("align-middle text-nowrap d-none d-md-table-cell employeeEmail"))
.append($("<td></td>").text(employee.departmentName).addClass("align-middle text-nowrap d-none d-md-table-cell"))
.append($("<td></td>").text(employee.locationName).addClass("align-middle text-nowrap d-none d-md-table-cell employeeLocation"))

        .append($("<td></td>").addClass("text-end text-nowrap").html('<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + employee.id + '"><i class="fa-solid fa-pencil fa-fw"></i></button> <button type="button" class="btn btn-danger btn-sm deletePersonnelBtn" data-id="' + employee.id + '"><i class="fa-solid fa-trash fa-fw"></i></button>'));
    $("#personnelTable tbody").append(row);
}



function fetchAndPopulateLocationsDropdown(dropdownId) {
    $.ajax({
        url: '/project2/php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status.code === "200") {
                var locations = response.data;
                var dropdown = $(dropdownId);
                dropdown.empty();
                dropdown.append('<option selected="true" disabled>Choose Location</option>');
                dropdown.prop('selectedIndex', 0);
                $.each(locations, function (key, location) {
                    dropdown.append($('<option></option>').attr('value', location.id).text(location.name));
                });
            } else {
                console.error("Error fetching locations:", response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching locations: ' + textStatus + ' - ' + errorThrown);
        }
    });
}



function fetchAndPopulateDepartmentsDropdown(dropdownId) {
    $.ajax({
        url: '/project2/php/getAllDepartments.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status.code === "200") {
                var departments = response.data;
                var dropdown = $(dropdownId);
                dropdown.empty();
                dropdown.append('<option selected="true" disabled>Choose Department</option>');
                dropdown.prop('selectedIndex', 0);
                $.each(departments, function (key, department) {
                    dropdown.append($('<option></option>').attr('value', department.id).text(department.name));
                });
            } else {
                console.error("Error fetching departments:", response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching departments: ' + textStatus + ' - ' + errorThrown);
        }
    });
}



$('#editDepartmentModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); 
    var departmentName = button.closest('tr').find('.departmentName').text();
    var modal = $(this);
    modal.find('input#editDepartmentName').attr("placeholder", departmentName); 
    modal.find('input#editDepartmentName').val('');
    fetchAndPopulateLocationsDropdown('#editDepartmentLocation');
});


$(document).on('click', '.editDepartmentBtn', function() {
    var departmentId = $(this).data('id');
    $('#editDepartmentId').val(departmentId);
    $('#editDepartmentDropdown').val(departmentId);
    $('#editDepartmentModal').modal('show');
});

function deleteLocation(locationId) {
    $.ajax({
        url: '/project2/php/deleteLocationByID.php',
        type: 'POST',
        dataType: 'json',
        data: { id: locationId },
        success: function(response) {
            if (response.status.code === 200) {
                fetchLocations(); 
                $('#deleteLocationModal').modal('hide');
                $('#deleteModalError').hide().text('');
            } else {
                $('#deleteModalError').text(response.status.description).show();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error during deletion:", textStatus, errorThrown);
            $('#deleteModalError').text('An unexpected error occurred.').show();
        }
    });
}

$('#confirmDeleteLocation').click(function() {
    var locationId = $('#deleteLocationModal').data('id');
    deleteLocation(locationId);
});



function deleteEmployee(employeeID) {
    $.ajax({
        url: "/project2/php/deleteEmployee.php",
        type: 'POST',
        dataType: 'json',
        data: { id: employeeID },
        success: function(result) {
            if (result.status && (result.status.code === '200' || result.status.code === 200)) {
                $("tr[data-employee-id='" + employeeID + "']").remove();
            } else {
                console.error('Failed to delete employee:', result);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error occurred while trying to delete employee:", textStatus, errorThrown);
        }
    });
}


$(document).on('click', '#confirmDelete', function() {
    if (employeeIDToDelete) {
        deleteEmployee(employeeIDToDelete);
        $('#confirmationModal').modal('hide');
    } else {
        console.error('No employee ID to delete');
    }
});


var employeeIDToDelete;

$(document).on('click', '.deletePersonnelBtn', function() {
    var $row = $(this).closest('tr');
    var nameString = $row.find('.employeeName').text().trim();
    var names = nameString.split(',').map(name => name.trim());
    if (names.length < 2) {
        console.error('Name format incorrect:', nameString);
        return;
    }
    var fullName = names[1] + " " + names[0];
    
    $('#employeeNameDisplay').text(fullName);
    employeeIDToDelete = $(this).data('id');
    $('#confirmationModal').modal('show');
});

function populateDepartmentSelect(selector) {
    $.ajax({
        url: "/project2/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        success: function(response) {
    if (response.data && response.data.length > 0) {
        var selectElement = $('#addPersonDepartment'); 
        selectElement.empty(); 
        $.each(response.data, function(index, department) {
            var option = $('<option>', {
                value: department.id,
                text: department.name
            });
            selectElement.append(option);
        });
    } else {
        console.error('No departments returned from the server');
    }
},
error: function(error) {
    console.error('Error fetching departments:', error);
}

    });
}

$("#addPersonModal").on("show.bs.modal", function(e) {
    populateDepartmentSelect("#addPersonDepartment");
});

function checkDepartmentDependencies(departmentId, callback) {
    $.ajax({
        url: '/project2/php/checkDepartmentDependencies.php',
        type: 'POST',
        data: { departmentId: departmentId },
        dataType: 'json',
        success: function(response) {
            if (response.status === "success") {
                callback(null, 0, response.departmentName);
            } else {
                callback(null, response.employeeCount, response.departmentName);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            callback("Error checking department dependencies: " + textStatus, 0, '');
        }
    });
}

$(document).on('click', '.removeDepartmentBtn', function() {
    var departmentId = $(this).data('id');
    checkDepartmentDependencies(departmentId, function(error, count, departmentName) {
        if (error) {
            console.error(error);
            return;
        }
        if (count > 0) {
            var message = 'You cannot remove the ' + departmentName + ' department because it has ' + count + ' employees assigned to it.';
            $('#dependencyModal').find('.modal-body').text(message);
            $('#dependencyModal').modal('show');
        } else {
            $('#deleteDepartmentModal').data('departmentId', departmentId);
            $('#deleteDepartmentModal').find('#departmentNameDisplay').text(departmentName);
            $('#deleteDepartmentModal').modal('show');
        }
    });
});

function checkLocationDependencies(locationId, callback) {
    $.ajax({
        url: '/project2/php/checkLocationDependencies.php',
        type: 'POST',
        dataType: 'json',
        data: { locationId: locationId },
        success: function(response) {
            console.log(response);
            if (response.status === 'error') {
                callback(response.message, response.departmentCount, response.locationName);
            } else {
                callback(null, 0, response.locationName);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error during dependency check:", textStatus, errorThrown);
            callback('An unexpected error occurred.', null, null);
        }
    });
}

$(document).on('click', '.deleteLocationBtn', function() {
    var locationId = $(this).data('id');

    checkLocationDependencies(locationId, function(error, departmentCount, locationName) {
        if (error) {
            $('#dependencyModal').find('.modal-body').text(error);
            $('#dependencyModal').modal('show');
            return;
        }
        if (departmentCount > 0) {
            var message = 'You cannot remove ' + locationName + ' as it has ' + departmentCount + ' departments assigned to it.';
            $('#dependencyModal').find('.modal-body').text(message);
            $('#dependencyModal').modal('show');
        } else {
            var deleteMessage = 'Are you sure you want to delete the location ' + locationName + '?';
            $('#deleteLocationModal').find('.modal-body p').text(deleteMessage);
            $('#deleteLocationModal').data('id', locationId).modal('show');
        }
    });
});


