// Initialize Firebase
var config = {
    apiKey: "AIzaSyBjDtttRc7RnWq6a0lwvJOOTpRKaBHaBrE",
    authDomain: "train-schedule-e45a7.firebaseapp.com",
    databaseURL: "https://train-schedule-e45a7.firebaseio.com",
    projectId: "train-schedule-e45a7",
    storageBucket: "",
    messagingSenderId: "775300051604"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;


$("#submit").on("click", function (event) {
    event.preventDefault();

    if ($("#train-name").val().trim() === "" ||
        $("#destination").val().trim() === "" ||
        $("#first-train").val().trim() === "" ||
        $("#frequency").val().trim() === "") {

        //explore jQuery UI dialog
        alert("Please fill all fields to continue");

    } else {

        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        startTime = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        $(".form-field").val("");

        database.ref().push({
            trainName,
            destination,
            frequency,
            startTime,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    }
});

database.ref().on("child_added", function (childSnapshot) {
    var startTime = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTime), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var minToArrival = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;

    var newRow = $("<tr>");
    newRow.append($(`<td class="text-center">${childSnapshot.val().trainName}</td>`));
    newRow.append($(`<td class="text-center">${childSnapshot.val().destination}</td>`));
    newRow.append($(`<td class="text-center">${childSnapshot.val().frequency}</td>`));
    newRow.append($(`<td class="text-center">${moment(nextTrain).format("LT")}</td>`));
    newRow.append($(`<td class="text-center">${minToArrival}</td>`));
    newRow.append($(`<td class="text-center"><button class="btn btn-danger btn-xs" id="remove" data-key=${key}>x</button></td>`));

    
    $("#train-table-rows").append(newRow);

});

$(document).on("click", "#remove", function () {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
});

function currentTime() {
    var current = moment().format('LT');
    $("#time").html(current);
    setTimeout(currentTime, 1000);
};

currentTime();