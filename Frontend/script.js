 // ==========================================
// POWERWATCH - DAY 3 JAVASCRIPT
// ==========================================


// 1. Equipment data

const transformer = {
    id: "TR-101",
    type: "Transformer",
    temperature: 72,
    load: 68
};


// 2. Function to check temperature

function checkTemperature(temperature) {

    if (temperature > 85) {
        return "Critical";
    }

    else if (temperature >= 75) {
        return "Warning";
    }

    else {
        return "Normal";
    }
}


// 3. Get transformer status

transformer.status = checkTemperature(transformer.temperature);


// 4. Display transformer data on webpage

document.getElementById("transformerTemperature").textContent =
    transformer.temperature;

document.getElementById("transformerLoad").textContent =
    transformer.load;

document.getElementById("transformerStatus").textContent =
    transformer.status;


// 5. Temperature checker

const checkButton = document.getElementById("checkButton");

checkButton.addEventListener("click", function () {

    const temperatureInput =
        document.getElementById("temperature");

    const statusElement =
        document.getElementById("status");

    const temperature =
        Number(temperatureInput.value);


    // Check empty input

    if (temperatureInput.value === "") {

        statusElement.textContent =
            "Please enter a temperature.";

        return;
    }


    // Calculate status

    const status =
        checkTemperature(temperature);


    // Display result

    statusElement.textContent =
        "Status: " + status;

});