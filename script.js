document.addEventListener('DOMContentLoaded', () => {
  const scope = {
    videos: [
      { id: 'vid1', title: "Neon Dreams", src: "https://www.w3schools.com/html/mov_bbb.mp4", tags: ["cyber", "dream", "synth"], poster: "https://picsum.photos/seed/neondreams/600/338" },
      { id: 'vid2', title: "Digital Pulse", src: "https://www.w3schools.com/html/movie.mp4", tags: ["tech", "cyber", "glitch"], poster: "https://picsum.photos/seed/digitalpulse/600/338" },
      { id: 'vid3', title: "Synthwave Journey", src: "https://www.w3schools.com/html/mov_bbb.mp4", tags: ["synth", "retro", "80s"], poster: "https://picsum.photos/seed/synthjourney/600/338" },
      { id: 'vid4', title: "Future Cityscape", src: "https://www.w3schools.com/html/movie.mp4", tags: ["sci-fi", "city", "future"], poster: "https://picsum.photos/seed/futurecity/600/338" },
      { id: 'vid5', title: "Quantum Realm", src: "https://www.w3schools.com/html/mov_bbb.mp4", tags: ["science", "quantum", "abstract"], poster: "https://picsum.photos/seed/quantumrealm/600/338" }
    ],
    filter: '',
    get filteredVideos() {
      if (!this.filter.trim()) return this.videos;
      const term = this.filter.toLowerCase().trim();
      return this.videos.filter(v =>
        v.title.toLowerCase().includes(term) ||
        v.tags.some(t => t.toLowerCase().includes(term))
      );
    }
  };

  const videoGrid = document.getElementById('videoGrid');
  const searchInput = document.getElementById('searchInput');
  const themeToggleButton = document.getElementById('theme-toggle');
  const noResultsDiv = document.getElementById('noResults');

  function createVideoCard(video) {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.dataset.videoId = video.id;

    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'video-wrapper';

    const videoElement = document.createElement('video');
    videoElement.className = 'video-element';
    videoElement.src = video.src;
    videoElement.poster = video.poster || ''; // Add poster if available
    videoElement.preload = "metadata"; // Suggest browser to load metadata

    videoWrapper.appendChild(videoElement);

    const videoInfo = document.createElement('div');
    videoInfo.className = 'video-info';

    const title = document.createElement('h3');
    title.textContent = video.title;

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags';
    video.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = `#${tag}`;
        tagsContainer.appendChild(tagSpan);
    });

    videoInfo.appendChild(title);
    videoInfo.appendChild(tagsContainer);

    const controls = document.createElement('div');
    controls.className = 'video-controls';

    const playPauseButton = document.createElement('button');
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    playPauseButton.setAttribute('aria-label', 'Play/Pause');
    playPauseButton.onclick = () => togglePlay(videoElement, playPauseButton);

    const volumeControls = document.createElement('div');
    volumeControls.className = 'volume-controls';

    const muteButton = document.createElement('button');
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    muteButton.setAttribute('aria-label', 'Mute/Unmute');
    muteButton.onclick = () => toggleMute(videoElement, muteButton);

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.05';
    volumeSlider.value = videoElement.volume;
    volumeSlider.className = 'volume-slider';
    volumeSlider.oninput = () => changeVolume(videoElement, volumeSlider.value, muteButton);

    volumeControls.appendChild(muteButton);
    volumeControls.appendChild(volumeSlider);

    controls.appendChild(playPauseButton);
    controls.appendChild(volumeControls);

    card.appendChild(videoWrapper);
    card.appendChild(videoInfo);
    card.appendChild(controls);

    return card;
  }

  function render() {
    videoGrid.innerHTML = ''; // Clear existing videos
    const videosToRender = scope.filteredVideos;

    if (videosToRender.length === 0 && scope.filter.trim() !== '') {
        noResultsDiv.style.display = 'block';
    } else {
        noResultsDiv.style.display = 'none';
    }

    videosToRender.forEach(video => {
      const card = createVideoCard(video);
      videoGrid.appendChild(card);
    });

    // Re-apply Anime.js animation to newly added cards
    anime({
      targets: '.video-card',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(80, { start: 100 }),
      duration: 700,
      easing: 'easeOutExpo'
    });
  }

  function togglePlay(videoElement, button) {
    if (videoElement.paused || videoElement.ended) {
      videoElement.play();
      button.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      videoElement.pause();
      button.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  function toggleMute(videoElement, button) {
    videoElement.muted = !videoElement.muted;
    updateMuteButtonIcon(videoElement, button);
    // If unmuting and volume was 0, set to a default, e.g., 0.5
    if (!videoElement.muted && videoElement.volume === 0) {
        videoElement.volume = 0.5;
        // Also update the slider if one is associated
        const slider = button.closest('.video-controls').querySelector('.volume-slider');
        if (slider) slider.value = 0.5;
    }
  }

  function changeVolume(videoElement, volume, muteButton) {
    videoElement.volume = parseFloat(volume);
    videoElement.muted = videoElement.volume === 0;
    updateMuteButtonIcon(videoElement, muteButton);
  }

  function updateMuteButtonIcon(videoElement, button) {
    if (videoElement.muted || videoElement.volume === 0) {
      button.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (videoElement.volume <= 0.5) {
      button.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
      button.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  }

  // Theme Toggle Logic
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }

  themeToggleButton.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);


  // Search Input Binding
  searchInput.addEventListener('input', (e) => {
    scope.filter = e.target.value;
    render();
  });

  // Update current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Initial Render
  render();
});