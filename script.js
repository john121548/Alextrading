document.addEventListener('DOMContentLoaded', function() {

    // --- Product Data ---
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
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true, offset: 50 });
        }
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
        const hamburger = document.getElementById('hamburgerMenu');
        const navLinks = document.getElementById('navLinks');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        const header = document.querySelector('.site-header');
        if(header){
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight){
                    header.style.top = `-${header.offsetHeight}px`;
                } else {
                    header.style.top = '0';
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

    // --- Gemini AI Assistant Logic ---
    function initGeminiAssistant() {
        const getAdviceBtn = document.getElementById('get-advice-btn');
        const problemDescription = document.getElementById('problem-description');
        const modal = document.getElementById('gemini-modal');
        const closeModalBtn = document.getElementById('close-gemini-modal');
        const responseContainer = document.getElementById('gemini-response-container');

        if (!getAdviceBtn) return;

        getAdviceBtn.addEventListener('click', async () => {
            const problem = problemDescription.value.trim();
            if (problem === "") {
                alert("الرجاء وصف المشكلة التي تواجهها.");
                return;
            }

            modal.classList.add('show');
            responseContainer.innerHTML = '<div class="loading-spinner"></div>';
            
            const prompt = `
                أنت خبير في صيانة ماكينات الخياطة. مستخدم يصف مشكلة تواجهه ويريد نصيحة.
                المشكلة هي: "${problem}"
    
                مهمتك هي تقديم رد واضح ومساعد باللغة العربية، مقسم إلى ثلاثة أقسام:
                1.  **الأسباب المحتملة:** اذكر 2-3 أسباب قد تؤدي لهذه المشكلة.
                2.  **خطوات الحل المقترحة:** قدم 2-3 خطوات بسيطة يمكن للمستخدم تجربتها.
                3.  **قطع غيار قد تحتاجها:** اذكر 1-2 من قطع الغيار التي قد تحل المشكلة، مثل (إبر جديدة، مكوك، بيت مكوك، زيت ماكينة).
    
                اجعل الرد مختصراً ومباشراً.
            `;

            try {
                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiKey = ""; // Leave empty for Canvas provided key
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.candidates && result.candidates.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    responseContainer.innerHTML = text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
                        .replace(/\n/g, '<br>'); // New lines
                } else {
                    throw new Error("لم يتم العثور على رد من المساعد الذكي.");
                }

            } catch (error) {
                console.error("Gemini API Error:", error);
                responseContainer.innerHTML = `<p>عفواً، حدث خطأ أثناء محاولة الحصول على نصيحة. الرجاء المحاولة مرة أخرى لاحقاً.</p>`;
            }
        });

        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.classList.remove('show');
            }
        });
    }

    // --- Page-Specific Logic ---
    function initHomePage() {
        if (document.body.classList.contains('homepage')) {
            const featuredGrid = document.getElementById('featured-product-grid');
            const featuredProducts = productsData.filter(p => p.featured);
            renderProducts(featuredProducts, featuredGrid);
            initGeminiAssistant(); // Initialize Gemini feature on homepage
        }
    }

    function initProductsPage() {
        if (document.body.classList.contains('products-page')) {
            const allProductsGrid = document.getElementById('all-products-grid');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const urlParams = new URLSearchParams(window.location.search);
            const filterFromUrl = urlParams.get('filter');

            if (filterFromUrl) {
                const productsFilteredByUrl = productsData.filter(p => p.category === filterFromUrl);
                renderProducts(productsFilteredByUrl, allProductsGrid);
                filterBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filterFromUrl);
                });
            } else {
                renderProducts(productsData, allProductsGrid);
                filterBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === 'all');
                });
            }

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
