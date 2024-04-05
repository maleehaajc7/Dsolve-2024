const searchButton = document.getElementById('searchButton');
const accommodationList = document.getElementById('accommodationList');
const searchInput = document.getElementById('searchInput');
const amenitiesFilter = document.getElementById('amenitiesFilter');
const typeFilter = document.getElementById('typeFilter');
const genderFilter = document.getElementById('genderFilter');
const messFilter = document.getElementById('messFilter');

searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value;
  const amenitiesValue = amenitiesFilter.value;
  const typeValue = typeFilter.value;
  const genderValue = genderFilter.value;
  const messValue = messFilter.value;

  const queryParams = new URLSearchParams({
    amenities: amenitiesValue,
    type: typeValue,
    gender: genderValue,
    mess: messValue,
  });

  if (searchTerm) {
    queryParams.append('search', searchTerm);
  }

  const url = `http://127.0.0.1:3000/api/accommodations?${queryParams.toString()}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayAccommodations(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

function displayAccommodations(data) {
  accommodationList.innerHTML = '';

  if (data.length === 0) {
    accommodationList.innerHTML = '<p>No accommodations found.</p>';
    return;
  }

  const list = document.createElement('ul');

  data.forEach(accommodation => {
    const item = document.createElement('li');
    const detailsLink = document.createElement('a');
    detailsLink.href = `/accommodations/${accommodation.id}`;
    detailsLink.textContent = `${accommodation.name} - ${accommodation.rent}`;
    item.appendChild(detailsLink);
    list.appendChild(item);
  });

  accommodationList.appendChild(list);
}