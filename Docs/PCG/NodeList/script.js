// ============================================
// PCGノード一覧 JavaScriptロジック
// ============================================

// グローバル変数
let allNodes = [];
let allTags = {};
let tagCategories = [];
let selectedTags = new Set();
let currentSortMode = 'name-asc';
let filterMode = 'or'; // 'or' または 'and'

// ============================================
// 初期化
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 PCGノード一覧を初期化中...');

    try {
        await loadData();
        renderTagFilters();
        renderNodeList();
        setupEventListeners();
        updateStats();

        console.log('✅ 初期化完了');
    } catch (error) {
        console.error('❌ 初期化エラー:', error);
        showError('データの読み込みに失敗しました');
    }
});

// ============================================
// データ読み込み
// ============================================
async function loadData() {
    try {
        // ノードデータの読み込み
        const nodesResponse = await fetch('nodes-data.json');
        const nodesData = await nodesResponse.json();
        allNodes = nodesData.nodes;

        // 生成日時を表示
        if (nodesData.generatedAt) {
            const date = new Date(nodesData.generatedAt);
            document.getElementById('generatedDate').textContent = date.toLocaleString('ja-JP');
        }

        document.getElementById('totalCount').textContent = allNodes.length;
        document.getElementById('footerTotalCount').textContent = allNodes.length;

        // タグ定義の読み込み
        const tagsResponse = await fetch('tags-definition.json');
        const tagsData = await tagsResponse.json();
        tagCategories = tagsData.tagCategories;

        // タグの集計
        allTags = collectTags(allNodes);

        console.log(`📊 ${allNodes.length} ノードを読み込みました`);
        console.log(`🏷️  ${Object.keys(allTags).length} 種類のタグを検出`);

    } catch (error) {
        console.error('データ読み込みエラー:', error);
        throw error;
    }
}

// タグを集計
function collectTags(nodes) {
    const tags = {};
    nodes.forEach(node => {
        if (node.tags && Array.isArray(node.tags)) {
            node.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        }
    });
    return tags;
}

// ============================================
// タグフィルタのレンダリング
// ============================================
function renderTagFilters() {
    const container = document.getElementById('tagFilters');
    container.innerHTML = '';

    tagCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'tag-category';

        const categoryName = document.createElement('div');
        categoryName.className = 'tag-category-name';
        categoryName.textContent = category.name;
        categoryDiv.appendChild(categoryName);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'tag-options';

        category.tags.forEach(tag => {
            const count = allTags[tag] || 0;
            if (count === 0) return; // タグが使用されていない場合はスキップ

            const label = document.createElement('label');
            label.className = 'tag-checkbox';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = tag;
            checkbox.dataset.tag = tag;

            const labelText = document.createElement('span');
            labelText.textContent = tag;

            const countBadge = document.createElement('span');
            countBadge.className = 'tag-count';
            countBadge.textContent = count;

            label.appendChild(checkbox);
            label.appendChild(labelText);
            label.appendChild(countBadge);

            optionsDiv.appendChild(label);
        });

        categoryDiv.appendChild(optionsDiv);
        container.appendChild(categoryDiv);
    });
}

// ============================================
// ノードリストのレンダリング
// ============================================
function renderNodeList() {
    const filteredNodes = filterAndSortNodes();
    const container = document.getElementById('nodeList');
    const emptyState = document.getElementById('emptyState');

    if (filteredNodes.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';
    container.innerHTML = '';

    filteredNodes.forEach(node => {
        const card = createNodeCard(node);
        container.appendChild(card);
    });

    updateStats(filteredNodes.length);
}

// ノードカードを作成
function createNodeCard(node) {
    const card = document.createElement('div');
    card.className = 'node-card';
    card.dataset.tags = (node.tags || []).join(',');

    // ヘッダー
    const header = document.createElement('div');
    header.className = 'node-header';

    const nameLink = document.createElement('a');
    nameLink.href = node.docPath;
    nameLink.className = 'node-name';
    nameLink.textContent = node.name;
    header.appendChild(nameLink);

    if (node.category) {
        header.appendChild(document.createTextNode(' '));
        const category = document.createElement('span');
        category.className = 'node-category';
        category.textContent = node.category;
        header.appendChild(category);
    }

    card.appendChild(header);

    // 概要
    const overview = document.createElement('div');
    overview.className = 'node-overview';
    overview.textContent = node.overview || '概要情報なし';
    card.appendChild(overview);

    // 機能
    if (node.features && node.features.length > 0 && node.features[0] !== '機能情報なし') {
        const featuresDiv = document.createElement('div');
        featuresDiv.className = 'node-features';

        const featuresTitle = document.createElement('div');
        featuresTitle.className = 'node-features-title';
        featuresTitle.textContent = '主な機能';
        featuresDiv.appendChild(featuresTitle);

        const featuresList = document.createElement('ul');
        featuresList.className = 'node-features-list';

        node.features.slice(0, 3).forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        featuresDiv.appendChild(featuresList);
        card.appendChild(featuresDiv);
    }

    // タグ
    if (node.tags && node.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'node-tags';

        node.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            if (selectedTags.has(tag)) {
                tagSpan.classList.add('active');
            }
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });

        card.appendChild(tagsDiv);
    }

    return card;
}

// ============================================
// フィルタリングとソート
// ============================================
function filterAndSortNodes() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    let filtered = allNodes.filter(node => {
        // 検索クエリでフィルタ
        if (searchQuery) {
            const matchName = node.name.toLowerCase().includes(searchQuery);
            const matchOverview = (node.overview || '').toLowerCase().includes(searchQuery);
            if (!matchName && !matchOverview) {
                return false;
            }
        }

        // タグでフィルタ（AND/OR条件）
        if (selectedTags.size > 0) {
            const nodeTags = new Set(node.tags || []);
            if (filterMode === 'and') {
                // AND条件: すべてのタグが含まれる必要がある
                for (const tag of selectedTags) {
                    if (!nodeTags.has(tag)) {
                        return false;
                    }
                }
            } else {
                // OR条件: いずれかのタグが含まれればOK
                let hasAnyTag = false;
                for (const tag of selectedTags) {
                    if (nodeTags.has(tag)) {
                        hasAnyTag = true;
                        break;
                    }
                }
                if (!hasAnyTag) {
                    return false;
                }
            }
        }

        return true;
    });

    // ソート
    filtered.sort((a, b) => {
        switch (currentSortMode) {
            case 'name-asc':
                return a.name.localeCompare(b.name, 'ja');
            case 'name-desc':
                return b.name.localeCompare(a.name, 'ja');
            case 'category':
                const catA = a.category || '';
                const catB = b.category || '';
                if (catA !== catB) {
                    return catA.localeCompare(catB, 'ja');
                }
                return a.name.localeCompare(b.name, 'ja');
            default:
                return 0;
        }
    });

    return filtered;
}

// ============================================
// 統計情報の更新
// ============================================
function updateStats(currentCount) {
    const count = currentCount !== undefined ? currentCount : allNodes.length;
    document.getElementById('nodeCount').textContent = count;
}

// ============================================
// イベントリスナー
// ============================================
function setupEventListeners() {
    // 検索ボックス
    const searchInput = document.getElementById('searchInput');
    const clearSearchButton = document.getElementById('clearSearch');

    searchInput.addEventListener('input', debounce(() => {
        // クリアボタンの表示/非表示
        if (searchInput.value) {
            clearSearchButton.style.display = 'flex';
        } else {
            clearSearchButton.style.display = 'none';
        }
        renderNodeList();
    }, 300));

    // 検索クリアボタン
    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchButton.style.display = 'none';
        renderNodeList();
    });

    // タグチェックボックス
    const tagFilters = document.getElementById('tagFilters');
    tagFilters.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const tag = e.target.value;
            if (e.target.checked) {
                selectedTags.add(tag);
            } else {
                selectedTags.delete(tag);
            }
            renderNodeList();
        }
    });

    // フィルタモード切り替え（AND/OR）
    const filterModeRadios = document.querySelectorAll('input[name="filterMode"]');
    filterModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            filterMode = e.target.value;
            renderNodeList();
        });
    });

    // タグフィルタクリアボタン（タグのみクリア）
    const clearButton = document.getElementById('clearFilters');
    clearButton.addEventListener('click', () => {
        selectedTags.clear();
        document.querySelectorAll('#tagFilters input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        renderNodeList();
    });

    // ソート選択
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        currentSortMode = e.target.value;
        renderNodeList();
    });
}

// ============================================
// ユーティリティ関数
// ============================================

// デバウンス
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// エラー表示
function showError(message) {
    const container = document.getElementById('nodeList');
    container.innerHTML = `
        <div class="empty-state" style="display: block;">
            <div class="empty-icon">⚠️</div>
            <h3>エラー</h3>
            <p>${message}</p>
        </div>
    `;
}

// ============================================
// デバッグ用
// ============================================
if (window.location.search.includes('debug')) {
    window.debugInfo = () => {
        console.log('=== Debug Info ===');
        console.log('Total Nodes:', allNodes.length);
        console.log('Selected Tags:', Array.from(selectedTags));
        console.log('Sort Mode:', currentSortMode);
        console.log('All Tags:', allTags);
    };
    console.log('💡 デバッグモード: window.debugInfo() を実行して情報を表示');
}
