import styles from "../styles/Home.module.scss";
import ReactAudioPlayer from 'react-audio-player';
import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import Login from '../pages/login/index'



export default function Home() {


  // console.log(listSong);

  const [listSong, setListSong] = useState([])
  const [currentSong, setCurrentSong] = useState('')
  const [search, setSearch] = useState('')
  const [isPlay, setIsPlay] = useState(true)

  const [page, setPage] = useState([])

  const [idPage, setIdPage] = useState(1)

  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    let token = localStorage.getItem('keyZing');
    if (token) {
      setIsLogin(true)
    }
  }, [])

  useEffect(() => {
    axios
      .get(`https://zing-be.onrender.com/api/listsong/page/1`)
      .then(res => setPage(res.data))
      .catch((err) => {
        console.log(err);
      })
  }, [])

  useEffect(() => {
    axios
      .get("https://zing-be.onrender.com/api/listsong")
      .then(res => setListSong(res.data))
      .catch((err) => {
        console.log(err);
      })
  }, [])


  const handlePlay = (id) => {

    axios.get(`https://zing-be.onrender.com/api/listsong/${id}`)
      .then(res => {
        setCurrentSong(res.data)
      })
      .catch(error => {
        console.log(error);
      });

    setSearch('')

  }

  const handleStepDown = () => {

    listSong.map((item, index) => {

      if (item._id == currentSong[0]._id) {
        if (index == 0) {
          index = listSong.length
        }
        let id = listSong[index - 1]._id
        axios.get(`https://zing-be.onrender.com/api/listsong/${id}`)
          .then(res => {
            setCurrentSong(res.data)
          })
          .catch(error => {
            console.log(error);
          });

      }
    })

    document.getElementById('currentImg').style.animationPlayState = 'running'
  }

  const handleStepUp = () => {

    listSong.map((item, index) => {



      if (item._id == currentSong[0]._id) {

        if (index == listSong.length - 1) {
          index = 0
          let id = listSong[index]._id
          axios.get(`https://zing-be.onrender.com/api/listsong/${id}`)
            .then(res => {
              setCurrentSong(res.data)
            })
            .catch(error => {
              console.log(error);
            });

        }

        let id = listSong[index + 1]._id

        axios.get(`https://zing-be.onrender.com/api/listsong/${id}`)
          .then(res => {
            setCurrentSong(res.data)
          })
          .catch(error => {
            console.log(error);
          });




      }
    })

  }

  const handlePause = () => {

    if (isPlay == false) {
      document.getElementById('currentAudio').play()
      setIsPlay(true)
      document.getElementById('currentImg').style.animationPlayState = 'running'
    }
    if (isPlay == true) {
      document.getElementById('currentAudio').pause()
      setIsPlay(false)
      document.getElementById('currentImg').style.animationPlayState = 'paused'
    }


  }

  const handlRandom = () => {
    const random = Math.floor(Math.random() * listSong.length)
    axios.get(`https://zing-be.onrender.com/api/listsong/${listSong[random]._id}`)
      .then(res => {
        setCurrentSong(res.data)
      })
      .catch(error => {
        console.log(error);
      });

  }

  const handleRePlay = () => {
    document.getElementById('currentAudio').currentTime = 0
  }

  const handleChangePage = (page) => {
    setIdPage(page)
    axios
      .get(`https://zing-be.onrender.com/api/listsong/page/${page}`)
      .then(res => setPage(res.data))
      .catch((err) => {
        console.log(err);
      })
  }


  let boxSearch = []
  listSong.map((item) => {
    let check = item.name.toLowerCase().includes(search.toLowerCase())
    if (check == true) {
      boxSearch.push(item)
    }
  })





  return (
    <div>
      {isLogin ? (
        <div className={styles.parent}>
          <div className={styles.container}>

            <Head>
              <title>Zing</title>
              <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"></link>
            </Head>

            <div className={styles.search}>
              <input
                placeholder="Enter my song ... ?"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              {boxSearch.length > 0 && boxSearch.length < listSong.length ? (
                <div className={styles.listSearch}>
                  <ul>
                    {boxSearch.map((item, index) => {
                      return (
                        <li onClick={() => handlePlay(item._id)} key={index}>
                          <img src={item.img} />
                          <small>{item.name}</small>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : ('')}
            </div>

            {currentSong.length > 0 ? (
              <div className={styles.showSong}>
                <h4>Now playing: {currentSong[0].date}</h4>
                <img id="currentImg" className={styles.currentImg} src={currentSong[0].img} />
                <br></br>
                <ReactAudioPlayer
                  id="currentAudio"
                  src={currentSong[0].url}
                  autoPlay
                  controls
                />
                <br></br>
                <div className={styles.stepSong}>
                  <i onClick={handleRePlay} className="fa-solid fa-rotate-right "></i>
                  <i onClick={handleStepDown} className="fa-solid fa-backward-step "></i>
                  <i onClick={handlePause} className="fa-solid fa-circle-play "></i>
                  <i onClick={handleStepUp} className="fa-solid fa-forward-step "></i>
                  <i onClick={handlRandom} className="fa-solid fa-shuffle "></i>
                </div>
              </div>

            ) : (
              <div className={styles.showSong}>

                <h4>Welcome To Zing.Mp3</h4>
                <img
                  className={styles.currentImg}
                  src='https://static-zmp3.zmdcdn.me/skins/common/logo600.png'
                />
                <br></br>
                <div className={styles.stepSong}>
                  <i className="fa-solid fa-rotate-right "></i>
                  <i className="fa-solid fa-backward-step "></i>
                  <i className="fa-solid fa-circle-play "></i>
                  <i className="fa-solid fa-forward-step "></i>
                  <i className="fa-solid fa-shuffle "></i>
                </div>
              </div>
            )}


            <div className={styles.songList}>
              {page.map((item, index) => {
                return (
                  <div key={index}>
                    {currentSong && currentSong[0]._id == item._id ? (

                      <div style={{ backgroundColor: 'pink' }} className={styles.itemSong}>
                        <img onClick={() => handlePlay(item._id)} src={item.img} />
                        <div>
                          <p>{item.name}</p>
                          <small>{item.author}</small>
                        </div>
                      </div>

                    ) : (

                      <div className={styles.itemSong}>
                        <img onClick={() => handlePlay(item._id)} src={item.img} />
                        <div>
                          <p>{item.name}</p>
                          <small>{item.author}</small>
                        </div>
                      </div>

                    )}
                  </div>
                )
              })}
            </div>

            <div className={styles.page}>
              {listSong.map((item, index) => {

                return (
                  <div key={index}>
                    {index < (listSong.length / 2) ? (
                      <>
                        {index + 1 == idPage ? (
                          <span>
                            <button style={{ backgroundColor: '#af6fe8', color: 'white' }} onClick={() => handleChangePage(index + 1)} >{index + 1}</button>
                          </span>
                        ) : (
                          <span>
                            <button onClick={() => handleChangePage(index + 1)} >{index + 1}</button>
                          </span>
                        )}
                      </>
                    ) : ('')}
                  </div>
                )

              })}
            </div>

          </div >
        </div>
      ) : (<Login />)}
    </div>
  );
}
