
// Prevent auto scroll on load
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.onload = function () {
    window.scrollTo(0, 0);
};

// High-Performance Helper function to load third party scripts dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Debounce Helper for High-Performance Scrolling and Resizing
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// --- SECTION BY SECTION CUSTOM LOADING REVEAL EFFECTS (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-element');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px', // Trigger slightly before viewport entry
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
});

// --- SIWMAGA DHAMMA SCHOOL ANIMATED TITLE REVEAL ---
document.addEventListener('DOMContentLoaded', () => {
    const siwmagaTitle = document.getElementById('siwmaga-title');
    if (!siwmagaTitle) return;

    const words = siwmagaTitle.querySelectorAll('.siwmaga-word');

    const titleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                words.forEach((word, i) => {
                    setTimeout(() => {
                        word.classList.add('revealed');
                    }, i * 220);
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    titleObserver.observe(siwmagaTitle);
});

// --- PROGRESSIVE CUSTOM IMAGE LAZY LOADING SYSTEM ---
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('.lazy-image');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.classList.remove('shimmer-skeleton');
                        img.classList.add('loaded');
                    };
                }
                observer.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px 200px 0px' // Fetch images 200px ahead of scroll for a seamless feel
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Navigation Bar Scroll Styling
window.addEventListener('scroll', debounce(() => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.remove('bg-transparent', 'border-transparent');
        header.classList.add('bg-black/80', 'backdrop-blur-md', 'shadow-xl', 'py-3', 'border-white/10');
    } else {
        header.classList.remove('bg-black/80', 'backdrop-blur-md', 'shadow-xl', 'py-3', 'border-white/10');
        header.classList.add('bg-transparent', 'border-transparent');
    }
}, 15));

// Mobile Menu Toggle (Features smooth active status transitions)
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        const isClosed = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', !isClosed);
        mobileBtn.setAttribute('aria-expanded', String(isClosed));
        mobileBtn.innerHTML = isClosed
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile drawer when clicking any link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Scroll helper
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hide scroll indicator on scroll
(function () {
    const scrollHint = document.getElementById('scroll-down-hint');
    if (scrollHint) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                scrollHint.classList.add('hidden-scroll');
            } else {
                scrollHint.classList.remove('hidden-scroll');
            }
        }, { passive: true });
    }
})();

// Hero Slider Navigation
const next = document.querySelector('.next-btn');
const prev = document.querySelector('.prev-btn');
const slider = document.querySelector('.slide');

function slideNext() {
    let items = document.querySelectorAll('.item');
    if (slider && items.length > 0) slider.appendChild(items[0]);
}

if (next) {
    next.onclick = slideNext;
}

if (prev) {
    prev.onclick = function () {
        let items = document.querySelectorAll('.item');
        if (slider && items.length > 0) slider.prepend(items[items.length - 1]);
    }
}

let autoSlide = setInterval(slideNext, 7000);

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(slideNext, 7000);
}

[next, prev].forEach(btn => {
    if (btn) btn.addEventListener('click', resetAutoSlide);
});

// Click thumbnail to make it active
slider.addEventListener('click', function (e) {
    const clickedItem = e.target.closest('.item');
    if (!clickedItem) return;

    const items = Array.from(slider.querySelectorAll('.item'));
    const index = items.indexOf(clickedItem);

    if (index >= 2) {
        for (let i = 0; i < index - 1; i++) {
            let currentItems = slider.querySelectorAll('.item');
            slider.appendChild(currentItems[0]);
        }
        resetAutoSlide();
    }
});

// --- KEYBOARD ARROW KEY BINDINGS FOR MAIN SLIDER ---
document.addEventListener('keydown', (e) => {
    if (document.activeElement && (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable
    )) {
        return;
    }
    if (e.key === 'ArrowLeft') {
        prev.click();
        resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
        next.click();
        resetAutoSlide();
    }
});



// Updated data with local time zones corresponding to each country (Including Japan Medium)
const timetableData = [
    // Sinhala Medium (සිංහල මාධ්‍යය)
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 1 | 2", age: "අවු: 7 - 8", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-1", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 3 | 4", age: "අවු: 9 - 10", time: "ඉරිදා 3:30 - 5:00 pm", localTime: "ඉරිදා 3:30 - 5:00 pm", link: "https://zoom.us/mock-link-sivumaga-2", day: 0, startHour: 15, startMin: 30, endHour: 17, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 5 | 6", age: "අවු: 11 - 12", time: "ඉරිදා 3:30 - 5:00 pm", localTime: "ඉරිදා 3:30 - 5:00 pm", link: "https://zoom.us/mock-link-sivumaga-3", day: 0, startHour: 15, startMin: 30, endHour: 17, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 7 | 8", age: "අවු: 13 - 16", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-4", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 1 | 2", age: "අවු: 7 - 8", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-5", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 3 | 4", age: "අවු: 9 - 10", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-6", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 5", age: "අවු: 11", time: "ඉරිදා 7:00 - 8:30 pm", localTime: "ඉරිදා 7:00 - 8:30 pm", link: "https://zoom.us/mock-link-sivumaga-7", day: 0, startHour: 19, startMin: 0, endHour: 20, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 7", age: "අවු: 13", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-8", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 8", age: "අවු: 14", time: "ඉරිදා 7:00 - 8:30 pm", localTime: "ඉරිදා 7:00 - 8:30 pm", link: "https://zoom.us/mock-link-sivumaga-9", day: 0, startHour: 19, startMin: 0, endHour: 20, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි 9", age: "අවු: 15 - 16", time: "ඉරිදා 7:00 - 8:30 pm", localTime: "ඉරිදා 7:00 - 8:30 pm", link: "https://zoom.us/mock-link-sivumaga-10", day: 0, startHour: 19, startMin: 0, endHour: 20, endMin: 30 },
    { med: "Sinhala", country: "England", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට Junior", age: "අවු: 7 - 11", time: "ඉරිදා 2:00 - 3:30 pm", localTime: "Sun. 9:30 - 11:00 am (BST)", link: "https://zoom.us/mock-link-sivumaga-11", day: 0, startHour: 14, startMin: 0, endHour: 15, endMin: 30 },
    { med: "Sinhala", country: "England", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට Senior", age: "අවු: 12 - 16", time: "ඉරිදා 4:00 - 5:30 pm", localTime: "Sun. 11:30 am - 1:00 pm (BST)", link: "https://zoom.us/mock-link-sivumaga-12", day: 0, startHour: 16, startMin: 0, endHour: 17, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට", age: "අවු: 7 - 16", time: "ඉරිදා 1:00 - 2:30 pm", localTime: "Sun. 6:30 - 8:00 pm (AEST)", link: "https://zoom.us/mock-link-sivumaga-13", day: 0, startHour: 13, startMin: 0, endHour: 14, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට", age: "අවු: 7 - 16", time: "සෙන. 1:00 - 2:30 pm", localTime: "Sat. 9:30 - 11:00 am (CEST)", link: "https://zoom.us/mock-link-sivumaga-14", day: 6, startHour: 13, startMin: 0, endHour: 14, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට", age: "අවු: 7 - 16", time: "සෙන. 1:00 - 2:30 pm", localTime: "Sat. 9:30 - 11:00 am (CEST)", link: "https://zoom.us/mock-link-sivumaga-15", day: 6, startHour: 13, startMin: 0, endHour: 14, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ - ආරාමය", age: "අවු: 7 - 11", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-16", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ - ආරාමය", age: "අවු: 11 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-17", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි - ආරාමය", age: "අවු: 7 - 11", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-18", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි - ආරාමය", age: "අවු: 11 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-19", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },

    // English Medium (ඉංග්‍රීසි මාධ්‍යය)
    { med: "English", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට", age: "අවු: 6 - 12", time: "ඉරිදා 8:00 - 10:00 pm", localTime: "Sun. 10:30 am - 12:30 pm (EDT)", link: "https://zoom.us/mock-link-sivumaga-20", day: 0, startHour: 20, startMin: 0, endHour: 22, endMin: 0 },
    { med: "English", country: "Qatar", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International", age: "අවු: 7 - 16", time: "සිකු. 2:00 - 3:30 pm", localTime: "Fri. 11:30 am - 1:00 pm (AST)", link: "https://zoom.us/mock-link-sivumaga-21", day: 5, startHour: 14, startMin: 0, endHour: 15, endMin: 30 },
    { med: "English", country: "Any country", type: "Online", gender: "පුරුෂ", sec: "Siwmaga International", age: "අවු: 7 - 16", time: "සෙන. 12:30 - 2:00 pm", localTime: "Sat. 7:00 - 8:30 am (UTC)", link: "https://zoom.us/mock-link-sivumaga-22", day: 6, startHour: 12, startMin: 30, endHour: 14, endMin: 0 },
    { med: "English", country: "Any country", type: "Online", gender: "ස්ත්‍රී", sec: "Siwmaga International", age: "අවු: 7 - 16", time: "සෙන. 12:30 - 2:00 pm", localTime: "Sat. 7:00 - 8:30 am (UTC)", link: "https://zoom.us/mock-link-sivumaga-23", day: 6, startHour: 12, startMin: 30, endHour: 14, endMin: 0 },
    { med: "English", country: "Sri Lanka", type: "ආරාමීය", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ - ආරාමය", age: "අවු: 7 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-24", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "English", country: "Sri Lanka", type: "ආරාමීය", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි - ආරාමය", age: "අවු: 7 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "https://zoom.us/mock-link-sivumaga-25", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "English", country: "Ireland", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International", age: "අවු: 6 - 16", time: "සෙන. 7:30 - 9:00 pm", localTime: "Sat. 3:00 - 4:30 pm (IST)", link: "https://zoom.us/mock-link-sivumaga-26", day: 6, startHour: 19, startMin: 30, endHour: 21, endMin: 0 },
    { med: "English", country: "Canada", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International", age: "අවු: 13 - 16", time: "ඉරිදා 8:30 - 10:00 pm", localTime: "Sun. 11:00 am - 12:30 pm (EDT)", link: "https://zoom.us/mock-link-sivumaga-27", day: 0, startHour: 20, startMin: 30, endHour: 22, endMin: 0 },

    // Japan Medium (ජපන් මාධ්‍යය)
    { med: "Japan", country: "Japan", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International Junior", age: "අවු: 5 - 10", time: "ඉරිදා 3:30 - 4:30 pm", localTime: "Sun. 7:00 - 8:00 pm (JST)", link: "https://zoom.us/mock-link-sivumaga-28", day: 0, startHour: 15, startMin: 30, endHour: 16, endMin: 30 },
    { med: "Japan", country: "Japan", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International Senior", age: "අවු: 11 - 16", time: "ඉරිදා 3:30 - 4:30 pm", localTime: "Sun. 7:00 - 8:00 pm (JST)", link: "https://zoom.us/mock-link-sivumaga-29", day: 0, startHour: 15, startMin: 30, endHour: 16, endMin: 30 }
];

let activeMedium = "Sinhala";

function getSLDate() {
    const nd = new Date();
    const utc = nd.getTime() + (nd.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 5.5)); // UTC + 5:30 for Sri Lanka Time
}

function isClassActive(item) {
    const slDate = getSLDate();
    const currentDay = slDate.getDay();
    const currentHour = slDate.getHours();
    const currentMin = slDate.getMinutes();

    if (currentDay !== item.day) return false;

    const currentMinutesSinceMidnight = currentHour * 60 + currentMin;
    const startMinutes = item.startHour * 60 + item.startMin;
    const endMinutes = item.endHour * 60 + item.endMin;

    return currentMinutesSinceMidnight >= startMinutes && currentMinutesSinceMidnight <= endMinutes;
}

function formatGender(gender, isEN) {
    if (!isEN) return gender;
    if (gender === 'පුරුෂ') return 'Male';
    if (gender === 'ස්ත්‍රී') return 'Female';
    if (gender === 'ස්ත්‍රී/පුරුෂ') return 'All (Boys & Girls)';
    return gender;
}

function formatType(type, isEN) {
    if (!isEN) return type;
    if (type === 'ආරාමීය') return 'Monastery';
    return type;
}

function formatSection(sec, isEN) {
    if (!isEN) return sec;
    const map = {
        'සිව්මග දරුවෝ පියවර 1 | 2': 'Siwmaga Boys Step 1 | 2',
        'සිව්මග දරුවෝ පියවර 3 | 4': 'Siwmaga Boys Step 3 | 4',
        'සිව්මග දරුවෝ පියවර 5 | 6': 'Siwmaga Boys Step 5 | 6',
        'සිව්මග දරුවෝ පියවර 7 | 8': 'Siwmaga Boys Step 7 | 8',
        'සිව්මග දියණි පියවර 1 | 2': 'Siwmaga Girls Step 1 | 2',
        'සිව්මග දියණි පියවර 3 | 4': 'Siwmaga Girls Step 3 | 4',
        'සිව්මග දියණි පියවර 5': 'Siwmaga Girls Step 5',
        'සිව්මග දියණි පියවර 7': 'Siwmaga Girls Step 7',
        'සිව්මග දියණි පියවර 8': 'Siwmaga Girls Step 8',
        'සිව්මග දියණි 9': 'Siwmaga Girls Step 9',
        'සිව්මග පිටරට Junior': 'Siwmaga Overseas Junior',
        'සිව්මග පිටරට Senior': 'Siwmaga Overseas Senior',
        'සිව්මග පිටරට': 'Siwmaga Overseas',
        'සිව්මග දරුවෝ - ආරාමය': 'Siwmaga Boys - Monastery',
        'සිව්මග දියණි - ආරාමය': 'Siwmaga Girls - Monastery',
    };
    return map[sec] || sec;
}

function formatAge(age, isEN) {
    if (!isEN) return age;
    return age.replace('අවු:', 'Age:');
}

function formatTime(time, isEN) {
    if (!isEN) return time;
    return time
        .replace('ඉරිදා', 'Sun.')
        .replace('සඳුදා', 'Mon.')
        .replace('අඟහ.', 'Tue.')
        .replace('බදාදා', 'Wed.')
        .replace('බ්‍රහස්.', 'Thu.')
        .replace('සිකු.', 'Fri.')
        .replace('සෙන.', 'Sat.');
}

function handleJoinClass(index) {
    const item = timetableData[index];
    const isActive = isClassActive(item);
    const isEN = document.documentElement.lang === 'en';

    if (isActive) {
        window.open(item.link, '_blank');
    } else {
        document.getElementById('class-status-title').innerText = isEN ? "Class Is Not Active Yet" : "පන්තිය තවමත් සක්‍රීය නැත";
        document.getElementById('class-status-message').innerHTML = isEN ? `
                    <span class="font-extrabold text-slate-800">${item.country}</span> class is scheduled for <br>
                    Sri Lanka Time: <span class="font-extrabold text-amber-600">${item.time}</span><br>
                    Your Local Time: <span class="font-extrabold text-blue-600">${item.localTime}</span>.<br>
                    <span class="text-xs text-slate-400 mt-2 block">Please join at the scheduled time.</span>
                ` : `
                    <span class="font-extrabold text-slate-800">${item.country}</span> පන්තිය පැවැත්වෙන්නේ <br>
                    ශ්‍රී ලංකා වේලාවෙන්: <span class="font-extrabold text-amber-600">${item.time}</span><br>
                    ඔබේ දේශීය වේලාවෙන්: <span class="font-extrabold text-blue-600">${item.localTime}</span>.<br>
                    <span class="text-xs text-slate-400 mt-2 block">කරුණාකර නියමිත වේලාවට සම්බන්ධ වන්න.</span>
                `;
        openClassStatusModal();
    }
}

function openClassStatusModal() {
    const modal = document.getElementById('class-status-modal');
    const content = document.getElementById('class-status-modal-content');
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 50);
}

function closeClassStatusModal() {
    const modal = document.getElementById('class-status-modal');
    const content = document.getElementById('class-status-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

document.getElementById('class-status-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeClassStatusModal();
    }
});

function switchMedium(medium) {
    activeMedium = medium;

    const tabSinhala = document.getElementById("tab-sinhala");
    const tabEnglish = document.getElementById("tab-english");
    const tabJapan = document.getElementById("tab-japan");

    const mTabSinhala = document.getElementById("modal-tab-sinhala");
    const mTabEnglish = document.getElementById("modal-tab-english");
    const mTabJapan = document.getElementById("modal-tab-japan");

    const activeStyle = "flex-1 sm:flex-none text-sm font-bold px-6 py-3.5 rounded-lg transition-all duration-300 bg-amber-500 text-white shadow-md flex items-center justify-center gap-2";
    const inactiveStyle = "flex-1 sm:flex-none text-sm font-bold px-6 py-3.5 rounded-lg transition-all duration-300 text-slate-700 hover:text-slate-900 flex items-center justify-center gap-2";

    const mActiveStyle = "flex-1 text-xs font-bold py-3 rounded-lg transition-all duration-300 bg-amber-500 text-white shadow-md flex items-center justify-center gap-1";
    const mInactiveStyle = "flex-1 text-xs font-bold py-3 rounded-lg transition-all duration-300 text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1";

    if (tabSinhala) tabSinhala.className = (medium === "Sinhala") ? activeStyle : inactiveStyle;
    if (tabEnglish) tabEnglish.className = (medium === "English") ? activeStyle : inactiveStyle;
    if (tabJapan) tabJapan.className = (medium === "Japan") ? activeStyle : inactiveStyle;

    if (mTabSinhala) mTabSinhala.className = (medium === "Sinhala") ? mActiveStyle : mInactiveStyle;
    if (mTabEnglish) mTabEnglish.className = (medium === "English") ? mActiveStyle : mInactiveStyle;
    if (mTabJapan) mTabJapan.className = (medium === "Japan") ? mActiveStyle : mInactiveStyle;

    filterTimetable();
}

function filterTimetable() {
    const desktopQuery = document.getElementById("timetable-search") ? document.getElementById("timetable-search").value.toLowerCase() : "";
    const modalQuery = document.getElementById("modal-timetable-search") ? document.getElementById("modal-timetable-search").value.toLowerCase() : "";

    // Check if mobile modal is active to determine which input query to read
    const isModalVisible = !document.getElementById("timetable-mobile-modal").classList.contains("hidden");
    const query = (isModalVisible ? modalQuery : desktopQuery).trim();

    const cardsContainer = document.getElementById("timetable-cards-container");
    const desktopTableBody = document.getElementById("timetable-rows");
    const desktopTable = document.getElementById("timetable-table");

    const warning = document.getElementById("no-timetable-results");
    const mWarning = document.getElementById("modal-no-timetable-results");

    // Filter logic: Search globally across all 3 mediums if query is not empty
    const filteredData = timetableData.map((item, originalIndex) => ({ ...item, originalIndex }))
        .filter(item => {
            const matchesQuery = item.country.toLowerCase().includes(query) ||
                item.age.toLowerCase().includes(query) ||
                item.sec.toLowerCase().includes(query) ||
                item.med.toLowerCase().includes(query);

            if (query === "") {
                // Empty query: Show only the selected tab's active medium
                return item.med === activeMedium;
            } else {
                // Query present: Search across all three tabs (Sinhala, English, Japan)
                return matchesQuery;
            }
        });

    if (filteredData.length === 0) {
        if (warning) warning.classList.remove("hidden");
        if (desktopTable) desktopTable.classList.add("hidden");
        if (mWarning) mWarning.classList.remove("hidden");
        if (cardsContainer) cardsContainer.innerHTML = '';
        if (desktopTableBody) desktopTableBody.innerHTML = '';
        return;
    } else {
        if (warning) warning.add ? warning.classList.add("hidden") : warning.classList.add("hidden");
        if (desktopTable) desktopTable.classList.remove("hidden");
        if (mWarning) mWarning.classList.add("hidden");
    }

    // Mobile view cards
    const isEN = document.documentElement.lang === 'en';
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        filteredData.forEach(item => {
            const badgeClass = item.type === "Online" ? "online" : "monastery";
            const isActive = isClassActive(item);

            const btnClass = isActive
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white animate-pulse shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                : "bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200";

            const btnLabel = isActive
                ? `<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span> ${isEN ? 'Join Class' : 'සම්බන්ධ වන්න'}`
                : `<i class="fa-solid fa-lock text-[10px] text-slate-400"></i> ${isEN ? 'Locked' : 'අගුළු දමා ඇත'}`;

            let medLabel = '';
            if (item.med === 'Sinhala') medLabel = isEN ? 'Sinhala Medium' : 'සිංහල මාධ්‍යය';
            else if (item.med === 'English') medLabel = 'English Medium';
            else if (item.med === 'Japan') medLabel = isEN ? 'Japanese Medium' : 'Japan Medium';

            const displayGender = formatGender(item.gender, isEN);
            const displayType = formatType(item.type, isEN);
            const displaySection = formatSection(item.sec, isEN);
            const displayAge = formatAge(item.age, isEN);
            const displayTime = formatTime(item.time, isEN);

            const card = `
                        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 transition-all duration-300">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">${medLabel}</span>
                                <span class="status-badge ${badgeClass}">${displayType}</span>
                            </div>
                            <h4 class="text-base font-bold text-slate-800 mb-2">${item.country}</h4>
                            <div class="grid grid-cols-2 gap-y-1.5 text-xs text-slate-600 mb-4">
                                <div><span class="font-bold text-slate-700">${isEN ? 'Gender:' : 'ස්ත්‍රී/පුරුෂ:'}</span> ${displayGender}</div>
                                <div><span class="font-bold text-slate-700">${isEN ? 'Age:' : 'වයස:'}</span> ${displayAge}</div>
                                <div class="col-span-2"><span class="font-bold text-slate-700">${isEN ? 'Division:' : 'අංශය:'}</span> ${displaySection}</div>
                            </div>
                            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 mb-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-slate-500">${isEN ? 'SL Time:' : 'ශ්‍රී ලංකා වේලාව:'}</span>
                                    <span class="text-xs font-bold text-amber-600">${displayTime}</span>
                                </div>
                                <div class="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                                    <span class="text-xs font-bold text-slate-500">${isEN ? 'Local Time:' : 'Local Time:'}</span>
                                    <span class="text-xs font-bold text-blue-600">${item.localTime}</span>
                                </div>
                            </div>
                            <button onclick="handleJoinClass(${item.originalIndex})" class="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 ${btnClass}">
                                ${btnLabel}
                            </button>
                        </div>
                    `;
            cardsContainer.innerHTML += card;
        });
    }

    // Desktop table rows
    if (desktopTableBody) {
        desktopTableBody.innerHTML = '';
        filteredData.forEach((item) => {
            const badgeClass = item.type === "Online" ? "online" : "monastery";
            const isActive = isClassActive(item);
            const btnClass = isActive
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/30 animate-[pulse_2.5s_infinite]"
                : "bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200";

            const btnLabel = isActive
                ? `<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span> ${isEN ? 'Join Class' : 'සම්බන්ධ වන්න'}`
                : `<i class="fa-solid fa-lock text-[10px] text-slate-400"></i> ${isEN ? 'Locked' : 'අගුළු දමා ඇත'}`;

            let rowMedLabel = '';
            if (item.med === 'Sinhala') {
                rowMedLabel = `<span class="ml-2 px-2.5 py-1 text-[10px] font-extrabold bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/25">${isEN ? 'Sinhala' : 'සිංහල'}</span>`;
            } else if (item.med === 'English') {
                rowMedLabel = '<span class="ml-2 px-2.5 py-1 text-[10px] font-extrabold bg-blue-500/10 text-blue-500 rounded-md border border-blue-500/25">English</span>';
            } else if (item.med === 'Japan') {
                rowMedLabel = `<span class="ml-2 px-2.5 py-1 text-[10px] font-extrabold bg-red-500/10 text-red-500 rounded-md border border-red-500/25">${isEN ? 'Japanese' : 'Japan'}</span>`;
            }

            const displayGender = formatGender(item.gender, isEN);
            const displayType = formatType(item.type, isEN);
            const displaySection = formatSection(item.sec, isEN);
            const displayAge = formatAge(item.age, isEN);
            const displayTime = formatTime(item.time, isEN);

            const rowHTML = `
                        <tr class="t-row t-${item.med.toLowerCase()}">
                            <td class="font-semibold text-slate-800">
                                <div class="flex items-center justify-center gap-1">
                                    <span>${item.country}</span>
                                    ${query !== "" ? rowMedLabel : ""}
                                </div>
                            </td>
                            <td><span class="status-badge ${badgeClass}">${displayType}</span></td>
                            <td>${displayGender}</td>
                            <td>${displaySection}</td>
                            <td class="font-medium text-slate-700">${displayAge}</td>
                            <td class="font-bold text-amber-600 text-xs">${displayTime}</td>
                            <td class="font-bold text-blue-600 text-xs">${item.localTime}</td>
                            <td>
                                <button onclick="handleJoinClass(${item.originalIndex})" class="inline-flex items-center justify-center gap-2 font-extrabold px-5 py-3 rounded-xl text-xs transition-all shadow-sm transform hover:-translate-y-0.5 active:scale-95 ${btnClass}">
                                    ${btnLabel}
                                </button>
                            </td>
                        </tr>
                    `;
            desktopTableBody.innerHTML += rowHTML;
        });
    }
}

function openTimetableModal() {
    const modal = document.getElementById('timetable-mobile-modal');
    const content = document.getElementById('timetable-modal-content');

    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 50);
    document.body.style.overflow = 'hidden';

    const desktopSearchVal = document.getElementById('timetable-search') ? document.getElementById('timetable-search').value : "";
    if (document.getElementById('modal-timetable-search')) {
        document.getElementById('modal-timetable-search').value = desktopSearchVal;
    }
    filterTimetable();
}

function closeTimetableModal() {
    const modalBox = document.getElementById('timetable-mobile-modal');
    const contentBox = document.getElementById('timetable-modal-content');

    contentBox.classList.remove('scale-100', 'opacity-100');
    contentBox.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modalBox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

document.getElementById('timetable-mobile-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeTimetableModal();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const isEN = document.documentElement.lang === 'en';
    switchMedium(isEN ? 'English' : 'Sinhala');
    setInterval(filterTimetable, 30000);
});



(function () {
    const viewport = document.getElementById('carousel3d-viewport');
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const prevBtn = document.getElementById('carousel3d-prev');
    const nextBtn = document.getElementById('carousel3d-next');
    const dotsContainer = document.getElementById('carousel3d-dots');

    const totalSlides = slides.length;
    let virtualIndex = 2000000 + 2;
    let dragOffset = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function getRealIndex() {
        const currentVirtual = virtualIndex + dragOffset;
        return ((currentVirtual % totalSlides) + totalSlides) % totalSlides;
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot-3d' + (i === getRealIndex() ? ' active-dot' : '');
            dot.addEventListener('click', () => {
                const currentReal = getRealIndex();
                if (i === currentReal) return;

                let diff = i - currentReal;
                if (diff < -totalSlides / 2) diff += totalSlides;
                if (diff > totalSlides / 2) diff -= totalSlides;

                virtualIndex += diff;
                updateCarousel();
                resetAutoplayTimer();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const realIndex = getRealIndex();

        slides.forEach((slide, idx) => {
            let offset = idx - realIndex;

            if (offset < -totalSlides / 2) offset += totalSlides;
            if (offset > totalSlides / 2) offset -= totalSlides;

            const absOffset = Math.abs(offset);

            if (absOffset > 2.2) {
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
                slide.style.transform = `translate3d(${offset > 0 ? 150 : -150}%, 0, 0) scale(0.4) rotateY(${offset > 0 ? -45 : 45}deg)`;
                slide.classList.remove('active-3d');
                return;
            }

            slide.style.visibility = 'visible';

            let opacity = 0;
            if (absOffset <= 1) {
                opacity = 1 - absOffset * (1 - 0.78);
            } else if (absOffset <= 2) {
                opacity = 0.78 - (absOffset - 1) * (0.78 - 0.35);
            } else {
                opacity = 0.35 - (absOffset - 2) * 0.35;
            }
            slide.style.opacity = Math.max(0, opacity).toString();
            slide.style.filter = `blur(${absOffset * 1.5}px)`;
            slide.style.zIndex = Math.round(10 - absOffset).toString();

            let translateX = offset * 260;
            let scale = 1 - (absOffset * 0.16);
            let rotateY = offset * -25;

            if (window.innerWidth < 768) {
                translateX = offset * 115;
                scale = 1 - (absOffset * 0.24);
                rotateY = offset * -15;
            } else if (window.innerWidth < 1024) {
                translateX = offset * 190;
            }

            if (isDragging) {
                slide.style.transition = 'none';
            } else {
                if (!slide.dataset.prevOffset) {
                    slide.dataset.prevOffset = offset.toString();
                }
                const prevOffset = parseFloat(slide.dataset.prevOffset);

                if (Math.abs(offset - prevOffset) > 2) {
                    slide.style.transition = 'none';
                    void slide.offsetHeight;
                } else {
                    slide.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease, filter 0.85s ease';
                }
            }
            slide.dataset.prevOffset = offset.toString();

            slide.style.transform = `translate3d(${translateX}px, 0, ${-absOffset * 40}px) scale(${scale}) rotateY(${rotateY}deg)`;

            if (absOffset < 0.5) {
                slide.classList.add('active-3d');
            } else {
                slide.classList.remove('active-3d');
            }
        });

        const realIntIndex = Math.round(realIndex) % totalSlides;
        const dots = document.querySelectorAll('.dot-3d');
        dots.forEach((dot, idx) => {
            if (idx === (realIntIndex + totalSlides) % totalSlides) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
    }

    let autoplayTimer = setInterval(() => {
        virtualIndex++;
        updateCarousel();
    }, 5000);

    function resetAutoplayTimer() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
            virtualIndex++;
            updateCarousel();
        }, 5000);
    }

    function goToSlide(direction) {
        virtualIndex += direction;
        updateCarousel();
        resetAutoplayTimer();
    }

    nextBtn.addEventListener('click', () => {
        goToSlide(1);
    });

    prevBtn.addEventListener('click', () => {
        goToSlide(-1);
    });

    slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
            const realIndex = getRealIndex();
            if (idx !== realIndex) {
                let diff = idx - realIndex;
                if (diff < -totalSlides / 2) diff += totalSlides;
                if (diff > totalSlides / 2) diff -= totalSlides;
                goToSlide(diff);
            }
        });
    });

    let lastWheelTime = 0;

    function moveCarousel(direction) {
        goToSlide(direction);
    }

    // Mouse Drag Scrolling & Interactive Swiping Feature
    const dragThreshold = 8;
    let clickPrevented = false;

    function getStepSize() {
        if (window.innerWidth < 768) return 115;
        if (window.innerWidth < 1024) return 190;
        return 260;
    }

    viewport.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left click
        isDragging = true;
        startX = e.clientX;
        currentX = e.clientX;
        dragOffset = 0;
        viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const deltaX = currentX - startX;
        dragOffset = -deltaX / getStepSize();
        updateCarousel();

        if (Math.abs(deltaX) > dragThreshold) {
            clickPrevented = true;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        viewport.style.cursor = 'grab';

        const slideChange = Math.round(dragOffset);
        virtualIndex += slideChange;
        dragOffset = 0;
        updateCarousel();
        resetAutoplayTimer();

        if (clickPrevented) {
            setTimeout(() => {
                clickPrevented = false;
            }, 50);
        }
    });

    // Prevent browser image dragging behavior
    viewport.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Interactive Touch Support
    viewport.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = e.touches[0].clientX;
        dragOffset = 0;
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        dragOffset = -deltaX / getStepSize();
        updateCarousel();

        if (Math.abs(deltaX) > dragThreshold) {
            clickPrevented = true;
        }
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const slideChange = Math.round(dragOffset);
        virtualIndex += slideChange;
        dragOffset = 0;
        updateCarousel();
        resetAutoplayTimer();

        if (clickPrevented) {
            setTimeout(() => {
                clickPrevented = false;
            }, 50);
        }
    }, { passive: true });

    viewport.addEventListener('click', (e) => {
        if (clickPrevented) {
            e.stopPropagation();
            e.preventDefault();
            clickPrevented = false;
        } else {
            viewport.focus();
        }
    }, true);

    viewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            moveCarousel(1);
            resetAutoplayTimer();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            moveCarousel(-1);
            resetAutoplayTimer();
        }
    });

    viewport.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

        const now = Date.now();
        if (now - lastWheelTime < 160) return;

        e.preventDefault();
        lastWheelTime = now;
        moveCarousel(e.deltaY > 0 ? 1 : -1);
        resetAutoplayTimer();
    }, { passive: false });

    window.addEventListener('resize', debounce(updateCarousel, 100));

    buildDots();
    updateCarousel();
})();



const youthYoutubeData = {
    latest: [
        {
            id: "xt0GDSVk4J4",
            title: "ඔබ සතුටින්ද ඉන්නේ",
            desc: "නිවන මූලික කරගත් නිවැරදි අවබෝධයෙන් ලොව දකින ගුණ නැණ බෙලෙන් සපිරි උතුම් දුදරු කැළක් ලොවට දායාද කිරීම උදෙසා...",
            thumb: "https://img.youtube.com/vi/xt0GDSVk4J4/0.jpg",
            type: "video"
        },
        {
            id: "sWimbFKrw94",
            title: "අම්මගෙ ආදරේ නොමිලේද ලැබුනේ",
            desc: "නිවන මූලික කරගත් නිවැරදි අවබෝධයෙන් ලොව දකින ගුණ නැණ බෙලෙන් සපිරි උතුම් දුදරු කැළක් ලොවට දායාද කිරීම උදෙසා... ",
            thumb: "https://img.youtube.com/vi/sWimbFKrw94/0.jpg",
            type: "video"
        },
        {
            id: "xvbuizKzpuA",
            title: "සතුටින් ඉන්න නම්...",
            desc: "නිවන මූලික කරගත් නිවැරදි අවබෝධයෙන් ලොව දකින ගුණ නැණ බෙලෙන් සපිරි උතුම් දුදරු කැළක් ලොවට දායාද කිරීම උදෙසා... ",
            thumb: "https://img.youtube.com/vi/xvbuizKzpuA/0.jpg",
            type: "video"
        }
    ],
    popular: [
        { id: "UomBOw-x0Zc", title: "තරුණ පරපුරට ජීවිතය දිනන්නට දහම් උපදෙස්", desc: "නැරඹුම් වාර දහස් ගණනක් පසුකළ විශිෂ්ට දේශනාව", thumb: "https://img.youtube.com/vi/UomBOw-x0Zc/0.jpg", type: "video" },
        { id: "ZMtJvYUMaSc", title: "නිවැරදි මාවත සොයායන තාරුණ්‍යයට බුදු දහම", desc: "නූතන සමාජයට ගැළපෙන සැබෑ දහම් සන්නිවේදනය", thumb: "https://img.youtube.com/vi/ZMtJvYUMaSc/0.jpg", type: "video" },
        { id: "niRsWkJ9Ccs", title: "පවුලේ සැමට සැනසීම ළඟා කරන ආශිර්වාද සෙත් පිරිත්", desc: "නිවසට සෞභාග්‍යය උදා කරන බලසම්පන්න සජ්ඣායනය", thumb: "https://img.youtube.com/vi/niRsWkJ9Ccs/0.jpg", type: "video" },
        { id: "QyQTGBvo6aQ", title: "කුඩා දරුවන්ගේ ගුණධර්ම වර්ධනය කරන දහම් පන්ති", desc: "පුංචි දූ දරුවන් වෙනුවෙන්ම සකස් කළ දහම් අත්වැල", thumb: "https://img.youtube.com/vi/QyQTGBvo6aQ/0.jpg", type: "video" }
    ],
    shorts: [
        { id: "Mqeo5XQ85tU", title: "තත්පර 60න් සිත එකඟ කරගන්නා විශ්මිත ක්‍රමය", desc: "🔥 1 MILLION+ VIEWS! ලක්ෂ සංඛ්‍යාත පිරිසක් නැරඹූ කෙටි දේශනාව", thumb: "https://img.youtube.com/vi/Mqeo5XQ85tU/0.jpg", type: "short", special: true },
        { id: "fq77AgjStUg", title: "යහපත් ජීවිතයකට puංචි දහම් පණිවිඩයක්", desc: "තරුණ සිතුවිලි නිවැරදි දිශාවට මෙහෙයවන්නට", thumb: "https://img.youtube.com/vi/fq77AgjStUg/0.jpg", type: "short" },
        { id: "Rm7eVI_ZjIg", title: "අපහසු අවස්ථාවන්හිදී නොසැලී සිටින්නේ කෙසේද?", desc: "ලොව්තුරු දහමෙන් ජීවිතයට ශක්තියක්", thumb: "https://img.youtube.com/vi/Rm7eVI_ZjIg/0.jpg", type: "short" },
        { id: "gTIUlD3ZMtM", title: "පුංචි දරුවන්ට ආදර්ශවත් බෞද්ධ කතාවක්", desc: "ගුණධර්ම පිරි සදාචාරවත් දරු පරපුරක් උදෙසා", thumb: "https://img.youtube.com/vi/gTIUlD3ZMtM/0.jpg", type: "short" }
    ]
};

let currentActiveTab = 'latest';
let currentlySelectedVideoId = "xt0GDSVk4J4";
let isIframeActive = false;

function changeMainVideo(youtubeId, title) {
    currentlySelectedVideoId = youtubeId;
    const videoTitle = document.getElementById('main-youtube-title');
    if (videoTitle) videoTitle.innerText = title;

    if (isIframeActive) {
        const iframe = document.getElementById('main-youtube-iframe');
        if (iframe) {
            iframe.style.opacity = '0';
            setTimeout(() => {
                iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
                iframe.style.opacity = '1';
            }, 200);
        }
    } else {
        const facadeImg = document.getElementById('facade-thumbnail');
        if (facadeImg) {
            facadeImg.src = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }
    }

    const cards = document.querySelectorAll('.youtube-side-item');
    cards.forEach(card => {
        if (card.getAttribute('data-video-id') === youtubeId) {
            card.classList.add('border-red-500', 'bg-red-500/10');
            card.classList.remove('border-transparent');
        } else {
            card.classList.remove('border-red-500', 'bg-red-500/10');
            card.classList.add('border-transparent');
        }
    });
}

function activateRealYoutubeIframe() {
    const container = document.getElementById('yt-player-container');
    if (!container) return;

    container.innerHTML = `
                <iframe id="main-youtube-iframe" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" src="https://www.youtube.com/embed/${currentlySelectedVideoId}?autoplay=1" title="Siwmaga YouTube Player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            `;
    isIframeActive = true;
}

function switchYoutubeTab(tab) {
    currentActiveTab = tab;

    const tabs = ['latest', 'popular', 'shorts'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-yt-${t}`);
        if (btn) {
            if (t === tab) {
                btn.className = "flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/20";
            } else {
                btn.className = "flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 text-slate-400 hover:text-white flex items-center justify-center gap-1.5";
            }
        }
    });

    renderPlaylist(tab);
}

function renderPlaylist(tab) {
    const container = document.getElementById('youtube-sidebar-playlist');
    if (!container) return;

    container.innerHTML = '';
    const items = youthYoutubeData[tab];

    items.forEach((item) => {
        const isSpecial = item.special ? 'glowing-short-border border-2' : '';
        const specialBadge = item.special
            ? `<span class="absolute top-1 left-1 bg-gradient-to-r from-yellow-500 to-red-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow animate-bounce">🔥 1M+ Views</span>`
            : '';

        const cardHTML = `
                    <button onclick="changeMainVideo('${item.id}', '${item.title}')" 
                            class="youtube-side-item w-full flex items-center gap-3 p-2.5 rounded-2xl border ${isSpecial ? isSpecial : 'border-transparent'} bg-slate-900/60 hover:bg-slate-900 text-left transition-all duration-300 relative group overflow-hidden" 
                            data-video-id="${item.id}">
                        
                        <div class="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                            <img src="${item.thumb}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="${item.title}">
                            ${specialBadge}
                            <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span class="bg-white/20 p-2 rounded-full backdrop-blur-md"><i class="fa-solid fa-play"></i></span>
                            </div>
                        </div>

                        <div class="flex-grow min-w-0">
                            <h4 class="text-xs sm:text-sm font-bold text-white truncate leading-snug group-hover:text-red-400 transition-colors">${item.title}</h4>
                            <p class="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">${item.desc}</p>
                        </div>
                    </button>
                `;
        container.innerHTML += cardHTML;
    });

    if (items.length > 0) {
        changeMainVideo(items[0].id, items[0].title);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    switchYoutubeTab('latest');
});



// High Quality News & Announcement Dataset (Featuring Sinhala & English versions)
const newsDataset = {
    'japan-class': {
        title: "හිරු නැගෙන දේශයට සදහම් සිසිලස - නව ජපන් මාධ්‍ය දහම් පාසල",
        date: "2026 ජූලි 12",
        badge: "නව පන්ති ආරම්භය",
        image: "image/carousel/japan.png",
        desc: "ජපානයේ වෙසෙන ආදරණීය සිංහල දූ දරුවන් උදෙසා සුවිශේෂී ලෙස ජපන් මාධ්‍යයෙන් (Japanese Medium) පවත්වනු ලබන නවතම දහම් පන්ති මාලාව මෙම සතියේ සිට ආරම්භ වේ.",
        text: [
            "සිව්මග ධර්මායතනය මගින් නැගී එන හිරුගේ දේශය වන ජපානයේ (Japan) වෙසෙන දූ දරුවන්ට සදහම් ආලෝකය තිළිණ කරමින් ජපන් මාධ්‍යයෙන් පැවැත්වෙන නවතම දහම් පන්ති මාලාව මෙම සතියේ සිට ඇරඹේ.",
            "ජපන් සමාජයේ හැදී වැඩෙන දරුවන්ට වඩාත් පහසුවෙන් තේරුම් ගත හැකි පරිදි සරල ජපන් මාධ්‍යයෙන් (Japanese Medium) බුදු දහමේ සාරධර්ම, බෞද්ධ ඉතිහාසය සහ ප්‍රතිපත්ති පූජාවන් මෙහිදී ආකර්ෂණීය ලෙස සාකච්ඡා කෙරේ.",
            "වයස අවුරුදු 6-10 සහ අවුරුදු 11-16 ලෙස වයස් කාණ්ඩ දෙකක් යටතේ සෑම ඉරිදා දිනකම ශ්‍රී ලංකා වේලාවෙන් දහවල් 12:00 සිට 01:00 දක්වා (ජපාන වේලාවෙන් පස්වරු 3:30 - 4:30) Online (Zoom) තාක්ෂණය ඔස්සේ මෙම පන්ති පැවැත්වෙනු ඇත."
        ]
    },
    'school-reg': {
        title: "2026 අවුරුදු නිවාඩු නිවේදනය",
        date: "2026 අප්‍රේල් 01",
        badge: "විශේෂ නිවේදන",
        image: "image/News/newyear.webp",
        desc: "සිංහල හා හින්දු අලුත් අවුරුද්ද නිමිත්තෙන් සිව්මග ධර්මායතනයේ සියලුම පන්ති සඳහා අප්‍රේල් 05 සිට 18 දක්වා නිවාඩු ලබා දෙන බවත්, අප්‍රේල් 18 වනදා සිට පන්ති නැවත ආරම්භ වන බවත් දන්වා සිටිමු.",
        text: [
            "සිංහල හා හින්දු අලුත් අවුරුද්ද නිමිත්තෙන් සිව්මග ධර්මායතනයේ සියලුම පන්ති සඳහා අප්‍රේල් 05 සිට 18 දක්වා නිවාඩු ලබා දෙන බව කාරුණිකව දන්වා සිටිමු.",
            "මෙම කාල සීමාව තුළ දරුවන් නිවෙස්වල රැඳී සිටිමින් දෙමාපියන් සමඟ එක්ව බොදු සිරිත් විරිත්වලට මුල් තැන දෙමින් අවුරුදු සැමරීමටත්, සදාචාර සම්පන්න හැසිරීම් පුරුදු කිරීමටත් උනන්දු කරවන්න.",
            "අප්‍රේල් 18 වනදායින් පසුව නැවත සුපුරුදු පරිදි කාලසටහනට අනුව පන්ති ආරම්භ වන බව සලකන්න."
        ]
    },
    'social-help': {
        title: "මිලියනයක් පිරිස වැලඳගත් 'මල් මැජික්' එක",
        date: "2026 මාර්තු 15",
        badge: "දහම් නිර්මාණ",
        image: "image/News/DA.webp",
        desc: "පෙති අටේ මලක් නටුවෙන් වෙන් කරද්දී මලට මොකද වුණේ? ලක්ෂ සංඛ්‍යාත පිරිසක් නැරඹූ, හේතු-ඵල දහම ගැන සරලව කියාදෙන මෙම අපූරු වීඩියෝව අදම නරඹන්න...",
        text: [
            "පෙති අටේ මලක් නටුවෙන් වෙන් කරද්දී මලට මොකද වුණේ? ලක්ෂ සංඛ්‍යාත පිරිසක් නැරඹූ, හේතු-ඵල දහම ගැන සරලව කියාදෙන මෙම අපූරු වීඩියෝව අදම නරඹන්න.",
            "පෙති අටක් ඇති මලක් නටුවෙන් වෙන් කරද්දී එහි පැවැත්මට සිදුවන වෙනස්කම් සහ විශ්වයේ ක්‍රියාත්මක වන හේතු-ඵල සම්බන්ධය ළමා මනසට පහසුවෙන් අවබෝධ කරගත හැකි සරල විද්‍යාත්මක ආදර්ශනයකින් මෙහි දක්වා ඇත."
        ]
    },
    'meditation-program': {
        title: "2026 නව අධ්‍යයන වර්ෂයේ ආරම්භය සහ කාලසටහන",
        date: "2026 ජනවාරි 03",
        badge: "නව වසරේ ඇරඹුම",
        image: "image/News/medi.webp",
        desc: "සිව්මග ධර්මායතනයේ 2026 නව අධ්‍යයන වර්ෂය ජනවාරි 03 වනදා සිට ආරම්භ වේ. නව වසරේ පන්ති වේලාවන්හි සංශෝධන පවතින බැවින්, අදාළ කාලසටහනන අනුව දරුවන් සම්බන්ධ කිරීමට කාරුණික වන්න.",
        text: [
            "සිව්මග ධර්මායතනයේ 2026 නව අධ්‍යයන වර්ෂය ජනවාරි 03 වනදා සිට ආරම්භ වේ. නව වසරේ පන්ති වේලාවන්හි සංශෝධන පවතින බැවින්, අදාළ කාලසටහනන අනුව දරුවන් සම්බන්ධ කිරීමට කාරුණික වන්න.",
            "නව වසරේ දරුවන්ගේ දහම් දැනුම හා ගුණධර්ම වර්ධනය වෙනුවෙන් සතිපතා පැවැත්වෙන පන්ති පැවැත්වෙන වේලාවන් සහ සබැඳි කාලසටහන මඟින් පහසුවෙන් සොයාගත හැක."
        ]
    }
};

const newsDatasetEN = {
    'japan-class': {
        title: "Dhamma Peace for the Land of the Rising Sun - New Japanese Medium Dhamma School",
        date: "July 12, 2026",
        badge: "New Class Launch",
        image: "image/carousel/japan.png",
        desc: "Specially conducted in Japanese Medium for children living in Japan, our brand-new Dhamma class series commences from this week.",
        text: [
            "Siwmaga Dharmayathanaya introduces a new Japanese Medium Dhamma class series starting this week, illuminating the lives of children living in Japan with the sublime light of the Dhamma.",
            "Tailored specifically for children growing up in Japanese society, fundamental Buddhist virtues, history, and noble practices will be discussed interactively in simple Japanese.",
            "Classes will be held every Sunday via Zoom technology for age groups 6–10 and 11–16 from 12:00 PM to 01:00 PM Sri Lanka Time (3:30 PM – 4:30 PM Japan Standard Time)."
        ]
    },
    'school-reg': {
        title: "2026 New Year Vacation Announcement",
        date: "April 01, 2026",
        badge: "Special Notice",
        image: "image/News/newyear.webp",
        desc: "On account of the Sinhala and Tamil New Year, all Siwmaga Dharmayathanaya classes will be on vacation from April 05 to April 18. Regular classes resume from April 18.",
        text: [
            "We kindly announce that all classes conducted by Siwmaga Dharmayathanaya will remain closed for the New Year vacation from April 05 to April 18, 2026.",
            "During this holiday period, parents are encouraged to guide children in observing traditional Buddhist values, spending quality family time, and practicing wholesome conduct.",
            "Please note that all regular Dhamma classes will resume according to the normal timetable starting from April 18."
        ]
    },
    'social-help': {
        title: "The 'Flower Magic' Video Reaching Over A Million Viewers",
        date: "March 15, 2026",
        badge: "Dhamma Creations",
        image: "image/News/DA.webp",
        desc: "What happens when an eight-petaled flower is severed from its stem? Watch this remarkable video explaining the law of cause and effect in a simple and captivating way...",
        text: [
            "What happens to a flower when its eight petals are detached from the stem? Watch this inspiring demonstration viewed by hundreds of thousands, explaining cause and effect in simple terms.",
            "This captivating visual demonstration illustrates the law of dependent origination (Hetu-Phala) and cause-and-effect relationships in nature in a way that young minds can easily grasp and appreciate."
        ]
    },
    'meditation-program': {
        title: "Commencement & Schedule of the 2026 Academic Year",
        date: "January 03, 2026",
        badge: "New Academic Year",
        image: "image/News/medi.webp",
        desc: "The 2026 academic year of Siwmaga Dharmayathanaya begins on January 03. Please refer to the updated timetable to join classes accordingly.",
        text: [
            "The 2026 academic year at Siwmaga Dharmayathanaya commences on January 03. As there are minor revisions to class times in the new year, please ensure your child connects according to the updated schedule.",
            "Weekly class schedules and direct Zoom access links designed to foster spiritual wisdom and moral growth in children can be easily found in the interactive timetable section."
        ]
    }
};

function getActiveNewsDataset() {
    return document.documentElement.lang === 'en' ? newsDatasetEN : newsDataset;
}

const newsKeys = Object.keys(newsDataset);
let newsCarouselIndex = 0;
let isNewsDragging = false;
let newsStartX = 0;
let newsCurrentX = 0;
let newsDragOffset = 0;
let isNewsClickPrevented = false;

function renderNewsCards() {
    const track = document.getElementById('news-track');
    if (!track) return;
    track.innerHTML = '';

    const isEN = document.documentElement.lang === 'en';
    const activeDataset = getActiveNewsDataset();
    const keys = Object.keys(activeDataset);

    keys.forEach(key => {
        const item = activeDataset[key];
        const btnText = isEN ? 'Read More' : 'වැඩිදුර කියවන්න';
        const card = `
                    <div class="news-card flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-md flex flex-col border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <div class="relative h-48 overflow-hidden shimmer-skeleton bg-slate-200">
                            <img class="w-full h-full object-cover lazy-image fade-in-ready"
                                data-src="${item.image}"
                                alt="${item.title}" decoding="async">
                            <span class="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md z-10">${item.badge}</span>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <div class="text-slate-400 text-[11px] font-bold mb-2 flex items-center gap-1">
                                <i class="far fa-calendar-alt"></i> <span>${item.date}</span>
                            </div>
                            <h3 class="text-base font-extrabold text-slate-800 mb-3 line-clamp-2 leading-snug">${item.title}</h3>
                            <p class="text-slate-600 text-xs mb-5 line-clamp-3 leading-relaxed">${item.desc}</p>
                            <button onclick="openNewsModal('${key}')"
                                class="mt-auto text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 group self-start transition-colors">
                                ${btnText} <i class="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                            </button>
                        </div>
                    </div>
                `;
        track.innerHTML += card;
    });

    // Re-apply image lazy loading for dynamic elements
    const lazyImages = track.querySelectorAll('.lazy-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.parentElement.classList.remove('shimmer-skeleton');
                        img.classList.add('loaded');
                    };
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '0px 0px 200px 0px' });
    lazyImages.forEach(img => imageObserver.observe(img));

    buildNewsDots();
    updateNewsSlider();
}

function getNewsVisibleCount() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
}

function buildNewsDots() {
    const dotsContainer = document.getElementById('news-dots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    const visibleCount = getNewsVisibleCount();
    const totalSteps = Math.max(1, newsKeys.length - visibleCount + 1);

    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('div');
        dot.className = 'w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ' +
            (i === newsCarouselIndex ? 'bg-amber-500 w-6' : 'bg-slate-300 hover:bg-slate-400');
        dot.addEventListener('click', () => {
            newsCarouselIndex = i;
            updateNewsSlider();
            resetNewsAutoplay();
        });
        dotsContainer.appendChild(dot);
    }
}

function updateNewsSlider() {
    const track = document.getElementById('news-track');
    if (!track) return;

    const visibleCount = getNewsVisibleCount();
    const totalSteps = Math.max(1, newsKeys.length - visibleCount + 1);

    if (newsCarouselIndex >= totalSteps) {
        newsCarouselIndex = 0;
    } else if (newsCarouselIndex < 0) {
        newsCarouselIndex = totalSteps - 1;
    }

    const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth : 0;
    const gap = 24; // Equivalent to gap-6
    let translateValue = newsCarouselIndex * (cardWidth + gap);

    if (isNewsDragging) {
        translateValue += newsDragOffset;
        track.style.transition = 'none';
    } else {
        track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    track.style.transform = `translate3d(${-translateValue}px, 0, 0)`;

    // Update active dot
    const dots = document.querySelectorAll('#news-dots div');
    dots.forEach((dot, idx) => {
        if (idx === newsCarouselIndex) {
            dot.className = 'w-6 h-2 rounded-full cursor-pointer transition-all duration-300 bg-amber-500';
        } else {
            dot.className = 'w-2 h-2 rounded-full cursor-pointer transition-all duration-300 bg-slate-300 hover:bg-slate-400';
        }
    });
}

// Slide logic & Touch-to-swipe handling
const prevBtn = document.getElementById('news-prev');
const nextBtn = document.getElementById('news-next');

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        newsCarouselIndex--;
        updateNewsSlider();
        resetNewsAutoplay();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        newsCarouselIndex++;
        updateNewsSlider();
        resetNewsAutoplay();
    });
}

// Drag/Swipe Functionality
const trackContainer = document.getElementById('news-track');
if (trackContainer) {
    const startDrag = (clientX) => {
        isNewsDragging = true;
        newsStartX = clientX;
        newsDragOffset = 0;
        trackContainer.style.cursor = 'grabbing';
    };

    const moveDrag = (clientX) => {
        if (!isNewsDragging) return;
        const diffX = clientX - newsStartX;
        newsDragOffset = -diffX;
        updateNewsSlider();

        if (Math.abs(diffX) > 8) {
            isNewsClickPrevented = true;
        }
    };

    const endDrag = () => {
        if (!isNewsDragging) return;
        isNewsDragging = false;
        trackContainer.style.cursor = 'grab';

        const cardWidth = trackContainer.firstElementChild ? trackContainer.firstElementChild.offsetWidth : 100;
        const step = Math.round(newsDragOffset / (cardWidth + 24));

        newsCarouselIndex += step;
        newsDragOffset = 0;
        updateNewsSlider();
        resetNewsAutoplay();

        if (isNewsClickPrevented) {
            setTimeout(() => { isNewsClickPrevented = false; }, 50);
        }
    };

    trackContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        startDrag(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        moveDrag(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        endDrag();
    });

    // Touch support for mobiles
    trackContainer.addEventListener('touchstart', (e) => {
        startDrag(e.touches[0].clientX);
    }, { passive: true });

    trackContainer.addEventListener('touchmove', (e) => {
        moveDrag(e.touches[0].clientX);
    }, { passive: true });

    trackContainer.addEventListener('touchend', () => {
        endDrag();
    }, { passive: true });
}

// Autoplay Loop Functionality
let newsAutoplayTimer = setInterval(() => {
    newsCarouselIndex++;
    updateNewsSlider();
}, 6000);

function resetNewsAutoplay() {
    clearInterval(newsAutoplayTimer);
    newsAutoplayTimer = setInterval(() => {
        newsCarouselIndex++;
        updateNewsSlider();
    }, 6000);
}

// Modal triggers
function openNewsModal(key) {
    if (isNewsClickPrevented) return;
    const activeDataset = getActiveNewsDataset();
    const item = activeDataset[key];
    if (!item) return;

    document.getElementById('modal-img').src = item.image;
    document.getElementById('modal-badge').innerText = item.badge;
    document.getElementById('modal-date').innerText = item.date;
    document.getElementById('modal-title').innerText = item.title;

    const textContainer = document.getElementById('modal-text');
    textContainer.innerHTML = '';
    item.text.forEach(p => {
        textContainer.innerHTML += `<p class="mb-4">${p}</p>`;
    });

    const modal = document.getElementById('news-modal');
    const content = document.getElementById('news-modal-content');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 50);
}

function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    const content = document.getElementById('news-modal-content');

    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close on clicking outside modal content
document.getElementById('news-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeNewsModal();
    }
});

window.addEventListener('resize', debounce(() => {
    buildNewsDots();
    updateNewsSlider();
}, 150));

window.addEventListener('DOMContentLoaded', () => {
    renderNewsCards();
});



(function () {
    const footer = document.getElementById('footer');
    let isMapLoaded = false;

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isMapLoaded) {
                isMapLoaded = true;
                loadD3LibraryAndMap();
                footerObserver.unobserve(footer);
            }
        });
    }, { rootMargin: '300px 0px' });

    footerObserver.observe(footer);

    async function loadD3LibraryAndMap() {
        try {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js");
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js");

            initializeFooterD3Map();
        } catch (error) {
            console.error("Failed to load D3/TopoJSON libraries asynchronously:", error);
        }
    }

    function initializeFooterD3Map() {
        const wrap = document.getElementById('footer-map-wrap');
        let width = wrap.offsetWidth;
        let height = wrap.offsetHeight;
        const svg = d3.select("#footer-dynamic-map")
            .attr("width", width)
            .attr("height", height);

        const locations = [
            { name: "Sri Lanka", coords: [80.7718, 7.8731], flag: "https://flagcdn.com/w40/lk.png", center: true },
            { name: "Australia", coords: [133.7751, -25.2744], flag: "https://flagcdn.com/w40/au.png" },
            { name: "Japan", coords: [138.2529, 36.2048], flag: "https://flagcdn.com/w40/jp.png" },
            { name: "England", coords: [-1.5, 52.5], flag: "https://flagcdn.com/w40/gb-eng.png" },
            { name: "USA", coords: [-95.7129, 37.0902], flag: "https://flagcdn.com/w40/us.png" },
            { name: "Canada", coords: [-106.3468, 56.1304], flag: "https://flagcdn.com/w40/ca.png" },
            { name: "Italy", coords: [12.5674, 41.8719], flag: "https://flagcdn.com/w40/it.png" },

        ];

        const projection = d3.geoMercator()
            .scale(width / 6.5)
            .translate([width / 2, height / 1.5]);
        const path = d3.geoPath().projection(projection);

        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
            .then(worldData => {
                const countries = topojson.feature(worldData, worldData.objects.countries);

                svg.selectAll(".land")
                    .data(countries.features)
                    .enter()
                    .append("path")
                    .attr("class", "land")
                    .attr("d", path);

                const sPoint = projection(locations[0].coords);

                locations.forEach((loc, i) => {
                    const tPoint = projection(loc.coords);

                    if (i > 0) {
                        const globalList = d3.select("#global-branch-list");
                        if (globalList.node() && globalList.selectAll("li").size() < locations.length - 1) {
                            globalList.append("li")
                                .html(`<img src="${loc.flag}" alt="${loc.name} flag" class="w-[18px] h-auto rounded-sm"> ${loc.name}`);
                        }

                        const dx = tPoint[0] - sPoint[0],
                            dy = tPoint[1] - sPoint[1],
                            dr = Math.sqrt(dx * dx + dy * dy) * 1.3;

                        const pLine = svg.append("path")
                            .attr("class", "link")
                            .attr("d", `M${sPoint[0]},${sPoint[1]}A${dr},${dr} 0 0,1 ${tPoint[0]},${tPoint[1]}`);

                        const dot = svg.append("circle")
                            .attr("class", "moving-dot")
                            .attr("r", 2.5);

                        function anim() {
                            dot.transition()
                                .duration(5000 + Math.random() * 3000)
                                .attrTween("transform", () => t => {
                                    const length = pLine.node().getTotalLength();
                                    const p = pLine.node().getPointAtLength(t * length);
                                    return `translate(${p.x},${p.y})`;
                                })
                                .on("end", anim);
                        }
                        anim();
                    }

                    const lbl = svg.append("g")
                        .attr("transform", `translate(${tPoint[0] + 5}, ${tPoint[1] - 8})`);

                    lbl.append("rect")
                        .attr("class", "label-box")
                        .attr("width", 54)
                        .attr("height", 15)
                        .attr("fill", "white")
                        .attr("opacity", 0.75);

                    lbl.append("text")
                        .attr("x", 5)
                        .attr("y", 11)
                        .text(loc.name)
                        .style("font-size", "8px")
                        .style("font-family", "Inter, sans-serif")
                        .style("fill", "#050c16")
                        .style("font-weight", "bold");

                    svg.append("circle")
                        .attr("cx", tPoint[0])
                        .attr("cy", tPoint[1])
                        .attr("r", loc.center ? 5 : 3.5)
                        .attr("fill", loc.center ? "#f39c12" : "#00eaff")
                        .attr("filter", "drop-shadow(0px 0px 4px rgba(243, 156, 18, 0.8))");
                });
            })
            .catch(err => {
                console.error("D3 map failed to load", err);
            });

        window.addEventListener('resize', debounce(() => {
            width = wrap.offsetWidth;
            height = wrap.offsetHeight;
            svg.attr("width", width).attr("height", height);
        }, 150));
    }
})();
