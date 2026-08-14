
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMmhAILiMlfOyu9UZ1aZVTfyAPxHdNyLbkHnMMAD8wm2JXZMut80kEZPOdcuDZDNAu7A/exec";
        const VIDEO_API_URL = "https://script.google.com/macros/s/AKfycbz96wiJgTCqEVCVjTVgPgpq2TWt1Xp0gmCb1I3ahO_dQFVMdRZ4ai7qlCPzJp2NDqPdJA/exec";
        const CACHE_KEY = "sivmaga_gallery_cache";
        const VIDEO_CACHE_KEY = "sivmaga_video_cache";
        const CACHE_TTL_MS = 60 * 1000;

        // Target Google Drive Folder IDs
        const IMAGE_FOLDER_ID = "1wxQPQVNpKcUJSubKv-USkuBe0nhPIHfG";
        const VIDEO_FOLDER_ID = "1KJPE1gFQTJnmrX4-L0sxkE50uR88P_QU";
        const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

        let allImagesData = [];
        let filteredImagesData = [];
        let allVideosData = [];
        let filteredVideosData = [];
        let isVideosLoaded = false;
        let isVideosLoading = false;
        let activeTab = 'photos'; // 'photos' or 'videos'
        let activeCategory = 'all'; // 'all', 'events', 'pinkam', 'other'

        let displayedCount = 0;
        const BATCH_SIZE = 12;
        let observer = null;
        let currentImageIndex = 0;
        let currentVideoIndex = 0;

        let touchStartX = 0;
        let touchEndX = 0;

        // Helper to parse Category using delimiter '|' or '#'
        function parseCategory(rawItem, fallbackCategory = 'other') {
            let rawStr = rawItem.title || rawItem.name || rawItem.description || '';
            let category = (rawItem.category && rawItem.category !== 'undefined') ? String(rawItem.category).trim().toLowerCase() : fallbackCategory;
            let itemDate = rawItem.date || rawItem.createdTime || null;

            const delimiter = rawStr.includes('|') ? '|' : (rawStr.includes('#') ? '#' : null);

            if (delimiter) {
                const parts = rawStr.split(delimiter).map(p => p.trim());
                if (parts.length >= 3) {
                    if (/^\d{4}-\d{2}-\d{2}/.test(parts[1])) {
                        itemDate = parts[1];
                        category = parts[2].toLowerCase();
                    } else if (/^\d{4}-\d{2}-\d{2}/.test(parts[0])) {
                        itemDate = parts[0];
                        category = parts[2].toLowerCase();
                    } else {
                        category = parts[parts.length - 1].toLowerCase();
                    }
                } else if (parts.length === 2) {
                    if (/^\d{4}-\d{2}-\d{2}/.test(parts[1])) {
                        itemDate = parts[1];
                    } else {
                        category = parts[1].toLowerCase();
                    }
                }
            }

            return { category, date: itemDate };
        }

        // Category Sinhala Label Helper
        function getCategoryLabel(cat) {
            if (!cat) return 'වෙනත්';
            const c = String(cat).trim().toLowerCase();
            if (c === 'events') return 'ධම්ම';
            if (c === 'pinkam') return 'පින් කටයුතු';
            if (c === 'other') return 'වෙනත්';
            return cat;
        }

        function readCachedImages() {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (!cachedData) return { items: [], fresh: false };

            try {
                const parsed = JSON.parse(cachedData);
                const items = Array.isArray(parsed?.items) ? parsed.items : (Array.isArray(parsed) ? parsed : []);
                const timestamp = Number(parsed?.timestamp || 0);
                const fresh = items.length > 0 && Date.now() - timestamp < CACHE_TTL_MS;

                if (fresh) {
                    return { items, fresh: true };
                }

                return { items, fresh: false };
            } catch (e) {
                console.error("Cache parse error", e);
                return { items: [], fresh: false };
            }
        }

        window.onload = function () {
            setupIntersectionObserver();
            setupKeyboardAndTouch();

            const { items: cachedImages, fresh: hasCache } = readCachedImages();
            if (cachedImages.length > 0) {
                allImagesData = cachedImages;
                applyFilters();
            }

            fetchPhotos(hasCache);
            fetchVideos();

            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'visible') {
                    fetchPhotos(false);
                }
            });

            setInterval(() => {
                if (document.visibilityState === 'visible') {
                    fetchPhotos(false);
                }
            }, 45000);
        };

        function getOptimizedDriveUrl(url, size = 'w600') {
            if (!url) return 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';

            let idMatch = url.match(/id=([a-zA-Z0-9_-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);

            if (idMatch && idMatch[1]) {
                const fileId = idMatch[1];
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
            }
            return url;
        }

        function fetchPhotos(hasCache = false) {
            if (!hasCache) {
                showLoadingState();
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);
            const cacheBustUrl = `${SCRIPT_URL}?_ts=${Date.now()}`;

            fetch(cacheBustUrl, { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) throw new Error("ප්‍රතිචාරය ලබා ගැනීමට නොහැකි විය");
                    return response.json();
                })
                .then(images => {
                    let imageList = images || [];
                    if (Array.isArray(imageList)) {
                        imageList = imageList.map(img => {
                            const parsed = parseCategory(img, 'other');
                            return {
                                ...img,
                                category: parsed.category,
                                date: parsed.date
                            };
                        });
                        imageList.sort((a, b) => {
                            if (a.date && b.date) {
                                return new Date(b.date) - new Date(a.date);
                            }
                            return 0;
                        });
                    }
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items: imageList }));
                    allImagesData = imageList;
                    applyFilters();
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    if (!hasCache && allImagesData.length === 0) {
                        document.getElementById('photoGallery').innerHTML = '<p class="col-span-full text-center text-slate-500 py-10">දත්ත ලබා ගැනීමට නොහැකි විය. පසුව නැවත උත්සාහ කරන්න.</p>';
                    }
                });
        }

        async function fetchVideos() {
            if (isVideosLoading) return;
            isVideosLoading = true;

            const videoContainer = document.getElementById('videoGallery');

            const cachedVideoData = localStorage.getItem(VIDEO_CACHE_KEY);
            if (cachedVideoData) {
                try {
                    const parsed = JSON.parse(cachedVideoData);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        allVideosData = parsed;
                        if (activeTab === 'videos') renderVideos();
                    }
                } catch (e) {
                    console.error("Video cache error", e);
                }
            }

            if (allVideosData.length === 0 && activeTab === 'videos') {
                videoContainer.innerHTML = `
                    <div class="col-span-full text-center py-16">
                        <div class="inline-block w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <p class="mt-3 text-slate-600 font-medium text-sm">loding...</p>
                    </div>`;
            }

            try {
                const response = await fetch(VIDEO_API_URL);
                const videos = await response.json();

                if (Array.isArray(videos)) {
                    allVideosData = videos.map(v => {
                        const parsed = parseCategory(v, 'other');
                        return {
                            ...v,
                            category: parsed.category,
                            date: parsed.date
                        };
                    });
                    allVideosData.sort((a, b) => {
                        if (a.date && b.date) {
                            return new Date(b.date) - new Date(a.date);
                        }
                        return 0;
                    });

                    localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(allVideosData));
                    isVideosLoaded = true;
                    if (activeTab === 'videos') renderVideos();
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
                if (allVideosData.length === 0 && activeTab === 'videos') {
                    videoContainer.innerHTML = '<p class="col-span-full text-center text-slate-500 py-10">දත්ත ලබා ගැනීමේදී දෝෂයක් සිදු විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.</p>';
                }
            } finally {
                isVideosLoading = false;
            }
        }

        // Filter Switcher
        function filterCategory(cat) {
            activeCategory = cat;
            document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.getElementById(`cat-${cat}`);
            if (activeBtn) activeBtn.classList.add('active');

            if (activeTab === 'photos') {
                applyFilters();
            } else {
                renderVideos();
            }
        }

        function switchMediaTab(tab) {
            activeTab = tab;
            const photoBtn = document.getElementById('tabPhotosBtn');
            const videoBtn = document.getElementById('tabVideosBtn');
            const photoGal = document.getElementById('photoGallery');
            const videoGal = document.getElementById('videoGallery');
            const loadMore = document.getElementById('loadMoreContainer');

            if (tab === 'photos') {
                photoBtn.className = "px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30";
                videoBtn.className = "px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all flex items-center gap-2.5";
                photoGal.classList.remove('hidden');
                videoGal.classList.add('hidden');
                if (loadMore) loadMore.classList.remove('hidden');
            } else {
                videoBtn.className = "px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30";
                photoBtn.className = "px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all flex items-center gap-2.5";
                photoGal.classList.add('hidden');
                videoGal.classList.remove('hidden');
                if (loadMore) loadMore.classList.add('hidden');

                if (!isVideosLoaded && !isVideosLoading && allVideosData.length === 0) {
                    fetchVideos();
                } else {
                    renderVideos();
                }
            }
        }

        function applyFilters() {
            if (activeCategory === 'all') {
                filteredImagesData = [...allImagesData];
            } else {
                filteredImagesData = allImagesData.filter(img => String(img.category || '').toLowerCase() === activeCategory.toLowerCase());
            }

            displayedCount = 0;
            document.getElementById('photoGallery').innerHTML = '';
            initGalleryRender(filteredImagesData);
        }

        function initGalleryRender(images) {
            const container = document.getElementById('photoGallery');

            if (!images || images.length === 0) {
                container.innerHTML = '<p class="col-span-full text-center text-slate-500 py-10">මෙම කාණ්ඩය යටතේ පින්තූර කිසිවක් හමු නොවුණි.</p>';
                document.getElementById('loadMoreContainer').classList.add('hidden');
                return;
            }

            loadNextBatch();
        }

        function loadNextBatch() {
            if (displayedCount >= filteredImagesData.length) return;

            const container = document.getElementById('photoGallery');
            const loadingElem = document.getElementById('loading');
            if (loadingElem) loadingElem.remove();

            const startIndex = displayedCount;
            const nextBatch = filteredImagesData.slice(startIndex, startIndex + BATCH_SIZE);

            nextBatch.forEach((img, index) => {
                const globalIndex = startIndex + index;
                const thumbUrl = getOptimizedDriveUrl(img.url, 'w600');
                const isRecent = globalIndex < 3;
                const catLabel = getCategoryLabel(img.category);

                const card = document.createElement('div');
                card.className = `group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border ${isRecent ? 'border-amber-400 ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/15' : 'border-slate-100'} opacity-0 flex flex-col justify-between`;
                card.style.animation = `fadeIn 0.3s ease-in-out ${index * 0.04}s forwards`;

                card.innerHTML = `
                    <div class="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                        <div class="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md text-amber-300 text-[10px] font-extrabold rounded-full shadow-md border border-amber-500/30 flex items-center gap-1">
                            <i class="fa-solid fa-tag text-[9px]"></i>
                            <span>${catLabel}</span>
                        </div>
                        ${isRecent ? `
                            <div class="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1 animate-pulse border border-white/50">
                                <i class="fa-solid fa-sparkles text-[9px]"></i>
                                <span>අලුත්ම</span>
                            </div>
                        ` : ''}
                        <img src="${thumbUrl}" 
                             alt="සදහම් ඡායාරූපය" 
                             loading="lazy" 
                             onerror="this.onerror=null; this.src='https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable';"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span class="text-white text-xs font-semibold bg-amber-500/90 px-3 py-1 rounded-full backdrop-blur-sm">ලොකු කර බලන්න 🔍</span>
                        </div>
                    </div>
                `;

                card.onclick = function () { openLightbox(globalIndex); };
                container.appendChild(card);
            });

            displayedCount += nextBatch.length;
            updateLoadMoreUI();
        }

        function renderVideos() {
            const container = document.getElementById('videoGallery');
            container.innerHTML = '';

            filteredVideosData = allVideosData;
            if (activeCategory !== 'all') {
                filteredVideosData = allVideosData.filter(v => String(v.category || '').toLowerCase() === activeCategory.toLowerCase());
            }

            if (!filteredVideosData || filteredVideosData.length === 0) {
                container.innerHTML = '<p class="col-span-full text-center text-slate-500 py-10">මෙම කාණ්ඩය යටතේ වීඩියෝ කිසිවක් හමු නොවුණි.</p>';
                return;
            }

            filteredVideosData.forEach((vid, index) => {
                const playUrl = vid.previewUrl || vid.url || "";
                const thumbUrl = getOptimizedDriveUrl(playUrl, 'w600');
                const catLabel = getCategoryLabel(vid.category);

                const card = document.createElement('div');
                card.className = 'group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between opacity-0 cursor-pointer transform hover:-translate-y-1 relative';
                card.style.animation = `fadeIn 0.3s ease-in-out ${index * 0.05}s forwards`;

                card.onclick = function () {
                    openVideoLightbox(index);
                };

                card.innerHTML = `
                    <div class="relative w-full aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                        <div class="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md text-amber-300 text-[10px] font-extrabold rounded-full shadow-md border border-amber-500/30 flex items-center gap-1">
                            <i class="fa-solid fa-tag text-[9px]"></i>
                            <span>${catLabel}</span>
                        </div>
                        <img src="${thumbUrl}" 
                             alt="සදහම් වීඩියෝව" 
                             loading="lazy" 
                             onerror="this.onerror=null; this.src='https://placehold.co/600x400/0f172a/f59e0b?text=Video+Preview';"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>

                        <div class="absolute w-14 h-14 bg-amber-500/90 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-300 border-2 border-white/80 backdrop-blur-sm">
                            <i class="fa-solid fa-play text-xl ml-1"></i>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function setupIntersectionObserver() {
            const sentinel = document.getElementById('scrollSentinel');
            if ('IntersectionObserver' in window && sentinel) {
                observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && activeTab === 'photos' && displayedCount < filteredImagesData.length && filteredImagesData.length > 0) {
                            loadNextBatch();
                        }
                    });
                }, { rootMargin: '200px' });
                observer.observe(sentinel);
            }
        }

        function updateLoadMoreUI() {
            const container = document.getElementById('loadMoreContainer');
            const countText = document.getElementById('loadedCountText');
            const btn = document.getElementById('loadMoreBtn');

            if (displayedCount < filteredImagesData.length) {
                container.classList.remove('hidden');
                countText.textContent = `පින්තූර ${displayedCount} / ${filteredImagesData.length} ක් පෙන්වයි`;
                btn.classList.remove('hidden');
            } else {
                if (filteredImagesData.length > 0) {
                    container.classList.remove('hidden');
                    countText.textContent = `සියලුම පින්තූර ${filteredImagesData.length} පෙන්වා අවසන්`;
                    btn.classList.add('hidden');
                } else {
                    container.classList.add('hidden');
                }
            }
        }

        function showLoadingState() {
            const container = document.getElementById('photoGallery');
            container.innerHTML = `
                <div id="loading" class="col-span-full text-center py-20">
                    <div class="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="mt-4 text-slate-600 font-medium">සදහම් ඡායාරූප එක්රැස් වෙමින් පවතී...</p>
                </div>`;
        }

        // Upload Modal Controls
        function openUploadModal(type = 'image') {
            const modal = document.getElementById('uploadModal');
            const title = document.getElementById('uploadModalTitle');
            const icon = document.getElementById('uploadModalIcon');
            const mediaTypeInput = document.getElementById('uploadMediaType');
            const fileInput = document.getElementById('uploadFileInput');
            const warningBox = document.getElementById('videoSizeWarning');
            const statusMsg = document.getElementById('uploadStatusMessage');
            const previewContainer = document.getElementById('filePreviewContainer');

            statusMsg.classList.add('hidden');
            if (previewContainer) previewContainer.classList.add('hidden');
            fileInput.value = '';
            mediaTypeInput.value = type;

            if (type === 'video') {
                title.textContent = "වීඩියෝවක් Upload කරන්න";
                icon.innerHTML = '<i class="fa-solid fa-video"></i>';
                fileInput.accept = "video/*";
                warningBox.classList.remove('hidden');
            } else {
                title.textContent = "ඡායාරූපයක් Upload කරන්න";
                icon.innerHTML = '<i class="fa-solid fa-image"></i>';
                fileInput.accept = "image/*";
                warningBox.classList.add('hidden');
            }

            modal.style.display = 'flex';
        }

        function closeUploadModal() {
            document.getElementById('uploadModal').style.display = 'none';
        }

        function validateSelectedFile() {
            const fileInput = document.getElementById('uploadFileInput');
            const mediaType = document.getElementById('uploadMediaType').value;
            const statusMsg = document.getElementById('uploadStatusMessage');
            const previewContainer = document.getElementById('filePreviewContainer');
            const previewImg = document.getElementById('filePreviewImg');

            statusMsg.classList.add('hidden');

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];

                if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE_BYTES) {
                    showStatusMessage('❌ වීඩියෝ ගොනුව 50MB ට වඩා වැඩි විය නොහැක! කරුණාකර කුඩා වීඩියෝවක් තෝරන්න.', 'error');
                    fileInput.value = '';
                    if (previewContainer) previewContainer.classList.add('hidden');
                    return;
                }

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (evt) {
                        if (previewImg && previewContainer) {
                            previewImg.src = evt.target.result;
                            previewContainer.classList.remove('hidden');
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    if (previewContainer) previewContainer.classList.add('hidden');
                }
            } else {
                if (previewContainer) previewContainer.classList.add('hidden');
            }
        }

        function showStatusMessage(message, type) {
            const statusMsg = document.getElementById('uploadStatusMessage');
            statusMsg.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-800', 'border', 'border-emerald-200', 'bg-rose-50', 'text-rose-800', 'border-rose-200');

            if (type === 'success') {
                statusMsg.classList.add('bg-emerald-50', 'text-emerald-800', 'border', 'border-emerald-200');
                statusMsg.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-base"></i><span>${message}</span>`;
            } else {
                statusMsg.classList.add('bg-rose-50', 'text-rose-800', 'border', 'border-rose-200');
                statusMsg.innerHTML = `<i class="fa-solid fa-circle-xmark text-rose-600 text-base"></i><span>${message}</span>`;
            }
        }

        function showTemporaryPageMessage(message, type = 'success') {
            const existingToast = document.getElementById('pageToast');
            if (existingToast) existingToast.remove();

            const toast = document.createElement('div');
            toast.id = 'pageToast';
            toast.className = `fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] max-w-[90vw] px-4 py-3 rounded-2xl border text-sm font-bold shadow-2xl backdrop-blur-md transition-all duration-300 ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`;
            toast.innerHTML = `<div class="flex items-center gap-2.5"><i class="${type === 'success' ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-circle-xmark text-rose-600'}"></i><span>${message}</span></div>`;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        function handleUploadSubmit(e) {
            e.preventDefault();

            const mediaType = document.getElementById('uploadMediaType').value;
            const category = document.getElementById('uploadCategory').value;
            const fileInput = document.getElementById('uploadFileInput');

            if (!fileInput.files || fileInput.files.length === 0) {
                showStatusMessage('කරුණාකර Upload කිරීමට ගොනුවක් තෝරන්න.', 'error');
                return;
            }

            const file = fileInput.files[0];

            if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE_BYTES) {
                showStatusMessage('❌ වීඩියෝ ගොනුව 50MB ට වඩා වැඩි විය නොහැක! කරුණාකර කුඩා එකක් තෝරන්න.', 'error');
                return;
            }

            const currentDate = new Date().toISOString().split('T')[0];
            const folderId = (mediaType === 'video') ? VIDEO_FOLDER_ID : IMAGE_FOLDER_ID;

            const combinedTitle = `${currentDate} | ${category}`;

            const submitBtn = document.getElementById('uploadSubmitBtn');
            const btnText = document.getElementById('uploadBtnText');
            const spinner = document.getElementById('uploadSpinner');

            submitBtn.disabled = true;
            btnText.textContent = "Upload වෙමින් පවතී... ස්වල්ප වේලාවක් රැඳී සිටින්න...";
            spinner.classList.remove('hidden');

            const reader = new FileReader();
            reader.onload = function (evt) {
                var rawLog = evt.target.result.split(',');
                var base64Data = rawLog[1];

                var uploadUrl = `${SCRIPT_URL}?folderId=${encodeURIComponent(folderId)}&fileType=${encodeURIComponent(mediaType)}&mediaType=${encodeURIComponent(mediaType)}&category=${encodeURIComponent(category)}&title=${encodeURIComponent(combinedTitle)}`;

                var formData = new FormData();
                formData.append("data", base64Data);
                formData.append("filename", `${combinedTitle}.${file.name.split('.').pop()}`);
                formData.append("mimeType", file.type);
                formData.append("fileType", mediaType);
                formData.append("folderId", folderId);
                formData.append("title", combinedTitle);
                formData.append("category", category);
                formData.append("mediaType", mediaType);

                fetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                })
                    .then(() => {
                        const successMessage = `✅ Resource (${mediaType === 'video' ? 'වීඩියෝ' : 'ඡායාරූප'}) upload වීම සාර්ථකයි.`;
                        showTemporaryPageMessage(successMessage, 'success');

                        if (mediaType === 'image') {
                            allImagesData.unshift({
                                category: category,
                                date: currentDate,
                                url: evt.target.result,
                                thumb: evt.target.result
                            });
                            if (activeTab === 'photos') applyFilters();
                        } else {
                            allVideosData.unshift({
                                category: category,
                                date: currentDate,
                                previewUrl: evt.target.result,
                                mimeType: file.type
                            });
                            if (activeTab === 'videos') renderVideos();
                        }

                        fileInput.value = '';
                        const previewContainer = document.getElementById('filePreviewContainer');
                        if (previewContainer) previewContainer.classList.add('hidden');

                        setTimeout(() => {
                            closeUploadModal();
                        }, 300);
                    })
                    .catch((err) => {
                        console.error("Upload error:", err);
                        showStatusMessage('❌ Error එකක් ආවා: ' + err, 'error');
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        btnText.textContent = "Upload කරන්න";
                        spinner.classList.add('hidden');
                    });
            };

            reader.onerror = function () {
                showStatusMessage('❌ ගොනුව කියවීමට නොහැකි විය. වෙනත් ගොනුවක් උත්සාහ කරන්න.', 'error');
                submitBtn.disabled = false;
                btnText.textContent = "Upload කරන්න";
                spinner.classList.add('hidden');
            };

            reader.readAsDataURL(file);
        }

        // Lightbox Functions
        function openLightbox(index) {
            if (index < 0 || index >= filteredImagesData.length) return;
            currentImageIndex = index;

            const imgData = filteredImagesData[currentImageIndex];
            const thumbUrl = getOptimizedDriveUrl(imgData.url, 'w600');
            const fullUrl = getOptimizedDriveUrl(imgData.url, 'w1200');

            const lightboxImg = document.getElementById('lightboxImg');
            const spinner = document.getElementById('lightboxSpinner');
            const counter = document.getElementById('lightboxCounter');
            const lbCategory = document.getElementById('lightboxCategory');

            if (counter) counter.textContent = `${currentImageIndex + 1} / ${filteredImagesData.length}`;
            if (lbCategory) lbCategory.textContent = getCategoryLabel(imgData.category);

            lightboxImg.src = thumbUrl;
            spinner.classList.remove('hidden');

            const highRes = new Image();
            highRes.src = fullUrl;
            highRes.onload = function () {
                if (currentImageIndex === index) {
                    lightboxImg.src = fullUrl;
                    spinner.classList.add('hidden');
                }
            };
            highRes.onerror = function () {
                spinner.classList.add('hidden');
            };

            document.getElementById('lightbox').style.display = 'flex';
            document.body.style.overflow = 'hidden';
            updateNavButtons();
        }

        function prevImage() {
            if (currentImageIndex > 0) openLightbox(currentImageIndex - 1);
        }

        function nextImage() {
            if (currentImageIndex < filteredImagesData.length - 1) openLightbox(currentImageIndex + 1);
        }

        function updateNavButtons() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (prevBtn) prevBtn.style.visibility = (currentImageIndex > 0) ? 'visible' : 'hidden';
            if (nextBtn) nextBtn.style.visibility = (currentImageIndex < filteredImagesData.length - 1) ? 'visible' : 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function openVideoLightbox(index) {
            if (!filteredVideosData || index < 0 || index >= filteredVideosData.length) return;
            currentVideoIndex = index;

            const videoItem = filteredVideosData[currentVideoIndex];
            const url = videoItem.previewUrl || videoItem.url || "";
            const category = getCategoryLabel(videoItem.category);

            const modal = document.getElementById('videoLightbox');
            const iframe = document.getElementById('videoFrame');
            const vCat = document.getElementById('videoLightboxCategory');
            const vCounter = document.getElementById('videoLightboxCounter');

            if (vCat) vCat.textContent = category;
            if (vCounter) vCounter.textContent = `${currentVideoIndex + 1} / ${filteredVideosData.length}`;

            let finalUrl = url;
            if (url.includes('drive.google.com') && !url.includes('/preview')) {
                let idMatch = url.match(/id=([a-zA-Z0-9_-]+)/) ||
                    url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                if (idMatch && idMatch[1]) {
                    finalUrl = `https://drive.google.com/file/d/${idMatch[1]}/preview`;
                }
            }

            iframe.src = finalUrl;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            updateVideoNavButtons();
        }

        function prevVideo() {
            if (currentVideoIndex > 0) openVideoLightbox(currentVideoIndex - 1);
        }

        function nextVideo() {
            if (currentVideoIndex < filteredVideosData.length - 1) openVideoLightbox(currentVideoIndex + 1);
        }

        function updateVideoNavButtons() {
            const prevVidBtn = document.getElementById('prevVidBtn');
            const nextVidBtn = document.getElementById('nextVidBtn');
            if (prevVidBtn) prevVidBtn.style.visibility = (currentVideoIndex > 0) ? 'visible' : 'hidden';
            if (nextVidBtn) nextVidBtn.style.visibility = (currentVideoIndex < filteredVideosData.length - 1) ? 'visible' : 'hidden';
        }

        function closeVideoLightbox() {
            const modal = document.getElementById('videoLightbox');
            const iframe = document.getElementById('videoFrame');
            iframe.src = '';
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function setupKeyboardAndTouch() {
            document.addEventListener('keydown', function (e) {
                const lightbox = document.getElementById('lightbox');
                if (lightbox && lightbox.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') prevImage();
                    else if (e.key === 'ArrowRight') nextImage();
                    else if (e.key === 'Escape') closeLightbox();
                }

                const videoModal = document.getElementById('videoLightbox');
                if (videoModal && videoModal.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') prevVideo();
                    else if (e.key === 'ArrowRight') nextVideo();
                    else if (e.key === 'Escape') closeVideoLightbox();
                }
            });

            // Touch support for image lightbox
            const lightbox = document.getElementById('lightbox');
            lightbox.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            lightbox.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                if (Math.abs(swipeDistance) > 40) {
                    if (swipeDistance < 0) nextImage();
                    else prevImage();
                }
            }, { passive: true });

            // Touch support for video lightbox
            const videoLightbox = document.getElementById('videoLightbox');
            videoLightbox.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            videoLightbox.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                if (Math.abs(swipeDistance) > 40) {
                    if (swipeDistance < 0) nextVideo();
                    else prevVideo();
                }
            }, { passive: true });
        }

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

        function debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

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
    
