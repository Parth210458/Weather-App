const userTab=document.querySelector('[data-userWeather]');
const searchTab=document.querySelector('[data-searchWeather]');
const userContainer=document.querySelector('.weather-container');
const grantAccessContainer=document.querySelector('.grant-locationContainer');
const searchForm=document.querySelector('[data-searchForm]');
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector('.user-info-container');
const errorContainer = document.querySelector('.error-msg');
const errorMsg = document.querySelector('[data-error]');


let currTab= userTab;
const API_KEY = "4830904c3514930f3a4e9c9463954c5f"; 
currTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currTab){
        currTab.classList.remove("current-tab");
        currTab=clickedTab;
        currTab.classList.add("current-tab");
        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else
        {
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click',()=>{
    //passing clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //passing clicked tab as input paramter
    switchTab(searchTab);
});

//check fi coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        //if localcoordinates not found
        grantAccessContainer.classList.add('active');
    }
    else
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grant continer invisible
    grantAccessContainer.classList.remove('active');
     errorContainer.classList.remove('active');
    //make loader visisble
    loadingScreen.classList.add('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');
    }
}
function renderWeatherInfo(weatherInfo){
    //fetch the elements
    console.log(weatherInfo);
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-contryIcon]');
    const desc = document.querySelector('[data-weatherDesc]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-clouds]');
    
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        //shiow alert;
    }
}
function showPosition(position){
    const userCoordiantes = {
        lat:position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordiantes));
    fetchUserWeatherInfo(userCoordiantes);
}

const grantAccessButton = document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener('click',getLocation);
const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName ==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    errorContainer.classList.remove('active');
    try{
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        console.log(response);
        if(response?.ok==false){
            loadingScreen.classList.remove('active');
            errorContainer.classList.add('active');
            errorMsg.textContent='City not found try again';
            return;
        }
       
        const data= await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active'); 
        renderWeatherInfo(data); 
    }
    catch(err){
        //remainin
        console.log('asdfasdf',err);
    }
}