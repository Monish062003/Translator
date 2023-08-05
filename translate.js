const inputbox1 = document.getElementById("inputlang");
const outputbox1 = document.getElementById("outputlang");
const textspace = document.getElementById("textparah");
const btn1 = document.getElementsByTagName("button")[0];
const select = document.getElementById("selection");
const micpicbtn= document.getElementById("micimg");
const volpicbtn=document.getElementById("volimg");

let micon="./images/microphone.png";
let micoff="./images/microphoneoff.png";
let volon="./images/volumeon.png"
let voloff="./images/volumeoff.png";

let optionvalue="en"
let optionchanged=()=>{
  optionvalue=select.value;
}

let synth=speechSynthesis;
const utterance = new SpeechSynthesisUtterance("Hello everyone, Monish by this side. I built a google translator by combining 3 a p i's by google using vanilla j s for backend along with other frontend languages such as Html and Css along with tailwind css. I Hope you like my webpage.");
synth.speak(utterance);

window.SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

let speechrecognitionon=(()=>{
    recognition.start();
    recognition.interimResults = true;
    recognition.continuous= true;
    
    recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
    
    inputbox1.value = transcript;
    });  
})

recognition.onend = function() {
  micpicbtn.setAttribute('src',micoff);
};

let micimage=(()=>{
  if((micpicbtn.getAttribute('src')==micon)?true:false)
  {
    micpicbtn.setAttribute('src',micoff);
    recognition.stop();
  }
  else
  {
    micpicbtn.setAttribute('src',micon);
    speechrecognitionon();
  }

})


let volimage=(()=>{

  let synth=speechSynthesis;
  if((volpicbtn.getAttribute('src')==volon)?true:false)
  {
    volpicbtn.setAttribute('src',voloff);
    synth.pause()
  }
  else
  {
    volpicbtn.setAttribute('src',volon);
    synth.paused? synth.resume():synth.speak(utterance);
  }

})
setInterval(() => {
  if (speechSynthesis.speaking==false) {
    volpicbtn.setAttribute('src',voloff);
  }
}, 0);

let foptionsvalue=async()=>{
  const url2 = 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages';
  const options2 = {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': 'b17baa4412msha7614889e3fdf4cp105810jsn07a8ffcc8f8b',
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url2, options2);
    const result = await response.json();
    let length=result['data']['languages'].length;
    let options=document.createElement('option');
    options.innerHTML=result['data']['languages'][25]['language'];
    select.appendChild(options);

    for (let index = 0; index < length; index++) {
      if (index==25) {
        continue;
      }
      let options=document.createElement('option');
      options.innerHTML=result['data']['languages'][index]['language'];
      options.setAttribute('value',`${options.innerHTML}`)
      options.setAttribute('style',`color:black`)
      select.appendChild(options);
    }

  } catch (error) {
    console.error(error);
  }
}

foptionsvalue()

let detecttranslate = async () => {
  const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': 'b17baa4412msha7614889e3fdf4cp105810jsn07a8ffcc8f8b',
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    body: new URLSearchParams({
      q: inputbox1.value
    })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    textspace.innerHTML = "The language detected is : " + (result['data']['detections'][0][0]['language']).toUpperCase();

    try {
      let translate = async () => {
          const url1 = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
          const options1 = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': 'b17baa4412msha7614889e3fdf4cp105810jsn07a8ffcc8f8b',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            body: new URLSearchParams({
              q: inputbox1.value,
              target: optionvalue,
              source: result['data']['detections'][0][0]['language']
            })
        };

        try {
          const response = await fetch(url1, options1);
          const result = await response.json();
          outputbox1.value = result['data']['translations'][0]['translatedText'];
        } catch (error) {
          console.error(error);
        }
      }

      translate()
    } catch (error) {
      alert(error.name + " Spotted bro")
    }

  } catch (error) {
    console.error(error);
  }
}

select.addEventListener('change',optionchanged)
micpicbtn.addEventListener('click', micimage)
btn1.addEventListener('click', detecttranslate)
volpicbtn.addEventListener('click', volimage)