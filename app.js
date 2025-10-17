// Global variables
let currentPage = '';
let searchTimeout = null;
let tutorsData = [];
let currentFilters = {
    subjects: [],
    gradeLevels: [],
    gender: [],
    priceRange: 200,
    minRating: 0,
    teachingMethods: [],
    experience: []
};
let currentSort = 'recommended';
let currentView = 'grid';
let currentPageNum = 1;
let hasMoreTutors = true;
let isLoading = false;

// Initialize app based on current page
function initApp() {
    currentPage = getCurrentPage();
    initializePage();
}

// Check if DOM is already loaded, if not wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already loaded, initialize immediately
    initApp();
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('login.html')) return 'login';
    if (path.includes('signup-student.html')) return 'signup-student';
    if (path.includes('signup-tutor.html')) return 'signup-tutor';
    if (path.includes('profile-setup.html')) return 'profile-setup';
    if (path.includes('search.html')) return 'search';
    return 'home';
}

function initializePage() {
    switch (currentPage) {
        case 'home':
            initializeHomePage();
            break;
        case 'login':
            initializeLoginPage();
            break;
        case 'signup-student':
            initializeStudentSignupPage();
            break;
        case 'signup-tutor':
            initializeTutorSignupPage();
            break;
        case 'profile-setup':
            initializeProfileSetupPage();
            break;
        case 'search':
            initializeSearchPage();
            break;
    }
}

// Homepage functionality
function initializeHomePage() {
    setupSearchSuggestions();
    loadFeaturedTutors();
}

function setupSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!searchInput || !suggestionsContainer) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length < 2) {
            suggestionsContainer.classList.remove('show');
            return;
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadSearchSuggestions(query, suggestionsContainer);
        }, 300);
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.remove('show');
        }
    });
}

function loadSearchSuggestions(query, container) {
    // Mock suggestions data
    const suggestions = [
        { type: 'subject', text: 'Mathematics', count: 45 },
        { type: 'subject', text: 'English Language', count: 32 },
        { type: 'subject', text: 'Physics', count: 28 },
        { type: 'subject', text: 'Chemistry', count: 25 },
        { type: 'tutor', text: 'John Smith', count: 1 },
        { type: 'tutor', text: 'Maria Garcia', count: 1 },
        { type: 'category', text: 'Science', count: 15 },
        { type: 'category', text: 'Languages', count: 12 }
    ];
    
    const filteredSuggestions = suggestions.filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
    
    if (filteredSuggestions.length === 0) {
        container.classList.remove('show');
        return;
    }
    
    container.innerHTML = filteredSuggestions.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text}', '${suggestion.type}')">
            <div class="suggestion-type">${suggestion.type}</div>
            <div class="suggestion-text">${suggestion.text}</div>
        </div>
    `).join('');
    
    container.classList.add('show');
}

function selectSuggestion(text, type) {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    searchInput.value = text;
    suggestionsContainer.classList.remove('show');
    
    // Redirect to search page with the selected suggestion
    window.location.href = `search.html?q=${encodeURIComponent(text)}`;
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

function loadFeaturedTutors() {
    const container = document.getElementById('featuredTutors');
    if (!container) return;
    
    // Mock featured tutors data with Georgian names
    const featuredTutors = [
        {
            id: '1',
            firstName: 'TeacherName',
            lastName: 'Kipiani',
            profileImage: null,
            subjects: ['Calculus', 'Physics'],
            bio: 'Experienced math and physics tutor with 8 years of teaching experience.',
            hourlyRate: 50,
            avgRating: 4.8,
            ratingCount: 127,
            teachingHours: 1200,
            yearsExperience: 8,
            lessonFormats: ['Online', 'Student visits'],
            pinnedComment: 'TeacherName helped me improve my calculus grade from C to A+ in just 3 months!',
            verifiedTrusted: true,
            gradeLevels: [9, 10, 11, 12],
            gender: 'male'
        },
        {
            id: '2',
            firstName: 'TeacherName',
            lastName: 'Gelashvili',
            profileImage: null,
            subjects: ['English', 'Georgian'],
            bio: 'Native Georgian speaker with TESOL certification and 5 years of experience.',
            hourlyRate: 45,
            avgRating: 4.9,
            ratingCount: 89,
            teachingHours: 800,
            yearsExperience: 5,
            lessonFormats: ['Online'],
            pinnedComment: 'TeacherName is an amazing teacher! Her patience and teaching methods are outstanding.',
            verifiedTrusted: true,
            gradeLevels: [1, 2, 3, 4, 5, 6],
            gender: 'female'
        },
        {
            id: '3',
            firstName: 'TeacherName',
            lastName: 'Mchedlishvili',
            profileImage: null,
            subjects: ['Chemistry', 'Biology'],
            bio: 'PhD in Chemistry with extensive research and teaching background.',
            hourlyRate: 60,
            avgRating: 4.7,
            ratingCount: 156,
            teachingHours: 1500,
            yearsExperience: 12,
            lessonFormats: ['Online', 'Tutor visits'],
            pinnedComment: 'TeacherName made organic chemistry understandable for me. Highly recommended!',
            verifiedTrusted: true,
            gradeLevels: [10, 11, 12],
            gender: 'female'
        },
        {
            id: '4',
            firstName: 'TeacherName',
            lastName: 'Tsereteli',
            profileImage: null,
            subjects: ['History', 'Geography'],
            bio: 'Passionate history teacher with deep knowledge of Georgian and world history.',
            hourlyRate: 40,
            avgRating: 4.6,
            ratingCount: 94,
            teachingHours: 900,
            yearsExperience: 6,
            lessonFormats: ['Online', 'Student visits'],
            pinnedComment: 'TeacherName makes history come alive! His storytelling is incredible.',
            verifiedTrusted: true,
            gradeLevels: [7, 8, 9, 10],
            gender: 'male'
        },
        {
            id: '5',
            firstName: 'TeacherName',
            lastName: 'Chkheidze',
            profileImage: null,
            subjects: ['Programming', 'Web Development'],
            bio: 'Software engineer with 7 years of industry experience and teaching passion.',
            hourlyRate: 55,
            avgRating: 4.8,
            ratingCount: 112,
            teachingHours: 1100,
            yearsExperience: 7,
            lessonFormats: ['Online'],
            pinnedComment: 'TeacherName taught me Python from scratch. Now I work as a developer!',
            verifiedTrusted: true,
            gradeLevels: [9, 10, 11, 12],
            gender: 'male'
        },
        {
            id: '6',
            firstName: 'TeacherName',
            lastName: 'Kalandadze',
            profileImage: null,
            subjects: ['Drawing', 'Painting'],
            bio: 'Professional artist and art teacher with gallery exhibitions and teaching experience.',
            hourlyRate: 35,
            avgRating: 4.9,
            ratingCount: 78,
            teachingHours: 600,
            yearsExperience: 10,
            lessonFormats: ['Online', 'Tutor visits'],
            pinnedComment: 'TeacherName helped me discover my artistic talent. Amazing teacher!',
            verifiedTrusted: true,
            gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8],
            gender: 'female'
        }
    ];
    
    container.innerHTML = featuredTutors.map(tutor => createTutorCard(tutor)).join('');
}

// Login page functionality
function initializeLoginPage() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Basic validation
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters long');
        return;
    }
    
    // Mock login - redirect to search page
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
        window.location.href = 'search.html';
    }, 1500);
}

// Student signup page functionality
function initializeStudentSignupPage() {
    const form = document.getElementById('studentSignupForm');
    if (form) {
        form.addEventListener('submit', handleStudentSignup);
    }
    
    setupPasswordStrength();
    setupPasswordConfirmation();
}

function handleStudentSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validation
    if (!firstName.trim()) {
        showError('firstNameError', 'First name is required');
        return;
    }
    
    if (!lastName.trim()) {
        showError('lastNameError', 'Last name is required');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('passwordError', 'Password must be at least 8 characters with uppercase, number, and special character');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        return;
    }
    
    if (!terms) {
        showError('termsError', 'You must agree to the terms and conditions');
        return;
    }
    
    // Mock signup - redirect to login
    showSuccess('Account created successfully! Redirecting to login...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Tutor signup page functionality
function initializeTutorSignupPage() {
    const form = document.getElementById('tutorSignupForm');
    if (form) {
        form.addEventListener('submit', handleTutorSignup);
    }
    
    setupPasswordStrength();
    setupPasswordConfirmation();
}

function handleTutorSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validation
    if (!firstName.trim()) {
        showError('firstNameError', 'First name is required');
        return;
    }
    
    if (!lastName.trim()) {
        showError('lastNameError', 'Last name is required');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    if (!validatePhone(phone)) {
        showError('phoneError', 'Please enter a valid phone number');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('passwordError', 'Password must be at least 8 characters with uppercase, number, and special character');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        return;
    }
    
    if (!terms) {
        showError('termsError', 'You must agree to the terms and conditions');
        return;
    }
    
    // Mock signup - redirect to profile setup
    showSuccess('Account created successfully! Setting up your profile...');
    setTimeout(() => {
        window.location.href = 'profile-setup.html';
    }, 1500);
}

// Profile setup page functionality
function initializeProfileSetupPage() {
    const step1Form = document.getElementById('profileStep1Form');
    const step2Form = document.getElementById('profileStep2Form');
    
    if (step1Form) {
        step1Form.addEventListener('submit', handleProfileStep1);
    }
    
    if (step2Form) {
        step2Form.addEventListener('submit', handleProfileStep2);
    }
    
    setupBioCounter();
    setupTeachingMethodsToggle();
    loadSubjects();
    setupPhoneVerification();
}

function handleProfileStep1(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const phone = formData.get('phone');
    const dateOfBirth = formData.get('dateOfBirth');
    const bio = formData.get('bio');
    
    // Validation
    if (!firstName.trim()) {
        showError('firstNameError', 'First name is required');
        return;
    }
    
    if (!lastName.trim()) {
        showError('lastNameError', 'Last name is required');
        return;
    }
    
    if (!validatePhone(phone)) {
        showError('phoneError', 'Please enter a valid phone number');
        return;
    }
    
    if (!dateOfBirth) {
        showError('dateOfBirthError', 'Date of birth is required');
        return;
    }
    
    // Check age (18+)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0)) {
        showError('dateOfBirthError', 'You must be at least 18 years old to become a tutor');
        return;
    }
    
    // Move to step 2
    goToStep(2);
}

function handleProfileStep2(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const subjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(cb => cb.value);
    const hourlyRate = formData.get('hourlyRate');
    const teachingMethods = Array.from(document.querySelectorAll('input[name="teachingMethods"]:checked')).map(cb => cb.value);
    const city = formData.get('city');
    const neighborhoods = formData.get('neighborhoods');
    const experience = formData.get('experience');
    
    // Validation
    if (subjects.length === 0) {
        showError('subjectsError', 'Please select at least one subject');
        return;
    }
    
    if (subjects.length > 5) {
        showError('subjectsError', 'You can select up to 5 subjects');
        return;
    }
    
    if (!hourlyRate || hourlyRate < 10) {
        showError('hourlyRateError', 'Please set a valid hourly rate (minimum 10 GEL)');
        return;
    }
    
    if (teachingMethods.length === 0) {
        showError('teachingMethodsError', 'Please select at least one teaching method');
        return;
    }
    
    if (teachingMethods.includes('tutor_visits') && (!city || !neighborhoods)) {
        showError('cityError', 'City and neighborhoods are required for tutor visits');
        showError('neighborhoodsError', 'City and neighborhoods are required for tutor visits');
        return;
    }
    
    if (!experience) {
        showError('experienceError', 'Please select your experience level');
        return;
    }
    
    // Mock profile completion - redirect to search page
    showSuccess('Profile completed successfully! Welcome to Memora!');
    setTimeout(() => {
        window.location.href = 'search.html';
    }, 1500);
}

function goToStep(step) {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (step === 1) {
        step1.style.display = 'block';
        step2.style.display = 'none';
        progressSteps[0].classList.add('active');
        progressSteps[1].classList.remove('active');
    } else if (step === 2) {
        step1.style.display = 'none';
        step2.style.display = 'block';
        progressSteps[0].classList.remove('active');
        progressSteps[1].classList.add('active');
    }
}

function skipStep() {
    goToStep(2);
}

// Search page functionality
function initializeSearchPage() {
    setupSearchSuggestions();
    setupFilters();
    setupSorting();
    setupInfiniteScroll();
    loadTutors();
    
    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
    }
}

function setupFilters() {
    // Subject filters
    loadSubjectFilters();
    
    // Grade level filters
    const gradeInputs = document.querySelectorAll('input[name="gradeLevels"]');
    gradeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.gradeLevels.push(this.value);
            } else {
                currentFilters.gradeLevels = currentFilters.gradeLevels.filter(grade => grade !== this.value);
            }
            applyFilters();
        });
    });
    
    // Gender filters
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.gender.push(this.value);
            } else {
                currentFilters.gender = currentFilters.gender.filter(gender => gender !== this.value);
            }
            applyFilters();
        });
    });
    
    // Price range filter
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            const maxPrice = document.getElementById('maxPrice');
            maxPrice.textContent = this.value;
            currentFilters.priceRange = parseInt(this.value);
            applyFilters();
        });
    }
    
    // Rating filter
    const ratingInputs = document.querySelectorAll('input[name="minRating"]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            currentFilters.minRating = parseFloat(this.value);
            applyFilters();
        });
    });
    
    // Teaching method filters
    const teachingMethodInputs = document.querySelectorAll('input[name="teachingMethod"]');
    teachingMethodInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.teachingMethods.push(this.value);
            } else {
                currentFilters.teachingMethods = currentFilters.teachingMethods.filter(method => method !== this.value);
            }
            applyFilters();
        });
    });
    
    // Experience filters
    const experienceInputs = document.querySelectorAll('input[name="experience"]');
    experienceInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.experience.push(this.value);
            } else {
                currentFilters.experience = currentFilters.experience.filter(exp => exp !== this.value);
            }
            applyFilters();
        });
    });
}

function loadSubjectFilters() {
    const container = document.getElementById('subjectFilters');
    if (!container) return;
    
    // Three-level hierarchical subjects data structure
    const subjectCategories = [
        {
            id: 'technical',
            name: 'Technical',
            expanded: false,
            subcategories: [
                {
                    id: 'mathematics',
                    name: 'Mathematics',
                    expanded: false,
                    subjects: [
                        { id: 'mathematics_school', name: 'Mathematics for School Students (Grades 1–10)' },
                        { id: 'mathematics_abiturient', name: 'Mathematics for University Entrance (Abiturient)' },
                        { id: 'mathematics_exams', name: 'Mathematics for Exams (SAT, University Exams, G-Math)' }
                    ]
                },
                {
                    id: 'programming',
                    name: 'Programming',
                    expanded: false,
                    subjects: [
                        { id: 'programming_backend', name: 'Back-end Development' },
                        { id: 'programming_frontend', name: 'Front-end Development' }
                    ]
                }
            ]
        },
        {
            id: 'natural_sciences',
            name: 'Natural Sciences',
            expanded: false,
            subcategories: [
                {
                    id: 'chemistry',
                    name: 'Chemistry',
                    expanded: false,
                    subjects: [
                        { id: 'chemistry_school', name: 'Chemistry for School Students (Grades 1–10)' },
                        { id: 'chemistry_abiturient', name: 'Chemistry for University Entrance (Abiturient)' },
                        { id: 'chemistry_university', name: 'Chemistry for University Students' }
                    ]
                },
                {
                    id: 'physics',
                    name: 'Physics',
                    expanded: false,
                    subjects: [
                        { id: 'physics_school', name: 'Physics for School Students (Grades 1–10)' },
                        { id: 'physics_abiturient', name: 'Physics for University Entrance (Abiturient)' },
                        { id: 'physics_university', name: 'Physics for University Students' }
                    ]
                },
                {
                    id: 'biology',
                    name: 'Biology',
                    expanded: false,
                    subjects: [
                        { id: 'biology_school', name: 'Biology for School Students (Grades 1–10)' },
                        { id: 'biology_abiturient', name: 'Biology for University Entrance (Abiturient)' },
                        { id: 'biology_university', name: 'Biology for University Students' }
                    ]
                },
                {
                    id: 'geography',
                    name: 'Geography',
                    expanded: false,
                    subjects: [
                        { id: 'geography_school', name: 'Geography for School Students (Grades 1–10)' },
                        { id: 'geography_abiturient', name: 'Geography for University Entrance (Abiturient)' }
                    ]
                }
            ]
        },
        {
            id: 'foreign_languages',
            name: 'Foreign Languages',
            expanded: false,
            subcategories: [
                {
                    id: 'english',
                    name: 'English',
                    expanded: false,
                    subjects: [
                        { id: 'english_school', name: 'English for School Students (Grades 1–10)' },
                        { id: 'english_abiturient', name: 'English for University Entrance (Abiturient)' },
                        { id: 'english_university', name: 'English for University Students' },
                        { id: 'english_exams', name: 'English for Exams (SAT, IELTS, TOEFL, CAE, etc.)' },
                        { id: 'english_conversational', name: 'Conversational English' }
                    ]
                },
                {
                    id: 'german',
                    name: 'German',
                    expanded: false,
                    subjects: [
                        { id: 'german_school', name: 'German for School Students (Grades 1–10)' },
                        { id: 'german_abiturient', name: 'German for University Entrance (Abiturient)' },
                        { id: 'german_university', name: 'German for University Students' },
                        { id: 'german_exams', name: 'German for Exams (TestDaF, ÖSD, DSD, Goethe, etc.)' },
                        { id: 'german_conversational', name: 'Conversational German' }
                    ]
                },
                {
                    id: 'russian',
                    name: 'Russian',
                    expanded: false,
                    subjects: [
                        { id: 'russian_school', name: 'Russian for School Students (Grades 1–10)' },
                        { id: 'russian_abiturient', name: 'Russian for University Entrance (Abiturient)' },
                        { id: 'russian_conversational', name: 'Conversational Russian' }
                    ]
                },
                {
                    id: 'french',
                    name: 'French',
                    expanded: false,
                    subjects: [
                        { id: 'french_university', name: 'French for University Students' },
                        { id: 'french_exams', name: 'French for Exams' },
                        { id: 'french_conversational', name: 'Conversational French' }
                    ]
                },
                {
                    id: 'spanish',
                    name: 'Spanish',
                    expanded: false,
                    subjects: [
                        { id: 'spanish_university', name: 'Spanish for University Students' },
                        { id: 'spanish_exams', name: 'Spanish for Exams' },
                        { id: 'spanish_conversational', name: 'Conversational Spanish' }
                    ]
                },
                {
                    id: 'italian',
                    name: 'Italian',
                    expanded: false,
                    subjects: [
                        { id: 'italian_university', name: 'Italian for University Students' },
                        { id: 'italian_exams', name: 'Italian for Exams' },
                        { id: 'italian_conversational', name: 'Conversational Italian' }
                    ]
                },
                {
                    id: 'chinese',
                    name: 'Chinese',
                    expanded: false,
                    subjects: [
                        { id: 'chinese_university', name: 'Chinese for University Students' },
                        { id: 'chinese_exams', name: 'Chinese for Exams' },
                        { id: 'chinese_conversational', name: 'Conversational Chinese' }
                    ]
                },
                {
                    id: 'japanese',
                    name: 'Japanese',
                    expanded: false,
                    subjects: [
                        { id: 'japanese_university', name: 'Japanese for University Students' },
                        { id: 'japanese_exams', name: 'Japanese for Exams' },
                        { id: 'japanese_conversational', name: 'Conversational Japanese' }
                    ]
                }
            ]
        },
        {
            id: 'hobbies_interests',
            name: 'Hobbies & Interests',
            expanded: false,
            subcategories: [
                {
                    id: 'sports',
                    name: 'Sports',
                    expanded: false,
                    subjects: [
                        { id: 'football', name: 'Football' },
                        { id: 'basketball', name: 'Basketball' },
                        { id: 'volleyball', name: 'Volleyball' },
                        { id: 'tennis', name: 'Tennis' },
                        { id: 'karate', name: 'Karate' },
                        { id: 'boxing', name: 'Boxing' }
                    ]
                },
                {
                    id: 'arts',
                    name: 'Arts',
                    expanded: false,
                    subjects: [
                        { id: 'drawing_painting', name: 'Drawing/Painting' },
                        { id: 'graphic_arts', name: 'Graphic Arts' },
                        { id: 'sketching', name: 'Sketching' },
                        { id: 'sculpture', name: 'Sculpture' },
                        { id: 'ceramics', name: 'Ceramics' }
                    ]
                },
                {
                    id: 'music',
                    name: 'Music',
                    expanded: false,
                    subjects: [
                        { id: 'guitar', name: 'Guitar' },
                        { id: 'piano', name: 'Piano' },
                        { id: 'drums', name: 'Drums' },
                        { id: 'georgian_singing', name: 'Georgian Singing' },
                        { id: 'singing', name: 'Singing' }
                    ]
                },
                {
                    id: 'dance',
                    name: 'Dance',
                    expanded: false,
                    subjects: [
                        { id: 'georgian_dance', name: 'Georgian Dance' },
                        { id: 'foreign_dance', name: 'Foreign Dance' },
                        { id: 'hip_hop', name: 'Hip-Hop' }
                    ]
                },
                {
                    id: 'educational_intellectual',
                    name: 'Educational/Intellectual',
                    expanded: false,
                    subjects: [
                        { id: 'debates', name: 'Debates' },
                        { id: 'what_where_when', name: '"What? Where? When?" (quiz game)' },
                        { id: 'creative_writing', name: 'Creative Writing' },
                        { id: 'literature', name: 'Literature' },
                        { id: 'history', name: 'History' },
                        { id: 'economics', name: 'Economics' },
                        { id: 'psychology', name: 'Psychology' }
                    ]
                }
            ]
        }
    ];
    
    container.innerHTML = subjectCategories.map(category => `
        <div class="subject-category">
            <div class="category-header" onclick="toggleCategory('${category.id}')">
                <label class="checkbox-label category-checkbox">
                    <input type="checkbox" name="subjectCategories" value="${category.id}">
                    <span class="checkmark"></span>
                    ${category.name}
                </label>
                <button class="expand-btn" id="expand-${category.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </button>
            </div>
            <div class="subcategory-list" id="subcategories-${category.id}" style="display: none;">
                ${category.subcategories.map(subcategory => `
                    <div class="subcategory-item">
                        <div class="subcategory-header" onclick="toggleSubcategory('${category.id}', '${subcategory.id}')">
                            <label class="checkbox-label subcategory-checkbox">
                                <input type="checkbox" name="subcategoryCategories" value="${subcategory.id}">
                                <span class="checkmark"></span>
                                ${subcategory.name}
                            </label>
                            <button class="expand-btn subcategory-expand" id="expand-${category.id}-${subcategory.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6,9 12,15 18,9"></polyline>
                                </svg>
                            </button>
                        </div>
                        <div class="specific-subjects-list" id="specific-${category.id}-${subcategory.id}" style="display: none;">
                            ${subcategory.subjects.map(subject => `
                                <label class="checkbox-label specific-subject-checkbox">
            <input type="checkbox" name="subjects" value="${subject.id}">
            <span class="checkmark"></span>
                                    ${subject.name}
        </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    // Add event listeners for category checkboxes (Level 1)
    const categoryInputs = container.querySelectorAll('input[name="subjectCategories"]');
    categoryInputs.forEach(input => {
        input.addEventListener('change', function() {
            const categoryId = this.value;
            const subcategoryInputs = container.querySelectorAll(`#subcategories-${categoryId} input[name="subcategoryCategories"]`);
            const specificSubjectInputs = container.querySelectorAll(`#subcategories-${categoryId} input[name="subjects"]`);
            
            if (this.checked) {
                // Check all subcategories and specific subjects
                subcategoryInputs.forEach(subInput => {
                    subInput.checked = true;
                    if (!currentFilters.subjects.includes(subInput.value)) {
                        currentFilters.subjects.push(subInput.value);
                    }
                });
                specificSubjectInputs.forEach(subInput => {
                    subInput.checked = true;
                    if (!currentFilters.subjects.includes(subInput.value)) {
                        currentFilters.subjects.push(subInput.value);
                    }
                });
            } else {
                // Uncheck all subcategories and specific subjects
                subcategoryInputs.forEach(subInput => {
                    subInput.checked = false;
                    currentFilters.subjects = currentFilters.subjects.filter(subject => subject !== subInput.value);
                });
                specificSubjectInputs.forEach(subInput => {
                    subInput.checked = false;
                    currentFilters.subjects = currentFilters.subjects.filter(subject => subject !== subInput.value);
                });
            }
            applyFilters();
        });
    });
    
    // Add event listeners for subcategory checkboxes (Level 2)
    const subcategoryInputs = container.querySelectorAll('input[name="subcategoryCategories"]');
    subcategoryInputs.forEach(input => {
        input.addEventListener('change', function() {
            const subcategoryId = this.value;
            const categoryContainer = this.closest('.subject-category');
            const categoryId = categoryContainer.querySelector('input[name="subjectCategories"]').value;
            const specificSubjectInputs = container.querySelectorAll(`#specific-${categoryId}-${subcategoryId} input[name="subjects"]`);
            
            if (this.checked) {
                // Check all specific subjects in this subcategory
                specificSubjectInputs.forEach(subInput => {
                    subInput.checked = true;
                    if (!currentFilters.subjects.includes(subInput.value)) {
                        currentFilters.subjects.push(subInput.value);
                    }
                });
                // Also add the subcategory itself to filters
                if (!currentFilters.subjects.includes(subcategoryId)) {
                    currentFilters.subjects.push(subcategoryId);
                }
            } else {
                // Uncheck all specific subjects in this subcategory
                specificSubjectInputs.forEach(subInput => {
                    subInput.checked = false;
                    currentFilters.subjects = currentFilters.subjects.filter(subject => subject !== subInput.value);
                });
                // Remove the subcategory from filters
                currentFilters.subjects = currentFilters.subjects.filter(subject => subject !== subcategoryId);
            }
            applyFilters();
        });
    });

    // Add event listeners for specific subject checkboxes (Level 3)
    const subjectInputs = container.querySelectorAll('input[name="subjects"]');
    subjectInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                if (!currentFilters.subjects.includes(this.value)) {
                currentFilters.subjects.push(this.value);
                }
            } else {
                currentFilters.subjects = currentFilters.subjects.filter(subject => subject !== this.value);
                
                // Uncheck parent subcategory if any specific subject is unchecked
                const subcategoryContainer = this.closest('.subcategory-item');
                const subcategoryCheckbox = subcategoryContainer.querySelector('input[name="subcategoryCategories"]');
                if (subcategoryCheckbox) {
                    subcategoryCheckbox.checked = false;
                }
                
                // Uncheck parent category if any subcategory is unchecked
                const categoryContainer = this.closest('.subject-category');
                const categoryCheckbox = categoryContainer.querySelector('input[name="subjectCategories"]');
                if (categoryCheckbox) {
                    categoryCheckbox.checked = false;
                }
            }
            applyFilters();
        });
    });
}

function toggleCategory(categoryId) {
    const subcategoryList = document.getElementById(`subcategories-${categoryId}`);
    const expandBtn = document.getElementById(`expand-${categoryId}`);
    
    if (subcategoryList.style.display === 'none') {
        subcategoryList.style.display = 'block';
        expandBtn.style.transform = 'rotate(180deg)';
    } else {
        subcategoryList.style.display = 'none';
        expandBtn.style.transform = 'rotate(0deg)';
    }
}

function toggleSubcategory(categoryId, subcategoryId) {
    const specificSubjectsList = document.getElementById(`specific-${categoryId}-${subcategoryId}`);
    const expandBtn = document.getElementById(`expand-${categoryId}-${subcategoryId}`);
    
    if (specificSubjectsList.style.display === 'none') {
        specificSubjectsList.style.display = 'block';
        expandBtn.style.transform = 'rotate(180deg)';
    } else {
        specificSubjectsList.style.display = 'none';
        expandBtn.style.transform = 'rotate(0deg)';
    }
}

function setupInfiniteScroll() {
    window.addEventListener('scroll', function() {
        if (isLoading || !hasMoreTutors) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= documentHeight - 100) {
            loadMoreTutors();
        }
    });
}

function loadTutors() {
    isLoading = true;
    showLoadingSpinner();
    
    // Mock API call with short delay
    setTimeout(() => {
        const mockTutors = generateMockTutors(20);
        tutorsData = mockTutors;
        
        // Display all tutors initially without filtering
        displayTutors(mockTutors);
        updateResultsCount(mockTutors.length);
        hideLoadingSpinner();
        isLoading = false;
    }, 500);
}

function loadMoreTutors() {
    if (isLoading || !hasMoreTutors) return;
    
    isLoading = true;
    currentPageNum++;
    
    // Mock API call for more tutors
    setTimeout(() => {
        const moreTutors = generateMockTutors(10);
        tutorsData = [...tutorsData, ...moreTutors];
        displayTutors(tutorsData);
        updateResultsCount(tutorsData.length);
        isLoading = false;
        
        // Simulate no more tutors after 3 pages
        if (currentPageNum >= 3) {
            hasMoreTutors = false;
            document.getElementById('loadMoreContainer').style.display = 'none';
        }
    }, 1000);
}

// Sample tutor dataset
const SAMPLE_TUTORS = [
    {
        id: 'tutor-001',
        firstName: 'TeacherName',
        lastName: 'Kipiani',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Mathematics for School Students (Grades 1–10)', category: 'Technical', subcategory: 'Mathematics' },
            { name: 'Mathematics for University Entrance (Abiturient)', category: 'Technical', subcategory: 'Mathematics' },
            { name: 'Physics for School Students (Grades 1–10)', category: 'Natural Sciences', subcategory: 'Physics' }
        ],
        gradeLevels: [9, 10, 11, 12],
        gender: 'male',
        bio: 'Experienced mathematics and physics tutor with 8 years of teaching experience. Specializes in advanced calculus and physics concepts.',
        detailedBio: 'TeacherName is a passionate mathematics and physics educator with a Master\'s degree in Applied Mathematics from Tbilisi State University. He has been helping students excel in their studies for over 8 years, with a particular focus on making complex mathematical concepts accessible and engaging.',
        hourlyRate: 45,
        subjectRates: {
            'Mathematics for School Students (Grades 1–10)': 45,
            'Mathematics for University Entrance (Abiturient)': 50,
            'Physics for School Students (Grades 1–10)': 45
        },
        teachingHours: 1200,
        avgRating: 4.8,
        ratingCount: 127,
        yearsExperience: 8,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'TeacherName helped me improve my calculus grade from C to A+ in just 3 months! His explanations are clear and he\'s very patient.',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Excellent tutor! Very knowledgeable and patient.', student: 'Mariam G.' },
            { rating: 5, comment: 'Made calculus understandable for me.', student: 'David K.' },
            { rating: 4, comment: 'Great teaching methods.', student: 'Ana T.' }
        ]
    },
    {
        id: 'tutor-002',
        firstName: 'TeacherName',
        lastName: 'Gelashvili',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'English for School Students (Grades 1–10)', category: 'Foreign Languages', subcategory: 'English' },
            { name: 'Conversational English', category: 'Foreign Languages', subcategory: 'English' },
            { name: 'Creative Writing', category: 'Hobbies & Interests', subcategory: 'Educational/Intellectual' }
        ],
        gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8],
        gender: 'female',
        bio: 'Native Georgian speaker with TESOL certification and 5 years of experience teaching languages.',
        detailedBio: 'TeacherName is a certified language instructor with a TESOL certificate and extensive experience in both English and Georgian language instruction. She holds a degree in Linguistics and has worked with students of all ages.',
        hourlyRate: 40,
        subjectRates: {
            'English for School Students (Grades 1–10)': 45,
            'Conversational English': 40,
            'Creative Writing': 35
        },
        teachingHours: 800,
        avgRating: 4.9,
        ratingCount: 89,
        yearsExperience: 5,
        lessonFormats: ['Online'],
        pinnedComment: 'TeacherName is an amazing teacher! Her patience and teaching methods are outstanding.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Best language teacher ever!', student: 'Sophie M.' },
            { rating: 5, comment: 'Patient and encouraging.', student: 'Luka B.' }
        ]
    },
    {
        id: 'tutor-003',
        firstName: 'TeacherName',
        lastName: 'Mchedlishvili',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Chemistry', category: 'Science', subcategory: 'Physical Sciences' },
            { name: 'Biology', category: 'Science', subcategory: 'Life Sciences' }
        ],
        gradeLevels: [10, 11, 12],
        gender: 'female',
        bio: 'PhD in Chemistry with extensive research and teaching background in life sciences.',
        detailedBio: 'Dr. TeacherName Mchedlishvili is a highly qualified chemistry and biology educator with a PhD in Organic Chemistry.',
        hourlyRate: 55,
        subjectRates: {
            'Chemistry': 60,
            'Biology': 50
        },
        teachingHours: 1500,
        avgRating: 4.7,
        ratingCount: 156,
        yearsExperience: 12,
        lessonFormats: ['Online', 'Tutor visits'],
        pinnedComment: 'TeacherName made organic chemistry understandable for me. Highly recommended!',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Outstanding chemistry teacher!', student: 'Giorgi L.' },
            { rating: 4, comment: 'Very knowledgeable and helpful.', student: 'Tamar K.' }
        ]
    },
    {
        id: 'tutor-004',
        firstName: 'David',
        lastName: 'Smith',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'French', category: 'Languages', subcategory: 'Foreign Languages' },
            { name: 'Spanish', category: 'Languages', subcategory: 'Foreign Languages' },
            { name: 'German', category: 'Languages', subcategory: 'Foreign Languages' }
        ],
        gradeLevels: [5, 6, 7, 8, 9, 10, 11, 12],
        gender: 'male',
        bio: 'Polyglot language instructor with native-level proficiency in multiple European languages.',
        detailedBio: 'David is a multilingual language instructor with native-level proficiency in French, Spanish, and German. He holds a Master\'s degree in Linguistics and has lived and studied in France, Spain, and Germany.',
        hourlyRate: 45,
        subjectRates: {
            'French': 50,
            'Spanish': 45,
            'German': 50
        },
        teachingHours: 1300,
        avgRating: 4.7,
        ratingCount: 145,
        yearsExperience: 9,
        lessonFormats: ['Online'],
        pinnedComment: 'David made learning French enjoyable and practical. I can now hold conversations with native speakers!',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Excellent language teacher!', student: 'Ana M.' },
            { rating: 4, comment: 'Very patient and encouraging.', student: 'Luka T.' }
        ]
    },
    {
        id: 'tutor-005',
        firstName: 'Sarah',
        lastName: 'Johnson',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Psychology', category: 'Social Sciences', subcategory: 'Behavioral Sciences' },
            { name: 'Sociology', category: 'Social Sciences', subcategory: 'Social Studies' },
            { name: 'Economics', category: 'Social Sciences', subcategory: 'Business Studies' }
        ],
        gradeLevels: [9, 10, 11, 12],
        gender: 'female',
        bio: 'Psychology professor with PhD and extensive research experience in behavioral sciences.',
        detailedBio: 'Dr. Sarah Johnson is a licensed psychologist and professor with a PhD in Clinical Psychology from Johns Hopkins University. She has over 11 years of experience in both clinical practice and academic teaching.',
        hourlyRate: 60,
        subjectRates: {
            'Psychology': 65,
            'Sociology': 55,
            'Economics': 60
        },
        teachingHours: 1400,
        avgRating: 4.8,
        ratingCount: 98,
        yearsExperience: 11,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'Dr. Johnson\'s insights into human behavior are fascinating. She makes psychology concepts easy to understand.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Brilliant teacher with deep knowledge.', student: 'Michael R.' },
            { rating: 5, comment: 'Very engaging and insightful.', student: 'Emma L.' }
        ]
    },
    {
        id: 'tutor-006',
        firstName: 'Michael',
        lastName: 'Chen',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Calculus', category: 'Mathematics', subcategory: 'Advanced Math' },
            { name: 'Algebra', category: 'Mathematics', subcategory: 'Basic Math' },
            { name: 'Statistics', category: 'Mathematics', subcategory: 'Applied Math' }
        ],
        gradeLevels: [9, 10, 11, 12],
        gender: 'male',
        bio: 'Mathematics professor with 6 years of experience teaching advanced math concepts to high school students.',
        detailedBio: 'Michael holds a Master\'s degree in Mathematics and specializes in helping students master calculus and algebra. His teaching approach focuses on building strong foundational skills.',
        hourlyRate: 35,
        subjectRates: {
            'Calculus': 40,
            'Algebra': 30,
            'Statistics': 35
        },
        teachingHours: 450,
        avgRating: 4.6,
        ratingCount: 78,
        yearsExperience: 6,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'Michael made calculus click for me! His step-by-step approach is amazing.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Excellent math tutor!', student: 'Alex T.' },
            { rating: 4, comment: 'Very patient and clear.', student: 'Maria S.' }
        ]
    },
    {
        id: 'tutor-007',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Poetry', category: 'Literature', subcategory: 'Creative Writing' },
            { name: 'Creative Writing', category: 'Literature', subcategory: 'Composition' },
            { name: 'World Literature', category: 'Literature', subcategory: 'Classics' }
        ],
        gradeLevels: [8, 9, 10, 11, 12],
        gender: 'female',
        bio: 'Published poet and creative writing instructor with 4 years of experience inspiring young writers.',
        detailedBio: 'Emily is an award-winning poet with a Master\'s in Creative Writing. She helps students discover their voice through poetry and creative expression.',
        hourlyRate: 30,
        subjectRates: {
            'Poetry': 35,
            'Creative Writing': 30,
            'World Literature': 25
        },
        teachingHours: 280,
        avgRating: 4.8,
        ratingCount: 45,
        yearsExperience: 4,
        lessonFormats: ['Online'],
        pinnedComment: 'Emily helped me win the school poetry contest! She\'s an amazing mentor.',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Incredible writing teacher!', student: 'Sophia L.' },
            { rating: 5, comment: 'She helped me find my voice.', student: 'James K.' }
        ]
    },
    {
        id: 'tutor-008',
        firstName: 'Dr. James',
        lastName: 'Wilson',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Physics', category: 'Science', subcategory: 'Physical Sciences' },
            { name: 'Chemistry', category: 'Science', subcategory: 'Physical Sciences' }
        ],
        gradeLevels: [10, 11, 12, 'abiturient', 'bachelor_1', 'bachelor_2'],
        gender: 'male',
        bio: 'PhD in Physics with 8 years of experience making complex science concepts accessible to students.',
        detailedBio: 'Dr. Wilson holds a PhD in Theoretical Physics and has published several research papers. He specializes in making physics and chemistry concepts understandable.',
        hourlyRate: 50,
        subjectRates: {
            'Physics': 55,
            'Chemistry': 50
        },
        teachingHours: 600,
        avgRating: 4.7,
        ratingCount: 89,
        yearsExperience: 8,
        lessonFormats: ['Online', 'Tutor visits'],
        pinnedComment: 'Dr. Wilson made physics make sense! His analogies are brilliant.',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Best physics teacher ever!', student: 'David M.' },
            { rating: 4, comment: 'Very knowledgeable.', student: 'Lisa R.' }
        ]
    },
    {
        id: 'tutor-009',
        firstName: 'Alex',
        lastName: 'Kim',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Back-end Development', category: 'Technical', subcategory: 'Programming' },
            { name: 'Front-end Development', category: 'Technical', subcategory: 'Programming' }
        ],
        gradeLevels: [9, 10, 11, 12, 'abiturient', 'bachelor_1', 'bachelor_2', 'bachelor_3'],
        gender: 'male',
        bio: 'Software engineer with 5 years of industry experience teaching programming to students of all levels.',
        detailedBio: 'Alex is a senior software engineer at a tech startup. He loves teaching programming and has helped many students start their coding journey.',
        hourlyRate: 40,
        subjectRates: {
            'Back-end Development': 45,
            'Front-end Development': 40
        },
        teachingHours: 350,
        avgRating: 4.9,
        ratingCount: 67,
        yearsExperience: 5,
        lessonFormats: ['Online'],
        pinnedComment: 'Alex taught me Python from scratch. Now I\'m building my own apps!',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Amazing programming tutor!', student: 'Ryan P.' },
            { rating: 5, comment: 'Very patient and encouraging.', student: 'Emma T.' }
        ]
    },
    {
        id: 'tutor-010',
        firstName: 'Isabella',
        lastName: 'Martinez',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Spanish', category: 'Languages', subcategory: 'Foreign Languages' },
            { name: 'French', category: 'Languages', subcategory: 'Foreign Languages' },
            { name: 'English', category: 'Languages', subcategory: 'Foreign Languages' }
        ],
        gradeLevels: [6, 7, 8, 9, 10, 11, 12],
        gender: 'female',
        bio: 'Trilingual language instructor with 7 years of experience teaching Spanish, French, and English.',
        detailedBio: 'Isabella is a native Spanish speaker who is also fluent in French and English. She has lived in three countries and brings cultural context to language learning.',
        hourlyRate: 35,
        subjectRates: {
            'Spanish': 35,
            'French': 35,
            'English': 30
        },
        teachingHours: 520,
        avgRating: 4.8,
        ratingCount: 94,
        yearsExperience: 7,
        lessonFormats: ['Online'],
        pinnedComment: 'Isabella made me fluent in Spanish in just 6 months! She\'s incredible.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Best language teacher!', student: 'Carlos M.' },
            { rating: 5, comment: 'Very engaging lessons.', student: 'Anna L.' }
        ]
    },
    {
        id: 'tutor-011',
        firstName: 'Robert',
        lastName: 'Thompson',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'History', category: 'Social Sciences', subcategory: 'Humanities' },
            { name: 'Geography', category: 'Social Sciences', subcategory: 'Earth Sciences' }
        ],
        gradeLevels: [7, 8, 9, 10, 11, 12],
        gender: 'male',
        bio: 'History teacher with 9 years of experience making the past come alive for students.',
        detailedBio: 'Robert has a Master\'s in History and has traveled extensively. He brings historical events to life through storytelling and interactive learning.',
        hourlyRate: 25,
        subjectRates: {
            'History': 30,
            'Geography': 25
        },
        teachingHours: 680,
        avgRating: 4.5,
        ratingCount: 112,
        yearsExperience: 9,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'Robert makes history fascinating! His stories are unforgettable.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 4, comment: 'Great history teacher!', student: 'Tom W.' },
            { rating: 5, comment: 'Very knowledgeable.', student: 'Sarah K.' }
        ]
    },
    {
        id: 'tutor-012',
        firstName: 'Grace',
        lastName: 'Williams',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Piano', category: 'Hobbies & Interests', subcategory: 'Music' },
            { name: 'Drawing/Painting', category: 'Hobbies & Interests', subcategory: 'Arts' },
            { name: 'Singing', category: 'Hobbies & Interests', subcategory: 'Music' }
        ],
        gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        gender: 'female',
        bio: 'Professional musician and art instructor with 6 years of experience teaching creative arts to students of all ages.',
        detailedBio: 'Grace is a classically trained pianist and visual artist. She believes in nurturing creativity and self-expression through music and art.',
        hourlyRate: 30,
        subjectRates: {
            'Piano': 35,
            'Drawing/Painting': 25,
            'Singing': 30
        },
        teachingHours: 420,
        avgRating: 4.7,
        ratingCount: 73,
        yearsExperience: 6,
        lessonFormats: ['Online', 'Student visits', 'Tutor visits'],
        pinnedComment: 'Grace helped me discover my artistic talent. She\'s an amazing mentor!',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Incredible art teacher!', student: 'Maya P.' },
            { rating: 5, comment: 'Very patient and encouraging.', student: 'Lucas R.' }
        ]
    },
    {
        id: 'tutor-013',
        firstName: 'Mrs. Jennifer',
        lastName: 'Brown',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Arithmetic', category: 'Mathematics', subcategory: 'Basic Math' },
            { name: 'Reading', category: 'Literature', subcategory: 'Basic Skills' }
        ],
        gradeLevels: [1, 2, 3, 4, 5],
        gender: 'female',
        bio: 'Elementary school teacher with 10 years of experience helping young students build strong academic foundations.',
        detailedBio: 'Mrs. Brown specializes in early childhood education and has a gentle, patient approach to teaching basic math and reading skills.',
        hourlyRate: 20,
        subjectRates: {
            'Arithmetic': 20,
            'Reading': 20
        },
        teachingHours: 800,
        avgRating: 4.9,
        ratingCount: 156,
        yearsExperience: 10,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'Mrs. Brown made learning fun for my daughter! She\'s wonderful with kids.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Perfect for young learners!', student: 'Parent of Emma' },
            { rating: 5, comment: 'Very patient and kind.', student: 'Parent of Jake' }
        ]
    },
    {
        id: 'tutor-014',
        firstName: 'Marcus',
        lastName: 'Davis',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Biology', category: 'Science', subcategory: 'Life Sciences' },
            { name: 'Environmental Science', category: 'Science', subcategory: 'Earth Sciences' }
        ],
        gradeLevels: [8, 9, 10, 11, 12],
        gender: 'male',
        bio: 'Biology teacher with 5 years of experience making life sciences engaging and understandable.',
        detailedBio: 'Marcus has a background in environmental biology and loves connecting students with nature and scientific concepts.',
        hourlyRate: 28,
        subjectRates: {
            'Biology': 30,
            'Environmental Science': 25
        },
        teachingHours: 380,
        avgRating: 4.6,
        ratingCount: 82,
        yearsExperience: 5,
        lessonFormats: ['Online', 'Tutor visits'],
        pinnedComment: 'Marcus made biology exciting! His field trip ideas are amazing.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Great biology teacher!', student: 'Zoe H.' },
            { rating: 4, comment: 'Very knowledgeable about nature.', student: 'Ben S.' }
        ]
    },
    {
        id: 'tutor-015',
        firstName: 'Dr. Lisa',
        lastName: 'Anderson',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Economics', category: 'Social Sciences', subcategory: 'Business Studies' },
            { name: 'Business Studies', category: 'Social Sciences', subcategory: 'Business Studies' }
        ],
        gradeLevels: [9, 10, 11, 12, 'abiturient', 'bachelor_1', 'bachelor_2', 'bachelor_3', 'bachelor_4', 'masters'],
        gender: 'female',
        bio: 'Economics professor with 12 years of experience teaching business and economic concepts to high school students.',
        detailedBio: 'Dr. Anderson holds a PhD in Economics and has worked in both academia and industry. She brings real-world examples to economic concepts.',
        hourlyRate: 45,
        subjectRates: {
            'Economics': 50,
            'Business Studies': 45
        },
        teachingHours: 720,
        avgRating: 4.8,
        ratingCount: 98,
        yearsExperience: 12,
        lessonFormats: ['Online'],
        pinnedComment: 'Dr. Anderson helped me understand economics like never before. She\'s brilliant!',
        introVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Excellent economics teacher!', student: 'Kevin L.' },
            { rating: 5, comment: 'Very clear explanations.', student: 'Rachel M.' }
        ]
    },
    {
        id: 'tutor-016',
        firstName: 'Carlos',
        lastName: 'Silva',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Portuguese', category: 'Languages', subcategory: 'Foreign Languages' },
            { name: 'Spanish', category: 'Languages', subcategory: 'Foreign Languages' }
        ],
        gradeLevels: [6, 7, 8, 9, 10, 11, 12],
        gender: 'male',
        bio: 'Native Portuguese speaker with 4 years of experience teaching Portuguese and Spanish to international students.',
        detailedBio: 'Carlos is from Brazil and is fluent in both Portuguese and Spanish. He brings cultural richness to language learning.',
        hourlyRate: 25,
        subjectRates: {
            'Portuguese': 30,
            'Spanish': 25
        },
        teachingHours: 290,
        avgRating: 4.7,
        ratingCount: 56,
        yearsExperience: 4,
        lessonFormats: ['Online'],
        pinnedComment: 'Carlos made learning Portuguese so much fun! His cultural insights are amazing.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Great language teacher!', student: 'Isabella R.' },
            { rating: 4, comment: 'Very patient and fun.', student: 'Diego M.' }
        ]
    },
    {
        id: 'tutor-017',
        firstName: 'Mrs. Patricia',
        lastName: 'Taylor',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Basic Math', category: 'Mathematics', subcategory: 'Elementary' },
            { name: 'Writing Skills', category: 'Literature', subcategory: 'Elementary' }
        ],
        gradeLevels: [1, 2, 3, 4, 5],
        gender: 'female',
        bio: 'Elementary school teacher with 8 years of experience helping young students master basic academic skills.',
        detailedBio: 'Mrs. Taylor specializes in early elementary education and has a warm, nurturing approach to teaching basic math and writing.',
        hourlyRate: 22,
        subjectRates: {
            'Basic Math': 22,
            'Writing Skills': 22
        },
        teachingHours: 650,
        avgRating: 4.8,
        ratingCount: 124,
        yearsExperience: 8,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'Mrs. Taylor helped my son love math! She\'s wonderful with children.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Perfect for elementary students!', student: 'Parent of Mia' },
            { rating: 5, comment: 'Very caring and patient.', student: 'Parent of Alex' }
        ]
    },
    {
        id: 'tutor-018',
        firstName: 'Daniel',
        lastName: 'Clark',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Geometry', category: 'Mathematics', subcategory: 'Basic Math' },
            { name: 'Trigonometry', category: 'Mathematics', subcategory: 'Advanced Math' }
        ],
        gradeLevels: [8, 9, 10, 11, 12],
        gender: 'male',
        bio: 'Math teacher with 7 years of experience specializing in geometry and trigonometry for high school students.',
        detailedBio: 'Daniel has a Master\'s in Mathematics Education and specializes in helping students visualize and understand geometric concepts.',
        hourlyRate: 32,
        subjectRates: {
            'Geometry': 30,
            'Trigonometry': 35
        },
        teachingHours: 480,
        avgRating: 4.6,
        ratingCount: 91,
        yearsExperience: 7,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'Daniel made geometry click for me! His visual approach is amazing.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Great math tutor!', student: 'Chris T.' },
            { rating: 4, comment: 'Very clear explanations.', student: 'Amanda K.' }
        ]
    },
    {
        id: 'tutor-019',
        firstName: 'Rachel',
        lastName: 'Green',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Anatomy', category: 'Science', subcategory: 'Life Sciences' },
            { name: 'Physiology', category: 'Science', subcategory: 'Life Sciences' }
        ],
        gradeLevels: [10, 11, 12],
        gender: 'female',
        bio: 'Pre-med student with 3 years of experience tutoring anatomy and physiology for aspiring medical students.',
        detailedBio: 'Rachel is a pre-med student at a top university and excels at making complex biological systems understandable.',
        hourlyRate: 35,
        subjectRates: {
            'Anatomy': 40,
            'Physiology': 35
        },
        teachingHours: 180,
        avgRating: 4.9,
        ratingCount: 42,
        yearsExperience: 3,
        lessonFormats: ['Online'],
        pinnedComment: 'Rachel helped me ace my anatomy exam! She\'s incredibly knowledgeable.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Amazing anatomy tutor!', student: 'Jake M.' },
            { rating: 5, comment: 'Very detailed explanations.', student: 'Sofia R.' }
        ]
    },
    {
        id: 'tutor-020',
        firstName: 'Mr. Kevin',
        lastName: 'Johnson',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        subjects: [
            { name: 'Reading Comprehension', category: 'Literature', subcategory: 'Elementary' },
            { name: 'Spelling', category: 'Literature', subcategory: 'Elementary' }
        ],
        gradeLevels: [1, 2, 3, 4, 5],
        gender: 'male',
        bio: 'Elementary reading specialist with 9 years of experience helping young students develop strong literacy skills.',
        detailedBio: 'Mr. Johnson is a certified reading specialist who uses phonics and interactive methods to help students become confident readers.',
        hourlyRate: 24,
        subjectRates: {
            'Reading Comprehension': 25,
            'Spelling': 22
        },
        teachingHours: 720,
        avgRating: 4.8,
        ratingCount: 138,
        yearsExperience: 9,
        lessonFormats: ['Online', 'Student visits'],
        pinnedComment: 'Mr. Johnson helped my daughter become a confident reader! He\'s amazing.',
        introVideoUrl: null,
        verifiedTrusted: true,
        reviews: [
            { rating: 5, comment: 'Perfect for struggling readers!', student: 'Parent of Lily' },
            { rating: 5, comment: 'Very patient and encouraging.', student: 'Parent of Noah' }
        ]
    }
];

function generateMockGradeLevels() {
    const gradeLevels = [];
    const numGrades = Math.floor(Math.random() * 4) + 1; // 1-4 grade levels
    for (let i = 0; i < numGrades; i++) {
        gradeLevels.push(Math.floor(Math.random() * 12) + 1); // 1-12
    }
    return [...new Set(gradeLevels)]; // Remove duplicates
}

function generateMockGender() {
    const genders = ['male', 'female', 'other', 'prefer_not_to_say'];
    return genders[Math.floor(Math.random() * genders.length)];
}

function generateMockTutors(count) {
    // Return the sample tutors instead of generating random ones
    return SAMPLE_TUTORS.slice(0, Math.min(count, SAMPLE_TUTORS.length));
}

function displayTutors(tutors) {
    const container = document.getElementById('tutorsGrid');
    if (!container) {
        console.error('Tutors grid container not found');
        return;
    }
    
    if (tutors.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    container.innerHTML = tutors.map(tutor => createTutorCard(tutor)).join('');
}

function createTutorCard(tutor) {
    const priceText = tutor.hourlyRate ? `Starting from $${tutor.hourlyRate}/hour` : 'Contact for pricing';
    const stars = '★'.repeat(Math.floor(tutor.avgRating)) + '☆'.repeat(5 - Math.floor(tutor.avgRating));
    const lessonFormats = tutor.lessonFormats || ['Online'];
    
    // Handle both old and new subject formats
    const subjectNames = tutor.subjects.map(subject => 
        typeof subject === 'string' ? subject : subject.name
    );
    const subjectList = subjectNames.slice(0, 3).join(', ');
    const remainingSubjects = subjectNames.length > 3 ? ` +${subjectNames.length - 3} more` : '';
    
    return `
        <div class="tutor-card" onclick="selectTutor('${tutor.id}')">
            <div class="tutor-header">
                <div class="tutor-avatar">
                    ${tutor.profileImage ? `<img src="${tutor.profileImage}" alt="${tutor.firstName}">` : tutor.firstName.charAt(0)}
                </div>
                <div class="tutor-info">
                    <h3>${tutor.firstName} ${tutor.lastName}</h3>
                    <div class="tutor-badges">
                        ${tutor.verifiedTrusted ? '<span class="badge badge-verified">✓ Verified</span>' : ''}
                        ${tutor.verifiedTrusted ? '<span class="badge badge-trusted">Trusted</span>' : ''}
                    </div>
                    <div class="tutor-price">${priceText}</div>
                </div>
            </div>
            <div class="tutor-rating">
                <span class="stars">${stars}</span>
                <span class="rating-text">${tutor.avgRating} (${tutor.ratingCount} reviews)</span>
            </div>
            <div class="tutor-bio">${tutor.bio || 'Experienced tutor ready to help you succeed!'}</div>
            <div class="tutor-subjects">
                <strong>Subjects:</strong> ${subjectList}${remainingSubjects}
            </div>
            <div class="tutor-stats">
                <span>📚 ${tutor.teachingHours} teaching hours</span>
                <span>⭐ ${tutor.yearsExperience || 0} years experience</span>
            </div>
            <div class="lesson-formats">
                ${lessonFormats.map(format => `<span class="format-tag">${format}</span>`).join('')}
            </div>
            ${tutor.pinnedComment ? `<div class="pinned-comment">"${tutor.pinnedComment}"</div>` : ''}
            <button class="booking-btn" onclick="event.stopPropagation(); bookTutor('${tutor.id}')">Book Lesson</button>
        </div>
    `;
}

function hasActiveFilters() {
    return currentFilters.subjects.length > 0 ||
           currentFilters.gradeLevels.length > 0 ||
           currentFilters.gender.length > 0 ||
           currentFilters.minRating > 0 ||
           currentFilters.teachingMethods.length > 0 ||
           currentFilters.experience.length > 0;
}

function applyFilters() {
    // Don't apply filters if tutors data is not loaded yet
    if (!tutorsData || tutorsData.length === 0) {
        return;
    }
    
    let filteredTutors = [...tutorsData];
    
    // If no filters are active, show all tutors (except price filter which is always applied)
    if (!hasActiveFilters()) {
        filteredTutors = filteredTutors.filter(tutor => 
            tutor.hourlyRate <= currentFilters.priceRange
        );
        displayTutors(filteredTutors);
        updateResultsCount(filteredTutors.length);
        return;
    }
    
    // Apply subject filter
    if (currentFilters.subjects.length > 0) {
        filteredTutors = filteredTutors.filter(tutor => 
            currentFilters.subjects.some(subject => 
                tutor.subjects.some(tutorSubject => {
                    const subjectName = typeof tutorSubject === 'string' ? tutorSubject : tutorSubject.name;
                    return subjectName.toLowerCase().includes(subject.toLowerCase()) ||
                           subject.toLowerCase().includes(subjectName.toLowerCase());
                })
            )
        );
    }
    
    // Apply grade level filter
    if (currentFilters.gradeLevels.length > 0) {
        filteredTutors = filteredTutors.filter(tutor => {
            const tutorGradeLevels = tutor.gradeLevels || [];
            return currentFilters.gradeLevels.some(grade => {
                // Handle numeric grades (1-12)
                if (!isNaN(grade)) {
                    return tutorGradeLevels.includes(parseInt(grade));
                }
                // Handle string grades (abiturient, bachelor_1, etc.)
                return tutorGradeLevels.includes(grade);
            });
        });
    }
    
    // Apply gender filter
    if (currentFilters.gender.length > 0) {
        filteredTutors = filteredTutors.filter(tutor => {
            const tutorGender = tutor.gender || '';
            return currentFilters.gender.includes(tutorGender);
        });
    }
    
    // Apply price filter (always apply this one)
    filteredTutors = filteredTutors.filter(tutor => 
        tutor.hourlyRate <= currentFilters.priceRange
    );
    
    // Apply rating filter
    if (currentFilters.minRating > 0) {
        filteredTutors = filteredTutors.filter(tutor => 
            parseFloat(tutor.avgRating) >= currentFilters.minRating
        );
    }
    
    // Apply teaching method filter
    if (currentFilters.teachingMethods.length > 0) {
        filteredTutors = filteredTutors.filter(tutor => 
            currentFilters.teachingMethods.some(method => 
                tutor.lessonFormats.includes(method)
            )
        );
    }
    
    // Apply experience filter
    if (currentFilters.experience.length > 0) {
        filteredTutors = filteredTutors.filter(tutor => 
            currentFilters.experience.some(exp => {
                const tutorExp = tutor.yearsExperience;
                switch (exp) {
                    case '0-1': return tutorExp <= 1;
                    case '2-3': return tutorExp >= 2 && tutorExp <= 3;
                    case '4-5': return tutorExp >= 4 && tutorExp <= 5;
                    case '6-10': return tutorExp >= 6 && tutorExp <= 10;
                    case '10+': return tutorExp > 10;
                    default: return true;
                }
            })
        );
    }
    
    // Apply sorting
    switch (currentSort) {
        case 'rating':
            filteredTutors.sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating));
            break;
        case 'price_asc':
            filteredTutors.sort((a, b) => a.hourlyRate - b.hourlyRate);
            break;
        case 'price_desc':
            filteredTutors.sort((a, b) => b.hourlyRate - a.hourlyRate);
            break;
        case 'newest':
            filteredTutors.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            break;
        case 'demand':
            filteredTutors.sort((a, b) => b.ratingCount - a.ratingCount);
            break;
        default: // recommended
            filteredTutors.sort((a, b) => {
                const scoreA = parseFloat(a.avgRating) * Math.log(a.ratingCount + 1);
                const scoreB = parseFloat(b.avgRating) * Math.log(b.ratingCount + 1);
                return scoreB - scoreA;
            });
    }
    
    displayTutors(filteredTutors);
    updateResultsCount(filteredTutors.length);
}

function clearFilters() {
    currentFilters = {
        subjects: [],
        gradeLevels: [],
        gender: [],
        priceRange: 200,
        minRating: 0,
        teachingMethods: [],
        experience: []
    };
    
    // Reset UI
    document.getElementById('priceRange').value = 200;
    document.getElementById('maxPrice').textContent = '200';
    document.querySelectorAll('input[name="minRating"]')[0].checked = true;
    document.querySelectorAll('input[name="teachingMethod"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="experience"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="subjects"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="subjectCategories"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="subcategoryCategories"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="gradeLevels"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="gender"]').forEach(input => input.checked = false);
    
    // Hide all expanded subcategories and specific subjects
    document.querySelectorAll('.subcategory-list').forEach(list => {
        list.style.display = 'none';
    });
    document.querySelectorAll('.specific-subjects-list').forEach(list => {
        list.style.display = 'none';
    });
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.style.transform = 'rotate(0deg)';
    });
    
    // Display all tutors without filtering
    displayTutors(tutorsData);
    updateResultsCount(tutorsData.length);
}

function updateSort() {
    const sortSelect = document.getElementById('sortSelect');
    currentSort = sortSelect.value;
    applyFilters();
}

function setView(view) {
    currentView = view;
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Update grid layout based on view
    const tutorsGrid = document.getElementById('tutorsGrid');
    const searchMain = document.querySelector('.search-main');
    const searchLayout = document.querySelector('.search-layout');
    
    if (view === 'list') {
        tutorsGrid.style.gridTemplateColumns = '1fr';
        tutorsGrid.classList.add('list-view');
        tutorsGrid.classList.remove('grid-view');
        
        // Make the layout wider for list view
        if (searchLayout) {
            searchLayout.style.maxWidth = '1400px';
            searchLayout.classList.add('list-view-active');
        }
        if (searchMain) {
            searchMain.classList.add('list-view-active');
        }
    } else {
        tutorsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
        tutorsGrid.classList.add('grid-view');
        tutorsGrid.classList.remove('list-view');
        
        // Reset to normal width for grid view
        if (searchLayout) {
            searchLayout.style.maxWidth = '1200px';
            searchLayout.classList.remove('list-view-active');
        }
        if (searchMain) {
            searchMain.classList.remove('list-view-active');
        }
    }
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${count} tutors found`;
    }
}

function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function showNoResults() {
    const noResults = document.getElementById('noResults');
    const tutorsGrid = document.getElementById('tutorsGrid');
    if (noResults) {
        noResults.style.display = 'block';
    }
    if (tutorsGrid) {
        tutorsGrid.innerHTML = '';
    }
}

function hideNoResults() {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = 'none';
    }
}

// Video modal functionality
function showTutorVideo(tutorId) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('tutorVideo');
    const tutorName = document.getElementById('videoTutorName');
    const tutorSubjects = document.getElementById('videoTutorSubjects');
    
    if (!modal) return;
    
    // Find tutor data
    const tutor = tutorsData.find(t => t.id === tutorId);
    if (!tutor) return;
    
    // Set video source (mock)
    video.src = `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`;
    
    // Set tutor info
    tutorName.textContent = `${tutor.firstName} ${tutor.lastName}`;
    tutorSubjects.textContent = tutor.subjects.join(', ');
    
    modal.classList.add('show');
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('tutorVideo');
    
    if (modal) {
        modal.classList.remove('show');
    }
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!passwordInput || !strengthFill || !strengthText) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        let strengthLabel = 'Weak';
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        switch (strength) {
            case 0:
            case 1:
                strengthLabel = 'Weak';
                strengthFill.className = 'strength-fill weak';
                break;
            case 2:
            case 3:
                strengthLabel = 'Fair';
                strengthFill.className = 'strength-fill fair';
                break;
            case 4:
                strengthLabel = 'Good';
                strengthFill.className = 'strength-fill good';
                break;
            case 5:
                strengthLabel = 'Strong';
                strengthFill.className = 'strength-fill strong';
                break;
        }
        
        strengthText.textContent = strengthLabel;
    });
}

function setupPasswordConfirmation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!passwordInput || !confirmPasswordInput) return;
    
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
        } else {
            clearError('confirmPasswordError');
        }
    });
}

function setupBioCounter() {
    const bioInput = document.getElementById('bio');
    const bioCount = document.getElementById('bioCount');
    
    if (!bioInput || !bioCount) return;
    
    bioInput.addEventListener('input', function() {
        bioCount.textContent = this.value.length;
    });
}

function setupTeachingMethodsToggle() {
    const tutorVisitsCheckbox = document.getElementById('tutorVisits');
    const locationGroup = document.getElementById('locationGroup');
    const neighborhoodsGroup = document.getElementById('neighborhoodsGroup');
    
    if (!tutorVisitsCheckbox || !locationGroup || !neighborhoodsGroup) return;
    
    tutorVisitsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            locationGroup.style.display = 'block';
            neighborhoodsGroup.style.display = 'block';
        } else {
            locationGroup.style.display = 'none';
            neighborhoodsGroup.style.display = 'none';
        }
    });
}

function loadSubjects() {
    const container = document.getElementById('subjectsGrid');
    if (!container) return;
    
    // Mock subjects data
    const subjects = [
        'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
        'Spanish', 'French', 'German', 'History', 'Geography', 'Computer Science',
        'Economics', 'Psychology', 'Literature', 'Art', 'Music'
    ];
    
    container.innerHTML = subjects.map(subject => `
        <label class="checkbox-label">
            <input type="checkbox" name="subjects" value="${subject.toLowerCase().replace(' ', '_')}">
            <span class="checkmark"></span>
            ${subject}
        </label>
    `).join('');
}

function setupPhoneVerification() {
    const verifyBtn = document.getElementById('verifyPhoneBtn');
    const confirmBtn = document.getElementById('confirmPhoneBtn');
    const verificationCode = document.getElementById('verificationCode');
    const phoneCode = document.getElementById('phoneCode');
    
    if (!verifyBtn || !confirmBtn || !verificationCode || !phoneCode) return;
    
    verifyBtn.addEventListener('click', function() {
        const phone = document.getElementById('phone').value;
        if (!validatePhone(phone)) {
            showError('phoneError', 'Please enter a valid phone number');
            return;
        }
        
        // Mock SMS sending
        showSuccess('Verification code sent to your phone');
        verificationCode.style.display = 'flex';
        
        // Mock verification code
        const mockCode = '123456';
        console.log(`Mock verification code for ${phone}: ${mockCode}`);
    });
    
    confirmBtn.addEventListener('click', function() {
        const code = phoneCode.value;
        if (code === '123456') {
            showSuccess('Phone number verified successfully!');
            verificationCode.style.display = 'none';
            phoneCode.value = '';
        } else {
            showError('phoneError', 'Invalid verification code');
        }
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

function bookTutor(tutorId) {
    // Mock booking functionality
    showSuccess('Redirecting to booking page...');
    setTimeout(() => {
        alert(`Booking functionality would be implemented here for tutor ${tutorId}`);
    }, 1000);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        font-weight: 500;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Tutor Detail Panel Functions
function selectTutor(tutorId) {
    const tutor = tutorsData.find(t => t.id === tutorId);
    if (!tutor) return;
    
    displayTutorDetail(tutor);
    
    // Remove active class from all tutor cards
    document.querySelectorAll('.tutor-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected tutor card
    const selectedCard = document.querySelector(`[onclick="selectTutor('${tutorId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // Show the detail panel on mobile
    const panel = document.getElementById('tutorDetailPanel');
    if (panel) {
        panel.classList.add('active');
    }
}

function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

function formatGradeLevel(grade) {
    const gradeMap = {
        'abiturient': 'University Entrance Exam (Abiturient)',
        'bachelor_1': '1st Year (Bachelor\'s)',
        'bachelor_2': '2nd Year (Bachelor\'s)',
        'bachelor_3': '3rd Year (Bachelor\'s)',
        'bachelor_4': '4th Year (Bachelor\'s)',
        'masters': 'Master\'s',
        'phd': 'Doctorate (PhD)',
        'other': 'Other'
    };
    return gradeMap[grade] || grade;
}

function displayTutorDetail(tutor) {
    const panel = document.getElementById('tutorDetailPanel');
    if (!panel) return;
    
    // Handle both old and new subject formats
    const subjectNames = tutor.subjects.map(subject => 
        typeof subject === 'string' ? subject : subject.name
    );
    const subjectCategories = tutor.subjects.map(subject => 
        typeof subject === 'string' ? 'General' : subject.category
    );
    
    const stars = '★'.repeat(Math.floor(tutor.avgRating)) + '☆'.repeat(5 - Math.floor(tutor.avgRating));
    const lessonFormats = tutor.lessonFormats || ['Online'];
    const gradeLevels = tutor.gradeLevels || [];
    const gender = tutor.gender || 'Not specified';
    
    // Generate pricing display
    let pricingHTML = '';
    if (tutor.subjectRates && Object.keys(tutor.subjectRates).length > 0) {
        pricingHTML = Object.entries(tutor.subjectRates)
            .map(([subject, rate]) => `
                <div class="tutor-detail-pricing-item">
                    <span class="tutor-detail-pricing-subject">${subject}</span>
                    <span class="tutor-detail-pricing-price">$${rate}/hour</span>
                </div>
            `).join('');
    } else {
        pricingHTML = `
            <div class="tutor-detail-pricing-item">
                <span class="tutor-detail-pricing-subject">All subjects</span>
                <span class="tutor-detail-pricing-price">$${tutor.hourlyRate}/hour</span>
            </div>
        `;
    }
    
    // Generate subjects display
    const subjectsHTML = subjectNames.map((subjectName, index) => {
        const category = subjectCategories[index];
        return `<span class="tutor-detail-subject-tag ${category !== 'General' ? 'category' : ''}">${subjectName}</span>`;
    }).join('');
    
    // Generate grade levels display
    const gradeLevelsHTML = gradeLevels.length > 0 
        ? gradeLevels.map(grade => {
            if (typeof grade === 'number') {
                return `${grade}${getOrdinalSuffix(grade)} Grade`;
            }
            return formatGradeLevel(grade);
        }).join(', ')
        : 'All grade levels';
    
    // Generate reviews HTML
    let reviewsHTML = '';
    if (tutor.pinnedComment) {
        reviewsHTML += `
            <div class="tutor-detail-pinned-review">
                <div class="tutor-detail-review-text">"${tutor.pinnedComment}"</div>
                <div class="tutor-detail-review-author">- Student Review</div>
            </div>
        `;
    }
    
    if (tutor.reviews && tutor.reviews.length > 0) {
        reviewsHTML += tutor.reviews.slice(0, 2).map(review => `
            <div class="tutor-detail-pinned-review">
                <div class="tutor-detail-review-text">"${review.comment}"</div>
                <div class="tutor-detail-review-author">- ${review.student}</div>
            </div>
        `).join('');
    }
    
    panel.innerHTML = `
        <div class="tutor-detail-content">
            <div class="tutor-detail-view active">
                <div class="tutor-detail-header">
                    <img src="${tutor.profileImage || 'https://via.placeholder.com/120x120/6366f1/ffffff?text=' + tutor.firstName.charAt(0)}" 
                         alt="${tutor.firstName} ${tutor.lastName}" 
                         class="tutor-detail-image">
                    <h2 class="tutor-detail-name">${tutor.firstName} ${tutor.lastName}</h2>
                    <p class="tutor-detail-subjects">${subjectNames.slice(0, 3).join(', ')}${subjectNames.length > 3 ? ` +${subjectNames.length - 3} more` : ''}</p>
                    <div class="tutor-detail-rating">
                        <div class="tutor-detail-stars">
                            ${stars.split('').map(star => `<span class="star">${star}</span>`).join('')}
                        </div>
                        <span class="tutor-detail-rating-text">${tutor.avgRating} (${tutor.ratingCount} reviews)</span>
                    </div>
                </div>
                
                <div class="tutor-detail-bio">
                    ${tutor.detailedBio || tutor.bio || 'Experienced tutor ready to help you succeed!'}
                </div>
                
                <div class="tutor-detail-info">
                    <h4>Subjects & Categories</h4>
                    <div class="tutor-detail-subjects-list">
                        ${subjectsHTML}
                    </div>
                </div>
                
                <div class="tutor-detail-info">
                    <h4>Teaching Details</h4>
                    <div class="tutor-detail-info-grid">
                        <div class="tutor-detail-info-item">
                            <span class="tutor-detail-info-label">Grade Levels</span>
                            <span class="tutor-detail-info-value">${gradeLevelsHTML}</span>
                        </div>
                        <div class="tutor-detail-info-item">
                            <span class="tutor-detail-info-label">Gender</span>
                            <span class="tutor-detail-info-value">${gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                        </div>
                        <div class="tutor-detail-info-item">
                            <span class="tutor-detail-info-label">Experience</span>
                            <span class="tutor-detail-info-value">${tutor.yearsExperience} years</span>
                        </div>
                        <div class="tutor-detail-info-item">
                            <span class="tutor-detail-info-label">Teaching Hours</span>
                            <span class="tutor-detail-info-value">${tutor.teachingHours}</span>
                        </div>
                        <div class="tutor-detail-info-item">
                            <span class="tutor-detail-info-label">Lesson Formats</span>
                            <span class="tutor-detail-info-value">${lessonFormats.join(', ')}</span>
                        </div>
                    </div>
                </div>
                
                <div class="tutor-detail-pricing">
                    <h4>Pricing</h4>
                    ${pricingHTML}
                </div>
                
                ${reviewsHTML ? `
                <div class="tutor-detail-reviews">
                    <h4>Student Reviews</h4>
                    ${reviewsHTML}
                </div>
                ` : ''}
                
                <div class="tutor-detail-actions">
                    <button class="tutor-detail-book-btn" onclick="bookTutor('${tutor.id}')">
                        Book Lesson with ${tutor.firstName}
                    </button>
                    ${tutor.introVideoUrl ? `
                        <button class="tutor-detail-video-btn" onclick="showTutorVideo('${tutor.id}')">
                            Watch Intro Video
                        </button>
                    ` : `
                        <button class="tutor-detail-video-btn" disabled>
                            No intro video available
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

// Direct initialization for search page
if (window.location.pathname.includes('search.html')) {
    setTimeout(() => {
        // Load tutors
        const mockTutors = generateMockTutors(20);
        tutorsData = mockTutors;
        displayTutors(mockTutors);
        updateResultsCount(mockTutors.length);
        
        // Setup filters and other functionality
        setupSearchSuggestions();
        setupFilters();
        setupSorting();
        setupInfiniteScroll();
    }, 500);
}
