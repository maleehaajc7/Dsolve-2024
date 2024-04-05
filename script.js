const searchButton = document.getElementById('searchButton');
const accommodationList = document.getElementById('accommodationList');

searchButton.addEventListener('click', () => {
  console.log('Fetching accommodations...');
  fetch('http://127.0.0.1:3000/api/accommodations')
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
  data.forEach(accommodation => {
    const div = document.createElement('div');
    div.textContent = `ID: ${accommodation.id}, Name: ${accommodation.name}, Rent: ${accommodation.rent}`;
    accommodationList.appendChild(div);
  });
}