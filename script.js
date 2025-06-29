document.addEventListener('DOMContentLoaded', function() {

    // --- Product Data (Embedded to prevent loading errors) ---
    const productsData = [
      { id: "singer001", name_ar: "مكوك سنجر أصلي موديل 123", category: "singer", image_path: "images/spare-parts.jpg", availability: "available", featured: true },
      { id: "singer002", name_ar: "دواسة عراوي أوتوماتيك سنجر", category: "singer", image_path: "images/supplies.jpg", availability: "unavailable" },
      { id: "over001", name_ar: "طقم سكاكين أوفر (عليا وسفلى)", category: "over", image_path: "images/machine-tools.jpg", availability: "available", featured: true },
      { id: "over002", name_ar: "حامل بكرات خيط لماكينة أوفر", category: "over", image_path: "images/logo.png", availability: "available" },
      { id: "orleh001", name_ar: "دليل خيط لماكينة أورليه", category: "orleh", image_path: "images/spare-parts.jpg", availability: "available" },
      { id: "needles001", name_ar: "علبة إبر متنوعة (مقاسات مختلفة)", category: "needles", image_path: "images/supplies.jpg", availability: "available", featured: true },
      { id: "accessories001", name_ar: "زيت ماكينة خياطة عالي النقاء", category: "accessories", image_path: "images/supplies.jpg", availability: "available", featured: true },
      { id: "accessories002", name_ar: "مقص أقمشة احترافي", category: "accessories", image_path: "images/machine-tools.jpg", availability: "available" }
    ];

    // --- General Initializations ---
    function init() {
        // Activate AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true, offset: 50 });
        }

        // Set current year in footer
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        // Handle mobile menu
        const hamburger = document.getElementById('hamburgerMenu');
        const navLinks = document.getElementById('navLinks');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        
        // Sticky Header Logic
        const header = document.querySelector('.site-header');
        if(header){
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight){
                    header.style.top = `-${header.offsetHeight}px`; // Hide using dynamic height
                } else {
                    header.style.top = '0'; // Show
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });
        }
    }
    
    // --- Product Rendering Logic ---
    function renderProducts(productsToRender, containerElement) {
        if (!containerElement) return;
        containerElement.innerHTML = '';
        
        const noResultsMessage = document.getElementById('no-results-message');

        if (productsToRender.length === 0) {
            if(noResultsMessage) noResultsMessage.style.display = 'block';
            return;
        }
        
        if(noResultsMessage) noResultsMessage.style.display = 'none';
        
        productsToRender.forEach(product => {
            const availabilityClass = product.availability === 'available' ? 'available' : 'unavailable';
            const availabilityText = product.availability === 'available' ? 'متوفر' : 'غير متوفر حاليًا';

            const cardHTML = `
                <div class="product-card">
                    <img src="${product.image_path}" alt="${product.name_ar}" class="product-image" onerror="this.onerror=null;this.src='https://placehold.co/300x200/e9ecef/343a40?text=Image';">
                    <div class="product-info">
                        <h3 class="product-name">${product.name_ar}</h3>
                        <p class="product-availability ${availabilityClass}">${availabilityText}</p>
                        <a href="index.html#contact" class="btn btn-primary">اطلب الآن</a>
                    </div>
                </div>`;
            containerElement.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- Page-Specific Logic ---
    function initHomePage() {
        if (document.body.classList.contains('homepage')) {
            const featuredGrid = document.getElementById('featured-product-grid');
            const featuredProducts = productsData.filter(p => p.featured);
            renderProducts(featuredProducts, featuredGrid);
        }
    }

    function initProductsPage() {
        if (document.body.classList.contains('products-page')) {
            const allProductsGrid = document.getElementById('all-products-grid');
            const filterBtns = document.querySelectorAll('.filter-btn');
            
            // Logic to handle URL parameter filtering
            const urlParams = new URLSearchParams(window.location.search);
            const filterFromUrl = urlParams.get('filter');

            if (filterFromUrl) {
                // Apply filter from URL
                const productsFilteredByUrl = productsData.filter(p => p.category === filterFromUrl);
                renderProducts(productsFilteredByUrl, allProductsGrid);
                // Update active state on buttons correctly
                filterBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filterFromUrl);
                });
            } else {
                // Initial render with all products if no filter in URL
                renderProducts(productsData, allProductsGrid);
                 // Make sure "All" button is active by default
                filterBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === 'all');
                });
            }

            // Add click listeners to filter buttons
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const filterValue = btn.dataset.filter;
                    const filteredProducts = (filterValue === 'all')
                        ? productsData
                        : productsData.filter(p => p.category === filterValue);
                    
                    renderProducts(filteredProducts, allProductsGrid);
                });
            });
        }
    }

    // --- Run All Initializations ---
    init();
    initHomePage();
    initProductsPage();
});
