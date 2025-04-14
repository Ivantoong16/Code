// DOM Elements
const musicButton = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Audio Controls
let isPlaying = false;

if (musicButton) {
    musicButton.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicButton.classList.remove('playing');
        } else {
            bgMusic.play();
            musicButton.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

// Mobile Menu Toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and images
document.querySelectorAll('section, img, .gallery-item, .contact-card').forEach(el => {
    observer.observe(el);
});

// Exercise Plan Functionality
let weeklyRoutine = JSON.parse(localStorage.getItem("weeklyRoutine")) || {};

function addExercise() {
    const day = document.getElementById('day')?.value;
    const exerciseName = document.getElementById('exercise')?.value;
    const duration = document.getElementById('duration')?.value;

    if (!day || day === '----') {
        alert('Please select a day');
        return;
    }

    if (exerciseName && duration) {
        if (!weeklyRoutine[day]) {
            weeklyRoutine[day] = [];
        }
        weeklyRoutine[day].push({ name: exerciseName, duration: duration });
        saveRoutine();
        displayRoutine();
        
        // Reset input fields
        if (document.getElementById('exercise')) {
            document.getElementById('exercise').value = '';
        }
        if (document.getElementById('duration')) {
            document.getElementById('duration').value = '';
        }
    } else {
        alert('Please enter both exercise name and duration');
    }
}

function displayRoutine() {
    const routineDiv = document.getElementById('routine');
    if (!routineDiv) return;

    routineDiv.innerHTML = '';
    const selectedDay = document.getElementById('day')?.value;
    
    if (!selectedDay || selectedDay === '----') {
        routineDiv.innerHTML = '<p class="text-center">Select a day to view exercises</p>';
        return;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const selectedIndex = days.indexOf(selectedDay);
    const relevantDays = days.slice(0, selectedIndex + 1);

    relevantDays.forEach(day => {
        if (weeklyRoutine[day] && weeklyRoutine[day].length > 0) {
            const daySection = document.createElement('div');
            daySection.className = 'day-section';
            daySection.innerHTML = `
                <h3 class="day-title">${day}</h3>
                <div class="exercise-list">
                    ${weeklyRoutine[day].map((exercise, index) => `
                        <div class="exercise-item">
                            <span>${exercise.name} - ${exercise.duration} min</span>
                            <button onclick="removeExercise('${day}', ${index})" class="remove-btn">
                                ×
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            routineDiv.appendChild(daySection);
        }
    });

    if (routineDiv.children.length === 0) {
        routineDiv.innerHTML = '<p class="text-center">No exercises added yet</p>';
    }
}

function removeExercise(day, index) {
    weeklyRoutine[day].splice(index, 1);
    if (weeklyRoutine[day].length === 0) {
        delete weeklyRoutine[day];
    }
    saveRoutine();
    displayRoutine();
}

function clearRoutine() {
    if (confirm('Are you sure you want to clear all exercises?')) {
        weeklyRoutine = {};
        saveRoutine();
        displayRoutine();
    }
}

function saveRoutine() {
    localStorage.setItem("weeklyRoutine", JSON.stringify(weeklyRoutine));
}

// Initialize routine display if on plan page
if (document.getElementById('routine')) {
    displayRoutine();
}

// Page Transitions
window.addEventListener('pageshow', () => {
    document.body.classList.add('page-loaded');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('active') && 
        !e.target.closest('.navbar-container')) {
        navLinks.classList.remove('active');
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('active');
        }
    }, 250);
});