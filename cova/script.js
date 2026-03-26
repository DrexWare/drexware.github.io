document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        DISCORD_USER_ID: '1477027688337117318',
        SPOTIFY_CLIENT_ID: 'dd3631db64a24da8a1d5bba2ea489a6e',
        DISCORD_BOT_TOKEN: null,
        UPDATE_INTERVAL: 30000,
        SPOTIFY_UPDATE_INTERVAL: 5000
    };
    
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        const hoverElements = document.querySelectorAll('a, .profile-img');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '16px';
                cursor.style.height = '16px';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
            });
        });
    }
    
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = 'made by @elliieluvsu';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                typingText.textContent = text.slice(0, index + 1);
                index++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    index = 0;
                    typingText.textContent = '';
                    setTimeout(typeWriter, 2000);
                }, 4000);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    
    async function updateDiscordStatus() {
        console.log('🔄 Mise à jour du statut Discord...');
        
        try {
            const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.DISCORD_USER_ID}`);
            
            if (lanyardResponse.ok) {
                const lanyardData = await lanyardResponse.json();
           
                if (lanyardData.success && lanyardData.data) {
                    updateDiscordUI(lanyardData.data);
                    return;
                }
            }
            
            const lookupResponse = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${CONFIG.DISCORD_USER_ID}`);
            
            if (lookupResponse.ok) {
                const lookupData = await lookupResponse.json();
        
                updateDiscordUIFromLookup(lookupData);
                return;
            }
            
            const discordResponse = await fetch(`https://discord.com/api/v10/users/${CONFIG.DISCORD_USER_ID}`);
            
            if (discordResponse.ok) {
                const discordData = await discordResponse.json();

                updateDiscordUIFromAPI(discordData);
                return;
            }
            
        } catch (error) {
        }
        
        updateDiscordOffline();
    }
    
    function updateDiscordUI(userData) {
        if (window.lastDiscordUpdate && Date.now() - window.lastDiscordUpdate < 5000) {
            return;
        }
        window.lastDiscordUpdate = Date.now();
        
    
        const avatar = document.getElementById('discord-avatar');
        const mainAvatar = document.getElementById('main-avatar');
        const username = document.getElementById('discord-username');
        const status = document.getElementById('discord-status');
        const activity = document.getElementById('discord-activity');
        const activityImage = document.getElementById('activity-image');
        
        if (userData.discord_user) {
            const avatarUrl = userData.discord_user.avatar 
                ? `https://cdn.discordapp.com/avatars/${userData.discord_user.id}/${userData.discord_user.avatar}.png?size=128`
                : `https://cdn.discordapp.com/embed/avatars/${(parseInt(userData.discord_user.discriminator) || 0) % 5}.png`;
            
            if (avatar) avatar.src = avatarUrl;
            if (mainAvatar) mainAvatar.src = avatarUrl;
            
            const discordUsername = userData.discord_user.username || 'cenfoire';
            if (username) username.textContent = '@' + discordUsername;
            
            currentDiscordHandle = '@' + discordUsername;
            
            if (status) {
                const statusClass = userData.discord_status || 'offline';
                status.className = `status-indicator ${statusClass}`;
            }
            
            if (activity) {
                if (userData.activities && userData.activities.length > 0) {
                    const filteredActivities = userData.activities.filter(a => 
                        a.type !== 4 &&
                        a.name !== 'Spotify' &&
                        !a.name.toLowerCase().includes('spotify')
                    );
                    
                    if (filteredActivities.length > 0) {
                        const currentActivity = filteredActivities[0];
                        
                        let activityHTML = '';
                        
                        switch (currentActivity.type) {
                            case 0:
                                activityHTML = `
                                    <span class="activity-text">
                                        🎮 playing ${currentActivity.name}
                                        ${currentActivity.details ? `<br><small>${currentActivity.details}</small>` : ''}
                                        ${currentActivity.state ? `<br><small>${currentActivity.state}</small>` : ''}
                                    </span>
                                `;
                                if (activityImage && currentActivity.assets) {
                                    if (currentActivity.assets.large_image) {
                                        const imageUrl = currentActivity.assets.large_image.startsWith('mp:')
                                            ? `https://media.discordapp.net/${currentActivity.assets.large_image.slice(3)}`
                                            : `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}.png`;
                                        activityImage.src = imageUrl;
                                        activityImage.style.display = 'block';
                                    } else {
                                        activityImage.style.display = 'none';
                                    }
                                }
                                break;
                            case 1:
                                activityHTML = `
                                    <span class="activity-text">
                                        🔴 Stream ${currentActivity.name}
                                        ${currentActivity.details ? `<br><small>${currentActivity.details}</small>` : ''}
                                    </span>
                                `;
                                break;
                            case 2:
                                activityHTML = `
                                    <span class="activity-text">
                                        🎵 Listening ${currentActivity.name}
                                        ${currentActivity.details ? `<br><small>${currentActivity.details}</small>` : ''}
                                        ${currentActivity.state ? `<br><small>par ${currentActivity.state}</small>` : ''}
                                    </span>
                                `;
                                break;
                            case 3:
                                activityHTML = `
                                    <span class="activity-text">
                                        📺 Watching ${currentActivity.name}
                                        ${currentActivity.details ? `<br><small>${currentActivity.details}</small>` : ''}
                                    </span>
                                `;
                                break;
                            default:
                                activityHTML = `
                                    <span class="activity-text">
                                        ${currentActivity.name}
                                        ${currentActivity.details ? `<br><small>${currentActivity.details}</small>` : ''}
                                    </span>
                                `;
                        }
                        
                        activity.innerHTML = activityHTML;
                    } else {
                        activity.innerHTML = '<span class="activity-text">No Activity</span>';
                        if (activityImage) activityImage.style.display = 'none';
                    }
                } else {
                    activity.innerHTML = '<span class="activity-text">No Activity</span>';
                    if (activityImage) activityImage.style.display = 'none';
                }
            }
            
            if (userData.spotify) {
                updateSpotifyFromDiscord(userData.spotify);
            }
        }
    }
    
    function updateDiscordUIFromLookup(userData) {

        
        const avatar = document.getElementById('discord-avatar');
        const mainAvatar = document.getElementById('main-avatar');
        const username = document.getElementById('discord-username');
        const discriminator = document.getElementById('discord-discriminator');
        const status = document.getElementById('discord-status');
        const activity = document.getElementById('discord-activity');
        
        const avatarUrl = userData.avatar && userData.avatar.link 
            ? userData.avatar.link
            : `https://cdn.discordapp.com/embed/avatars/0.png`;
        
        if (avatar) avatar.src = avatarUrl;
        if (mainAvatar) mainAvatar.src = avatarUrl;
        
        if (username) username.textContent = userData.username || 'c';
        if (discriminator) {
            discriminator.textContent = userData.discriminator 
                ? `#${userData.discriminator}` 
                : '';
        }
        
        if (status) status.className = 'status-indicator online';
        if (activity) activity.innerHTML = '<span class="activity-text">En ligne</span>';
    }
    
    function updateDiscordUIFromAPI(userData) {

        
        const avatar = document.getElementById('discord-avatar');
        const mainAvatar = document.getElementById('main-avatar');
        const username = document.getElementById('discord-username');
        const discriminator = document.getElementById('discord-discriminator');
        
        const avatarUrl = userData.avatar 
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=128`
            : `https://cdn.discordapp.com/embed/avatars/${(parseInt(userData.discriminator) || 0) % 5}.png`;
        
        if (avatar) avatar.src = avatarUrl;
        if (mainAvatar) mainAvatar.src = avatarUrl;
        
        if (username) username.textContent = userData.username || 'c';
        if (discriminator) {
            discriminator.textContent = userData.discriminator 
                ? `#${userData.discriminator}` 
                : '';
        }
    }
    
    function updateDiscordOffline() {
        
        const avatar = document.getElementById('discord-avatar');
        const mainAvatar = document.getElementById('main-avatar');
        const username = document.getElementById('discord-username');
        const discriminator = document.getElementById('discord-discriminator');
        const status = document.getElementById('discord-status');
        const activity = document.getElementById('discord-activity');
        
        const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
        if (avatar) avatar.src = defaultAvatar;
        if (mainAvatar) mainAvatar.src = defaultAvatar;
        
        if (username) username.textContent = 'c';
        if (discriminator) discriminator.textContent = '';
        if (status) status.className = 'status-indicator offline';
        if (activity) activity.innerHTML = '<span class="activity-text">Hors ligne</span>';
    }
    
    function updateSpotifyFromDiscord(spotifyData) {
        const trackName = document.getElementById('spotify-track');
        const artistName = document.getElementById('spotify-artist');
        const albumArt = document.getElementById('spotify-album');
        
        if (spotifyData && spotifyData.song) {
            if (trackName) trackName.textContent = spotifyData.song;
            if (artistName) artistName.textContent = spotifyData.artist;
            
            if (albumArt && spotifyData.album_art_url) {
                albumArt.src = spotifyData.album_art_url;
                albumArt.style.display = 'block';
            }
        } else {
            if (trackName) trackName.textContent = 'Rien en cours';
            if (artistName) artistName.textContent = '-';
            if (albumArt) albumArt.style.display = 'none';
        }
    }
    
    async function updateSpotifyStatus() {
        try {
            const token = localStorage.getItem('spotify_access_token');
            
            if (!token) {
                return;
            }
            
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok && response.status !== 204) {
                const data = await response.json();
                updateSpotifyUI(data);
            } else if (response.status === 401) {
                localStorage.removeItem('spotify_access_token');
            }
        } catch (error) {
       
        }
    }
    
    function updateSpotifyUI(data) {
        const trackName = document.getElementById('spotify-track');
        const artistName = document.getElementById('spotify-artist');
        const albumArt = document.getElementById('spotify-album');
        const albumArtContainer = document.querySelector('.album-art');
        const spotifyWidget = document.querySelector('.spotify-widget');
        
        if (data && data.is_playing && data.item) {
            if (trackName) trackName.textContent = data.item.name;
            if (artistName) artistName.textContent = data.item.artists.map(artist => artist.name).join(', ');
            
            if (albumArt && data.item.album && data.item.album.images && data.item.album.images.length > 0) {
                albumArt.src = data.item.album.images[0].url;
                if (albumArtContainer) albumArtContainer.style.display = 'block';
            }
            
            if (spotifyWidget) spotifyWidget.classList.remove('no-music');
        } else {
            if (trackName) trackName.textContent = 'Not playing';
            if (artistName) artistName.textContent = '';
            if (albumArtContainer) albumArtContainer.style.display = 'none';
            
            if (spotifyWidget) spotifyWidget.classList.add('no-music');
        }
    }

    function updateSpotifyFromDiscord(spotifyData) {
        const trackName = document.getElementById('spotify-track');
        const artistName = document.getElementById('spotify-artist');
        const albumArt = document.getElementById('spotify-album');
        const albumArtContainer = document.querySelector('.album-art');
        const spotifyWidget = document.querySelector('.spotify-widget');
        
        if (spotifyData && spotifyData.song) {
            if (trackName) trackName.textContent = spotifyData.song;
            if (artistName) artistName.textContent = spotifyData.artist;
            
            if (albumArt && spotifyData.album_art_url) {
                albumArt.src = spotifyData.album_art_url;
                if (albumArtContainer) albumArtContainer.style.display = 'block';
            } else {
                if (albumArtContainer) albumArtContainer.style.display = 'none';
            }
        } else {
            if (trackName) trackName.textContent = 'Not playing';
            if (artistName) artistName.textContent = '';
            if (albumArtContainer) albumArtContainer.style.display = 'none';
            
            if (spotifyWidget) spotifyWidget.classList.add('no-music');
        }
    }
    
    function initSpotifyAuth() {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            localStorage.setItem('spotify_access_token', accessToken);
            window.location.hash = '';
        }
    }
    
    function authenticateSpotify() {
        const scopes = 'user-read-currently-playing user-read-playback-state';
        const redirectUri = window.location.origin + window.location.pathname;
        
        const authUrl = `https://accounts.spotify.com/authorize?` +
            `client_id=${CONFIG.SPOTIFY_CLIENT_ID}&` +
            `response_type=token&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent(scopes)}`;
        
        window.location.href = authUrl;
    }
    
    const discordLink = document.querySelector('.discord-link');
    if (discordLink) {
        discordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const usernameElement = document.getElementById('discord-username');
            const currentUsername = usernameElement ? usernameElement.textContent : 'elliiluvsu'    ;
            
            navigator.clipboard.writeText(currentUsername).then(() => {
                showNotification(`copied my user : ${currentUsername}`);
            }).catch(() => {
                showNotification('Erreur lors de la copie');
            });
        });
    }
    const githubLink = document.querySelector('.github-link');
    if (githubLink) {
        githubLink.addEventListener('click', (e) => {
            e.preventDefault();
            const usernameElement = document.getElementById('github-username');
            const currentUsername = usernameElement ? usernameElement.textContent : 'moonlightrblx';
            
            navigator.clipboard.writeText(currentUsername).then(() => {
                showNotification(`copied my user : ${currentUsername}`);
            }).catch(() => {
                showNotification('Erreur lors de la copie');
            });
        });
    }
    const spotifyLink = document.querySelector('.spotify-link');
    if (spotifyLink) {
        spotifyLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (!localStorage.getItem('spotify_access_token')) {
                authenticateSpotify();
            } else {
                window.open('https://open.spotify.com/', '_blank');
            }
        });
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: #e1e8ed;
            padding: 12px 20px;
            border-radius: 8px;
            border: 1px solid #2c3e50;
            backdrop-filter: blur(20px);
            z-index: 10000;
            font-size: 14px;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    function updateLastSeen() {
        const lastSeenElement = document.getElementById('last-seen');
        if (lastSeenElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            lastSeenElement.textContent = `saigo ni mita: ${timeString}`;
        }
    }
    
    function createExtraSnow() {
        const snowContainer = document.querySelector('.snow-container');
        if (snowContainer) {
            for (let i = 0; i < 20; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snow';
                snowflake.style.left = Math.random() * 100 + '%';
                snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
                snowflake.style.animationDelay = Math.random() * 5 + 's';
                snowflake.style.width = snowflake.style.height = (Math.random() * 3 + 1) + 'px';
                snowContainer.appendChild(snowflake);
            }
        }
    }
    

    
    initSpotifyAuth();
    updateDiscordStatus();
    updateSpotifyStatus();
    updateLastSeen();
    createExtraSnow();
    
    setInterval(updateDiscordStatus, CONFIG.UPDATE_INTERVAL);
    setInterval(updateSpotifyStatus, CONFIG.SPOTIFY_UPDATE_INTERVAL);
    setInterval(updateLastSeen, 60000);

});