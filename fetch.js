(async () => {
  // fetch data
  const { data: studentsInfo } = await axios.get("./data/28/data.json");
  const { data: styles } = await axios.get("./data/28/style.css");
  const { data: event } = await axios.get(
    `https://rest.nextschool.io/v1/student/all-event?school_id=${28}`
  );
  const regex = /\?id=(\d+)/;
  const foundParam = window.location.search.match(regex);

  let clockin = [];
  if (foundParam) {
    const { data } = await axios.get(
      `https://rest.nextschool.io/v1/student/event-clockin?id=${foundParam[1]}`
    );
    clockin = data;
  } else {
    const { data } = await axios.get(
      `https://rest.nextschool.io/v1/student/clockin-today?school_id=${28}`
    );
    clockin = data;
  }

  // get node
  const eventList = document.querySelector("#eventList");
  const btnShuffle = document.querySelector("#casinoShuffle");
  const btnReset = document.querySelector("#playerReset");

  // create event radio button
  createEvent(0, "นักเรียนที่มาเรียน", eventList);
  if (event.length) {
    const topic = document.querySelector("#topic");
    topic.style.cssText = "display: block;";
    event.map(({ id, name }) => {
      createEvent(id, name, eventList, foundParam);
    });
  }

  // matching
  let match = [];
  const casino1 = document.querySelector("#casino1");

  clockin.map(({ student_id }) => {
    const div = document.createElement("div");
    div.className = `slot student_profile_img slot-${student_id}`;
    casino1.appendChild(div);
  });

  // inject css
  var style = document.createElement("style");
  style.innerHTML = styles;
  var ref = document.querySelector("script");
  ref.parentNode.insertBefore(style, ref);

  // render player
  if (clockin.length) {
    setTimeout(function() {
      btnShuffle.removeAttribute("disabled");
      btnShuffle.removeChild(btnShuffle.firstElementChild);
    }, (clockin.length / 110).toFixed() * 1000);
  }
  const player = document.querySelector("#player");
  player.innerHTML = clockin.length;
  const totalPlayer = document.querySelector("#totalPlayer");
  totalPlayer.innerHTML = studentsInfo.length;

  const randomDetail = document.querySelector("#randomDetail");
  const matchPlayer = document.querySelector("#matchPlayer");

  // create slot
  const mCasino1 = new SlotMachine(casino1, {
    active: 0,
    delay: 5000,
    onComplete: function(res) {
      const studentID = clockin[res].student_id;
      const { fullname, code, room_name, id } = studentsInfo.find(
        ({ id }) => id == studentID
      );
      if (match.find(item => item == id)) {
        this.run();
      } else {
        match.push(id);
        randomDetail.innerHTML = `${fullname} ${code} ${room_name}`;
        setSumMatchPlayer(match.length);
        createRowPlayer(match, code, fullname, room_name, matchPlayer);
      }
    }
  });

  // add event to shuffle button
  btnShuffle.addEventListener("click", () => {
    mCasino1.shuffle(0, function() {
      btnReset.removeAttribute("disabled");
    });
    randomDetail.innerHTML = "";
  });

  // add event to reset button
  btnReset.addEventListener("click", () => {
    match = [];
    setSumMatchPlayer(0);
    const matchPlayer = document.querySelector("#matchPlayer");
    resetRowPlayer(matchPlayer);
    randomDetail.innerHTML = "";
    btnReset.setAttribute("disabled");
  });
})();

const handleEvent = i => {
  if (i) {
    return (window.location.href = `/?id=${i}`);
  }
  return (window.location.href = "/");
};

const createEvent = (id, name, node, param) => {
  const div = document.createElement("div");
  const input = document.createElement("input");
  input.setAttribute("type", "radio");
  input.setAttribute("id", `event${id}`);
  input.setAttribute("name", `event`);
  input.setAttribute("onchange", `handleEvent(${id})`);

  if ((param && param[1] == id) || id == 0) {
    input.setAttribute("checked", "true");
  }

  const label = document.createElement("label");
  label.setAttribute("for", `event${id}`);
  label.setAttribute("style", `margin-left: 6px;`);
  label.innerHTML = " " + name;

  div.appendChild(input);
  div.appendChild(label);
  node.appendChild(div);
};

const createRowPlayer = (match, code, fullname, room_name, tbody) => {
  const row = document.createElement("tr");

  const no = document.createElement("th");
  no.setAttribute("scope", "row");
  no.innerHTML = match.length;
  no.className = `text-center`;

  const codeStudent = document.createElement("td");
  codeStudent.innerHTML = code;
  codeStudent.className = `text-center`;

  const name = document.createElement("td");
  name.innerHTML = fullname;

  const classroom = document.createElement("td");
  classroom.innerHTML = room_name;
  classroom.className = `text-center`;

  row.appendChild(no);
  row.appendChild(codeStudent);
  row.appendChild(name);
  row.appendChild(classroom);
  tbody.appendChild(row);
};

const resetRowPlayer = tbody => {
  let child = tbody.lastElementChild;
  while (child) {
    tbody.removeChild(child);
    child = tbody.lastElementChild;
  }
};

const setSumMatchPlayer = sum => {
  const matchPlayerSum = document.querySelector("#matchPlayerSum");
  matchPlayerSum.innerHTML = sum;
};
