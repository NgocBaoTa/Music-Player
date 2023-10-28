/** @format */

// 1.Render songs
// 2. Scroll top
// 3. Play / Pause / Seek
// 4. CD rotate
// 5. Next / Prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: "Đế Vương",
      singer: "Đình Dũng",
      // path: "http://soundimage.org/wp-content/uploads/2017/05/Nighttime-Escape.mp3",
      path: "./assets/audio/Đế Vương.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Dịu Dàng Em Đến",
      singer: "Erik & Ryan",
      path: "./assets/audio/Dịu Dàng Em Đến.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "La La La",
      singer: "Sam Smith",
      path: "./assets/audio/La La La.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Vẫn Sẽ Nhớ Em",
      singer: "Lâm Đạt Lãng",
      path: "./assets/audio/Vẫn Sẽ Nhớ EM.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Death Bed (Coffe For Your Head)",
      singer: "Powfu, beabadoobee",
      path: "./assets/audio/Death Bed (Coffee For Your Head).mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Backyard Boy",
      singer: "Claire Rosinkranz",
      path: "./assets/audio/Backyard Boy.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
    },
    {
      name: "Let Me Down Slowly",
      singer: "Alec Benjamin",
      path: "./assets/audio/Let Me Down Slowly.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
              <div style="cursor: pointer" class="song ${
                index === this.currentIndex ? "active" : ""
              }" data-index='${index}'>
                  <div class="thumb"
                      style="background-image: url(${song.image});">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      
                  </div>
              </div>
            `;
    });

    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  // All the evens will be call in this key
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Play/ Pause
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(-360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );

    cdThumbAnimate.pause();

    // Zoom in/ out
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.screenY;
      const newWidth = cdWidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    // When clicking play
    playBtn.onclick = function () {
      // Method 1
      // if (_this.isPlaying) {
      //   _this.isPlaying = false
      //   audio.pause()
      //   player.classList.remove('playing')
      // } else {
      //   _this.isPlaying = true
      //   audio.play()
      //   player.classList.add('playing')
      // }

      // Method 2
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      // When song is played
      audio.onplay = () => {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };

      // When song is paused
      audio.onpause = () => {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };

      // When the song tempo changes
      audio.ontimeupdate = () => {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      // Handle range input when the somg tempo changes  (use oninput instead of onchange)
      progress.oninput = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };
    };

    // When click next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollTopActiveSong();
    };

    // When click prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollTopActiveSong();
    };

    // Khi turn on/off random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Handle repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Handle next song when audio ended
    audio.onended = () => {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // When user clicks playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active )");
      if (songNode || e.target.closest(".option")) {
        // When click a song
        if (e.target.closest(".song:not(.active )")) {
          _this.currentIndex = Number(songNode.getAttribute("data-index"));
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  scrollTopActiveSong: function () {
    let view = "";
    if (this.currentIndex < 2) {
      view = "end";
    } else {
      view = "nearest";
    }

    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: view,
      });
    }, 300);
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Assign configuration
    this.loadConfig();

    // Define object's properties
    this.defineProperties();

    // Handle DOM Events
    this.handleEvents();

    // Load the first song in UI
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Display the initial state of the repeat and random buttons
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
