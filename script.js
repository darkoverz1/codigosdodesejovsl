document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // --- GLOBAL BOKEH & FINE DUST ---
    initGlobalParticles();
});

function initGlobalParticles() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Container is the mobile wrapper, but we use fixed viewport sizing
    const container = document.querySelector('.mobile-wrapper');
    
    let width, height;
    function resize() {
        // Set internal canvas resolution to match mobile wrapper width but fixed height
        width = canvas.width = container.offsetWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Subtle discrete amount of particles (magnetic dust)
    const numberOfOrbs = window.innerWidth < 640 ? 60 : 100; 
    const orbsArray = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Extremely fine particles for SOPHISTICATED tech look
            this.size = Math.random() * 2 + 0.5; 
            
            // Slow hypnotic drift
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = -(Math.random() * 0.3 + 0.1); 
            
            // Colors from the branding (Purple, Pink, Soft Magenta)
            const colors = ['157, 5, 255', '255, 42, 95', '184, 0, 255', '255, 255, 255'];
            this.baseColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Balanced opacity - visible but soft
            this.maxOpacity = Math.random() * 0.2 + 0.15; 
            this.opacity = Math.random() * this.maxOpacity;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            
            this.swaySpeed = Math.random() * 0.01 + 0.005;
            this.swayOffset = Math.random() * Math.PI * 2;
        }
        update() {
            // Swaying floating motion
            this.x += this.speedX + Math.sin(this.swayOffset) * 0.2;
            this.swayOffset += this.swaySpeed;
            this.y += this.speedY;
            
            // Slow delicate pulse
            this.opacity += 0.001 * this.fadeDir;
            if (this.opacity >= this.maxOpacity) this.fadeDir = -1;
            if (this.opacity <= 0) this.fadeDir = 1;
            
            // Respawn at bottom for continuous drift
            if (this.y + this.size < 0) {
                this.y = height + 10;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.baseColor}, ${Math.max(0, this.opacity)})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < numberOfOrbs; i++) {
        orbsArray.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        ctx.globalCompositeOperation = 'screen';
        
        for (let i = 0; i < orbsArray.length; i++) {
            orbsArray[i].update();
            orbsArray[i].draw();
        }
        
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(animate);
    }
    
    animate();
}
