$(document).ready(function () {
    var data = JSON.parse(localStorage.getItem('user') || null);
    var currentPage = window.location.pathname.split('/').pop();

    if ((!data || !data.isLoggedIn) && currentPage !== 'login.html') {
        window.location.href = './login.html';
    }

    if ((data !== null && data.isLoggedIn) && currentPage === 'login.html') {
        window.location.href = './index.html';
    }

    if (currentPage === "login.html") {
        if (data !== null) {
            $("#username").val(data?.username);
            $("#password").val(data?.password);
        }
    }

    if (currentPage === "cgpa.html") {
        var allCourses = data?.allCourses || [];
        var courseName = $("#course-name");
        allCourses.forEach(function (course) {
            var option = $("<option></option>").val(course.name).text(course.name);
            courseName.append(option);
        });
        var courseCode = $("#course-code");
        allCourses.forEach(function (course) {
            var option = $("<option></option>").val(course.code).text(course.code);
            courseCode.append(option);
        });
        var credit = $("#credit");
        allCourses.forEach(function (course) {
            var option = $("<option></option>").val(course.credit).text(course.credit);
            credit.append(option);
        });

        var myCourses = data?.myCourses || [];
        var myCourseList = $("#my-courses-list");
        myCourses.forEach(function (course, index) {
            var courseDiv = $("<div></div>").attr("id", "course-" + index);
            var courseInfo = $("<span></span>").text(course.name + " (" + course.code + ") - Credit: " + course.credit + ", Grade: " + course.grade);
            var deleteButton = $("<button></button>").text("Delete").attr("data-index", index);
            deleteButton.click(function () {
                myCourses.splice(index, 1);
                localStorage.setItem("user", JSON.stringify({ ...data, myCourses: myCourses }));
                window.location.reload();
            });
            courseDiv.append(courseInfo).append(deleteButton);
            myCourseList.append(courseDiv);
        });

    }

    if (currentPage === "calculate.html") {
        var myCourses = data?.myCourses || [];
        var totalCredit = 0;
        var totalGrade = 0;
        myCourses.forEach(function (course) {
            totalCredit += parseFloat(course.credit);
            var gradePoint = 0;
            switch (course.grade.toUpperCase()) {
                case 'A+':
                case 'A':
                    gradePoint = 4.0;
                    break;
                case 'A-':
                    gradePoint = 3.7;
                    break;
                case 'B+':
                    gradePoint = 3.3;
                    break;
                case 'B':
                    gradePoint = 3.0;
                    break;
                case 'B-':
                    gradePoint = 2.7;
                    break;
                case 'C+':
                    gradePoint = 2.3;
                    break;
                case 'C':
                    gradePoint = 2.0;
                    break;
                case 'C-':
                    gradePoint = 1.7;
                    break;
                case 'D':
                    gradePoint = 1.0;
                    break;
                default:
                    gradePoint = 0.0;
            }
            totalGrade += gradePoint * parseFloat(course.credit);
        });
        var cgpa = totalGrade / totalCredit;
        $("#cgpa").text("CGPA: " + cgpa.toFixed(2));
        $("#grade").text("Grade: " + (cgpa >= 3.5 ? "A" : cgpa >= 2.5 ? "B" : cgpa >= 1.5 ? "C" : "D"));
    }

    // login page form submit
    $("#login-form").submit(function (event) {
        event.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();

        localStorage.setItem("user", JSON.stringify({ ...data, username: username, password: password, isLoggedIn: true }));
        window.location.href = "index.html";
    });

    $("#logout-button").click(function () {
        data = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem("user", JSON.stringify({ ...data, isLoggedIn: false }));
        window.location.href = "./login.html";
    });

    $("#add-course").click(function (event) {
        event.preventDefault();

        var name = $("#course-name").val();
        var code = $("#course-code").val();
        var credit = $("#credit").val();
        var grade = $("#grade").val();
        if (name === "" || code === "" || credit === "" || grade === "") {
            alert("Please fill all fields!");
            return;
        }
        if (isNaN(credit)) {
            alert("Please enter valid numbers for credit and grade!");
            return;
        }
        $("#course-name").val("");
        $("#course-code").val("");
        $("#credit").val("");
        $("#grade").val("");

        localStorage.setItem("user", JSON.stringify({ ...data, myCourses: [...data.myCourses, { name: name, code: code, credit: credit, grade: grade }] }));
        location.reload();

    });


    $("#add-new-course-form").submit(function (event) {
        event.preventDefault();
        var name = $("#course-name").val();
        var code = $("#course-code").val();
        var credit = $("#course-credit").val();
        if (name === "" || code === "" || credit === "") {
            alert("Please fill all fields!");
            return;
        }
        if (isNaN(credit)) {
            alert("Please enter valid numbers for credit!");
            return;
        }
        $("#course-name").val("");
        $("#course-code").val("");
        $("#course-credit").val("");
        localStorage.setItem("user", JSON.stringify({ ...data, allCourses: [...data.allCourses, { name: name, code: code, credit: credit }] }));
        alert("Course added successfully!");
        window.location.href = "./cgpa.html";
    });


})