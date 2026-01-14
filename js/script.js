/**
 * 기사 뚝딱 (Article Chef) - 통합 스크립트 (GitHub Pages 배포용)
 * 모든 경로는 상대 경로로 작성되었습니다.
 */

window.ArticleChef = {
    services: {},
    components: {},
    pages: {}
};

// ---------------------------------------------------------
// 1. 서비스 영역 (Services)
// ---------------------------------------------------------

ArticleChef.services.scoutItems = async (region, category, period) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const now = new Date();
            const rawData = [
                { title: '평생학습 센터 개관식', category: '교육', type: 'news', offsetDays: -1 },
                { title: '청소년 코딩 경진대회 공고', category: '교육', type: 'policy', offsetDays: 0 },
                { title: '어르신 문해 교육 졸업 축제', category: '교육', type: 'event', offsetDays: 2 },
                { title: '지역 벚꽃 축제 거리 통제 안내', category: '행사', type: 'news', offsetDays: -2 },
                { title: '주말 플리마켓 셀러 모집', category: '행사', type: 'news', offsetDays: -5 },
                { title: '전통시장 야시장 야간 개장', category: '행사', type: 'event', offsetDays: 3 },
                { title: '신규 공용 주차장 준공 완료', category: '정책', type: 'policy', offsetDays: -3 },
                { title: '쓰레기 배출 요일 변경 안내', category: '정책', type: 'news', offsetDays: 0 },
                { title: '보건소 야간 진료 시간 확대', category: '정책', type: 'policy', offsetDays: 5 },
                { title: '10년째 이어온 익명의 기부 천사', category: '미담', type: 'news', offsetDays: -7 },
                { title: '길 잃은 치매 노인을 구한 중학생', category: '미담', type: 'news', offsetDays: -2 },
                { title: '환경 미화원에게 전달된 감동의 편지', category: '미담', type: 'news', offsetDays: 0 }
            ];

            const filtered = rawData.filter(item => {
                if (category !== '전체' && item.category !== category) return false;
                const eventDate = new Date();
                eventDate.setDate(now.getDate() + item.offsetDays);
                const diffTime = Math.abs(now - eventDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (period === '1d') return item.offsetDays <= 0 && diffDays <= 1;
                if (period === '3d') return item.offsetDays <= 0 && diffDays <= 3;
                if (period === '7d') return item.offsetDays <= 0 && diffDays <= 7;
                if (period === 'upcoming') return item.offsetDays > 0;
                return true;
            });

            const results = filtered.map((item, idx) => {
                const targetDate = new Date();
                targetDate.setDate(now.getDate() + item.offsetDays);
                return {
                    id: Date.now() + idx,
                    title: `[${region}] ${item.title}`,
                    source: `${region} 지역 소식지`,
                    sourceUrl: 'https://www.google.com/search?q=' + encodeURIComponent(region + " " + item.title),
                    date: targetDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
                    angle: idx % 3 === 0 ? '실제 현장의 생생한 목소리를 담은 인터뷰 위주 기획 제안' : idx % 3 === 1 ? '지자체 정책의 실효성과 향후 기대 효과 분석 중심' : '주민들의 참여도를 높일 수 있는 정보성 요약 기사 추천'
                };
            });
            resolve(results);
        }, 800);
    });
};

ArticleChef.services.generateArticle = async (params) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const { topic, facts, style, tone } = params;
            const getLead = () => {
                if (style === '스트레이트') return `[${topic}] 소식이 전해지며 지역 사회의 관심이 집중되고 있다. ${new Date().toLocaleDateString()} 취재 결과, 해당 안건은 구체적인 실행 단계에 접어든 것으로 확인됐다.`;
                if (style === '스케치') return `온 국민의 시선이 머무는 곳, 바로 [${topic}] 현장이다. 직접 찾아가 본 현장은 기대 이상의 뜨거운 열기로 가득했다.`;
                return `오랜 시간 논의되어 온 [${topic}] 문제가 드디어 해결의 실마리를 찾았다.`;
            };
            const getBody = () => {
                const factLines = facts.split('\n').filter(f => f.trim()).map(f => `<li>${f}</li>`).join('');
                let content = `<p>현장의 주요 팩트(Fact)를 정리하면 다음과 같다.</p><ul style="background:#f8fafc; padding:20px; border-radius:10px; margin:15px 0; list-style-position: inside;">${factLines || '<li>입력된 핵심 정보가 없습니다. 상세 내용을 추가해 주세요.</li>'}</ul>`;
                if (tone === '감성·스토리') content += `<p>한 주민은 "오랫동안 기다려온 변화"라며 기쁨을 감추지 못했다. 수첩에 적힌 팩트 너머에는 이웃들의 따뜻한 마음이 녹아있었다.</p>`;
                else if (tone === '비판·지적') content += `<p>하지만 정책적 허점도 명확히 보인다. 예산 집행의 투명성을 요구하는 목소리가 커지고 있는 만큼, 날카로운 감시가 필요한 시점이다.</p>`;
                else content += `<p>지방자치단체 관계자는 "주민 편의를 최우선으로 고려할 것"이라며 강한 의지를 보였다. 이번 결정이 지역의 미래에 어떤 변화를 가져올지 지켜볼 일이다.</p>`;
                return content;
            };
            const getHeadline = () => {
                const base = topic || '화제의 소식';
                if (tone === '비판·지적') return [`[진단] ${base}, 과연 누구를 위한 정책인가`, `${base} 논란 가열... 주민 반발 거세`, `${base}, 보여주기식 행정 넘어야`];
                if (style === '스케치') return [`[현장] ${base}, 그 생생한 기록`, `${base}를 가다: 미소 띤 얼굴들`, `현장에서 본 ${base}의 진솔한 풍경`];
                return [`${base} 본격 시작... 지역 활력 기대`, `${base}의 모든 것, 기자가 정리해 드립니다`, `${base}, 우리 동네가 달라졌어요`];
            };
            resolve({ headlines: getHeadline(), lead: getLead(), body: getBody(), hashtags: ['#지역뉴스', `#${topic.replace(/\s+/g, '')}`, '#기자뚝딱', '#실시간제보'] });
        }, 1200);
    });
};

// ---------------------------------------------------------
// 2. 컴포넌트 영역 (Components)
// ---------------------------------------------------------

ArticleChef.components.Header = function () {
    return `<header class="flex items-center justify-between p-4 mb-4 border-b" style="border-color: var(--border); background: white;"><div class="flex items-center gap-2" onclick="window.router.navigateTo('/')" style="cursor: pointer;"><i data-lucide="newspaper" style="color: var(--primary); width: 24px; height: 24px;"></i><h1 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px;">기사 뚝딱</h1></div><nav class="flex gap-3"><button onclick="window.router.navigateTo('/archive')" class="flex items-center gap-1" style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;"><i data-lucide="archive" style="width: 16px; height: 16px;"></i>보관함</button></nav></header>`;
};

// ---------------------------------------------------------
// 3. 페이지 영역 (Pages)
// ---------------------------------------------------------

ArticleChef.pages.Home = async function () {
    const container = document.createElement('div');
    container.className = 'container animate-fade-in';
    container.innerHTML = `
        ${ArticleChef.components.Header()}
        <main class="p-6">
            <div class="mb-8"><h2 style="font-size: 1.6rem; margin-bottom: 0.4rem; letter-spacing: -1px;">기자님, 환영합니다! 👋</h2><p style="color: var(--text-muted); font-size: 0.95rem;">오늘은 어떤 특종을 담아볼까요?</p></div>
            <div class="flex flex-col gap-5">
                <button onclick="window.router.navigateTo('/scout')" class="card group shadow-sm border-blue-50 flex items-center justify-between"><div><span class="badge badge-blue mb-2 inline-block">아이템 스카우터</span><h3 style="font-size: 1.15rem; margin-bottom: 4px; font-weight:700;">뉴스를 찾아라</h3><p style="font-size: 0.85rem; color: var(--text-muted);">실시간 지역 소식과 행사 발굴</p></div><div style="background: #eff6ff; padding: 14px; border-radius: 16px;"><i data-lucide="search" style="color: var(--primary); width: 26px; height: 26px;"></i></div></button>
                <button onclick="window.router.navigateTo('/builder')" class="card group shadow-sm border-emerald-50 flex items-center justify-between"><div><span class="badge badge-green mb-2 inline-block">기사 빌더</span><h3 style="font-size: 1.15rem; margin-bottom: 4px; font-weight:700;">기사 초안 작성</h3><p style="font-size: 0.85rem; color: var(--text-muted);">취재 메모를 고품격 기사로</p></div><div style="background: #ecfdf5; padding: 14px; border-radius: 16px;"><i data-lucide="pen-tool" style="color: #059669; width: 26px; height: 26px;"></i></div></button>
            </div>
            <div class="mt-8 pt-8 border-t" style="border-color: var(--border);"><div class="flex items-center justify-between mb-4"><h4 style="font-size: 0.95rem; font-weight: 700;">최근 작업 완료</h4><span onclick="window.router.navigateTo('/archive')" style="font-size: 0.8rem; color: var(--primary); cursor: pointer; font-weight: 600;">모두보기 ></span></div><div id="recent-articles-preview" style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1.5rem 0; background: var(--bg-input); border-radius: var(--radius-md);">기록이 아직 없습니다.</div></div>
        </main>`;
    setTimeout(() => {
        const saved = JSON.parse(localStorage.getItem('articles') || '[]');
        if (saved.length > 0) {
            const previewEl = container.querySelector('#recent-articles-preview');
            previewEl.innerHTML = saved.slice(0, 2).map(article => `<div class="bg-white p-3 mb-2 rounded border border-gray-100 shadow-sm text-left" onclick="window.router.navigateTo('/archive')" style="cursor: pointer;"><div class="font-bold text-gray-800 truncate" style="font-size: 0.9rem;">${article.headline || '제목 없음'}</div><div class="text-xs text-gray-400 mt-1">${new Date(article.date).toLocaleDateString()}</div></div>`).join('');
            previewEl.style.background = 'transparent'; previewEl.style.padding = '0';
        }
    }, 0);
    return container;
};

ArticleChef.pages.Scout = async function () {
    const container = document.createElement('div');
    container.className = 'container animate-fade-in';
    container.innerHTML = `
        ${ArticleChef.components.Header()}
        <main class="p-6"><h3 class="text-xl font-bold mb-4">아이템 스카우터 🕵️</h3><div class="card mb-6 shadow-sm"><div class="flex flex-col gap-4"><div><label>취재 지역</label><input type="text" id="region-input" placeholder="예: 성북구, 강남구" value="성북구"></div><div class="grid grid-cols-2 gap-3"><div><label>분야</label><select id="category-select"><option value="전체">전체</option><option value="교육">교육/학교</option><option value="행사">축제/행사</option><option value="정책">지자체 정책</option><option value="미담">동네 미담</option></select></div><div><label>탐색 기간</label><select id="period-select"><option value="all">전체</option><option value="1d">최근 1일</option><option value="3d">최근 3일</option><option value="7d">최근 7일</option><option value="upcoming">예정된 행사</option></select></div></div><button id="search-btn" class="btn btn-primary w-full mt-2"><i data-lucide="search" width="20"></i>최신 아이템 찾기</button></div></div><div id="loading" class="hidden text-center py-10"><div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div><p class="text-gray-500 font-medium">${new Date().toLocaleDateString()} 데이터 수집 중...</p></div><div id="results-area" class="hidden"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-bold">스카우트 결과</h3><span id="result-count" class="text-xs font-bold text-gray-400">0건 발견</span></div><div id="results-list" class="flex flex-col gap-4"></div></div></main>`;
    setTimeout(() => {
        const btn = container.querySelector('#search-btn');
        btn.addEventListener('click', async () => {
            const region = container.querySelector('#region-input').value;
            const category = container.querySelector('#category-select').value;
            const period = container.querySelector('#period-select').value;
            if (!region) return alert('지역을 입력해 주세요!');
            btn.disabled = true; container.querySelector('#results-area').classList.add('hidden'); container.querySelector('#loading').classList.remove('hidden');
            const matches = await ArticleChef.services.scoutItems(region, category, period);
            container.querySelector('#result-count').textContent = `${matches.length}건 발견`;
            container.querySelector('#results-list').innerHTML = matches.map(item => `<div class="card p-5 border-gray-100 bg-white shadow-sm" style="overflow:hidden;"><div class="flex justify-between items-start mb-3"><span class="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">${item.source}</span><span class="text-xs font-medium text-gray-400">${item.date}</span></div><h4 class="font-bold text-lg mb-3 leading-tight">${item.title}</h4><div class="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-4 border-l-4 border-primary"><div class="font-bold mb-1 text-primary">💡 기사 앵글 추천</div>${item.angle}</div><div class="grid grid-cols-2 gap-2"><a href="${item.sourceUrl}" target="_blank" class="btn btn-secondary text-xs h-10"><i data-lucide="external-link" width="14"></i>출처 확인</a><button class="use-item-btn btn btn-primary text-xs h-10" data-title="${item.title}"><i data-lucide="edit-3" width="14"></i>빌더로 이동</button></div></div>`).join('');
            container.querySelector('#loading').classList.add('hidden'); container.querySelector('#results-area').classList.remove('hidden');
            if (window.lucide) window.lucide.createIcons();
            container.querySelectorAll('.use-item-btn').forEach(b => b.addEventListener('click', e => window.router.navigateTo('/builder', { initialTopic: e.currentTarget.dataset.title })));
            btn.disabled = false;
        });
    }, 0);
    return container;
};

ArticleChef.pages.Builder = async function (state) {
    const container = document.createElement('div');
    container.className = 'container animate-fade-in';
    const initialTopic = state ? state.initialTopic : '';
    container.innerHTML = `
        ${ArticleChef.components.Header()}
        <main class="p-6"><h2 class="text-xl font-bold mb-5">기사 빌더 ✍️</h2><div id="input-section"><div class="mb-5"><label>기사 주제</label><input type="text" id="topic" value="${initialTopic}" placeholder="예: 동네 주민 센터 바자회"></div><div class="mb-5"><label>취재 메모</label><textarea id="facts" placeholder="- 내용 입력..."></textarea></div><div class="grid grid-cols-2 gap-4 mb-6"><div><label>장르</label><select id="style"><option value="스트레이트">스트레이트</option><option value="스케치">스케치</option><option value="인터뷰">인터뷰</option></select></div><div><label>어조</label><select id="tone"><option value="객관적">객관적</option><option value="감성·스토리">감성적</option><option value="비판·지적">비판적</option></select></div></div><button id="generate-btn" class="btn btn-primary w-full py-4 shadow-md"><i data-lucide="sparkles" width="20"></i> 기사 생성</button></div><div id="generating-loader" class="hidden fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center p-6 text-center"><div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-6"></div><p class="font-bold text-xl">기사 작성 중...</p></div><div id="result-section" class="hidden mt-8 pt-8 border-t"><h3 class="text-lg font-bold mb-4">기사 초안</h3><div id="headline-options" class="flex flex-col gap-2.5 mb-5"></div><div class="bg-white border-2 border-primary-light/30 p-5 rounded-xl shadow-sm mb-6"><div id="editor-content" class="prose focus:outline-none" contenteditable="true" style="min-height: 350px;"></div></div><div class="flex gap-2"><button id="save-btn" class="btn btn-primary w-full">보관함 저장</button><button onclick="location.reload()" class="btn btn-secondary">다시 쓰기</button></div></div></main>`;
    setTimeout(() => {
        const genBtn = container.querySelector('#generate-btn');
        genBtn.addEventListener('click', async () => {
            const topic = container.querySelector('#topic').value;
            const facts = container.querySelector('#facts').value;
            if (!topic) return alert('주제를 입력하세요.');
            container.querySelector('#generating-loader').classList.remove('hidden');
            const result = await ArticleChef.services.generateArticle({ topic, facts, style: container.querySelector('#style').value, tone: container.querySelector('#tone').value });
            container.querySelector('#headline-options').innerHTML = result.headlines.map((h, i) => `<label class="flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer"><input type="radio" name="headline-choice" value="${h}" ${i === 0 ? 'checked' : ''}><b>${h}</b></label>`).join('');
            container.querySelector('#editor-content').innerHTML = `<p class="font-extrabold text-xl mb-6 border-l-4 border-primary pl-4">${result.lead}</p><div>${result.body}</div><p class="mt-8 text-blue-600 font-bold">${result.hashtags.join(' ')}</p>`;
            container.querySelector('#input-section').classList.add('hidden'); container.querySelector('#generating-loader').classList.add('hidden'); container.querySelector('#result-section').classList.remove('hidden');
            container.querySelectorAll('input[name="headline-choice"]').forEach(r => r.addEventListener('change', e => window.currentHeadline = e.target.value));
            window.currentHeadline = result.headlines[0];
        });
        container.querySelector('#save-btn').addEventListener('click', () => {
            const article = { id: Date.now(), topic: container.querySelector('#topic').value, headline: window.currentHeadline, content: container.querySelector('#editor-content').innerHTML, date: new Date().toISOString() };
            const saved = JSON.parse(localStorage.getItem('articles') || '[]');
            saved.unshift(article); localStorage.setItem('articles', JSON.stringify(saved));
            if (confirm('저장되었습니다!')) window.router.navigateTo('/archive');
        });
    }, 0);
    return container;
};

ArticleChef.pages.Archive = async function () {
    const container = document.createElement('div');
    container.className = 'container animate-fade-in';
    let articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const render = () => articles.length === 0 ? `<div class="text-center py-20 text-gray-400"><p>기록이 없습니다.</p></div>` : articles.map(a => `<div class="card mb-4 bg-white p-5 shadow-sm"><h3 class="font-bold mb-2">${a.headline}</h3><p class="text-sm text-gray-500 line-clamp-2 mb-4">${a.content.replace(/<[^>]*>?/gm, '')}</p><div class="flex justify-end gap-2"><button class="del-btn text-red-500" data-id="${a.id}">삭제</button><button class="view-btn btn-primary px-4 py-1 rounded text-sm" data-id="${a.id}">보기</button></div></div>`).join('');
    container.innerHTML = `${ArticleChef.components.Header()}<main class="p-6"><h2 class="text-xl font-bold mb-6">기사 보관함 📂</h2><div id="list">${render()}</div></main><div id="modal" class="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div class="bg-white rounded-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto"><h3 id="m-title" class="font-bold text-lg mb-4"></h3><div id="m-content" class="prose mb-6"></div><div class="flex gap-2"><button id="m-close" class="btn btn-secondary w-full">닫기</button><button id="m-copy" class="btn btn-primary w-full">복사</button></div></div></div>`;
    setTimeout(() => {
        container.querySelector('#list').addEventListener('click', e => {
            if (e.target.closest('.view-btn')) {
                const a = articles.find(x => x.id === Number(e.target.closest('.view-btn').dataset.id));
                container.querySelector('#m-title').textContent = a.headline; container.querySelector('#m-content').innerHTML = a.content; container.querySelector('#modal').classList.remove('hidden');
            }
            if (e.target.closest('.del-btn')) {
                if (confirm('삭제하시겠습니까?')) {
                    articles = articles.filter(x => x.id !== Number(e.target.closest('.del-btn').dataset.id));
                    localStorage.setItem('articles', JSON.stringify(articles)); container.querySelector('#list').innerHTML = render();
                }
            }
        });
        container.querySelector('#m-close').addEventListener('click', () => container.querySelector('#modal').classList.add('hidden'));
        container.querySelector('#m-copy').addEventListener('click', () => navigator.clipboard.writeText(container.querySelector('#m-content').innerText).then(() => alert('복사 완료!')));
    }, 0);
    return container;
};

// ---------------------------------------------------------
// 4. 라우터 (Router)
// ---------------------------------------------------------

class Router {
    constructor(routes) { this.routes = routes; this.app = document.getElementById('app'); window.addEventListener('popstate', () => this.handle()); this.handle(); }
    navigateTo(path, data = null) { window.history.pushState(data, null, `#${path}`); this.handle(); }
    async handle() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes[hash] || this.routes['/'];
        this.app.innerHTML = '';
        const page = await route(window.history.state);
        if (typeof page === 'string') this.app.innerHTML = page; else this.app.appendChild(page);
        if (window.lucide) window.lucide.createIcons();
        window.scrollTo(0, 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router({ '/': ArticleChef.pages.Home, '/scout': ArticleChef.pages.Scout, '/builder': ArticleChef.pages.Builder, '/archive': ArticleChef.pages.Archive });
});
