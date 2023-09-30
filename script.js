

// User Weather click
const userTab = document.querySelector("[data-userWeather]");
// Search Weather click
const searchTab = document.querySelector("[data-searchWeather]");
// Largest Container of weather
const userContainer = document.querySelector(".weather-container");
// Grant location container
const grantAccessContainer = document.querySelector(".grant-location-container");
// search form container
const searchForm = document.querySelector("[data-searchForm]");
// Loading container
const loadingScreen = document.querySelector(".loading-container");
// show weather info container
const userInfoContainer = document.querySelector(".user-info-container");
// nocity image
const nocity = document.querySelector(".nocity");


//initially vairables need????
let oldTab = userTab;
const API_KEY = "4a8423a1de906167415846344e9ddac7";
nocity.classList.remove("active");
oldTab.classList.add("current-tab");
getfromSessionStorage(); // Checking the current storage value


function switchTab(newTab) {
    if(newTab != oldTab) {
        nocity.classList.remove("active");
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            nocity.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            nocity.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) { // Store nhi hai location
        nocity.classList.remove("active");
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates; // Important hai ??
    nocity.classList.remove("active");
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        nocity.classList.remove("active");
        loadingScreen.classList.remove("active"); // loader remove
        userInfoContainer.classList.add("active"); // Information adding
        renderWeatherInfo(data);
    }
    catch(err) {
        nocity.classList.remove("active");
        loadingScreen.classList.remove("active");
        throw(err);
    }

}

function renderWeatherInfo(weatherInfo) {

    //fistly, we have to fetch the elements to make a changes in it -->
    // country name paragraph
    const cityName = document.querySelector("[data-cityName]"); 
    // country Image
    const countryIcon = document.querySelector("[data-countryIcon]");
    // Desc of weather
    const desc = document.querySelector("[data-weatherDesc]");
    // Weather icon
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    // Temp
    const temp = document.querySelector("[data-temp]");
    // Wind speed
    const windspeed = document.querySelector("[data-windspeed]");
    // humidity
    const humidity = document.querySelector("[data-humidity]");
    // Cloud
    const cloudiness = document.querySelector("[data-cloudiness]");

    // Option chaing operator --> ?.

    //fetch values from weatherINfo object and put it UI elements
    // Counrty name
    cityName.innerText = weatherInfo?.name; 
    // Coountry flag -- > Find how to get this link
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // Weather Desc
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    // Weather icon grantAccessContainer. to weather condition
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    // Temp
    temp.innerText = `${weatherInfo?.main?.temp} ℃`;
    // Wind
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    // humidity
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    // cloud
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

// Getting the current location of user
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); // showPosition is fun. define below
    }
    else {
        //  show an alert for no gelolocation support available
        alert("Location Granted is not successfully done");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

// selecting the Grant Access Button 
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
// selecting the search div why not selecting the unput tag ????
const searchInput = document.querySelector("[data-searchInput]");
// submiting on submit button
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    nocity.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        if(data?.cod!=="404"){
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        else{
        nocity.classList.add("active");
        }
    }
    catch(err) {

    }
}
