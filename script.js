// Smooth scroll for navigation links
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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = contactForm.querySelector('.btn-submit');

// EmailJS Configuration
// INSTRUKCIJE ZA NASTAVITEV:
// 1. Pojdite na https://www.emailjs.com/ in ustvarite brezplačen račun
// 2. Ustvarite email service (Gmail, Outlook, itd.)
// 3. Ustvarite email template z naslednjimi spremenljivkami:
//    - {{name}} - Ime in priimek
//    - {{propertyType}} - Vrsta prostora
//    - {{area}} - Kvadratura
//    - {{message}} - Sporočilo
// 4. Zamenjajte spodnje vrednosti z vašimi:
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Zamenjajte z vašim Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Zamenjajte z vašim Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Zamenjajte z vašim Public Key
const YOUR_EMAIL = 'k.aleksandrazelic@gmail.com'; // Vaš email naslov (ne bo viden na strani)

// Load EmailJS SDK
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        propertyType: document.getElementById('propertyType').value,
        area: document.getElementById('area').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form
    if (!formData.name || !formData.propertyType || !formData.area) {
        showMessage('Prosimo, izpolnite vsa obvezna polja.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Prepare email template parameters
        const templateParams = {
            to_email: YOUR_EMAIL,
            from_name: formData.name,
            property_type: formData.propertyType === 'stanovanjski' ? 'Stanovanjski prostor' : 'Poslovni prostor',
            area: formData.area + ' m²',
            message: formData.message || 'Ni dodatnega sporočila.',
            reply_to: '', // EmailJS bo uporabil default
        };
        
        // Send email using EmailJS
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        // Success
        showMessage('Hvala! Vaše povpraševanje je bilo uspešno poslano. Kontaktirali vas bomo v najkrajšem možnem času.', 'success');
        contactForm.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        
        // Fallback: Show form data (for testing or manual processing)
        // V produkciji lahko uporabite alternativno metodo pošiljanja
        showMessage('Napaka pri pošiljanju. Prosimo, nas pokličite direktno na telefon.', 'error');
        
        // Log form data for debugging (remove in production)
        console.log('Form Data:', formData);
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 5 seconds for success, keep error visible
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Phone number formatting (optional enhancement)
const phoneLink = document.querySelector('.phone-link');
if (phoneLink) {
    // You can add click tracking or other functionality here
    phoneLink.addEventListener('click', () => {
        // Optional: Track phone clicks
        console.log('Phone number clicked');
    });
}

// Add animation on scroll for contact section
const contactSection = document.querySelector('.contact');
if (contactSection) {
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.contact-form-container')?.classList.add('slide-in-up');
                entry.target.querySelector('.contact-info')?.classList.add('slide-in-left');
            }
        });
    }, observerOptions);
    
    contactObserver.observe(contactSection);
}

// Testimonials functionality
const testimonialForm = document.getElementById('testimonialForm');
const testimonialsList = document.getElementById('testimonialsList');
const testimonialMessage = document.getElementById('testimonialMessage');
const TESTIMONIALS_STORAGE_KEY = 'lohke_cisto_testimonials';

// Load and display testimonials on page load
function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem(TESTIMONIALS_STORAGE_KEY) || '[]');
    displayTestimonials(testimonials);
}

// Display testimonials
function displayTestimonials(testimonials) {
    if (testimonials.length === 0) {
        testimonialsList.innerHTML = '<div class="testimonials-empty">Še ni oddanih mnenj. Bodi prvi, ki oddaja mnenje!</div>';
        return;
    }

    // Sort by date (newest first)
    testimonials.sort((a, b) => new Date(b.date) - new Date(a.date));

    testimonialsList.innerHTML = testimonials.map((testimonial, index) => {
        const date = new Date(testimonial.date);
        const formattedDate = date.toLocaleDateString('sl-SI', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const rating = testimonial.rating || 5;
        const starsHtml = Array.from({ length: 5 }, (_, i) => 
            `<span class="star ${i < rating ? '' : 'empty'}">★</span>`
        ).join('');

        return `
            <div class="testimonial-item" style="animation-delay: ${index * 0.1}s">
                <div class="testimonial-author">${escapeHtml(testimonial.name)}</div>
                <div class="testimonial-rating">${starsHtml}</div>
                <div class="testimonial-text">${escapeHtml(testimonial.text)}</div>
                <div class="testimonial-date">${formattedDate}</div>
            </div>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save testimonial
function saveTestimonial(name, text, rating) {
    const testimonials = JSON.parse(localStorage.getItem(TESTIMONIALS_STORAGE_KEY) || '[]');
    const newTestimonial = {
        id: Date.now(),
        name: name.trim(),
        text: text.trim(),
        rating: rating || 5,
        date: new Date().toISOString()
    };
    testimonials.push(newTestimonial);
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
    return newTestimonial;
}

// Star rating functionality
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('testimonialRating');
let selectedRating = 0;

if (starRating) {
    const stars = Array.from(starRating.querySelectorAll('.star'));
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = selectedRating;
            
            // Update visual state - reverse order because of flex-direction: row-reverse
            stars.forEach((s, i) => {
                const rating = parseInt(s.getAttribute('data-rating'));
                if (rating <= selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s) => {
                const rating = parseInt(s.getAttribute('data-rating'));
                if (rating <= hoverRating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    starRating.addEventListener('mouseleave', function() {
        stars.forEach((s) => {
            const rating = parseInt(s.getAttribute('data-rating'));
            if (rating <= selectedRating) {
                s.style.color = '#ffc107';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
}

// Handle testimonial form submission
if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('testimonialName').value.trim();
        const text = document.getElementById('testimonialText').value.trim();
        const rating = parseInt(ratingInput.value) || 0;
        
        if (!name || !text) {
            showTestimonialMessage('Prosimo, izpolnite vsa polja.', 'error');
            return;
        }

        if (!rating || rating < 1 || rating > 5) {
            showTestimonialMessage('Prosimo, izberite oceno z zvezdicami.', 'error');
            return;
        }

        if (text.length < 10) {
            showTestimonialMessage('Mnenje mora vsebovati vsaj 10 znakov.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = testimonialForm.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate slight delay for better UX
        setTimeout(() => {
            // Save testimonial
            saveTestimonial(name, text, rating);
            
            // Reload testimonials
            loadTestimonials();
            
            // Reset form
            testimonialForm.reset();
            selectedRating = 0;
            ratingInput.value = '';
            
            // Reset stars
            if (starRating) {
                starRating.querySelectorAll('.star').forEach(star => {
                    star.classList.remove('active');
                    star.style.color = '#ddd';
                });
            }
            
            // Show success message
            showTestimonialMessage('Hvala! Vaše mnenje je bilo uspešno oddano.', 'success');
            
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 500);
    });
}

function showTestimonialMessage(text, type) {
    testimonialMessage.textContent = text;
    testimonialMessage.className = `form-message ${type}`;
    testimonialMessage.style.display = 'block';
    
    // Scroll to message
    testimonialMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 5 seconds for success, keep error visible
    if (type === 'success') {
        setTimeout(() => {
            testimonialMessage.style.display = 'none';
        }, 5000);
    }
}

// Load testimonials when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
});