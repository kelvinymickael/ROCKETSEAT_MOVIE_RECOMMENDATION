// https://developer.themoviedb.org/reference/movie-popular-list
async function getMovies() {

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMThjOWZkNTUxZjc0NWMxNDA3OWZjMDQ1YmExM2I3NSIsInN1YiI6IjY0Y2NmMDM3Nzk4ZTA2MDBhZDE4NTAxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bCYELc215aqujb5AX78CViya-kkdd0YzTjAz0sfpj5k'
        }
      };
      
    try {
        return fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
        .then(response => response.json())
    } catch (error) {
        console.log(error)
    }

}

// Puxar informações extras do filme
// https://api.themoviedb.org/3/movie/{movie_id}
async function getMoreInfo(id) {
// Toda função assincrona demora um pouco para acontecer alguma coisa.
    
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMThjOWZkNTUxZjc0NWMxNDA3OWZjMDQ1YmExM2I3NSIsInN1YiI6IjY0Y2NmMDM3Nzk4ZTA2MDBhZDE4NTAxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bCYELc215aqujb5AX78CViya-kkdd0YzTjAz0sfpj5k'
        }
    };
    
    try {
        return fetch('https://api.themoviedb.org/3/movie/' + id, options)
        .then(response => response.json());
    } catch (error) {
        console.log(error);
    }

}

// Movie Barbie
// https://api.themoviedb.org/3/movie/{movie_id}/videos

async function watch(event) {
    
    const movie_id = event.currentTarget.dataset.id;

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMThjOWZkNTUxZjc0NWMxNDA3OWZjMDQ1YmExM2I3NSIsInN1YiI6IjY0Y2NmMDM3Nzk4ZTA2MDBhZDE4NTAxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bCYELc215aqujb5AX78CViya-kkdd0YzTjAz0sfpj5k'
        }
      };
      
      try {
        const data = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options)
        .then(response => response.json())

        const { results } = data

        const youtubeVideo = results.find(video => video.type === "Trailer")

        window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')

      } catch (error) {
        console.log(error)
      }

}

function createMovieLayout({
    movieId,
    title,
    avaliation,
    imagePoster,
    timeMovie,
    year
 }) {

    return `
    
    <div class="card-film">
        <div class="card-title">
            <span>${title}</span>
            <div class="avaliation">
                <img src="assets/icons/Star.svg" alt="Imagem de um estrela amarela">
                <span>${avaliation}</span>
            </div>
        </div>
        <div class="card-poster">
            <img src="https://image.tmdb.org/t/p/w500${imagePoster}" alt="Imagem do filme ${title}">
        </div>

        <div class="card-infos">
            <time class="duration">
                <img src="assets/icons/Clock.svg" alt="Imagem de um relogio">
                ${timeMovie}
            </time>

            <div class="year">
                <img src="assets/icons/CalendarBlank.svg" alt="Imagem de um calendario">
                <span>${year}</span>
            </div>
        </div>

        <div class="card-button">
            <button onclick="watch(event)" data-id="${movieId}">
                <img src="assets/icons/Play.svg" alt="Imagem de um player de video">
                Assistir Trailer
            </button>
        </div>
    </div>

    `
};

function selectThreeVideos(results) {
    const random = () => Math.floor(Math.random() * results.length)

    let selectedVideos = new Set();
    while(selectedVideos.size < 3) {
        selectedVideos.add(results[random()].id)
    }

    return [...selectedVideos]

}

function minutesToHourMinutesAndSeconds(minutes) {

    const date = new Date(null)
    date.setMinutes(minutes)
    return date.toISOString().slice(11, 19)

}

async function start() {
    // Pegar as sugestôes de filmes da API
    const { results } = await getMovies();
    // Pegar randomicamente 3 filmes para sugestão
    const bestThree = selectThreeVideos(results).map(async movie => {
        // Pegar informações extras dos 3 filmes
        const info = await getMoreInfo(movie)

        // Organizar os dados para...
        const props = {
            movieId: info.id,
            title: info.title,
            avaliation: Number(info.vote_average).toFixed(1),
            imagePoster: info.poster_path,
            timeMovie: minutesToHourMinutesAndSeconds(info.runtime),
            year: info.release_date.slice(0, 4)
        }

        return createMovieLayout(props)

    })

    const output = await Promise.all(bestThree)
    
    // Substituir o conteúdo dos movies lá no HTML
    document.querySelector('.container-films').innerHTML = output.join("")
}

start();