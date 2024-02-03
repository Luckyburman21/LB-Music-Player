import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause,faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons';

import MusicIMG from "./image/music1.gif";

// getting all music data from localStorage
var mydata=false;
function getLSD() 
{
      const data = JSON.parse(localStorage.getItem("myaudio"));
      if (data){
       if(data.length>0)
       {
        mydata=true;
       }
       return data;
       
      }
      else
      {
        return [];
      } 
}

//getting Last Playing Audio index and time from LocalStorage
function getLastAudio() 
{
  const data = JSON.parse(localStorage.getItem("lastaudio"));
  if (data) {
    if(mydata)
    {
      return data;
    }else 
    {
      return { index: 0, time: 0 };
    }
   
  } 
}


function AudioPlayer() {

  const [allfiles, setAllFiles] = useState(getLSD());
  const [currplay, setCurrplay] = useState(getLastAudio());
  const [isPlaying, setIsPlaying] = useState(false);
  const audioref = useRef(null);


  //function to play current Audio
  function playsong() 
  {
    audioref.current.addEventListener("canplay", () => {
      audioref.current.play();
    });
  }

//choose file button handler
  const addmusic = () => {
    document.querySelector("#file").click();
  };

  //getting user files and store in allfiles
  const handlechange = (e) => {

    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataURL = e.target.result;

        const obj = {
          name: file.name,
          url: dataURL,
        };

        setAllFiles((prevData) => [...prevData, obj]);

      };
      reader.readAsDataURL(file);
    });
  };

  //function for play playlist audio which will run onClick li 
  const playthis = (index) => {
    setCurrplay({ index: index, time: 0 });
    setIsPlaying(true);
    playsong();
  };

  //function to traverce playlist backward
  const backfun = () => {
    if (allfiles.length !== 0) {
      if (currplay.index !== 0) {
        setCurrplay({ index: currplay.index - 1, time: 0 });
        setIsPlaying(true);
        playsong();
      }
    }
  };

   //function to traverce playlist forward
  const nextfun = () => {
    if (allfiles.length !== 0) {
      if (currplay.index === allfiles.length - 1) {
        setCurrplay({ index: 0, time: 0 });
        playsong();
        setIsPlaying(true);
      } else {
        setCurrplay({ index: currplay.index + 1, time: 0 });
        playsong();
        setIsPlaying(true);
      }
    }
  };

   //function to toggle play pause button and icon

  const togglePlayPause = () => {
if(allfiles.length>0){
  if (audioref.current) {
    if (audioref.current.paused) {
      setIsPlaying(true);
      audioref.current.play();
    } else {
      audioref.current.pause();
      setIsPlaying(false);
    }
  }
};
}
   


//setting allfiles in LocalStorage
  useEffect(() => {
    localStorage.setItem("myaudio", JSON.stringify(allfiles));
  }, [allfiles]);

  //setting last playing audio index and time in localstorage when window is close
  window.addEventListener("beforeunload", () => {
    const currTime=document.querySelector("audio").currentTime;
    const obj = {
      index: currplay.index,
      time: currTime,
    };
    localStorage.setItem("lastaudio", JSON.stringify(obj));
  });

//setting data in state when component load or re-render
  useEffect(() => {
    if (allfiles.length === 0) {
      setCurrplay({ index: 0, time: 0 });
      localStorage.setItem("lastaudio", JSON.stringify({index:0,time:0}));
    }

    if (currplay.time !== 0) {
      audioref.current.currentTime = currplay.time;
    }

    audioref.current.addEventListener("play", () => {
      setIsPlaying(true);
    });

    audioref.current.addEventListener("pause", () => {
      setIsPlaying(false);
    });
  }, [allfiles]);
 

 
  return (
    <>
      {/* main container start*/}
      <div className="container">

        <header>
          <h2>ℒℬ ℳ𝓊𝓈𝒾𝒸 𝒫𝓁𝒶𝓎ℯ𝓇</h2>
        </header>

        <main>

          <section className="audio">
            <div className="audio-box">

        {/* current audio name as title */}
            <div className="curraudio">
              <p>{allfiles.length > 0 ? allfiles[currplay.index].name:""}</p>
            </div>

            {/* music gif */}
              <img src={MusicIMG} alt="music-logo" />

            {/* total length of playlist and current playing item index */}
              <p>{`${allfiles.length > 0 ? currplay.index + 1 : currplay.index}/${allfiles.length}`}</p>


            {/* audio control buttons div */}
            <div className="btn-div">

                <button onClick={backfun}>
                <FontAwesomeIcon icon={faStepBackward} />
                </button>

                <button onClick={() => {togglePlayPause();}}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>

                <button onClick={nextfun}>
                <FontAwesomeIcon icon={faStepForward} />
                </button>

              </div>

              <audio ref={audioref} src={allfiles.length > 0 ? allfiles[currplay.index].url : ""} preload="metadata" controls onEnded={nextfun}>
             
              </audio>

            </div>
          </section>
{/* audio section end */}

          <section className="add-music">

           {/* button to add files */}
            <button onClick={addmusic}>
              {allfiles.length > 0 ? "Add More Music" : "Add Music"}
            </button>

           {/* hidden input file */}
            <input
              id="file"
              type="file"
              accept="audio/*"
              onEnded={nextfun}
              onChange={handlechange}
              multiple
              style={{ display: "none" }}
            />
          </section>


          <section className="playlist">
            <h2>✧･ﾟ: Your Playlist :･ﾟ✧</h2>

            {allfiles.length > 0 ? (

              <ol>
                {allfiles.map((curr, index) => {
                  return (

                    <li key={index}
                   className={currplay.index===index?"selected-music":""}
                     onClick={() => playthis(index)}>
                      <span>{curr.name}</span>
                    </li>

                  );
                })}
              </ol>
            ) : (
              <div className="empty-playlist">
              <h3>no music added</h3>
              </div>
              
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default AudioPlayer;
