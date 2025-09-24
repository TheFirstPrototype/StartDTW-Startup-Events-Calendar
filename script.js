
$(document).ready(function () {
  var userLang = navigator.language || navigator.userLanguage;
  // Do not navigate if you come from another deaf assistant page
  if (document.referrer.includes("conferencecaptioning.com")) {
      console.log("Internal");
  } else {
      var langMap = {
          "fr": "index-fr.html",
          "de": "index-de.html",
          "es": "index-es.html",
          "ar": "index-ar.html",
          "nl": "index-nl.html",
          "pt": "index-pt.html",
          "ru": "index-ru.html",
          "uk": "index-uk.html",
          "hi": "index-hi.html",
          "ur": "index-ur.html",
          "yo": "index-yo.html",
          "id": "index-id.html",
          "it": "index-it.html",
          "ja": "index-ja.html",
          "sw": "index-sw.html",
          "pl": "index-pl.html",
          "vi": "index-vi.html",
          "ro": "index-ro.html",
          "zh-Hant": "index-zh-hant.html",
          "zh": "index-zh.html",
          "hr": "index-hr.html",
          "fa": "index-fa.html",
          "ko": "index-ko.html",
          "sv": "index-sv.html",
          "hu": "index-hu.html",
          "sq": "index-sq.html"
      };

      for (var lang in langMap) {
          if (userLang.startsWith(lang)) {
              window.location.href = langMap[lang];
              break;
          }
      }
  }
});

var eventsCount = 0;
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("embed") === "true") {
      document.getElementById("page-header").style.display = "none";
      document.getElementById("h3-try").style.display = "none";
      document.getElementById("page-footer").style.display = "none";
  }
  apiCalls();
  
});

function apiCalls() {
  const API_URL = "https://api.deafassistant.com/retrieve/GetJson?guid=24c8b245-018b-4ca7-8455-612c9339d636";
  // const API_URL = "https://script.google.com/macros/s/AKfycbzQIl7H91UC-3E8ma56iL4egPgX3kxmLf9rBJSlB4ltaMMvA-4dIruyBGjHUVezVe35Pw/exec"; // Replace with your API URL
  const eventsContainer = document.getElementById("events-container");
  const loader = document.getElementById("loader");

  // Show loader before fetching data
  // loader.style.display = "block";

  fetch(API_URL, {
      method: "GET",
      headers: {
          "Content-Type": " application/json"
      },
      mode: "cors"
  })
  .then((response) => { 
  console.log(response);      
  console.log("response");      
  console.log(response.json);      
  return response.json();      
  })
  .then((events) => {
    if (events.length <= eventsCount) {
        return
    }
    eventsCount = events.length; // Store the number of events
    
    loader.style.display = "none"; // Hide loader
    eventsContainer.innerHTML = ""; // Clear container
    
    if (events.length === 0) {
        eventsContainer.innerHTML = "<p>No upcoming events found.</p>";
        return;
    }

    events.forEach((event) => {
        eventsContainer.appendChild(getEventCard(event));
    });
    setTimeout(function() { apiCalls(); }, 5000);
  })
  .catch((error) => {
  // if running in localhost, generate mock data for event list
    mockEvents(eventsContainer, loader);
  });  
}
function mockEvents(eventsContainer, loader){
  if (window.location.hostname === "localhost" || window.location.origin === "file://") {
    const mockEvents = [
      {
          Title: "Mock Event 1",
          Date: "2023-10-01",
          Time: "10:00 AM - 12:00 PM",
          Location: "Mock Location 1",
          URL: "#",
          Image: "https://via.placeholder.com/150"
      },
      {
          Title: "Mock Event 2",
          Date: "2023-10-02",
          Time: "2:00 PM - 4:00 PM",
          Location: "Mock Location 2",
          URL: "#",
          Image: "https://via.placeholder.com/150"
      },
      {
          Title: "Mock Event 3",
          Date: "2023-10-02",
          Time: "2:00 PM - 4:00 PM",
          Location: "Mock Location 2",
          URL: "#",
          Image: "https://via.placeholder.com/150"
      },
      {
          Title: "Mock Event 4",
          Date: "2023-10-02",
          Time: "2:00 PM - 4:00 PM",
          Location: "Mock Location 2",
          URL: "#",
          Image: "https://via.placeholder.com/150"
      },
      {
          Title: "Mock Event 5",
          Date: "2023-10-02",
          Time: "2:00 PM - 4:00 PM",
          Location: "Mock Location 2",
          URL: "#",
          Image: "https://via.placeholder.com/150"
      },
      {
          Title: "Mock Event 6",
          Date: "2023-10-02",
          Time: "2:00 PM - 4:00 PM",
          Location: "Mock Location 2",
          URL: "#",
          Image: "https://via.placeholder.com/150"
      }
    ];

    mockEvents.forEach((event) => {
      eventsContainer.appendChild(getEventCard(event));
    });
    loader.style.display = "none";
  } else {
    console.error("Error fetching data:", error);
    loader.style.display = "none";
    eventsContainer.innerHTML = "<p>Error loading events.</p>";
  }
}
// Convert 24-hour time to 12-hour AM/PM format
function convertTime(time) {
  if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) {
      return time;
  }
  let [start, end] = time.split(" - ");
  let [hours, minutes] = start.split(":");
  hours = parseInt(hours);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24h to 12h format
  return `${hours}:${minutes} ${ampm}`;
}

function getEventCard(event){
  const eventCard = document.createElement("div");
  eventCard.classList.add("event-card");

  eventCard.innerHTML = `
          <div style="background-color: blue; padding:1px;">
              <img loading="lazy" style="object-fit: cover; object-position: center; width:300px; height:200px;" src="${
                  event.Image
              }" alt="Event Image" onerror="this.onerror=null;this.src='https://michigansbdc.org/wp-content/uploads/2021/06/Michigan_SBDC-LogoWhite.svg'; ">
          </div>
              <div class="event-details">
                  <div class="event-title">${event.Title}</div>
                  <div class="event-info"><strong>Date:</strong> ${
                      event.Date
                  }</div>
                  <div class="event-info"><strong>Time:</strong> ${convertTime(
                      event.Time
                  )}</div>
                  <div class="event-info"><strong>Location:</strong> ${
                      event.Location
                  }</div>
                  <a href="${
                      event.URL
                  }" class="btn btn-mod btn-small btn-round me-md-1" target="_blank">View Event</a>
              </div>
          `;
          return eventCard;
}
