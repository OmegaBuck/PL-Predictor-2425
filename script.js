document.addEventListener('DOMContentLoaded', () => {
    const premierLeagueTeams = [
        "Arsenal", "Aston Villa", "AFC Bournemouth", "Brentford", "Brighton", 
        "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City", 
        "Liverpool", "Manchester City", "Manchester United", "Nottingham Forest", 
        "Southampton", "Tottenham Hotspur", "Wolves", "West Ham United", 
        "Newcastle United"
    ];

    const otherTeams = [
        "Sheffield Wednesday", "Burnley", "Blackburn Rovers", "West Bromwich Albion", 
        "Sunderland", "Oxford United", "Watford", "Middlesbrough", "Stoke City", 
        "Sheffield United", "Portsmouth", "Leeds United", "Bristol City", "Hull City", 
        "Millwall", "Coventry City", "Swansea City", "Queens Park Rangers", "Cardiff City", 
        "Norwich City", "Preston North End", "Luton Town", "Plymouth Argyle", 
        "Huddersfield Town", "Stockport County", "Lincoln City", "Wrexham", 
        "Bolton Wanderers", "Mansfield Town", "Crawley Town", "Charlton Athletic", 
        "Bristol Rovers", "Exeter City", "Stevenage", "Reading", "Birmingham City", 
        "Wycombe Wanderers", "Burton Albion", "Blackpool", "Barnsley", "Leyton Orient", 
        "Northampton Town", "Rotherham United", "Shrewsbury Town", "Wigan Athletic", 
        "Cambridge United", "Peterborough United", "Doncaster Rovers", "Gillingham", 
        "AFC Wimbledon", "Bromley", "Port Vale", "Cheltenham Town", "Bradford City", 
        "Barrow", "Fleetwood Town", "Walsall", "Swindon Town", "Chesterfield", 
        "Notts County", "Tranmere Rovers", "Newport County AFC", "Milton Keynes Dons", 
        "Crewe Alexandra", "Grimsby Town", "Morecambe", "Colchester United", 
        "Harrogate Town", "Salford City", "Accrington Stanley", "Carlisle United"
    ];

    const teamIds = {
        "Arsenal": "602",
        "Aston Villa": "603",
        "AFC Bournemouth": "600",
        "Brentford": "617",
        "Brighton": "618",
        "Chelsea": "630",
        "Crystal Palace": "642",
        "Everton": "650",
        "Fulham": "654",
        "Ipswich Town": "667",
        "Leicester City": "673",
        "Liverpool": "676",
        "Manchester City": "679",
        "Manchester United": "680",
        "Nottingham Forest": "692",
        "Southampton": "713",
        "Tottenham Hotspur": "728",
        "Wolves": "740",
        "West Ham United": "735",
        "Newcastle United": "688",
    };

    const allTeams = [...premierLeagueTeams, ...otherTeams];
    allTeams.sort();

    const list = document.getElementById('teams-list');

    // Clear the list first to prevent duplication
    list.innerHTML = '';

    // Create a style element for dynamic CSS
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    document.head.appendChild(styleElement);

    let cssRules = '';

    // Populate the list with sorted teams
    premierLeagueTeams.sort().forEach((team, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${team}`;
        listItem.draggable = true;
        listItem.setAttribute('data-team', team);
        listItem.setAttribute('clubId',teamIds[team]);
        list.appendChild(listItem);
     
        const teamLogoSrc = teamIds[team] ? `logos/${teamIds[team]}.png` : '';
        if (teamLogoSrc) {
            cssRules += `
                #teams-list li[data-team="${team}"] {
                    position: relative; /* Ensure positioning context for :after */
                    padding-right: 40px; /* Adjust based on the size of the logo */
                }
                #teams-list li[data-team="${team}"]:after {
                    content: "";
                    display: block;
                    width: 50px;
                    height: 50px;
                    background-image: url('${teamLogoSrc}');
                    background-size: cover;
                    position: absolute;
                    right: 10px; /* Space from the right edge */
                    top: 50%;
                    transform: translateY(-50%); /* Center vertically */
                }
            `;
        }
        });

        styleElement.innerHTML = cssRules;


    // Populate the dropdowns
    const faCupDropdown = document.getElementById('fa-cup-winner');
    const carabaoCupDropdown = document.getElementById('carabao-cup-winner');

    allTeams.forEach(team => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = team;
        option1.textContent = team;
        option2.value = team;
        option2.textContent = team;
        faCupDropdown.appendChild(option1);
        carabaoCupDropdown.appendChild(option2);
    });

    let draggingItem;

    // Dragging functionality
    list.addEventListener('dragstart', (e) => {
        draggingItem = e.target;
        e.target.classList.add('dragging');
    });

    list.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        draggingItem = null;
        updateListNumbers();  // Update numbers and styles after dragging
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggingItem);
        } else {
            list.insertBefore(draggingItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Function to update list numbers and apply styles
    function updateListNumbers() {
        const listItems = document.querySelectorAll('#teams-list li');
        const faCupWinner = faCupDropdown.value;
        const carabaoCupWinner = carabaoCupDropdown.value;

        let extraBronze = 0;

        if (isTeamInTop5(faCupWinner, listItems)) {
            extraBronze++;
        }
        if (isTeamInTop5(carabaoCupWinner, listItems)) {
            extraBronze++;
        }

        listItems.forEach((item, index) => {
            item.textContent = `${index + 1}. ${item.getAttribute('data-team')}`;
            item.className = '';  // Clear all classes

            // Apply styles based on position
            if (index === 0) {
                item.classList.add('rank-1');
            } else if (index >= 1 && index <= 3) {
                item.classList.add(`rank-${index + 1}`);
            } else if (index === 4) {
                item.classList.add('rank-5');
            } else if (index === 5 && extraBronze >= 1) {
                item.classList.add('rank-6');
            } else if (index === 6 && extraBronze === 2) {
                item.classList.add('rank-7');
            } else if (index >= 17) {
                item.classList.add(`rank-${index + 1}`);
            }
        });

        updateEuropeanQualifiers();  // Update European qualifiers
    }

    function isTeamInTop5(team, listItems) {
        for (let i = 0; i < 5; i++) {
            if (listItems[i].getAttribute('data-team') === team) {
                return true;
            }
        }
        return false;
    }

    function updateEuropeanQualifiers() {
        const listItems = document.querySelectorAll('#teams-list li');
        const faCupWinner = faCupDropdown.value;
        const carabaoCupWinner = carabaoCupDropdown.value;

        let championsLeague = [];
        let europaLeague = [];
        let conferenceLeague = [];

        // Top 4 qualify for Champions League
        for (let i = 0; i < 4; i++) {
            championsLeague.push(listItems[i].getAttribute('data-team'));
        }

        // 5th place qualifies for Europa League
        europaLeague.push(listItems[4].getAttribute('data-team'));

        // FA Cup winner Europa League qualification logic
        if (isTeamInTop5(faCupWinner, listItems)) {
            // 6th place qualifies for Europa League
            europaLeague.push(listItems[5].getAttribute('data-team'));
        } else {
            europaLeague.push(faCupWinner);
        }

        // Carabao Cup winner Conference League qualification logic
        if (isTeamInTop5(carabaoCupWinner, listItems)) {
            // 6th place or 7th place qualifies for Conference League
            if (!europaLeague.includes(listItems[5].getAttribute('data-team'))) {
                conferenceLeague.push(listItems[5].getAttribute('data-team'));
            } else {
                conferenceLeague.push(listItems[6].getAttribute('data-team'));
            }
        } else {
            conferenceLeague.push(carabaoCupWinner);
        }

        const championsText = championsLeague.join(', ');
        const europaLText = europaLeague.join(', ');
        const europaCText = conferenceLeague.join(', ');
        const championsDiv = document.getElementById('champions-league');
        const europaLDiv = document.getElementById('europa-league');
        const europaCDiv = document.getElementById('conference-league');

        championsDiv.innerHTML = championsText;
        europaCDiv.innerHTML = europaCText;
        europaLDiv.innerHTML = europaLText;
    }

    // Update the list numbers and European qualifiers when the cup winner dropdowns change
    faCupDropdown.addEventListener('change', () => {
        updateListNumbers(); // Triggers both list number updates and European qualifier updates
    });
    carabaoCupDropdown.addEventListener('change', () => {
        updateListNumbers(); // Triggers both list number updates and European qualifier updates
    });

    // Initial styling based on the initial order
    updateListNumbers();

    // Save as image
    document.getElementById('save-button').addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        const listItems = document.querySelectorAll('#teams-list li');
        const faCupWinner = document.getElementById('fa-cup-winner').value;
        const carabaoCupWinner = document.getElementById('carabao-cup-winner').value;
    
        // Determine European qualification
        let championsLeague = [];
        let europaLeague = [];
        let conferenceLeague = [];
    
        // Top 4 qualify for Champions League
        for (let i = 0; i < 4; i++) {
            championsLeague.push(listItems[i].getAttribute('data-team'));
        }
    
        // 5th place qualifies for Europa League
        europaLeague.push(listItems[4].getAttribute('data-team'));
    
        // FA Cup winner Europa League qualification logic
        if (isTeamInTop5(faCupWinner, listItems)) {
            // 6th place qualifies for Europa League
            europaLeague.push(listItems[5].getAttribute('data-team'));
        } else {
            europaLeague.push(faCupWinner);
        }
    
        // Carabao Cup winner Conference League qualification logic
        if (isTeamInTop5(carabaoCupWinner, listItems)) {
            // 6th place or 7th place qualifies for Conference League
            if (!europaLeague.includes(listItems[5].getAttribute('data-team'))) {
                conferenceLeague.push(listItems[5].getAttribute('data-team'));
            } else {
                conferenceLeague.push(listItems[6].getAttribute('data-team'));
            }
        } else {
            conferenceLeague.push(carabaoCupWinner);
        }
    
        // Prepare the HTML structure for the image
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'inline-block';
        tempDiv.style.width = '1400px';
        tempDiv.style.height = '1600px';
        tempDiv.style.overflow = 'hidden';
        tempDiv.style.padding = "30px";
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.fontFamily = "'Roboto', sans-serif";
        tempDiv.style.color = '#37003c';
        tempDiv.style.backgroundColor = '#f6f6f6';
        tempDiv.style.backgroundImage = "url('logos/pattern.jpg')";
        tempDiv.style.backgroundSize = "cover";
    
        tempDiv.innerHTML = `
            <style>
            h1 {
                font-size: 50px;
                width: 600px !important;
                background-size: cover !important;
                display: block !important;
                position: relative !important;
                background: transparent !important;
            }
            #teams-list {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 0;
                flex-direction: column;
                margin: 0;
                list-style: none;
            }
            #teams-list li {
                font-size: 20px;
                font-weight: bold;
                width: 23%; /* Adjusted to fit four items per row with spacing */
                height: 80px;
                margin-bottom: 10px; /* Space between rows */
                box-sizing: border-box;
            }
            #teams-list li:after {
                content: '';
                display: block;
                width: 100px;
                height: 100px;
                background-size: 200%;
            }
             </style>
            <div style="width: 100%; background-size: 100%;">
            <h2 style="font-size: 80px; color: white;"><strong>My 2024/25 Season Predictions</strong></h2>
            <h2 style="font-size: 60px; color: white;"><strong>Premier League</strong></h2>
            <ul id="teams-list" style="display:flex; flex-direction: row;">${list.innerHTML}</ul>
            </div>
            <div id="id="european-qualifications" style="width: 100%; background-size: 100%; background-image:url(''https://fantasy.premierleague.com/static/media/pattern-2-d.0a64c7c7.png');">           
            <h2 style="font-size: 60px; color: white;"><strong>Domestic Cup Winners</strong></h2>
            <div class="qualified"><p style="margin: 5px 0; font-size:30px; color: black;"><strong>FA Cup Winner:</strong> ${faCupWinner}</p></div>
            <div class="qualified"> <p style="margin: 5px 0; font-size:30px; color: black;"><strong>Carabao Cup Winner:</strong> ${carabaoCupWinner}</p></div>
            </div>
            <div id="id="european-qualifications">
            <h2 style="font-size: 60px; color: white;"><strong>European Qualifications</strong></h2>
            <div class="qualified"><div class="img-container"><img  src="logos/CL.png" style="width: 50px; height: auto;"/></div> <span id="champions-league" style="font-size: 30px; color: black;">Champions League: ${championsLeague.join(', ')}</span></div>
            <div class="qualified"><div class="img-container"><img  src="logos/EL.svg" style="width: 50px; height: auto;"/></div> <span id="europa-league" style="font-size: 30px; color: black;">Europa League: ${europaLeague.join(', ')}</span></div>
            <div class="qualified"><div class="img-container"><img  src="logos/UCL.png"  style="width: 50px; height: auto;"/></div> <span id="conference-league" style="font-size: 30px; color: black;">Europa Conference League: ${conferenceLeague.join(', ')}</span></div>
    
            </div>
           
        `;
    
        // Use html2canvas to convert the tempDiv to an image
        document.body.appendChild(tempDiv);
        html2canvas(tempDiv).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'premier-league-prediction.png';
            link.click();
            document.body.removeChild(tempDiv); // Clean up the temporary div
        });
    });
    });
