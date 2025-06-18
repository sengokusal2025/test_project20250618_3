// メインアプリケーション
class ROIImageEditor {
    constructor() {
        // コンポーネント初期化
        this.imageHandler = new ImageHandler();
        this.roiManager = new ROIManager();
        this.zoomController = new ZoomController();
        this.uiController = new UIController();
        
        // キャンバス要素取得
        this.mainCanvas = document.getElementById('mainCanvas');
        this.roiCanvas = document.getElementById('roiCanvas');
        this.canvasRenderer = new CanvasRenderer(this.mainCanvas, this.roiCanvas);
        
        this.setupEventHandlers();
        this.setupCallbacks();
    }

    // イベントハンドラー設定
    setupEventHandlers() {
        // ズームスライダー
        const zoomSlider = document.getElementById('zoomSlider');
        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                this.zoomController.setDisplayScale(parseFloat(e.target.value));
            });
        }

        // ズームボタン
        const zoomFitBtn = document.getElementById('zoomFitBtn');
        const zoomResetBtn = document.getElementById('zoomResetBtn');
        
        if (zoomFitBtn) {
            zoomFitBtn.addEventListener('click', () => {
                const image = this.imageHandler.getImage();
                if (image) {
                    this.zoomController.fitToScreen(image.width, image.height);
                }
            });
        }

        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', () => {
                this.zoomController.resetToOriginal();
            });
        }

        // ROIマウスイベント
        const roiOverlay = document.getElementById('roiOverlay');
        if (roiOverlay) {
            roiOverlay.addEventListener('mousedown', (e) => {
                this.roiManager.handleMouseDown(e, roiOverlay);
            });

            roiOverlay.addEventListener('mousemove', (e) => {
                const canvasSize = this.getCanvasSize();
                this.roiManager.handleMouseMove(e, roiOverlay, canvasSize.width, canvasSize.height);
            });

            roiOverlay.addEventListener('mouseup', (e) => {
                this.roiManager.handleMouseUp();
            });
        }
    }

    // コールバック設定
    setupCallbacks() {
        // 画像ハンドラー
        this.imageHandler.setCallback('onImageLoad', (image) => {
            this.handleImageLoad(image);
        });

        // ROIマネージャー
        this.roiManager.setCallback('onROIUpdate', (roi) => {
            this.handleROIUpdate(roi);
        });

        this.roiManager.setCallback('onROICreate', (roi) => {
            this.handleROICreate(roi);
        });

        this.roiManager.setCallback('onROIReset', () => {
            this.handleROIReset();
        });

        // ズームコントローラー
        this.zoomController.setCallback('onZoomChange', (scale) => {
            this.handleZoomChange(scale);
        });

        // UIコントローラー
        this.uiController.setCallback('onFileSelect', (file) => {
            this.imageHandler.handleFileSelect(file);
        });

        this.uiController.setCallback('onCreateROI', () => {
            this.createDefaultROI();
        });

        this.uiController.setCallback('onResetROI', () => {
            this.roiManager.resetROI();
        });

        this.uiController.setCallback('onApplyROISize', (width, height) => {
            this.applyROISize(width, height);
        });

        this.uiController.setCallback('onExportROI', () => {
            this.exportROI();
        });
    }

    // 画像読み込み処理
    handleImageLoad(image) {
        this.redrawCanvas();
        this.roiManager.resetROI();
        this.uiController.showMainContent();
    }

    // ROI更新処理
    handleROIUpdate(roi) {
        this.canvasRenderer.createROIElement(roi);
        this.canvasRenderer.drawROICanvas(
            this.imageHandler.getImage(), 
            roi, 
            this.zoomController.getDisplayScale()
        );
        this.updateROIInfo();
    }

    // ROI作成処理
    handleROICreate(roi) {
        this.uiController.hideNoROIMessage();
        this.handleROIUpdate(roi);
    }

    // ROIリセット処理
    handleROIReset() {
        this.canvasRenderer.clearROIOverlay();
        this.canvasRenderer.drawROICanvas(null, null, 0);
        this.uiController.showNoROIMessage();
        this.updateROIInfo();
    }

    // ズーム変更処理
    handleZoomChange(scale) {
        this.redrawCanvas();
        const roi = this.roiManager.getROI();
        if (roi) {
            this.handleROIUpdate(roi);
        }
    }

    // キャンバス再描画
    redrawCanvas() {
        const image = this.imageHandler.getImage();
        if (image) {
            this.canvasRenderer.drawMainCanvas(image, this.zoomController.getDisplayScale());
        }
    }

    // デフォルトROI作成
    createDefaultROI() {
        const canvasSize = this.getCanvasSize();
        this.roiManager.createDefaultROI(canvasSize.width, canvasSize.height);
    }

    // ROIサイズ適用
    applyROISize(width, height) {
        const canvasSize = this.getCanvasSize();
        this.roiManager.setROISize(
            width, 
            height, 
            this.zoomController.getDisplayScale(),
            canvasSize.width,
            canvasSize.height
        );
    }

    // ROIエクスポート
    exportROI() {
        const dataUrl = this.canvasRenderer.exportROI();
        if (dataUrl) {
            this.uiController.downloadFile(dataUrl, 'roi_image.png');
        }
    }

    // ROI情報更新
    updateROIInfo() {
        const roiInfo = this.roiManager.getROIInfo(this.zoomController.getDisplayScale());
        this.uiController.updateROIInfo(roiInfo);
        this.uiController.updateROIInputs(roiInfo);
    }

    // キャンバスサイズ取得
    getCanvasSize() {
        return {
            width: this.mainCanvas.width,
            height: this.mainCanvas.height
        };
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const app = new ROIImageEditor();
    app.uiController.initialize();
});