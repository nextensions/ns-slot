const readline = require("readline");
const fs = require("fs");
const axios = require("axios");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What is school id ? ", schoolID => {
  const path = `/data/${schoolID}`;
  rl.question("What do you need data type ? (json/image) : ", async type => {
    if (type == "json") {
      // save json
      let styles = "";
      const { data: res } = await axios.get(
        "http://localhost:8086/v1/student/get-info?school_id=28"
      );
      res.map(i => {
        styles += `.slot-${i.id} {background-image: url(./data/${schoolID}/img/${i.id}.jpg);display: block;margin: 0 auto;height: 116px;width: auto;}`;
      });
      const now = new Date(Date.now()).toISOString();
      fs.writeFileSync(`.${path}/css/${now}.css`, JSON.stringify(styles));
      fs.writeFileSync(`.${path}/style.css`, JSON.stringify(styles));

      fs.writeFileSync(`.${path}/json/${now}.json`, JSON.stringify(res));
      fs.writeFileSync(`.${path}/data.json`, JSON.stringify(res));

      console.log(`Download json and save here : .${path}/data/.json`);

      rl.close();
    } else if (type == "image") {
      // save img
      const url =
        "https://s3-ap-southeast-1.amazonaws.com/nextschool.com/students/";
      //   const lastJson = fs.readdirSync(`./data/${schoolID}/json`).reverse()[0];
      const studentInfo = JSON.parse(
        fs.readFileSync(`.${path}/data.json`, "utf8")
      );

      const res = studentInfo.map(async ({ image, id }, index) => {
        const res = await axios({
          method: "get",
          url: url + image,
          responseType: "stream"
        });
        return res.data.pipe(
          fs.createWriteStream(`./data/${schoolID}/img/${id}.jpg`)
        );
      });
      console.log(res);
      Promise.all(res).then(() => {
        console.log(`Download json and save here : /data/${schoolID}/img/`);
        rl.close();
      });
    } else {
      console.log(`You don't choose anything`);
      rl.close();
    }
  });
});
