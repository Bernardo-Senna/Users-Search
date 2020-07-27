/*Variables*/
let tabPeople = document.querySelector('#tabPeople');
let tabStatistics = document.querySelector('#tabStatistics')
let inputName = document.querySelector('#inputName');
let searchButton = document.getElementById('searchButton');

let allPeople = [];
let filteredPeople = [];

let statistics = {
  Men: 0,
  Women: 0,
  SumAges: 0,
  AverageAge: 0.0,
};

addEventListener('load', () => {
  inputName.addEventListener('keyup', btnSearch);
  searchButton.addEventListener('click', filterPeople);

  fetchPeople();
});

//Asynchronous fetch function:
async function fetchPeople() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();

  allPeople = json.results.map((person) => {
    return {
      name: `${person.name.first} ${person.name.last}`,
      gender: person.gender,
      age: person.dob.age,
      picture: person.picture.medium,
    };
  });

  render();
}

function render() {
  renderStatistics();
  renderPeople();
}

const btnSearch = (e) => {
  if (inputName.value.length) {
    searchButton.disabled = false;
  } else {
    searchButton.disabled = true;
  }

  if (e.key === 'Enter' && inputName.value.length > 0) {
    filterPeople();
  }
};

const filterPeople = () => {
  filteredPeople = allPeople.filter(
    (person) =>
      person.name.toLowerCase().search(inputName.value.toLowerCase()) !==
      -1
  );
  filteredPeople.sort((a, b) => a.name.localeCompare(b.name));

  render();
};

function renderPeople() {
  let peopleHTML = `<div>`;
  if (filteredPeople.length > 0) {
    peopleHTML += `<h4>People found: ${filteredPeople.length}</h4>`;

    filteredPeople.forEach((person) => {

      const { name, picture, age } = person;

      const personHTML = `      
      <div class='people-found'>      
        <div>
          <img class="people-picture" src="${picture}" alt="photo">
        </div>
        <div class="people-name-age">
          <a>${name}, ${age} </a>
        </div>
      </div> 
      `;
      peopleHTML += personHTML;
    });
  } else {

    const personHTML = `<h4>No people found!</h4>`;

    peopleHTML += personHTML;
  }
  peopleHTML += `</div>`;

  tabPeople.innerHTML = peopleHTML;
}

const renderStatistics = () => {
  tabStatistics.innerHTML = '';

  if (filteredPeople.length <= 0) {
    statistics.Men = 0;
    statistics.Women = 0;
    statistics.SumAges = 0;
    statistics.AverageAge = 0.0;
  } else {
    statistics.Men = filteredPeople.filter(
      (person) => person.gender === 'male'
    ).length;
    statistics.Women = filteredPeople.filter(
      (person) => person.gender === 'female'
    ).length;
    statistics.SumAges = filteredPeople.reduce(
      (acc, nextPerson) => (acc += nextPerson.age),
      0
    );
    statistics.AverageAge = (
      statistics.SumAges / filteredPeople.length
    ).toFixed(2);
  }

  tabStatistics.innerHTML += `
    <div class='statistics'>
      <span><strong>Men: </strong>${statistics.Men}</span><br />
      <span><strong>Women: </strong>${statistics.Women}</span><br />
      <span><strong>Summatory ages: </strong>${statistics.SumAges}</span><br />
      <span><strong>Average ages: </strong>${statistics.AverageAge}</span>
    </div>
  `;
};