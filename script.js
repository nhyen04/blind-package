/* ==========================================================================
   SCRIPT.JS - PHOTOCARD RARE EDITION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. CÁC BIẾN & KHỞI TẠO DOM
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const blindBag = document.getElementById('blind-bag');
    const statusText = document.getElementById('status-text');
    const bagStage = document.getElementById('bag-stage');
    const cardStage = document.getElementById('card-stage');
    const inviteCard = document.getElementById('invite-card');
    const musicBtn = document.getElementById('music-btn');
    const muteSlash = document.getElementById('mute-slash');
    const appContainer = document.querySelector('.app-container');
    
    const magicalFlash = document.getElementById('magical-flash');
    const congratsBanner = document.getElementById('congrats-banner');
    
    // Thêm các tham chiếu DOM phục vụ gacha card
    const congratsTitle = congratsBanner.querySelector('.congrats-title');
    const congratsSubtitle = congratsBanner.querySelector('.congrats-subtitle');
    const cardImage = inviteCard.querySelector('.photocard-image');
    const rarityBadge = inviteCard.querySelector('.rarity-badge');

    // Cấu hình danh sách Card Pool Gacha
    const cardPool = {
        normal: [
            { src: 'images/normal1.jpg', name: 'Birthday', rarity: '🌸 NORMAL CARD 🌸' },
            { src: 'images/normal2.jpg', name: 'Garden', rarity: '🌸 NORMAL CARD 🌸' },
            { src: 'images/normal3.jpg', name: 'Home', rarity: '🌸 NORMAL CARD 🌸' },
            { src: 'images/normal4.jpg', name: 'Dinner', rarity: '🌸 NORMAL CARD 🌸' }
        ],
        secret: { src: 'images/secret.jpg', name: 'Secret', rarity: '⭐ SECRET RARE ⭐' }
    };

    let rolledCard = null;
    function rollGacha() {
        const rand = Math.random();
        if (rand < 0.10) {
            rolledCard = cardPool.secret;
        } else {
            const idx = Math.floor(Math.random() * cardPool.normal.length);
            rolledCard = cardPool.normal[idx];
        }
    }
    rollGacha();

    let clickCount = 0;
    const maxClicks = 5;
    let isTorn = false;
    let isFlipped = false;
    let musicPlaying = false;
    let canTilt = false;

    // Quản lý hệ thống hạt
    let particles = [];
    let backgroundParticles = [];

    // ----------------------------------------------------------------------
    // 2. CANVAS & CHUYỂN ĐỘNG HẠT NỀN (Sakura, Stars, Bubbles, Hearts)
    // ----------------------------------------------------------------------
    function resizeCanvas() {
        const rect = appContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Hạt nền đa dạng: Trôi nổi siêu chậm
    class BackgroundParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Phân loại: 0: Cánh hoa anh đào, 1: Sao lấp lánh, 2: Bong bóng, 3: Trái tim
            this.type = Math.floor(Math.random() * 4);
            
            this.size = Math.random() * 5 + 4;
            this.speedY = Math.random() * 0.3 + 0.1; // Cực kỳ chậm
            this.speedX = Math.random() * 0.2 - 0.1;
            
            // Xoay cánh hoa anh đào
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = Math.random() * 0.01 - 0.005;
            
            this.opacity = Math.random() * 0.5 + 0.2;
            this.fadeDir = Math.random() > 0.5 ? 0.005 : -0.005;

            // Bảng màu pastel lãng mạn
            const sakuraColors = ['#FFD3E8', '#FFB7D5', '#FFE4E1', '#FFF0F5'];
            this.color = sakuraColors[Math.floor(Math.random() * sakuraColors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.angle += this.spinSpeed;

            if (this.y > canvas.height + 10) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            if (this.x < -10 || this.x > canvas.width + 10) {
                this.speedX = -this.speedX;
            }

            // Nhấp nháy nhẹ
            this.opacity += this.fadeDir;
            if (this.opacity >= 0.7 || this.opacity <= 0.15) {
                this.fadeDir = -this.fadeDir;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            const p = this.size;

            if (this.type === 0) {
                // 1. CÁNH HOA ANH ĐÀO (Hình bầu dục pixel)
                ctx.beginPath();
                ctx.ellipse(0, 0, p * 0.7, p * 1.3, Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 1) {
                // 2. SAO PIXEL
                ctx.fillStyle = '#ECC45C';
                ctx.fillRect(0, -p/2, p/3, p);
                ctx.fillRect(-p/2, 0, p, p/3);
            } else if (this.type === 2) {
                // 3. BONG BÓNG TRẮNG SỮA
                ctx.strokeStyle = '#FFFDF9';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, p * 0.8, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // 4. TRÁI TIM PIXEL
                ctx.fillRect(-p/4, -p/2, p/2, p/2);
                ctx.fillRect(p/4, -p/2, p/2, p/2);
                ctx.fillRect(-p/2, -p/4, p, p/2);
                ctx.fillRect(-p/4, p/4, p/2, p/2);
                ctx.fillRect(0, p/2, p/4, p/4);
            }

            ctx.restore();
        }
    }

    // Hạt pháo hoa bùng nổ khi xé túi (Glitter, Giấy vụn)
    class ExplosionParticle {
        constructor(x, y, isPaperPiece = false) {
            this.x = x;
            this.y = y;
            this.isPaper = isPaperPiece;

            this.size = Math.random() * 4 + 4;
            const angle = Math.random() * Math.PI * 2;
            const speed = isPaperPiece ? (Math.random() * 3 + 1.5) : (Math.random() * 6 + 3);
            
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - (isPaperPiece ? 1 : 3);
            
            this.gravity = isPaperPiece ? 0.08 : 0.16;
            this.friction = 0.98;
            this.alpha = 1;
            this.decay = Math.random() * 0.012 + 0.008;

            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = Math.random() * 0.1 - 0.05;

            // Màu sắc pháo hoa
            const colors = ['#FF80AB', '#FFB7D5', '#ECC45C', '#FFD700', '#FFFDF9', '#4FC3F7'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.vx *= this.friction;
            this.vy = (this.vy + this.gravity) * this.friction;
            this.x += this.vx;
            this.y += this.vy;
            this.angle += this.spinSpeed;
            this.alpha -= this.decay;
        }

        draw() {
            if (this.alpha <= 0) return;

            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            const p = this.size;

            if (this.isPaper) {
                // VẼ GIẤY VỤN MỞ TÚI (Hình chữ nhật dẹt)
                ctx.fillRect(-p, -p/2, p * 2, p);
            } else {
                // VẼ HẠT LẤP LÁNH / TRÁI TIM
                if (Math.random() > 0.6) {
                    // Trái tim pixel nhỏ
                    ctx.fillRect(-p/2, -p/2, p, p);
                } else {
                    // Ngôi sao nhỏ
                    ctx.fillRect(0, -p/2, p/4, p);
                    ctx.fillRect(-p/2, 0, p, p/4);
                }
            }

            ctx.restore();
        }
    }

    // Khởi tạo 40 hạt nền trôi nổi
    for (let i = 0; i < 40; i++) {
        backgroundParticles.push(new BackgroundParticle());
    }

    // Loop vẽ chính
    function animationLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Vẽ nền trôi nổi
        backgroundParticles.forEach(bp => {
            bp.update();
            bp.draw();
        });

        // Vẽ hạt vụ nổ
        particles.forEach((part, index) => {
            part.update();
            part.draw();
            if (part.alpha <= 0) {
                particles.splice(index, 1);
            }
        });

        requestAnimationFrame(animationLoop);
    }
    animationLoop();

    // Tạo vụ nổ hạt hỗn hợp (giấy và lấp lánh)
    function triggerTearBurst(x, y, count, isSecretRare = false) {
        for (let i = 0; i < count; i++) {
            const isPaper = Math.random() < 0.4;
            const p = new ExplosionParticle(x, y, isPaper);
            if (isSecretRare) {
                // Tông màu vàng gold lấp lánh quý phái
                const goldColors = ['#FFE082', '#FFD54F', '#FFCA28', '#FFB300', '#FFFDF9', '#E0F7FA'];
                p.color = goldColors[Math.floor(Math.random() * goldColors.length)];
            } else {
                // Tông màu hồng phấn đào ngọt ngào
                const normalColors = ['#FF80AB', '#FFB7D5', '#FFFDF9', '#F8BBD0', '#F06292', '#E1BEE7'];
                p.color = normalColors[Math.floor(Math.random() * normalColors.length)];
            }
            particles.push(p);
        }
    }


    // ----------------------------------------------------------------------
    // 3. ÂM THANH SYNTHESIS (WEB AUDIO API)
    // ----------------------------------------------------------------------
    let audioCtx = null;
    let mainGain = null;
    let seqInterval = null;

    function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        mainGain = audioCtx.createGain();
        mainGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        mainGain.connect(audioCtx.destination);
    }

    // SFX Gõ giấy lắc túi
    function playTapSFX() {
        if (!audioCtx) initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(mainGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    // SFX Rách giấy & Nổ hạt
    function playRipSFX() {
        if (!audioCtx) initAudio();
        const now = audioCtx.currentTime;
        
        // 1. Tiếng xé rẹt rẹt (Nhân nhiễu trắng)
        try {
            const bufferSize = audioCtx.sampleRate * 0.15;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = audioCtx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = 1000;
            
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.12, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(mainGain);
            noise.start(now);
        } catch (e) {
            // Trình duyệt không hỗ trợ buffer, bỏ qua
        }

        // 2. Chime ma thuật (Các nốt Major arpeggio cao vút lên)
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            
            gain.gain.setValueAtTime(0, now + idx * 0.04);
            gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.04 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);

            osc.connect(gain);
            gain.connect(mainGain);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.3);
        });
    }

    // SFX Lật thiệp mời
    function playFlipSFX() {
        if (!audioCtx) initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(mainGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    }

    // Vòng lặp nhạc nền Lofi Anime
    const lofiNotes = [
        659.25, 783.99, 880.00, 1046.50, // E5, G5, A5, C6
        880.00, 783.99, 659.25, 587.33,
        659.25, 783.99, 880.00, 783.99,
        659.25, 587.33, 523.25, 587.33,
        
        659.25, 783.99, 880.00, 1046.50,
        1174.66, 1318.51, 1046.50, 880.00, // D6, E6, C6, A5
        987.77, 1046.50, 783.99, 659.25,  // B5, C6, G5, E5
        587.33, 659.25, 523.25, 523.25
    ];
    let noteIdx = 0;

    function playLofiStep() {
        if (!musicPlaying || !audioCtx) return;
        const now = audioCtx.currentTime;
        const freq = lofiNotes[noteIdx];

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.35);

        // Nhịp Bass đệm
        if (noteIdx % 4 === 0) {
            const bassOsc = audioCtx.createOscillator();
            const bassGain = audioCtx.createGain();

            bassOsc.type = 'sine';
            bassOsc.frequency.setValueAtTime(freq / 2, now);

            bassGain.gain.setValueAtTime(0, now);
            bassGain.gain.linearRampToValueAtTime(0.04, now + 0.05);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            bassOsc.connect(bassGain);
            bassGain.connect(mainGain);
            bassOsc.start(now);
            bassOsc.stop(now + 0.65);
        }

        noteIdx = (noteIdx + 1) % lofiNotes.length;
    }

    function toggleMusic() {
        initAudio();
        if (musicPlaying) {
            musicPlaying = false;
            clearInterval(seqInterval);
            muteSlash.style.display = 'block';
        } else {
            musicPlaying = true;
            muteSlash.style.display = 'none';
            if (audioCtx.state === 'suspended') audioCtx.resume();
            seqInterval = setInterval(playLofiStep, 320); // Nhịp lofi êm ái
        }
    }

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });


    // ----------------------------------------------------------------------
    // 4. LOGIC XÉ TÚI MÙ 5 GIAI ĐOẠN (RIP OPEN STAGE)
    // ----------------------------------------------------------------------
    const tipTexts = [
        "KEEP GOING!!",
        "ALMOST THERE!!",
        "SO CLOSE!!",
        "ONE MORE TAP!!"
    ];

    blindBag.addEventListener('click', () => {
        if (isTorn) return;

        initAudio(); // Nhận diện thao tác người dùng để chạy tiếng

        clickCount++;
        
        // Phát tiếng gõ giấy
        playTapSFX();

        // Kích hoạt class dừng breathing và chạy shake rung lắc
        blindBag.classList.add('ripping');
        blindBag.classList.remove('shake');
        void blindBag.offsetWidth; // Reset animation
        blindBag.classList.add('shake');

        // Lấy tọa độ đường rách của túi mù để tạo bụi xé giấy
        const rect = blindBag.getBoundingClientRect();
        const appRect = appContainer.getBoundingClientRect();
        const tearX = rect.left - appRect.left + rect.width / 2 + (Math.random() * 80 - 40);
        const tearY = rect.top - appRect.top + rect.height * 0.25;
        
        const isSecret = rolledCard === cardPool.secret;

        // Tạo pháo bông giấy vụn nhỏ
        triggerTearBurst(tearX, tearY, 8, isSecret);

        // Xử lý các cấp độ vết rách
        if (clickCount === 1) {
            blindBag.classList.add('step-1');
            statusText.innerText = tipTexts[0];
        } else if (clickCount === 2) {
            blindBag.classList.add('step-2');
            statusText.innerText = tipTexts[1];
        } else if (clickCount === 3) {
            blindBag.classList.add('step-3');
            statusText.innerText = tipTexts[2];
        } else if (clickCount === 4) {
            blindBag.classList.add('step-4');
            statusText.innerText = tipTexts[3];
        } else if (clickCount >= maxClicks) {
            // XÉ TAY HOÀN TOÀN!
            isTorn = true;
            blindBag.classList.remove('step-1', 'step-2', 'step-3', 'step-4');
            blindBag.classList.add('torn');
            statusText.innerText = "OPENED! ✨";

            // Cập nhật ảnh thẻ và nhãn độ hiếm theo kết quả gacha
            cardImage.src = rolledCard.src;
            rarityBadge.innerText = rolledCard.rarity;

            if (isSecret) {
                congratsTitle.innerHTML = '✨ CONGRATULATIONS! ✨';
                congratsSubtitle.innerText = 'You found a Secret Card!';
                congratsBanner.className = 'congrats-banner secret-banner';
                rarityBadge.className = 'rarity-badge rarity-secret';
            } else {
                congratsTitle.innerHTML = '🌸 CARD OPENED! 🌸';
                congratsSubtitle.innerText = `You found a Normal Card!`;
                congratsBanner.className = 'congrats-banner normal-banner';
                rarityBadge.className = 'rarity-badge rarity-normal';
            }

            // Âm thanh bùng nổ hoành tráng
            playRipSFX();

            // Màn hình lóa sáng trắng hồng lung linh (Bloom)
            magicalFlash.classList.add('flash-active');
            setTimeout(() => {
                magicalFlash.classList.remove('flash-active');
            }, 500);

            // Vụ nổ hạt giấy lấp lánh khổng lồ tại đường rách
            const centerX = rect.left - appRect.left + rect.width / 2;
            const centerY = rect.top - appRect.top + rect.height * 0.25;
            triggerTearBurst(centerX, centerY, 80, isSecret);

            // Chuyển giai đoạn mở thẻ Photocard hiếm
            setTimeout(() => {
                // Tách hẳn túi mù đi
                bagStage.style.transition = 'opacity 0.6s, transform 0.6s';
                bagStage.style.opacity = '0';
                bagStage.style.transform = 'scale(0.85)';
                
                setTimeout(() => {
                    bagStage.style.display = 'none';

                    // Hiện thẻ bài bay lên từ trong túi
                    cardStage.style.display = 'flex';
                    void cardStage.offsetWidth;

                    // Hiện hiệu ứng lóa sáng lấp lánh nền
                    triggerTearBurst(canvas.width / 2, canvas.height / 2, 40, isSecret);

                    // Phóng to bay lên
                    inviteCard.classList.add('card-reveal');

                    // Hiện Banner chúc mừng trong 5 giây rồi biến mất
                    congratsBanner.classList.add('show-congrats');
                    setTimeout(() => {
                        congratsBanner.style.transition = 'opacity 0.6s';
                        congratsBanner.classList.remove('show-congrats');
                    }, 5000);

                    // Tự động kích hoạt nhạc lofi
                    musicBtn.style.display = 'flex';
                    setTimeout(() => {
                        toggleMusic();
                    }, 300);

                    // Sau khi card bay lên và hiển thị mặt trước đủ 5 giây cùng banner, thẻ sẽ tự lật 3D sang mặt sau
                    setTimeout(() => {
                        inviteCard.classList.add('flipped');
                        playFlipSFX();
                        
                        // Thêm hiệu ứng hạt lấp lánh khi lật
                        triggerTearBurst(canvas.width / 2, canvas.height / 2, 30, isSecret);
                        
                        // Kích hoạt bập bềnh sau khi lật xong
                        setTimeout(() => {
                            inviteCard.classList.add('card-floating');
                            canTilt = true; // Cho phép tương tác nghiêng Tilt
                        }, 900);

                    }, 6000);

                }, 500);
            }, 650);
        }
    });

    blindBag.addEventListener('animationend', (e) => {
        if (e.animationName === 'bagShake') {
            blindBag.classList.remove('shake');
        }
    });


    // ----------------------------------------------------------------------
    // 5. TƯƠNG TÁC NGHIÊNG 3D PHOTOCARD (TILT EFFECT & HOLOGRAM MOVEMENT)
    // ----------------------------------------------------------------------
    function handleCardTilt(clientX, clientY) {
        if (!canTilt) return;

        const rect = inviteCard.getBoundingClientRect();
        const cardWidth = rect.width;
        const cardHeight = rect.height;
        
        // Tọa độ tâm thẻ bài
        const centerX = rect.left + cardWidth / 2;
        const centerY = rect.top + cardHeight / 2;
        
        // Khoảng cách từ vị trí chuột tới tâm thẻ
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        // Góc quay tối đa 16 độ
        // Vì lật sang mặt sau (180 độ), chúng ta đảo ngược trục Y để giữ độ xoay nghiêng tự nhiên
        const tiltX = -(deltaY / (cardHeight / 2)) * 14;
        const tiltY = (deltaX / (cardWidth / 2)) * 14 * (isFlipped ? -1 : 1);
        
        // Phản chiếu Hologram: Tọa độ phần trăm con trỏ trên thẻ
        const percentX = ((clientX - rect.left) / cardWidth) * 100;
        const percentY = ((clientY - rect.top) / cardHeight) * 100;

        // Cập nhật biến CSS để card xoay nghiêng và hologram dịch chuyển ánh sáng
        inviteCard.style.setProperty('--tilt-x', `${tiltX}deg`);
        inviteCard.style.setProperty('--tilt-y', `${tiltY}deg`);
        inviteCard.style.setProperty('--mouse-x', percentX);
        inviteCard.style.setProperty('--mouse-y', percentY);
    }

    function resetCardTilt() {
        if (!canTilt) return;
        // Trả thẻ bài về chính diện mượt mà
        inviteCard.style.transition = 'transform 0.4s ease-out';
        inviteCard.style.setProperty('--tilt-x', '0deg');
        inviteCard.style.setProperty('--tilt-y', '0deg');
        inviteCard.style.setProperty('--mouse-x', '50');
        inviteCard.style.setProperty('--mouse-y', '50');
        
        setTimeout(() => {
            if (canTilt) {
                // Xóa transition tạm thời để việc di chuột nghiêng không bị trễ/lag
                inviteCard.style.transition = 'transform 0.1s ease-out';
            }
        }, 400);
    }

    // Bắt sự kiện trên máy tính (Desktop)
    appContainer.addEventListener('mousemove', (e) => {
        handleCardTilt(e.clientX, e.clientY);
    });

    appContainer.addEventListener('mouseleave', () => {
        resetCardTilt();
    });

    // Bắt sự kiện trên điện thoại di động (Mobile Touch)
    appContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handleCardTilt(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    appContainer.addEventListener('touchend', () => {
        resetCardTilt();
    });

    // Click vào card để tự lật qua lại nếu muốn xem lại ảnh (Stage 9)
    inviteCard.addEventListener('click', () => {
        if (!canTilt) return; // Chỉ cho lật sau khi đã hoàn tất lật tự động đầu tiên
        
        isFlipped = !isFlipped;
        playFlipSFX();
        
        // Tắt bập bềnh tạm thời để lật không bị méo góc
        inviteCard.classList.remove('card-floating');
        
        if (isFlipped) {
            inviteCard.classList.add('flipped');
        } else {
            inviteCard.classList.remove('flipped');
        }

        // Tạo hạt lấp lánh khi lật
        triggerTearBurst(canvas.width / 2, canvas.height / 2, 20);

        setTimeout(() => {
            inviteCard.classList.add('card-floating');
        }, 900);
    });

});
