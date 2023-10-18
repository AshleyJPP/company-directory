var personnelData = [];
var emplloyeeIDToDelete;

$(document).ready(function() {
    fetchAndPopulateLocations();

$("#refreshBtn").click(function () {
  
  if ($("#personnelBtn").hasClass("active")) {
    
    // Refresh personnel table
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      // Refresh department table
      
    } else {
      
      // Refresh location table
      
    }
    
  }
  
});

$("#filterBtn").click(function () {
  
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  
});

$("#addBtn").click(function() {
    if ($("#personnelBtn").hasClass("active")) {
        $('#addPerson').modal('show');
    } else if ($("#departmentsBtn").hasClass("active")) {
        $('#addDepartment').modal('show');
    } else if ($("#locationsBtn").hasClass("active")) {
        $('#addLocation').modal('show');
    }
});

$("#personnelBtn").click(function () {
  
  // Call function to refresh presonnel table
  
});

$('#departmentsBtn').click(function() {
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
});


$("#locationsBtn").click(function () {
  
  // Call function to refresh location table
  
});

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



function populateDepartments(departments) {
    console.log('Data received in populateDepartments:', departments);

    if (!Array.isArray(departments)) {
        console.error('Expected departments to be an array but got:', departments);
        return;
    }

    $("#departmentsTable tbody").empty();

    departments.forEach(function(department) {
        var row = $("<tr></tr>")
            .attr("data-department-id", department.id)
            .append($("<td></td>").text(department.name).addClass("align-middle text-nowrap departmentName"))
            .append($("<td></td>").text(department.locationName).addClass("align-middle text-nowrap departmentLocation")) // changed from department.location to department.locationName based on your data 
            .append($("<td></td>").addClass("text-end text-nowrap").html('<button type="button" class="btn btn-primary btn-sm editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + department.id + '" data-name="' + department.name + '"><i class="fa-solid fa-pencil fa-fw"></i></button>'))

        $("#departmentsTable tbody").append(row);
    });
}

var departmentsData;

function fetchAndPopulateLocations() {
    $.ajax({
        url: '/project2/php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var locations = response.data;
            populateLocationDropdown(locations);
            populateLocationsTable(locations);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
}


function populateLocationsTable(locations) {
    var locationTable = $("#locationsTable tbody");
    locationTable.empty(); 

    locations.forEach(function(location) {
        var row = $("<tr></tr>")
            .append($("<td></td>").text(location.name))
            locationTable.append(row);
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


$('#locationsBtn').click(fetchAndPopulateLocations);


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
        console.log('Employee added:', response.employee);

        
        $('#addPerson').modal('hide');

        var selectedDepartmentName = $("#addPersonDepartment option:selected").text();
        console.log('Selected department:', selectedDepartmentName);

        var formattedName = response.employee.lastName + ", " + response.employee.firstName;
        var newRow = "<tr data-employee-id='" + response.employee.id + "'>" +
                        "<td>" + formattedName + "</td>" +
                        "<td>" + response.employee.jobTitle + "</td>" +
                        "<td>" + response.employee.email + "</td>" +
                        "<td>" + selectedDepartmentName + "</td>" +
                     "</tr>";

        
        $('#personnelTable').append(newRow);

        } else {
        console.error("Server responded with an error:", response.message);
    }
},
error: function(jqXHR, textStatus, errorThrown) {
    console.error("Error adding employee:", textStatus, errorThrown);
}
    });
});

$("#addDepartmentForm").submit(function(event) {
    event.preventDefault();

    var departmentData = {
        name: $("#addDepartmentName").val(),
        locationID: $("#addDepartmentLocation").val()
    };

    $.ajax({
        url: "/project2/php/insertDepartment.php",
        type: "POST",
        data: departmentData,
        dataType: "json",
        success: function(response) {
    if(response.status.code == 200) {
        $('#addDepartment').modal('hide');

        var newDepartment = "<tr><td>" + departmentData.name + "</td><td>" + "</td></tr>";
$('#departmentsTable').append(newDepartment);
    } else {
        console.error("Server responded with an error:", response.status.description);
    }
},
error: function(jqXHR, textStatus, errorThrown) {
    console.error("Error adding department:", textStatus, errorThrown);
}
    });
});





$(document).ready(function() {
    $('#addBtn').click(function() {
        if ($('#personnelBtn').hasClass('active')) {
            $('#addPerson').modal('show');
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



$("#editPersonnelForm").on("submit", function (e) {
    
    event.preventDefault();

    var employeeID = $("#editPersonnelEmployeeID").val();
    var firstName = $("#editPersonnelFirstName").val();
    var lastName = $("#editPersonnelLastName").val();
    var jobTitle = $("#editPersonnelJobTitle").val();
    var emailAddress = $("#editPersonnelEmailAddress").val();
    var department = $("#editPersonnelDepartment").val();
    populateDepartmentSelect("#editPersonnelDepartment");
    var data = {
        employeeID: employeeID,
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        emailAddress: emailAddress,
        department: department
    };

    
    $.ajax({
        url: "/project2/php/saveEdit.php",
        type: "POST",
        data: data,
        dataType: "json",
        success: function (response) {
            
            if (response.statusCode == 200) {
        var firstName = $('#editPersonnelFirstName').val();
        var lastName = $('#editPersonnelLastName').val();
        var jobTitle = $('#editPersonnelJobTitle').val();
        var emailAddress = $('#editPersonnelEmailAddress').val();
        var fullName = firstName + ', ' + lastName;
        var rowToUpdate = $("tr[data-employee-id='" + employeeID + "']");
        rowToUpdate.find('.employeeName').text(fullName);
        rowToUpdate.find('.employeeJobTitle').text(jobTitle);
        rowToUpdate.find('.employeeEmail').text(emailAddress);
            $("#editPersonnelModal").modal('hide');
                
            } else {
                alert("An error occurred: " + response.status.description);
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr, status, error);
            alert("An error occurred: " + error);
        }
    });
});



function editDepartment() {

    var departmentData = {
        id: $("#editDepartmentId").val(),
        name: $("#editDepartmentName").val(),
        locationID: $("#editDepartmentLocation").val()
    };

    $.ajax({
        url: '/project2/php/editDepartment.php',
        type: 'POST',
        data: departmentData,
        dataType: 'json',
        success: function(response) {
console.log(response);
            if(response.status.code === 200) {
                console.log("Department updated successfully!");

                $('#editDepartmentModal').modal('hide');

                } else {
                console.error("Server responded with an error while updating department:", response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error updating department:", textStatus, errorThrown);
        }
    });
}

$("#editDepartmentForm").submit(function(event) {
    console.log("Edit form submitted"); 
    event.preventDefault();
    editDepartment(); 
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
                var department = response.data;
                $("#editDepartmentId").val(department.id);
                $("#editDepartmentName").val(department.name);
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
});

$(document).on('click', '.removeDepartmentBtn', function() {
    var departmentId = $(this).data('id');
    if (confirm('Are you sure you want to remove this department?')) {
        
    }
});


$.ajax({
    url: 'https://ajppeters.com/project2/php/getAll.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        populatePersonnel(response.data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + textStatus + ' - ' + errorThrown);
    }
    
    
});


$('#editDepartmentBtn').click(function() {
    $('#editDepartmentModal').modal('show');
});

function populatePersonnel(employees) {
    $("#personnelTable tbody").empty();

    employees.forEach(function(employee) {
        var row = $("<tr></tr>")
            .attr("data-employee-id", employee.id)
            .append($("<td></td>").text(employee.firstName + ', ' + employee.lastName).addClass("align-middle text-nowrap employeeName"))
            .append($("<td></td>").text(employee.jobTitle).addClass("align-middle text-nowrap d-none d-md-table-cell employeeJobTitle"))
            .append($("<td></td>").text(employee.email).addClass("align-middle text-nowrap d-none d-md-table-cell employeeEmail"))
            .append($("<td></td>").text(employee.department).addClass("align-middle text-nowrap d-none d-md-table-cell"))
            .append($("<td></td>").text(employee.location).addClass("align-middle text-nowrap d-none d-md-table-cell employeeLocation"))
            .append($("<td></td>").addClass("text-end text-nowrap").html('<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + employee.id + '"><i class="fa-solid fa-pencil fa-fw"></i></button> <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="' + employee.id + '"><i class="fa-solid fa-trash fa-fw"></i></button>'));
        $("#personnelTable tbody").append(row);
    });
}

});


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


$('#editDepartmentModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); 
    var departmentName = button.closest('tr').find('.departmentName').text();

    // Update the modal's content.
    var modal = $(this);
    modal.find('input#editDepartmentName').attr("placeholder", departmentName); 
    modal.find('input#editDepartmentName').val('');
    fetchAndPopulateLocationsDropdown('#editDepartmentLocation');
});


$('#editDepartmentBtn').click(function() {
    $('#editDepartmentModal').modal('show');
});



function deleteEmployee(employeeID) {
    $.ajax({
        url: "/project2/php/deleteEmployee.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: employeeID
        },
        success: function(result) {
            $("tr[data-employee-id='" + employeeID + "']").remove();
        },
        error: function(jqXHR, exception){
            console.log("Error occurred while trying to delete profiles");
        }
    });
}

$(document).on('click', '.deletePersonnelBtn', function() {
    employeeIDToDelete = $(this).data('id');
    $('#confirmationModal').modal('show');
});

$(document).on('click', '#confirmDelete', function() {
    deleteEmployee(employeeIDToDelete);
    $('#confirmationModal').modal('hide');
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
console.log(departments);
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

$("#addPerson").on("show.bs.modal", function(e) {
    populateDepartmentSelect("#addPersonDepartment");
});

function erroraajx(jqXHR, exception) {

    var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
};


