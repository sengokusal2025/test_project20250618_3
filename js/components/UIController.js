// UI制御コンポーネント
class UIController {
    constructor() {
        this.callbacks = {
            onFileSelect: null,
            onCreateROI: null,
            onResetROI: null,
            onApplyROISize: null,
            onExportROI: null
        };
    }

    // 初期化
    initialize() {
        this.setupFileInput();
        this.setupDropZone();
        this.setupButtons();
    }

    // ファイル入力設定
    setupFileInput() {
        const fileInput = document.getElementById('imageInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (this.callbacks.onFileSelect && e.target.files[0]) {
                    this.callbacks.onFileSelect(e.target.files[0]);
                }
            });
        }
    }

    // ドロップゾーン設定
    setupDropZone() {
        const dropZone = document.getElementById('dropZone');
        if (!dropZone) return;

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/') && this.callbacks.onFileSelect) {
                this.callbacks.onFileSelect(file);
            }
        });
    }

    // ボタン設定
    setupButtons() {
        // ROI作成ボタン
        const createBtn = document.getElementById('createRoiBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                if (this.callbacks.onCreateROI) {
                    this.callbacks.onCreateROI();
                }
            });
        }

        // ROIリセットボタン
        const resetBtn = document.getElementById('resetRoiBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.callbacks.onResetROI) {
                    this.callbacks.onResetROI();
                }
            });
        }

        // ROIサイズ適用ボタン
        const applyBtn = document.getElementById('applyRoiSizeBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                if (this.callbacks.onApplyROISize) {
                    const width = parseInt(document.getElementById('roiWidth').value);
                    const height = parseInt(document.getElementById('roiHeight').value);
                    this.callbacks.onApplyROISize(width, height);
                }
            });
        }

        // ROIエクスポートボタン
        const exportBtn = document.getElementById('exportRoiBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.callbacks.onExportROI) {
                    this.callbacks.onExportROI();
                }
            });
        }
    }

    // メインコンテンツ表示
    showMainContent() {
        const uploadSection = document.getElementById('uploadSection');
        const mainContent = document.getElementById('mainContent');
        
        if (uploadSection) uploadSection.style.display = 'none';
        if (mainContent) mainContent.classList.add('active');
    }

    // ROI情報更新
    updateROIInfo(roiInfo) {
        const positionEl = document.getElementById('roiPosition');
        const sizeEl = document.getElementById('roiSize');
        const areaEl = document.getElementById('roiArea');

        if (roiInfo && roiInfo.width > 0) {
            if (positionEl) positionEl.textContent = `${roiInfo.x}, ${roiInfo.y}`;
            if (sizeEl) sizeEl.textContent = `${roiInfo.width} × ${roiInfo.height}`;
            if (areaEl) areaEl.textContent = `${roiInfo.area} px²`;
        } else {
            if (positionEl) positionEl.textContent = '-';
            if (sizeEl) sizeEl.textContent = '-';
            if (areaEl) areaEl.textContent = '-';
        }
    }

    // ROI入力フィールド更新
    updateROIInputs(roiInfo) {
        const widthInput = document.getElementById('roiWidth');
        const heightInput = document.getElementById('roiHeight');

        if (roiInfo && roiInfo.width > 0) {
            if (widthInput) widthInput.value = roiInfo.width;
            if (heightInput) heightInput.value = roiInfo.height;
        } else {
            if (widthInput) widthInput.value = '';
            if (heightInput) heightInput.value = '';
        }
    }

    // ROIメッセージ表示
    showNoROIMessage() {
        const message = document.getElementById('noRoiMessage');
        const canvas = document.getElementById('roiCanvas');
        
        if (message) message.style.display = 'block';
        if (canvas) canvas.style.display = 'none';
    }

    // ROIメッセージ非表示
    hideNoROIMessage() {
        const message = document.getElementById('noRoiMessage');
        const canvas = document.getElementById('roiCanvas');
        
        if (message) message.style.display = 'none';
        if (canvas) canvas.style.display = 'block';
    }

    // ファイルダウンロード
    downloadFile(dataUrl, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // コールバック設定
    setCallback(event, callback) {
        this.callbacks[event] = callback;
    }
}