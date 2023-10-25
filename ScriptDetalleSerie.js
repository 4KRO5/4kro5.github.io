const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      username: localStorage.getItem("username"),
      tvSerie: [],
      casting: [],
      images: [],
      keyword: [],
      recomendation: [],
      rating: "0.5",
      rateStatus: false,
      favStatus: false,
      totalReviews: "",
      review: null,
      reviewContenido: "",
      readMore: false,
      autor: "",
      imgAutor: null,
      dateReview: "",
      yearReview: "",
      sseasons: null,
      dateSeason: "",
      numbSeason: "",
      ovSeason: "",
      yearSeason: "",
      countEpisode: "",
      imgSeason: "",
      nameSeason: "",
      numbSeason: 0,
      userId: "",
      mediaStatus: "popular",
      videos: "",
      backdrops: null,
      posters: null,
      mediaPopular: null,
      mediaCount: [{ videos: 0, backdrops: 0, posters: 0 }],
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("username");
      window.location = "login.html";
    },

    getIdGenre(idGenre) {
      window.location.href =
        "detailGenre.html?genre_id=idGenre.id&type=tv&sort_by=popularity&order=desc";
    },
    addRate() {
      var data = new FormData();
      data.append("value", app.rating);

      var config = {
        method: "post",
        url: "https://api.themoviedb.org/3/tv/" + app.tvSerie.id + "/rating",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          app.rateStatus = true;
          console.log("Se añadio la calificacion: " + app.rateStatus);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    deleteRate() {
      var config = {
        method: "delete",
        url: "https://api.themoviedb.org/3/tv/" + app.tvSerie.id + "/rating",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
        },
      };

      axios(config)
        .then(function (response) {
          app.rateStatus = false;
          console.log("Se elimino la calificacion: " + app.rateStatus);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    favorites(tof) {
      var data = new FormData();
      data.append("media_type", "tv");
      data.append("media_id", app.tvSerie.id);
      data.append("favorite", tof);

      var config = {
        method: "post",
        url: "https://api.themoviedb.org/3/account/14738749/favorite",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          app.favStatus == false
            ? (app.favStatus = true)
            : (app.favStatus = false);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mediaChange(m) {
      app.mediaStatus = m;
    },
  },
  mounted() {
    if (!localStorage.username) {
      location.href = "login.html";
    }
    //////////////////////////////////////////////// DETALLE SERIE ////////////////////////////////////////////////
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var tvId = urlParams.get("id");

    var config = {
      method: "get",

      url: "https://api.themoviedb.org/3/tv/" + tvId + "?language=en-US",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        app.tvSerie = response.data;
        var access = app.tvSerie.seasons.map(function (r) {
          app.sseasons = r;
        });
        app.dateSeason = app.sseasons.air_date.substring(0, 10);
        app.yearSeason = app.sseasons.air_date.substring(0, 4);
        if (app.dateSeason == null) {
          app.dateSeason = "Unknown";
          app.yearSeason = "Unknown";
        }
        if (app.sseasons.overview.substring(0, 200) != "") {
          app.ovSeason = app.sseasons.overview.substring(0, 500);
        } else {
          app.ovSeason = "there is no overview to show this season in the api";
        }
        app.countEpisode = app.sseasons.episode_count;

        if (app.sseasons.poster_path != null) {
          app.imgSeason = app.sseasons.poster_path;
        } else {
          app.imgSeason = null;
        }

        app.nameSeason = app.sseasons.name.substring(0, 50);
        app.numbSeason = app.sseasons.season_number;
        console.log(app.numbSeason);
      })
      .catch(function (error) {
        console.log(error);
      });
    //////////////////////////////////////////////// DETALLE CASTING ////////////////////////////////////////////////
    var config = {
      method: "get",
      url:
        "https://api.themoviedb.org/3/tv/" + tvId + "/credits?&language=en-US",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        app.casting = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    //////////////////////////////////////////////// OBTENER KEYWORDS ////////////////////////////////////////////////
    var config = {
      method: "get",
      url:
        "https://api.themoviedb.org/3/tv/" +
        tvId +
        "/keywords?api_key=<<api_key>>",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        app.keyword = response.data.results;
      })
      .catch(function (error) {
        console.log(error);
      });
    //////////////////////////////////////////////// OBTENER TRAILERS ////////////////////////////////////////////////
    var config = {
      method: "get",
      url:
        "https://api.themoviedb.org/3/tv/" + tvId + "/videos?&language=en-US",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        app.trailer = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    //////////////////////////////////////////////// OBTENER RECOMENDACIONES ////////////////////////////////////////////////
    var config = {
      method: "get",
      url:
        "https://api.themoviedb.org/3/tv/" +
        tvId +
        "/recommendations?&language=en-US&page=1",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        app.recomendation = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    //////////////////////////////////////////////// OBTENER ID DEL USUARIO ////////////////////////////////////////////////
    var config = {
      method: "get",
      url: "https://api.themoviedb.org/3/account?",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };
    var userIdAux;
    axios(config)
      .then(function (response) {
        app.userId = response.data.id;
        userIdAux = app.userId;
      })
      .catch(function (error) {
        console.log(error);
      });
    //////////////////////////////////////////////// OBTENER SERIES FAVORITAS ////////////////////////////////////////////////
    var config = {
      method: "get",
      url:
        "https://api.themoviedb.org/3/account/" +
        userIdAux +
        "/favorite/tv?&language=en-US&sort_by=created_at.asc&page=1",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        var access = response.data.results.map(function (r) {
          if (r.id == tvId) {
            app.favStatus = true;
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    //////////////////////////////////////////////// OBTENER CALIFICACIÓN SERIE ////////////////////////////////////////////////
    var config = {
      method: "get",
      url:
        "https://api.themoviedb.org/3/account/" +
        userIdAux +
        "/rated/tv?api_key=<<api_key>>&language=en-US&sort_by=created_at.asc&page=1",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        var access = response.data.results.map(function (r) {
          if (r.id == tvId) {
            app.rateStatus = true;
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    //////////////////////////////////////////////// IMÁGENES DE LA SERIE ////////////////////////////////////////////////
    var config = {
      method: "get",
      url: "https://api.themoviedb.org/3/tv/" + tvId + "/images",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };
    var array = [];
    axios(config)
      .then(function (response) {
        app.images = response.data;
        var count = 0;
        var arrayBackdrops = [];
        var access = app.images.backdrops.map(function (b) {
          if (array[1] == null || b.vote_count > array.vote_count) {
            array = array.concat(b);
          }
          if (count < 15) {
            count++;
            arrayBackdrops = arrayBackdrops.concat(b);
          }
        });

        count = 0;
        var arrayPosters = [];
        var access = app.images.posters.map(function (b) {
          if (array[2] == null || b.vote_count > array.vote_count) {
            array = array.concat(b);
          }
          if (count < 15) {
            count++;
            arrayPosters = arrayPosters.concat(b);
          }
        });
        app.posters = arrayPosters;
        app.backdrops = arrayBackdrops;

        app.mediaPopular = array;
        app.mediaCount.backdrops = app.images.backdrops.length;
        app.mediaCount.posters = app.images.posters.length;
      })
      .catch(function (error) {
        console.log(error);
      });
    //////////////////////////////////////////////// VIDEOS DE LA SERIE ////////////////////////////////////////////////
    var config = {
      method: "get",
      url: "https://api.themoviedb.org/3/tv/" + tvId + "/videos",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2IxMDAyZjFjYmY3N2JkMTg1ZDg3NDkyMmFlZWU3MCIsInN1YiI6IjY1MTRiNzhlYmRkNTY4MDEzZjU4MzBjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OX11ObYS13YEQravRhAAKDfzpifakVGHdTnmxJ3rEeo",
      },
    };

    axios(config)
      .then(function (response) {
        app.videos = response.data.results;
        app.mediaCount.videos = app.videos.length;
        var access = app.videos.map(function (v) {
          if (
            array[0] == null &&
            (v.name == "Official Teaser" || v.name == "Official Trailer")
          ) {
            array = array.concat(v);
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  },
}).mount("#contenedor");