
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
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 1 | 2", age: "අවු: 7 - 8", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://teams.microsoft.com/l/team/19%3AvSvO_vIq7HYpia44ayCUcF0ITQ0Jj6Xz-ZNKpDuq6CE1%40thread.tacv2/conversations?groupId=c2da8095-9eaa-4754-bc79-f47b6015ad0c&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 3 | 4", age: "අවු: 9 - 10", time: "ඉරිදා 3:30 - 5:00 pm", localTime: "ඉරිදා 3:30 - 5:00 pm", link: "https://teams.microsoft.com/l/team/19%3A8dgoU7VtZ3bG6l9EHi85R0RWSy-9vJmjZXJeuSiSMjI1%40thread.tacv2/conversations?groupId=397aa08d-6c06-4f09-9f26-7d619f207a70&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 15, startMin: 30, endHour: 17, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 5 | 6", age: "අවු: 11 - 12", time: "ඉරිදා 3:30 - 5:00 pm", localTime: "ඉරිදා 3:30 - 5:00 pm", link: "https://teams.microsoft.com/l/team/19%3AC9zB69VdgezkoVxURunhAjWDgAX7ANOdWZIAR4jQ-1Q1%40thread.tacv2/conversations?groupId=e3d04842-d473-4cc8-9ddd-48b6569a2d36&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 15, startMin: 30, endHour: 17, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ පියවර 7 | 8 | 9", age: "අවු: 13 - 16", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://teams.microsoft.com/l/team/19%3AfGW9tygJ5dA5Lyak1mjBDh8Q7P6fjlnG0MaN60bW-X01%40thread.tacv2/conversations?groupId=a031c7ab-e5bd-4591-84f5-e47eb2ec25c2&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 1 | 2", age: "අවු: 7 - 8", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://teams.microsoft.com/l/team/19%3AgISzipARn--5QZifTg5Lj9KELxNUewMle8scAwTmmKI1%40thread.tacv2/conversations?groupId=bd9e2272-0beb-466d-91fa-e13e6da695cc&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 3 | 4", age: "අවු: 9 - 10", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://teams.microsoft.com/l/team/19%3AfpoZC-3u_1Rm6t9oxkLcDFnWf6Ln6a5A3c6J5rI6Pok1%40thread.tacv2/conversations?groupId=4a83a98a-ea70-4612-8402-ae4614878747&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 5", age: "අවු: 11", time: "ඉරිදා 7:00 - 8:30 pm", localTime: "ඉරිදා 7:00 - 8:30 pm", link: "https://teams.microsoft.com/l/team/19%3A9cXF3kPtc0t0vNcvTcimIQzNMVWo8kEftb6nvJKjAHI1%40thread.tacv2/conversations?groupId=b0d7b742-e5e7-40eb-bbcb-a1f23c96bb4e&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 19, startMin: 0, endHour: 20, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 7", age: "අවු: 13", time: "ඉරිදා 5:30 - 7:00 pm", localTime: "ඉරිදා 5:30 - 7:00 pm", link: "https://teams.microsoft.com/l/team/19%3AMvIgUagGRv7SuYJgc_R8Ad1z2b7rBjXlgpieK125Aes1%40thread.tacv2/conversations?groupId=8b5e84f4-7c22-4c33-9c74-2d4789021d7d&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 17, startMin: 30, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි පියවර 8", age: "අවු: 14", time: "ඉරිදා 7:00 - 8:30 pm", localTime: "ඉරිදා 7:00 - 8:30 pm", link: "https://teams.microsoft.com/l/team/19%3AWPXmYHabcWjIQo7YEjdtZ6osX2_tth0Kwi1aoxuuogk1%40thread.tacv2/conversations?groupId=c55c9a55-18e9-455f-aa07-b54901151752&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 19, startMin: 0, endHour: 20, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "Online", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි 9", age: "අවු: 15 - 16", time: "ඉරිදා 7:00 - 8:30 pm", localTime: "ඉරිදා 7:00 - 8:30 pm", link: "https://teams.microsoft.com/l/team/19%3AWPXmYHabcWjIQo7YEjdtZ6osX2_tth0Kwi1aoxuuogk1%40thread.tacv2/conversations?groupId=c55c9a55-18e9-455f-aa07-b54901151752&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 19, startMin: 0, endHour: 20, endMin: 30 },
    { med: "Sinhala", country: "England", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට Junior", age: "අවු: 7 - 11", time: "ඉරිදා 2:00 - 3:30 pm", localTime: "Sun. 9:30 - 11:00 am (BST)", link: "https://teams.microsoft.com/l/team/19%3AvSvO_vIq7HYpia44ayCUcF0ITQ0Jj6Xz-ZNKpDuq6CE1%40thread.tacv2/conversations?groupId=c2da8095-9eaa-4754-bc79-f47b6015ad0c&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 14, startMin: 0, endHour: 15, endMin: 30 },
    { med: "Sinhala", country: "England", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට Senior", age: "අවු: 12 - 16", time: "ඉරිදා 4:00 - 5:30 pm", localTime: "Sun. 11:30 am - 1:00 pm (BST)", link: "https://teams.microsoft.com/l/team/19%3Alc_LUtpqiHCQZkOrD5D0Xad5uhLecqjvvf0gz13a_Ck1%40thread.tacv2/conversations?groupId=e2749fab-d019-481d-bf7c-7b28b3e3488f&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 16, startMin: 0, endHour: 17, endMin: 30 },
    { med: "Sinhala", country: "Australia", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග පිටරට", age: "අවු: 7 - 16", time: "ඉරිදා 1:00 - 2:30 pm", localTime: "Sun. 6:30 - 8:00 pm (AEST)", link: "https://teams.cloud.microsoft/l/team/19%3AK5ZH4_oX4aY01mz5SFrFW8-pj2Veg_kdYZFLQUWInNA1%40thread.tacv2/conversations?groupId=53d2be84-d34e-4d11-b86d-81eb256c3404&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 13, startMin: 0, endHour: 14, endMin: 30 },
    { med: "Sinhala", country: "Italy", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග ඉතාලි කනිෂ්ඨ", age: "අවු: 7 - 16", time: "සෙන. 1:00 - 2:30 pm", localTime: "Sat. 9:30 - 11:00 am (CEST)", link: "https://teams.cloud.microsoft/l/team/19%3AC3ygExHMgOTJ8o1nc78UvdDv01R_6rvGl97jB0JfwWw1%40thread.tacv2/conversations?groupId=9d5dac2e-ef3a-4b97-adc3-648217f8d67e&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 6, startHour: 13, startMin: 0, endHour: 14, endMin: 30 },
    { med: "Sinhala", country: "Italy", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "සිව්මග ඉතාලි ජෙශ්ඨ", age: "අවු: 7 - 16", time: "සෙන. 1:00 - 2:30 pm", localTime: "Sat. 9:30 - 11:00 am (CEST)", link: "https://teams.cloud.microsoft/l/team/19%3A5FIlQoxgW-9X0ZSWHgdT4Sea9BxMw-apwrirNDAF5E01%40thread.tacv2/conversations?groupId=93579435-6b96-4f0c-b450-49ae4501a6d1&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 6, startHour: 13, startMin: 0, endHour: 14, endMin: 30 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ - ආරාමය", age: "අවු: 7 - 11", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ - ආරාමය", age: "අවු: 11 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි - ආරාමය", age: "අවු: 7 - 11", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "Sinhala", country: "Sri Lanka", type: "ආරාමීය", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි - ආරාමය", age: "අවු: 11 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },

    // English Medium (ඉංග්‍රීසි මාධ්‍යය)

    { med: "English", country: "Qatar", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International", age: "අවු: 7 - 16", time: "සිකු. 2:00 - 3:30 pm", localTime: "Fri. 11:30 am - 1:00 pm (AST)", link: "https://teams.microsoft.com/l/team/19%3AT8_ZLzl_B2SAUp4VcVyMjoqpw7RhtOzJ1ISgJCmPDXU1%40thread.tacv2/conversations?groupId=9a973580-fa4c-4fb9-8e98-eada447edac3&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 5, startHour: 14, startMin: 0, endHour: 15, endMin: 30 },
    { med: "English", country: "Any country", type: "Online", gender: "පුරුෂ", sec: "Siwmaga International", age: "අවු: 7 - 16", time: "සෙන. 12:30 - 2:00 pm", localTime: "Sat. 7:00 - 8:30 am (UTC)", link: "https://teams.microsoft.com/l/team/19%3A_rDjHcODR5Qnx6ehQl-pGHJyJiN4sZUf4pMwEU4Sqvg1%40thread.tacv2/conversations?groupId=99637394-741c-4a85-909f-5d69eeb81e24&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 6, startHour: 12, startMin: 30, endHour: 14, endMin: 0 },
    { med: "English", country: "Any country", type: "Online", gender: "ස්ත්‍රී", sec: "Siwmaga International", age: "අවු: 7 - 16", time: "සෙන. 12:30 - 2:00 pm", localTime: "Sat. 7:00 - 8:30 am (UTC)", link: "https://teams.cloud.microsoft/l/team/19%3Aw4wWGLaoxoXubfdIZUyxpC6MsZ51V8Pl1rIGwHc0l-81%40thread.tacv2/conversations?groupId=b902af19-9718-4af2-bc62-b05741a109f1&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 6, startHour: 12, startMin: 30, endHour: 14, endMin: 0 },
    { med: "English", country: "Sri Lanka", type: "ආරාමීය", gender: "පුරුෂ", sec: "සිව්මග දරුවෝ - ආරාමය", age: "අවු: 7 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "English", country: "Sri Lanka", type: "ආරාමීය", gender: "ස්ත්‍රී", sec: "සිව්මග දියණි - ආරාමය", age: "අවු: 7 - 16", time: "සෙන. 2:00 - 7:00 pm", localTime: "සෙන. 2:00 - 7:00 pm", link: "", day: 6, startHour: 14, startMin: 0, endHour: 19, endMin: 0 },
    { med: "English", country: "Ireland", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International", age: "අවු: 6 - 16", time: "සෙන. 7:30 - 9:00 pm", localTime: "Sat. 3:00 - 4:30 pm (IST)", link: "https://teams.microsoft.com/l/team/19%3AsO_94T9UAe3_pcZrZZXeTegfHubXczSyMT70-tOH-0g1%40thread.tacv2/conversations?groupId=5ca22b23-39aa-4651-b36d-cd6cb9916680&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 6, startHour: 19, startMin: 30, endHour: 21, endMin: 0 },
    { med: "English", country: "Canada", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International", age: "අවු: 13 - 16", time: "ඉරිදා 8:30 - 10:00 pm", localTime: "Sun. 11:00 am - 12:30 pm (EDT)", link: "https://teams.microsoft.com/l/team/19%3AI7BrMmXmOsFhfZo3QuMpzSB1-cGbGb1RjAd6-_npPso1%40thread.tacv2/conversations?groupId=1e2872ea-383c-4d30-a682-d737d93e6db0&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 20, startMin: 30, endHour: 22, endMin: 0 },
    { med: "English", country: "Canada", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International", age: "අවු: 6 - 12", time: "ඉරිදා 8:00 - 10:00 pm", localTime: "Sun. 10:30 am - 12:30 pm (EDT)", link: "https://teams.cloud.microsoft/l/team/19%3A45ELRwtoD6C6lcIoE_BCGqIovUbO5wdUfnoLdV0Ci2E1%40thread.tacv2/conversations?groupId=87054ba5-828e-4478-a8b3-a535c03fe292&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 20, startMin: 0, endHour: 22, endMin: 0 },
    // Japan Medium (ජපන් මාධ්‍යය)
    { med: "Japan", country: "Japan", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International Junior", age: "අවු: 5 - 10", time: "ඉරිදා 3:30 - 4:30 pm", localTime: "Sun. 7:00 - 8:00 pm (JST)", link: "https://teams.microsoft.com/l/team/19%3Aanyc5mdQMzOS-niezYuoVAkgDP8Wv_eadXawye09fuU1%40thread.tacv2/conversations?groupId=649cc22e-c942-48a1-a896-f002c6f2c7ca&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 15, startMin: 30, endHour: 16, endMin: 30 },
    { med: "Japan", country: "Japan", type: "Online", gender: "ස්ත්‍රී/පුරුෂ", sec: "Siwmaga International Senior", age: "අවු: 11 - 16", time: "ඉරිදා 3:30 - 4:30 pm", localTime: "Sun. 7:00 - 8:00 pm (JST)", link: "https://teams.microsoft.com/l/team/19%3AGwEbz7tLZY-CqFzHbGGV-OpeA2pHX5Wrr48I9GenTag1%40thread.tacv2/conversations?groupId=c6c94d8b-4aaf-4f15-8d62-39af9473c15b&tenantId=0c400fc1-5417-423e-86dc-a73298df68cc", day: 0, startHour: 15, startMin: 30, endHour: 16, endMin: 30 }
];

let activeMedium = "Sinhala";

function getSLDate() {
    const nd = new Date();
    const utc = nd.getTime() + (nd.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 5.5)); // UTC + 5:30 for Sri Lanka Time
}


// All Buttone Active
// function isClassActive(item) {
//     return true; 
//     const slDate = getSLDate();

// }
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

// special class ekak buttone visibleCount
function isClassActive(item) {
    if (item.country === "Sri Lanka" && item.sec.includes("පියවර 1 | 2")) {
        return true;
    }

    const slDate = getSLDate();

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
        'සිව්මග දරුවෝ පියවර 7 | 8| 9': 'Siwmaga Boys Step 7 | 8 |9',
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
    const isInHouse = item.type === 'ආරාමීය' || !item.link || item.link.trim() === '';
    const iconBox = document.getElementById('class-status-icon-box');
    const iconEl = document.getElementById('class-status-icon');

    if (isActive) {
        if (isInHouse) {
            if (iconBox && iconEl) {
                iconBox.className = "w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl";
                iconEl.className = "fa-solid fa-location-dot animate-bounce";
            }
            document.getElementById('class-status-title').innerText = isEN ? "In-House Monastery Class" : "ආරාමීය පන්තිය (In-House Class)";
            const secTitle = formatSection(item.sec, isEN);
            document.getElementById('class-status-message').innerHTML = isEN ? `
                <div class="font-extrabold text-slate-800 text-base mb-2">${secTitle}</div>
                <div class="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-900 text-sm font-medium mb-3">
                    <i class="fa-solid fa-location-dot text-amber-600 mr-1.5"></i>
                    This class is conducted directly at the <strong>Monastery (In-House)</strong>, not online.
                </div>
                <div class="text-xs text-slate-500">
                    Class Time: <span class="font-bold text-amber-600">${item.time}</span>
                </div>
            ` : `
                <div class="font-extrabold text-slate-800 text-base mb-2">${secTitle}</div>
                <div class="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-900 text-sm font-medium mb-3">
                    <i class="fa-solid fa-location-dot text-amber-600 mr-1.5"></i>
                    මෙම පන්තිය Online තාක්ෂණයෙන් නොපැවැත්වෙන අතර, <strong>ආරාමය තුළ (In-House)</strong> සෘජුවම පැවැත්වේ.
                </div>
                <div class="text-xs text-slate-500">
                    පැවැත්වෙන වේලාව: <span class="font-bold text-amber-600">${item.time}</span>
                </div>
            `;
            openClassStatusModal();
        } else {
            window.open(item.link, '_blank');
        }
    } else {
        if (iconBox && iconEl) {
            iconBox.className = "w-16 h-16 bg-red-50 border border-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl";
            iconEl.className = "fa-solid fa-lock animate-bounce";
        }
        document.getElementById('class-status-title').innerText = isEN ? "Class Is Not Active Yet" : "පන්තිය තවමත් සක්‍රීය නැත";

        if (isInHouse) {
            const secTitle = formatSection(item.sec, isEN);
            document.getElementById('class-status-message').innerHTML = isEN ? `
                <div class="font-extrabold text-slate-800 text-base mb-2">${secTitle}</div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs mb-3">
                    This is an <strong>In-House class</strong> held directly at the monastery.<br>
                    Scheduled Time: <span class="font-bold text-amber-600">${item.time}</span>
                </div>
                <span class="text-xs text-slate-400 block">Please attend at the scheduled time.</span>
            ` : `
                <div class="font-extrabold text-slate-800 text-base mb-2">${secTitle}</div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs mb-3">
                    මෙය <strong>ආරාමය තුළ (In-House)</strong> පැවැත්වෙන පන්තියකි.<br>
                    නියමිත වේලාව: <span class="font-bold text-amber-600">${item.time}</span>
                </div>
                <span class="text-xs text-slate-400 block">කරුණාකර නියමිත වේලාවට ආරාමයට සහභාගී වන්න.</span>
            `;
        } else {
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
        }
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
    if (!viewport || slides.length === 0) return;

    const prevBtn = document.getElementById('carousel3d-prev');
    const nextBtn = document.getElementById('carousel3d-next');
    const dotsContainer = document.getElementById('carousel3d-dots');

    const totalSlides = slides.length;
    let virtualIndex = 2000000 + 2;
    let dragOffset = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    // --- Dynamic Ambient Background Blur & Color Sampling ---
    const ambientSection = document.getElementById('gallery-3d') || viewport.closest('.carousel-3d-section');
    let ambientLayer1 = document.getElementById('carousel3d-layer-1');
    let ambientLayer2 = document.getElementById('carousel3d-layer-2');
    let activeAmbientLayer = 1;
    const colorCache = new Map();
    let offscreenCanvas = null;
    let offscreenCtx = null;
    let lastSampledIndex = -1;

    // Auto-inject ambient backdrop container if not present
    if (ambientSection && (!ambientLayer1 || !ambientLayer2)) {
        let backdrop = ambientSection.querySelector('.carousel-3d-ambient-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'carousel-3d-ambient-backdrop';
            backdrop.setAttribute('aria-hidden', 'true');
            backdrop.innerHTML = `
                <div class="carousel-3d-ambient-glow ambient-glow-primary"></div>
                <div class="carousel-3d-ambient-glow ambient-glow-secondary"></div>
                <div class="carousel-3d-ambient-layer carousel-3d-layer-1" id="carousel3d-layer-1"></div>
                <div class="carousel-3d-ambient-layer carousel-3d-layer-2" id="carousel3d-layer-2"></div>
                <div class="carousel-3d-ambient-mesh"></div>
            `;
            ambientSection.insertBefore(backdrop, ambientSection.firstChild);
        }
        ambientLayer1 = document.getElementById('carousel3d-layer-1') || backdrop.querySelector('.carousel-3d-layer-1');
        ambientLayer2 = document.getElementById('carousel3d-layer-2') || backdrop.querySelector('.carousel-3d-layer-2');
    }

    function getCanvasContext() {
        if (!offscreenCanvas) {
            offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = 40;
            offscreenCanvas.height = 40;
            offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        }
        return offscreenCtx;
    }

    // Extract dominant vibrant and accent colors from image
    function extractImageColors(img) {
        const defaultPalette = {
            primary: [245, 158, 11],     // warm amber
            secondary: [234, 88, 12],    // warm orange
            glow: [245, 158, 11]
        };

        if (!img || !img.complete || !img.naturalWidth) {
            return defaultPalette;
        }

        try {
            const ctx = getCanvasContext();
            if (!ctx) return defaultPalette;

            ctx.clearRect(0, 0, 40, 40);
            ctx.drawImage(img, 0, 0, 40, 40);
            const imgData = ctx.getImageData(0, 0, 40, 40).data;

            const candidates = [];
            let totalR = 0, totalG = 0, totalB = 0, count = 0;

            for (let i = 0; i < imgData.length; i += 16) { // Sample every 4th pixel
                const r = imgData[i];
                const g = imgData[i + 1];
                const b = imgData[i + 2];
                const a = imgData[i + 3];

                if (a < 128) continue;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const delta = max - min;
                const brightness = (r + g + b) / 3;
                const saturation = max === 0 ? 0 : delta / max;

                // Focus on meaningful non-extreme pixels
                if (brightness > 25 && brightness < 240) {
                    totalR += r;
                    totalG += g;
                    totalB += b;
                    count++;

                    if (saturation > 0.15) {
                        // Boost saturation score and favor warm/vibrant tones
                        const score = saturation * 2.0 + (brightness > 50 && brightness < 200 ? 1.0 : 0.4);
                        candidates.push({ r, g, b, sat: saturation, score });
                    }
                }
            }

            if (count === 0) return defaultPalette;

            candidates.sort((a, b) => b.score - a.score);

            const primary = candidates.length > 0
                ? [candidates[0].r, candidates[0].g, candidates[0].b]
                : [Math.round(totalR / count), Math.round(totalG / count), Math.round(totalB / count)];

            // Find distinct secondary color
            let secondary = [Math.round(totalR / count), Math.round(totalG / count), Math.round(totalB / count)];
            for (let i = 1; i < candidates.length; i++) {
                const c = candidates[i];
                const dist = Math.abs(c.r - primary[0]) + Math.abs(c.g - primary[1]) + Math.abs(c.b - primary[2]);
                if (dist > 70) {
                    secondary = [c.r, c.g, c.b];
                    break;
                }
            }

            return {
                primary,
                secondary,
                glow: primary
            };
        } catch (e) {
            return defaultPalette;
        }
    }

    function preloadSlideImage(slide) {
        if (!slide) return;
        const img = slide.querySelector('img');
        if (!img) return;
        if (!img.src && img.dataset.src) {
            img.src = img.dataset.src;
        }
    }

    function updateAmbientBackground(realIndex) {
        if (!ambientSection) return;
        const currentSlide = slides[realIndex];
        if (!currentSlide) return;

        const img = currentSlide.querySelector('img');
        if (!img) return;

        const imgSrc = img.src || img.dataset.src;
        if (!img.src && img.dataset.src) {
            img.src = img.dataset.src;
        }

        // Preload adjacent slides for instantaneous transitions
        const prevIndex = ((realIndex - 1) % totalSlides + totalSlides) % totalSlides;
        const nextIndex = (realIndex + 1) % totalSlides;
        preloadSlideImage(slides[prevIndex]);
        preloadSlideImage(slides[nextIndex]);

        if (lastSampledIndex === realIndex && colorCache.has(imgSrc)) {
            return;
        }
        lastSampledIndex = realIndex;

        function applyPalette(palette, sourceUrl) {
            const p = palette.primary;
            const s = palette.secondary;
            const g = palette.glow;

            ambientSection.style.setProperty('--ambient-c1', `rgba(${p[0]}, ${p[1]}, ${p[2]}, 0.32)`);
            ambientSection.style.setProperty('--ambient-c2', `rgba(${s[0]}, ${s[1]}, ${s[2]}, 0.25)`);
            ambientSection.style.setProperty('--ambient-glow', `rgba(${g[0]}, ${g[1]}, ${g[2]}, 0.42)`);
            ambientSection.style.setProperty('--ambient-shadow', `rgba(${Math.round(p[0] * 0.35)}, ${Math.round(p[1] * 0.35)}, ${Math.round(p[2] * 0.35)}, 0.45)`);

            // Crossfade blurred image background layers
            if (ambientLayer1 && ambientLayer2 && sourceUrl) {
                if (activeAmbientLayer === 1) {
                    ambientLayer2.style.backgroundImage = `url('${sourceUrl}')`;
                    ambientLayer2.classList.add('active');
                    ambientLayer1.classList.remove('active');
                    activeAmbientLayer = 2;
                } else {
                    ambientLayer1.style.backgroundImage = `url('${sourceUrl}')`;
                    ambientLayer1.classList.add('active');
                    ambientLayer2.classList.remove('active');
                    activeAmbientLayer = 1;
                }
            }
        }

        if (colorCache.has(imgSrc)) {
            applyPalette(colorCache.get(imgSrc), imgSrc);
        } else {
            if (img.complete && img.naturalWidth) {
                const palette = extractImageColors(img);
                colorCache.set(imgSrc, palette);
                applyPalette(palette, imgSrc);
            } else {
                const tempImg = new Image();
                tempImg.crossOrigin = 'anonymous';
                tempImg.onload = () => {
                    const palette = extractImageColors(tempImg);
                    colorCache.set(imgSrc, palette);
                    if (Math.round(getRealIndex()) % totalSlides === realIndex) {
                        applyPalette(palette, imgSrc);
                    }
                };
                tempImg.onerror = () => {
                    const fallback = {
                        primary: [245, 158, 11],
                        secondary: [234, 88, 12],
                        glow: [245, 158, 11]
                    };
                    colorCache.set(imgSrc, fallback);
                    applyPalette(fallback, imgSrc);
                };
                tempImg.src = imgSrc;
            }
        }
    }

    function getRealIndex() {
        const currentVirtual = virtualIndex + dragOffset;
        return ((currentVirtual % totalSlides) + totalSlides) % totalSlides;
    }

    function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot-3d' + (i === Math.round(getRealIndex()) % totalSlides ? ' active-dot' : '');
            dot.addEventListener('click', () => {
                const currentReal = Math.round(getRealIndex()) % totalSlides;
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
                    slide.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease, filter 0.85s ease, box-shadow 0.85s ease';
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

        const realIntIndex = ((Math.round(realIndex) % totalSlides) + totalSlides) % totalSlides;
        const dots = document.querySelectorAll('.dot-3d');
        dots.forEach((dot, idx) => {
            if (idx === realIntIndex) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });

        // Trigger dynamic ambient color & background update
        updateAmbientBackground(realIntIndex);
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
        // Only handle horizontal wheel scrolling for carousel navigation
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

        const now = Date.now();
        if (now - lastWheelTime < 160) return;

        e.preventDefault();
        lastWheelTime = now;
        moveCarousel(e.deltaX > 0 ? 1 : -1);
        resetAutoplayTimer();
    }, { passive: false });

    window.addEventListener('resize', debounce(updateCarousel, 100));

    buildDots();
    updateCarousel();
})();



// ============================================================
// SIWMAGA YOUTUBE MEDIA SPACE — DYNAMIC AUTO-LOAD ENGINE
// ============================================================

const SIWMAGA_YOUTUBE_CHANNELS = {
    si: {
        id: "UCDdevyocMwxh1twdKDc8WeA",
        name: "Siwmaga Sinhala",
        subscribeUrl: "https://www.youtube.com/channel/UCDdevyocMwxh1twdKDc8WeA?sub_confirmation=1"
    },
    en: {
        id: "UCOsVMjnhjCKgh0LIG6n_D5A",
        name: "Siwmaga English / Dhamma School",
        subscribeUrl: "https://www.youtube.com/channel/UCOsVMjnhjCKgh0LIG6n_D5A?sub_confirmation=1"
    }
};

const youthYoutubeData = {
    latest: [
        {
            id: "9VN7v9Z-v0k",
            title: "ඇත්තටම නිවන් දකින්න ඕනද?",
            desc: "නිවන මූලික කරගත් නිවැරදි අවබෝධයෙන් ලොව දකින ගුණ නැණ බෙලෙන් සපිරි උතුම් දුදරු කැළක් ලොවට දායාද කිරීම උදෙසා...",
            thumb: "https://img.youtube.com/vi/9VN7v9Z-v0k/hqdefault.jpg",
            type: "video"
        },
        {
            id: "Hbx5Ep-5Uj0",
            title: "රුපියල් 5000, 10000 වුන හැටි",
            desc: "නිවන මූලික කරගත් නිවැරදි අවබෝධයෙන් ලොව දකින ගුණ නැණ බෙලෙන් සපිරි උතුම් දුදරු කැළක් ලොවට දායාද කිරීම උදෙසා...",
            thumb: "https://img.youtube.com/vi/Hbx5Ep-5Uj0/hqdefault.jpg",
            type: "video"
        },
        {
            id: "1cH8uEQzPhg",
            title: "සසර නම් විහිලුවේ සරදම ඔබද?",
            desc: "නිවන මූලික කරගත් නිවැරදි අවබෝධයෙන් ලොව දකින ගුණ නැණ බෙලෙන් සපිරි උතුම් දුදරු කැළක් ලොවට දායාද කිරීම උදෙසා...",
            thumb: "https://img.youtube.com/vi/1cH8uEQzPhg/hqdefault.jpg",
            type: "video"
        },
        {
            id: "UomBOw-x0Zc",
            title: "තරුණ පරපුරට ජීවිතය දිනන්නට දහම් උපදෙස්",
            desc: "නැරඹුම් වාර දහස් ගණනක් පසුකළ විශිෂ්ට දේශනාව",
            thumb: "https://img.youtube.com/vi/UomBOw-x0Zc/hqdefault.jpg",
            type: "video"
        }
    ],
    popular: [
        { id: "9VN7v9Z-v0k", title: "ඇත්තටම නිවන් දකින්න ඕනද?", desc: "ලක්ෂ සංඛ්‍යාත පිරිසක් නැරඹූ විශිෂ්ට දේශනාව", thumb: "https://img.youtube.com/vi/9VN7v9Z-v0k/hqdefault.jpg", type: "video" },
        { id: "Hbx5Ep-5Uj0", title: "රුපියල් 5000, 10000 වුන හැටි", desc: "නූතන සමාජයට ගැළපෙන සැබෑ දහම් සන්නිවේදනය", thumb: "https://img.youtube.com/vi/Hbx5Ep-5Uj0/hqdefault.jpg", type: "video" },
        { id: "1cH8uEQzPhg", title: "සසර නම් විහිලුවේ සරදම ඔබද?", desc: "නිවසට සෞභාග්‍යය උදා කරන බලසම්පන්න සජ්ඣායනය", thumb: "https://img.youtube.com/vi/1cH8uEQzPhg/hqdefault.jpg", type: "video" },
        { id: "UomBOw-x0Zc", title: "තරුණ පරපුරට ජීවිතය දිනන්නට දහම් උපදෙස්", desc: "නැරඹුම් වාර දහස් ගණනක් පසුකළ විශිෂ්ට දේශනාව", thumb: "https://img.youtube.com/vi/UomBOw-x0Zc/hqdefault.jpg", type: "video" },
        { id: "niRsWkJ9Ccs", title: "පවුලේ සැමට සැනසීම ළඟා කරන ආශිර්වාද සෙත්", desc: "නිවසට සෞභාග්‍යය උදා කරන බලසම්පන්න සජ්ඣායනය", thumb: "https://img.youtube.com/vi/niRsWkJ9Ccs/hqdefault.jpg", type: "video" }
    ],
    shorts: [
        { id: "jxRbyOL5vOw", title: "මට ඔබව ඕන වේලාවක අඩවන්න පුලුවන්", desc: "🔥 Siwmaga Official Short Video", thumb: "https://img.youtube.com/vi/jxRbyOL5vOw/hqdefault.jpg", type: "short", special: true },
        { id: "GY_dOTVJ7zc", title: "“මොන දේ වුණත්, මම එයාට තාමත් ආදරෙයි ” ❤️", desc: "තරුණ සිතුවිලි නිවැරදි දිශාවට මෙහෙයවන්නට", thumb: "https://img.youtube.com/vi/GY_dOTVJ7zc/hqdefault.jpg", type: "short" },
        { id: "wUALKlKIE84", title: "මුහුණට හිනා වෙන මිනිස්සු", desc: "ලොව්තුරු දහමෙන් ජීවිතයට ශක්තියක්", thumb: "https://img.youtube.com/vi/wUALKlKIE84/hqdefault.jpg", type: "short" },
        { id: "mcMnDxYz28k", title: "ලස්සනම නියපොතු", desc: "ගුණධර්ම පිරි සදාචාරවත් දරු පරපුරක් උදෙසා", thumb: "https://img.youtube.com/vi/mcMnDxYz28k/hqdefault.jpg", type: "short" },
        { id: "yM8DL1F8YVM", title: "ඔය විදින්නේ සැබෑ නිදහස ද?", desc: "දහම් සිතුවිලි", thumb: "https://img.youtube.com/vi/yM8DL1F8YVM/hqdefault.jpg", type: "short" }
    ]
};

const youthYoutubeDataEN = {
    latest: [
        {
            id: "rfpsJQTyUq4",
            title: "Who Is the Hijacker of Your Mind?",
            desc: "A Dhamma message to help children see the world with wisdom, virtue, and a correct understanding rooted in Nibbana.",
            thumb: "https://img.youtube.com/vi/rfpsJQTyUq4/hqdefault.jpg",
            type: "video"
        },
        {
            id: "B4NGnL-SZvY",
            title: "This is why you are gifted",
            desc: "A thoughtful Dhamma message to help children see the world with wisdom, virtue, and a correct understanding.",
            thumb: "https://img.youtube.com/vi/B4NGnL-SZvY/hqdefault.jpg",
            type: "video"
        },
        {
            id: "6l1MZIkNHEU",
            title: "Kali Miththa Theri",
            desc: "A featured Dhamma discourse from Siwmaga Dhamma School.",
            thumb: "https://img.youtube.com/vi/6l1MZIkNHEU/hqdefault.jpg",
            type: "video"
        },
        {
            id: "ftlNqMJmuMQ",
            title: "Life and Internet",
            desc: "A featured Dhamma discourse exploring life, mindfulness, and technology.",
            thumb: "https://img.youtube.com/vi/ftlNqMJmuMQ/hqdefault.jpg",
            type: "video"
        }
    ],
    popular: [
        { id: "rfpsJQTyUq4", title: "Who Is the Hijacker of Your Mind?", desc: "A featured Dhamma discourse from Siwmaga", thumb: "https://img.youtube.com/vi/rfpsJQTyUq4/hqdefault.jpg", type: "video" },
        { id: "B4NGnL-SZvY", title: "This is why you are gifted", desc: "A featured Dhamma video from Siwmaga", thumb: "https://img.youtube.com/vi/B4NGnL-SZvY/hqdefault.jpg", type: "video" },
        { id: "6l1MZIkNHEU", title: "Kali Miththa Theri", desc: "A featured Dhamma video from Siwmaga", thumb: "https://img.youtube.com/vi/6l1MZIkNHEU/hqdefault.jpg", type: "video" },
        { id: "ftlNqMJmuMQ", title: "Life and Internet", desc: "A featured Dhamma video from Siwmaga", thumb: "https://img.youtube.com/vi/ftlNqMJmuMQ/hqdefault.jpg", type: "video" },
        { id: "WzcoCePu5nQ", title: "The Art of Giving", desc: "A featured Buddhist discourse from Siwmaga", thumb: "https://img.youtube.com/vi/WzcoCePu5nQ/hqdefault.jpg", type: "video" }
    ],
    shorts: [
        { id: "scVOkIjnWw4", title: "Why do movies Exist?", desc: "🔥 Official Siwmaga Short", thumb: "https://img.youtube.com/vi/scVOkIjnWw4/hqdefault.jpg", type: "short", special: true },
        { id: "xzupu1VS_O4", title: "What Goes Around, Comes Around", desc: "Guidance to direct young minds towards the right path", thumb: "https://img.youtube.com/vi/xzupu1VS_O4/hqdefault.jpg", type: "short" },
        { id: "l_m9A_cwZDM", title: "The Big Love Lie", desc: "Strength for life through the timeless Dhamma", thumb: "https://img.youtube.com/vi/l_m9A_cwZDM/hqdefault.jpg", type: "short" },
        { id: "nO2RlS_hOrM", title: "The Bus Ride Rule", desc: "Dhamma reflections for everyday life", thumb: "https://img.youtube.com/vi/nO2RlS_hOrM/hqdefault.jpg", type: "short" },
        { id: "4wPjFEuoKJQ", title: "The truth about your wish list", desc: "Inspiring wisdom for youth", thumb: "https://img.youtube.com/vi/4wPjFEuoKJQ/hqdefault.jpg", type: "short" },
        { id: "cRijlsNu9B0", title: "The relationship secret", desc: "Siwmaga Dhamma School reflection", thumb: "https://img.youtube.com/vi/cRijlsNu9B0/hqdefault.jpg", type: "short" }
    ]
};

function getActiveYouthYoutubeData() {
    return document.documentElement.lang === 'en' ? youthYoutubeDataEN : youthYoutubeData;
}

let currentActiveTab = 'popular';
let currentlySelectedVideoId = "";
let isIframeActive = false;

function changeMainVideo(youtubeId, title) {
    if (!youtubeId) return;
    currentlySelectedVideoId = youtubeId;
    
    const videoTitle = document.getElementById('main-youtube-title');
    if (videoTitle && title) videoTitle.innerText = title;

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
            facadeImg.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
            facadeImg.setAttribute('data-src', `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
        }
    }

    const cards = document.querySelectorAll('.youtube-side-item');
    cards.forEach(card => {
        if (card.getAttribute('data-video-id') === youtubeId) {
            card.classList.add('border-red-500', 'bg-red-500/15', 'shadow-md', 'shadow-red-500/10');
            card.classList.remove('border-transparent');
        } else {
            card.classList.remove('border-red-500', 'bg-red-500/15', 'shadow-md', 'shadow-red-500/10');
            card.classList.add('border-transparent');
        }
    });
}

function activateRealYoutubeIframe() {
    const container = document.getElementById('yt-player-container');
    if (!container) return;

    if (!currentlySelectedVideoId) {
        const activeData = getActiveYouthYoutubeData();
        const firstItem = (activeData[currentActiveTab] && activeData[currentActiveTab][0]) || 
                          (activeData.latest && activeData.latest[0]);
        if (firstItem) currentlySelectedVideoId = firstItem.id;
    }

    container.innerHTML = `
        <iframe id="main-youtube-iframe" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" 
            src="https://www.youtube.com/embed/${currentlySelectedVideoId}?autoplay=1&rel=0" 
            title="Siwmaga YouTube Player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen></iframe>
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
    const items = getActiveYouthYoutubeData()[tab] || [];

    if (items.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-slate-400 text-xs">
                <i class="fa-solid fa-spinner fa-spin text-red-500 text-base mb-2"></i>
                <p>වීඩියෝ පූරණය වෙමින් පවතී...</p>
            </div>
        `;
        return;
    }

    items.forEach((item, index) => {
        const isSpecial = item.special ? 'glowing-short-border border-2' : '';
        const specialBadge = item.special
            ? `<span class="absolute top-1 left-1 bg-gradient-to-r from-yellow-500 to-red-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow animate-bounce">🔥 1M+ Views</span>`
            : (item.isNew ? `<span class="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider shadow">NEW</span>` : '');

        const safeTitle = (item.title || "").replace(/'/g, "\\'");
        const isSelected = item.id === currentlySelectedVideoId || (!currentlySelectedVideoId && index === 0);

        const cardHTML = `
            <button onclick="changeMainVideo('${item.id}', '${safeTitle}')" 
                    class="youtube-side-item w-full flex items-center gap-3 p-2.5 rounded-2xl border ${isSelected ? 'border-red-500 bg-red-500/15' : 'border-transparent'} bg-slate-900/60 hover:bg-slate-900 text-left transition-all duration-300 relative group overflow-hidden" 
                    data-video-id="${item.id}">
                
                <div class="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                    <img src="${item.thumb}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="${item.title}" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${item.id}/hqdefault.jpg'">
                    ${specialBadge}
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span class="bg-white/20 p-2 rounded-full backdrop-blur-md"><i class="fa-solid fa-play"></i></span>
                    </div>
                </div>

                <div class="flex-grow min-w-0">
                    <h4 class="text-xs sm:text-sm font-bold text-white truncate leading-snug group-hover:text-red-400 transition-colors">${item.title}</h4>
                    <p class="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">${item.desc || (item.type === 'short' ? 'Short Video' : 'Dhamma Discourse')}</p>
                </div>
            </button>
        `;
        container.innerHTML += cardHTML;
    });

    if (items.length > 0 && !currentlySelectedVideoId) {
        changeMainVideo(items[0].id, items[0].title);
    }
}

// Auto-Load YouTube videos directly from channel RSS / APIs
async function autoLoadSiwmagaYouTubeFeed() {
    const isEn = document.documentElement.lang === 'en';
    const channelConfig = isEn ? SIWMAGA_YOUTUBE_CHANNELS.en : SIWMAGA_YOUTUBE_CHANNELS.si;
    const targetData = isEn ? youthYoutubeDataEN : youthYoutubeData;

    try {
        // Fetch public YouTube RSS feed converted via rss2json
        const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelConfig.id}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data && data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
            const fetchedVideos = [];
            const fetchedShorts = [];

            data.items.forEach((item, index) => {
                // Extract video ID from guid (yt:video:ID) or link
                let videoId = "";
                if (item.guid && item.guid.includes("yt:video:")) {
                    videoId = item.guid.replace("yt:video:", "");
                } else if (item.link) {
                    const match = item.link.match(/(?:watch\?v=|\/shorts\/|youtu\.be\/)([\w-]{11})/);
                    if (match) videoId = match[1];
                }

                if (!videoId) return;

                const isShort = (item.link && item.link.includes('/shorts/')) || 
                                (item.title && item.title.toLowerCase().includes('#shorts'));

                const videoObj = {
                    id: videoId,
                    title: item.title || (isEn ? "Siwmaga Dhamma Talk" : "සිව්මග ධර්ම දේශනාව"),
                    desc: item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...' : (isEn ? "Official Siwmaga YouTube Publication" : "සිව්මග නිල ධර්ම ප්‍රකාශනය"),
                    thumb: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    type: isShort ? "short" : "video",
                    isNew: index < 2
                };

                if (isShort) {
                    fetchedShorts.push(videoObj);
                } else {
                    fetchedVideos.push(videoObj);
                }
            });

            // If we got valid items, merge dynamically with baseline videos so we always have 4-5+ items
            if (fetchedVideos.length > 0 || fetchedShorts.length > 0) {
                // Baseline popular/featured items to prevent list dropping below 4 items
                const baselineVideos = isEn ? [
                    { id: "rfpsJQTyUq4", title: "Who Is the Hijacker of Your Mind?", desc: "A Dhamma message to help children see the world with wisdom.", thumb: "https://img.youtube.com/vi/rfpsJQTyUq4/hqdefault.jpg", type: "video" },
                    { id: "B4NGnL-SZvY", title: "This is why you are gifted", desc: "A thoughtful Dhamma message to help children see the world with wisdom.", thumb: "https://img.youtube.com/vi/B4NGnL-SZvY/hqdefault.jpg", type: "video" },
                    { id: "6l1MZIkNHEU", title: "Kali Miththa Theri", desc: "A featured Dhamma discourse from Siwmaga Dhamma School.", thumb: "https://img.youtube.com/vi/6l1MZIkNHEU/hqdefault.jpg", type: "video" },
                    { id: "ftlNqMJmuMQ", title: "Life and Internet", desc: "A featured Dhamma discourse from Siwmaga.", thumb: "https://img.youtube.com/vi/ftlNqMJmuMQ/hqdefault.jpg", type: "video" },
                    { id: "WzcoCePu5nQ", title: "The Art of Giving", desc: "A featured Buddhist discourse on generosity.", thumb: "https://img.youtube.com/vi/WzcoCePu5nQ/hqdefault.jpg", type: "video" }
                ] : [
                    { id: "9VN7v9Z-v0k", title: "ඇත්තටම නිවන් දකින්න ඕනද?", desc: "නිවන මූලික කරගත් නිවැරදි අවබෝධයෙන් ලොව දකින උතුම් දහම් අත්වැල", thumb: "https://img.youtube.com/vi/9VN7v9Z-v0k/hqdefault.jpg", type: "video" },
                    { id: "Hbx5Ep-5Uj0", title: "රුපියල් 5000, 10000 වුන හැටි", desc: "නූතන සමාජයට ගැළපෙන සැබෑ දහම් සන්නිවේදනය", thumb: "https://img.youtube.com/vi/Hbx5Ep-5Uj0/hqdefault.jpg", type: "video" },
                    { id: "1cH8uEQzPhg", title: "සසර නම් විහිලුවේ සරදම ඔබද?", desc: "ජීවිතය දිනන්නට මඟ පෙන්වන උතුම් දේශනාව", thumb: "https://img.youtube.com/vi/1cH8uEQzPhg/hqdefault.jpg", type: "video" },
                    { id: "UomBOw-x0Zc", title: "තරුණ පරපුරට ජීවිතය දිනන්නට දහම් උපදෙස්", desc: "නැරඹුම් වාර දහස් ගණනක් පසුකළ විශිෂ්ට දේශනාව", thumb: "https://img.youtube.com/vi/UomBOw-x0Zc/hqdefault.jpg", type: "video" },
                    { id: "ZMtJvYUMaSc", title: "නිවැරදි මාවත සොයායන තාරුණ්‍යයට බුදු දහම", desc: "නූතන සමාජයට ගැළපෙන සැබෑ දහම් සන්නිවේදනය", thumb: "https://img.youtube.com/vi/ZMtJvYUMaSc/hqdefault.jpg", type: "video" }
                ];

                // Merge fetched videos with baseline to ensure exactly 4 latest videos
                const mergedLatest = [...fetchedVideos];
                baselineVideos.forEach(bv => {
                    if (!mergedLatest.some(v => v.id === bv.id)) {
                        mergedLatest.push(bv);
                    }
                });

                targetData.latest = mergedLatest.slice(0, 4);
                targetData.popular = baselineVideos;

                if (fetchedShorts.length > 0) {
                    targetData.shorts = fetchedShorts;
                }

                // Render active tab with fresh content
                renderPlaylist(currentActiveTab);
                
                // If main video not yet actively chosen or matches default, update from active tab
                const currentList = targetData[currentActiveTab] || targetData.popular || targetData.latest;
                if (currentList && currentList.length > 0 && !isIframeActive) {
                    changeMainVideo(currentList[0].id, currentList[0].title);
                }
            }
        }
    } catch (err) {
        console.warn('Live YouTube Feed auto-fetch (fallback to local cache):', err.message);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Initial immediate render with popular tab active
    switchYoutubeTab('popular');
    
    // Auto load fresh channel feed in background
    autoLoadSiwmagaYouTubeFeed();
});


// ============================================================
// BREAKING NEWS TICKER — Bilingual Scrolling Banner Engine
// ============================================================
(function () {

    // Sinhala headlines (index.html)
    const tickerHeadlines_SI = [
        { text: "🇯🇵 ජපන් මාධ්‍ය දහම් පන්ති මෙම සතියේ සිට ආරම්භ — ලියාපදිංචිය දැන් විවෘතයි!", link: "#news" },
        { text: "📚 ඩිජිටල් පුස්තකාලය ළඟදීම — සිරිත් මල්දම, ධම්මපදය, නරසීහ ගාථා සහ ශ්‍රව්‍ය ඇතුළු ග්‍රන්ථ 10+ ක් ළඟදීම!", link: "library.html" },
        { text: "📸 ගැලරිය විවෘතයි — ඔබේ පින්කම් ඡායාරූප සහ වීඩියෝ දැන් Share කරන්න!", link: "gallery.html" },
        { text: "🌐 කාලසටහන (Timetable) නවීකරණය — Teams පන්ති සෘජුවම Join කිරීමේ නව හැකියාව!", link: "#timetable" },

        { text: "📺 සිව්මග YouTube මාධ්‍ය අවකාශය — ධර්ම දේශනා සහ දහම් කතා දැන් වෙබ් අඩවිය ඇතුළෙන්ම නරඹන්න!", link: "#youtube-preview" },
    ];

    // English headlines (index-en.html)
    const tickerHeadlines_EN = [
        { text: "🇯🇵 New Japanese Medium Dhamma Classes Starting This Week — Registrations Now Open!", link: "#news" },
        { text: "📚 Digital Library Coming Soon — Sirith Maldama, Dhammapada, Audio Pirith & 10+ Sacred Titles!", link: "library-en.html" },
        { text: "📸 Media Gallery is Live — Share Your Pinkam Photos & Videos With Us!", link: "gallery-en.html" },
        { text: "🌐 Timetable Upgraded — Direct One-Click Teams Classroom Access Now Available!", link: "#timetable" },

        { text: "📺 YouTube Media Space Live — Watch Dhamma Discourses & Pirith Chants Without Leaving the Website!", link: "#youtube-preview" },
    ];

    function buildTickerHTML(headlines) {
        // Duplicate items 3× to give a seamless infinite loop feel
        const all = [...headlines, ...headlines, ...headlines];
        return all.map(item => `
            <a href="${item.link}"
                class="inline-flex items-center gap-2 px-5 text-sm sm:text-[15px] font-semibold text-slate-100 hover:text-red-300 transition-colors duration-200 group"
                style="text-decoration:none;">
                <span class="text-red-500 text-xs">●</span>
                <span class="group-hover:underline underline-offset-2">${item.text}</span>
                <span class="text-slate-600 mx-3 text-lg select-none">|</span>
            </a>
        `).join('');
    }

    function initBreakingTicker() {
        const track = document.getElementById('breaking-ticker-track');
        if (!track) return;

        const isEN = document.documentElement.lang === 'en';
        const headlines = isEN ? tickerHeadlines_EN : tickerHeadlines_SI;

        track.innerHTML = buildTickerHTML(headlines);

        // CSS-driven marquee animation (smooth, GPU accelerated)
        const totalItems = headlines.length;
        // Approx pixel width per item: we animate one set width
        // We inject a <style> tag with the keyframe using JS-measured width
        requestAnimationFrame(() => {
            // Get width of ONE set (first totalItems anchors)
            const anchors = track.querySelectorAll('a');
            let oneSetWidth = 0;
            for (let i = 0; i < totalItems; i++) {
                oneSetWidth += anchors[i] ? anchors[i].offsetWidth : 0;
            }
            if (oneSetWidth === 0) oneSetWidth = 1800; // fallback

            // Duration: ~60px per second base speed
            const durationSecs = Math.max(20, Math.round(oneSetWidth / 60));

            const styleId = 'ticker-keyframes';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    @keyframes tickerScroll {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-${oneSetWidth}px); }
                    }
                    #breaking-ticker-track {
                        animation: tickerScroll ${durationSecs}s linear infinite;
                    }
                    #breaking-ticker-track:hover {
                        animation-play-state: paused;
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBreakingTicker);
    } else {
        initBreakingTicker();
    }

})();



// High Quality News & Announcement Dataset (Featuring Sinhala & English versions)

const newsDataset = {
    'gallery-launch': {
        title: "ඔබේ පින්කම් මතකයන් අප හා බෙදාගන්න - නවීන මාධ්‍ය ගැලරිය විවෘතයි!",

        badge: "සුවිශේෂී අංගයක්",
        image: "image/News/pin.webp",
        desc: "සිව්මග නවීන මාධ්‍ය ගැලරිය ඔස්සේ ඡායාරූප සහ වීඩියෝ නැරඹීමට අමතරව, ඔබ සිදුකරන පින්කම් සහ සදහම් වැඩසටහන්වල මතකයන් අප වෙත යොමුකර වෙබ් අඩවියට එක්කිරීමේ සුවිශේෂී අවස්ථාව දැන් උදාවී ඇත.",
        text: [
            "සිව්මග ධර්මායතනයේ නවතම අංගයක් ලෙස නවීන මාධ්‍ය ගැලරිය (Media Gallery) දැන් ඔබ වෙත විවෘත කර ඇත. මෙහිදී සදහම් දේශනා, ආරාමීය පින්කම් සහ දහම් පාසල් උත්සවයන්හි සුන්දර මතක සිතුවම් සහ වීඩියෝ නැරඹීමේ අවස්ථාව හිමිවේ.",
            "මෙහි ඇති සුවිශේෂීම පහසුකම වන්නේ, ලොව පුරා විසිරී සිටින ඔබ සැමට ඔබ සහභාගී වූ හෝ සංවිධානය කළ උතුම් පින්කම්, ආමිස/ප්‍රතිපත්ති පූජා සහ දහම් කටයුතුවල ඡායාරූප සහ වීඩියෝ අපගේ ගැලරිය පිටුව (Gallery Page) ඔස්සේ සෘජුවම අප වෙත යොමුකර (Upload / Share) වෙබ් අඩවියේ පළ කිරීමට හැකිවීමයි.",
            "ගැලරිය පිටුවේ ඇති 'Share Your Memories' බොත්තම ක්ලික් කර ඔබගේ සදහම් මතකයන් අප වෙත පහසුවෙන්ම යොමු කරන්න."
        ]
    },
    'timetable-join': {
        title: "කාලසටහනෙන් සෘජුවම Microsoft Teams පන්ති වලට එක්වීමේ පහසුකම!",

        badge: "සෘජු ප්‍රවේශය",
        image: "image/News/class.webp",
        desc: "මීට පෙර කාලසටහන බලාගැනීමට පමණක් සීමා වී තිබූ අතර, දැන් අදාළ පන්තියේ වේලාවට 'සම්බන්ධ වන්න' බොත්තම ක්ලික් කිරීමෙන් සෘජුවම Microsoft Teams පන්තියට එක්විය හැක.",
        text: [
            "ලොව පුරා විසිරී සිටින සිව්මග දහම් පාසල් සිසු දරු දැරියන්ට සහ දෙමාපියන්ට වඩාත් පහසුවෙන් පන්ති වලට සම්බන්ධ විය හැකි වන පරිදි කාලසටහන නවීකරණය කර ඇත.",
            "මීට පෙර වෙබ් අඩවිය ඔස්සේ කාලසටහන සහ පන්ති පැවැත්වෙන වේලාවන් බලාගැනීමට පමණක් අවස්ථාව තිබූ නමුත්, දැන් අදාළ පන්තිය සක්‍රීය වන වේලාවට 'සම්බන්ධ වන්න' (Join Now) බොත්තම ක්ලික් කිරීමෙන් කිසිදු අපහසුවකින් තොරව සෘජුවම Microsoft Teams පන්ති කාමරයට ප්‍රවේශ විය හැක.",
            "ශ්‍රී ලංකාව, එක්සත් රාජධානිය, ඉතාලිය, ඕස්ට්‍රේලියාව, ජපානය, කැනඩාව, කටාර් ඇතුළු රටවල් ගණනාවක දේශීය වේලාවන් සමඟින් පන්ති කාලසටහන පහසුවෙන්ම පරීක්ෂා කරගැනීමට දැන් ඔබට හැකියාව ඇත."
        ]
    },
    'library-hub': {
        title: "දහම් පාසල් ඩිජිටල් පුස්තකාලය - වන්දනා ගාථා,දහම් කෘති හා ශ්‍රව්ය මාධ්‍ය එකම තැනකින්!",

        badge: "ඩිජිටල් පුස්තකාලය",
        image: "image/library/sirithmal.webp",
        desc: "දහම් පාසල් දරුවන්ට අවශ්‍ය වන්දනා ගාථා, සෙත්, සිරිත් මල්දම, ධම්මපදය සහ ගුරු වන්දනා ඇතුළු සියලුම සදහම් ග්‍රන්ථ හා එකම තැනකින් පරිශීලනය කරන්න.",
        text: [
            "සිව්මග ධර්මායතන වෙබ් අඩවියට අලුතින්ම එක්වූ ඩිජිටල් පුස්තකාලය (Digital Library Hub) මඟින් දහම් පාසල් අධ්‍යාපනය ලබන දූ දරුවන්ට අත්‍යවශ්‍ය සදහම් ග්‍රන්ථ හා වන්දනා පාඨ රැසක් ඩිජිටල් තාක්ෂණයෙන් ලබා දී ඇත.",
            "මෙහිදී දිනපතා බුද්ධ වන්දනා ගාථා, ආහාර පූජා ගාථා, නරසීහ ගාථා, උපාලි ගාථා, සිරිත් මල්දම සදාචාර කාව්‍ය, ධම්මපද ගාථා, කමා යාචනා සහ පින් අනුමෝදනා ගාථා සිංහල තේරුම් සහ ශ්‍රව්‍ය (Audio) සමඟින් පරිශීලනය කළ හැක.",
            "දරුවන්ගේ ගුණධර්ම සහ නිවැරදි වත්පිළිවෙත් ප්‍රගුණ කිරීම සඳහා මෙම ඩිජිටල් පුස්තකාලය මහඟු අත්වැලක් වනු ඇත."
        ]
    },
    'youtube-space': {
        title: "සිව්මග නිල YouTube මාධ්‍ය අවකාශය",

        badge: "මාධ්‍ය අවකාශය",
        image: "image/News/DA.webp",
        desc: "සිව්මග ධර්මායතනය මඟින් පවත්වනු ලබන නවතම සදහම් දේශනා සජ්ඣායනා, සහ ළමා දහම් වැඩසටහන් වෙබ් අඩවිය තුළදීම පහසුවෙන් නැරඹිය හැකි නව YouTube මාධ්‍ය අවකාශය දැන් සක්‍රීයයි.",
        text: [
            "අපගේ නිල YouTube නාලිකාව හා සම්බන්ධ වන නවීන මාධ්‍ය අවකාශයක් (YouTube Media Space) වෙබ් අඩවියට සාර්ථකව එක් කර ඇත.",
            "මෙමගින් පූජ්‍ය මහා සංඝරත්නය විසින් දේශනා කරනු ලබන උතුම් ශ්‍රී සද්ධර්ම දේශනා, සතිපතා දහම් වැඩසටහන් සහ ළමා මනසට උචිත සදාචාරාත්මක බෞද්ධ කතන්දර වෙබ් අඩවියෙන් ඉවත් නොවී අධි තාක්ෂණික Facade Player එකක් ඔස්සේ ක්ෂණිකව නැරඹිය හැක.",
            "නවතම වීඩියෝ දර්ශන මෙන්ම ජනප්‍රියම ධර්ම දේශනා පෙළගැස්ම (Playlist) ඔස්සේ ඔබේ සිත් පහන් කරගන්නා සදහම් වැඩසටහන් පහසුවෙන්ම තෝරා බේරා නරඹන්න."
        ]
    },
    'japan-class': {
        title: "හිරු නැගෙන දේශයට සදහම් සිසිලස - නව ජපන් මාධ්‍ය දහම් පාසල",

        badge: "නව පන්ති ආරම්භය",
        image: "image/carousel/japan.webp",
        desc: "ජපානයේ වෙසෙන ආදරණීය දූ දරුවන් උදෙසා සුවිශේෂී ලෙස ජපන් මාධ්‍යයෙන් (Japanese Medium) පවත්වනු ලබන නවතම දහම් පන්ති මාලාව මෙම සතියේ සිට ආරම්භ වේ.",
        text: [
            "සිව්මග ධර්මායතනය මගින් නැගී එන හිරුගේ දේශය වන ජපානයේ (Japan) වෙසෙන දූ දරුවන්ට සදහම් ආලෝකය තිළිණ කරමින් ජපන් මාධ්‍යයෙන් පැවැත්වෙන නවතම දහම් පන්ති මාලාව මෙම සතියේ සිට ඇරඹේ.",
            "ජපන් සමාජයේ හැදී වැඩෙන දරුවන්ට වඩාත් පහසුවෙන් තේරුම් ගත හැකි පරිදි සරල ජපන් මාධ්‍යයෙන් (Japanese Medium) බුදු දහමේ සාරධර්ම, බෞද්ධ ඉතිහාසය සහ ප්‍රතිපත්ති පූජාවන් මෙහිදී ආකර්ෂණීය ලෙස සාකච්ඡා කෙරේ.",
            "වයස අවුරුදු 6-10 සහ අවුරුදු 11-16 ලෙස වයස් කාණ්ඩ දෙකක් යටතේ සෑම ඉරිදා දිනකම ශ්‍රී ලංකා වේලාවෙන් දහවල් 12:00 සිට 01:00 දක්වා (ජපාන වේලාවෙන් පස්වරු 3:30 - 4:30) Online තාක්ෂණය ඔස්සේ මෙම පන්ති පැවැත්වෙනු ඇත."
        ]
    }
};

const newsDatasetEN = {
    'gallery-launch': {
        title: "Share Your Meritorious Deeds With Us - Modern Media Gallery Now Live!",

        badge: "Special Feature",
        image: "image/News/pin.webp",
        desc: "Along with browsing sacred photos and video recordings, devotees worldwide can now share and upload their own meritorious deeds (Pinkam) and Dhamma memories directly to our official gallery!",
        text: [
            "As a brand-new feature of the Siwmaga web portal, our Modern Media Gallery is now officially live, showcasing vibrant photography, spiritual discourses, and memorable milestones of our Dhamma school.",
            "The highlight of this launch is the interactive upload portal: students and devotees worldwide can now submit their personal photos and video footage of meritorious deeds and religious festivals to be featured publicly on the Siwmaga Gallery.",
            "Simply click the 'Share Your Memories' button on our Gallery page to contribute your blessed moments."
        ]
    },
    'timetable-join': {
        title: "Direct Microsoft Teams Classroom Access via Timetable Now Active!",

        badge: "Direct Classroom",
        image: "image/News/class.webp",
        desc: "Previously limited to viewing schedule times, students and parents can now click 'Join Now' on any active class to connect directly to Microsoft Teams.",
        text: [
            "We have modernized our interactive timetable to provide seamless, single-click access to virtual classrooms for students and parents worldwide.",
            "Previously, the timetable served only as a schedule reference. With this latest update, whenever a class is active, clicking the 'Join Now' button instantly launches your Microsoft Teams session.",
            "The timetable automatically integrates local time zones for Sri Lanka, the United Kingdom, Italy, Australia, Japan, Canada, and Qatar, making global participation completely effortless."
        ]
    },
    'library-hub': {
        title: "Dhamma School Digital Library Hub - Stanzas, Chants & Moral Literature!",

        badge: "Digital Library",
        image: "image/library/sirithmal.webp",
        desc: "Explore essential devotional stanzas, protective Pirith chants, Sirith Maldama moral conduct verses, and Dhammapada texts tailored for Dhamma school students in one digital hub.",
        text: [
            "The newly launched Digital Library Hub brings sacred Buddhist study materials and devotional stanzas directly to your fingertips.",
            "Students can easily access and study daily Buddha Vandana, Mealtime Gatha, Naraseeha Gatha, Upali Gatha, Sirith Maldama character-building poems, Dhammapada verses, and Punya Anumodana chants complete with meanings and audio playback.",
            "This digital repository serves as a profound companion for children cultivating virtues and wholesome spiritual habits."
        ]
    },
    'youtube-space': {
        title: "Official Siwmaga YouTube Media Space",

        badge: "YouTube Space",
        image: "image/News/DA.webp",
        desc: "Watch the latest Dhamma sermons, sacred Pirith recitations, and inspiring Buddhist children's stories directly inside our website via the high-speed YouTube Media Space.",
        text: [
            "An embedded, high-performance YouTube Media Space has been integrated directly into the Siwmaga web portal.",
            "Users can now watch profound Dhamma discourses delivered by the Venerable Maha Sangha, live weekly broadcasts, and moral Buddhist animated stories without leaving the portal, powered by a lightweight, lightning-fast video facade player.",
            "Browse curated playlists and featured Dhamma series designed to inspire inner peace and spiritual wisdom in both young and mature minds."
        ]
    },
    'japan-class': {
        title: "Dhamma Peace for the Land of the Rising Sun - New Japanese Medium Dhamma School",

        badge: "New Class Launch",
        image: "image/carousel/japan.webp",
        desc: "Specially conducted in Japanese Medium for children living in Japan, our brand-new Dhamma class series commences from this week.",
        text: [
            "Siwmaga Dharmayathanaya introduces a new Japanese Medium Dhamma class series starting this week, illuminating the lives of children living in Japan with the sublime light of the Dhamma.",
            "Tailored specifically for children growing up in Japanese society, fundamental Buddhist virtues, history, and noble practices will be discussed interactively in simple Japanese.",
            "Classes will be held every Sunday via Microsoft Teams technology for age groups 6–10 and 11–16 from 12:00 PM to 01:00 PM Sri Lanka Time (3:30 PM – 4:30 PM Japan Standard Time)."
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
                    <div class="news-card flex-shrink-0 bg-white rounded-3xl overflow-hidden shadow-md flex flex-col border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] cursor-pointer" data-news-key="${key}" tabindex="0" role="button" aria-label="${item.title}">
                        <div class="relative h-48 overflow-hidden shimmer-skeleton bg-slate-200">
                            <img class="w-full h-full object-cover lazy-image fade-in-ready"
                                data-src="${item.image}"
                                alt="${item.title}" decoding="async">
                            <span class="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md z-10">${item.badge}</span>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-base font-extrabold text-slate-800 mb-3 line-clamp-2 leading-snug">${item.title}</h3>
                            <p class="text-slate-600 text-xs mb-5 line-clamp-3 leading-relaxed">${item.desc}</p>
                            <button type="button" data-news-key="${key}"
                                class="mt-auto text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 group self-start transition-colors">
                                ${btnText} <i class="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                            </button>
                        </div>
                    </div>
                `;
        track.innerHTML += card;
    });

    const newsCards = track.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        const key = card.dataset.newsKey;
        if (!key) return;

        card.addEventListener('click', (event) => {
            if (event.target.closest('button')) return;
            if (isNewsClickPrevented) return;
            openNewsModal(key);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (isNewsClickPrevented) return;
                openNewsModal(key);
            }
        });
    });

    const newsReadMoreButtons = track.querySelectorAll('[data-news-key] button');
    newsReadMoreButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const key = button.dataset.newsKey;
            if (key) openNewsModal(key);
        });
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
    const modalDate = document.getElementById('modal-date');
    if (modalDate) {
        if (item.date) {
            modalDate.innerText = item.date;
            modalDate.parentElement.style.display = 'flex';
        } else {
            modalDate.parentElement.style.display = 'none';
        }
    }
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
            { name: "Qatar", coords: [51.1839, 25.3548], flag: "https://flagcdn.com/w40/qa.png" },

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


// Libary area

document.addEventListener("DOMContentLoaded", function () {
    // 1. Centralized Resource Library Data
    const libraryResources = [
        {
            img: "image/library/sirithmal.webp",
            en: { title: "Sirith Maldama", subtitle: "Moral Conduct Verses for Students" },
            si: { title: "සිරිත් මල්දම", subtitle: "දරුවන්ගේ චරිත සංවර්ධන කාව්‍ය" }
        },
        {
            img: "image/library/armes.webp",
            en: { title: "Mealtime Vandana", subtitle: "Food Offering & Devotional Chants" },
            si: { title: "ආහාර පූජා ගාථා", subtitle: "ආහාර අනුභවයට පෙර වන්දනාව" }
        },
        {
            img: "image/library/upali.webp",
            en: { title: "Upali Gatha", subtitle: "Pali Stanzas & Sinhala Meaning" },
            si: { title: "උපාලි ගාථා", subtitle: "පාලි ගාථා සහ සිංහල තේරුම" }
        },
        {
            img: "image/library/narasiha.webp",
            en: { title: "Naraseeha Gatha", subtitle: "Lord Buddha's Virtues & Audio" },
            si: { title: "නරසීහ ගාථා", subtitle: "බුදුගුණ වර්ණනා සහ ශ්‍රව්‍ය" }
        },
        {
            img: "image/library/dhama.webp",
            en: { title: "Dhammapada Verses", subtitle: "Sacred Teachings of the Buddha" },
            si: { title: "ධම්මපදය", subtitle: "බුදුරජාණන් වහන්සේගේ ධර්ම දේශනා" }
        },
        {
            img: "image/library/guruv.webp",
            en: { title: "Guru Vandana", subtitle: "Homage & Respect to Teachers" },
            si: { title: "ගුරු වන්දනාව", subtitle: "ගුරුවරුන්ට ගෞරව දැක්වීම" }
        },
        {
            img: "image/library/for.webp",
            en: { title: "Kama Yachana Gatha", subtitle: "Stanzas for Seeking Forgiveness" },
            si: { title: "කමා යාචනා ගාථා", subtitle: "වැඩිහිටියන්ගෙන් සමාව ඇයැදීම" }
        },
        {
            img: "image/library/habite.webp",
            en: { title: "Punya Anumodana", subtitle: "Water Pouring & Merit Stanzas" },
            si: { title: "පින් අනුමෝදනා ගාථා", subtitle: "පැන් වඩා පින් දීමේ ගාථා" }
        }
    ];

    // Language Detection
    const lang = document.documentElement.lang === "si" ? "si" : "en";
    const cards = document.querySelectorAll(".carousel-card");
    let currentIndex = 0;

    // 2. Auto Rotation Logic
    if (cards.length > 0) {
        function rotateCarousel() {
            cards.forEach(card => {
                card.classList.remove("opacity-100");
                card.classList.add("opacity-0");
            });

            setTimeout(() => {
                cards.forEach((card, i) => {
                    const item = libraryResources[(currentIndex + i) % libraryResources.length];
                    const textData = item[lang];

                    const img = card.querySelector(".card-img");
                    const title = card.querySelector(".card-title");
                    const sub = card.querySelector(".card-sub");

                    if (img) {
                        img.src = item.img;
                        img.alt = textData.title + " Preview";
                    }
                    if (title) title.textContent = textData.title;
                    if (sub) sub.textContent = textData.subtitle;
                });

                cards.forEach(card => {
                    card.classList.remove("opacity-0");
                    card.classList.add("opacity-100");
                });

                currentIndex = (currentIndex + 1) % libraryResources.length;
            }, 700);
        }

        setInterval(rotateCarousel, 3500);
    }

    // 3. Custom Toast Notification System
    function showNotification(message) {
        // Check if toast already exists, remove it
        const existingToast = document.getElementById("custom-toast");
        if (existingToast) existingToast.remove();

        // Create Toast Container
        const toast = document.createElement("div");
        toast.id = "custom-toast";
        toast.className =
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900 border border-amber-500/40 text-amber-200 text-sm font-semibold rounded-2xl shadow-2xl shadow-amber-500/10 backdrop-blur-xl transition-all duration-300 opacity-0 translate-y-4";

        // Toast Content
        toast.innerHTML = `
      <span class="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
      <span>${message}</span>
    `;

        document.body.appendChild(toast);

        // Fade In Animation
        requestAnimationFrame(() => {
            toast.classList.remove("opacity-0", "translate-y-4");
            toast.classList.add("opacity-100", "translate-y-0");
        });

        // Auto Remove After 3 Seconds
        setTimeout(() => {
            toast.classList.remove("opacity-100", "translate-y-0");
            toast.classList.add("opacity-0", "translate-y-4");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 4. Attach Click Event to Library CTA Buttons (Sinhala + English versions)
    const ctaBtns = document.querySelectorAll('a[href="library.html"], a[href="library-en.html"]');
    ctaBtns.forEach(function (ctaBtn) {
        ctaBtn.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent navigating — show notification instead
            const msg = lang === "si"
                ? "📚 ළඟදීම ලබා ගත හැක! ඩිජිටල් පුස්තකාලය 85% සූදානම් — ශීඝ්‍රයෙන්ම විවෘත වේ!"
                : "📚 Coming Soon! The Digital Library is 85% complete and launching very soon!";
            showNotification(msg);
        });
    });

    // 5. Attach Click Event to Carousel Cards (Removed pointer-events-none style dynamically)
    cards.forEach(card => {
        // Enable interaction on cards
        card.parentElement.classList.remove("pointer-events-none");
        card.classList.add("cursor-pointer", "pointer-events-auto");

        card.addEventListener("click", function () {
            const cardTitle = card.querySelector(".card-title")?.textContent || "";
            const msg = lang === "si"
                ? `"${cardTitle}" - මෙම අංගය ළඟදීම එක් කෙරේ!`
                : `"${cardTitle}" - This resource will be available soon!`;
            showNotification(msg);
        });
    });
});
