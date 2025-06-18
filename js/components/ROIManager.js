// ROI管理コンポーネント
class ROIManager {
    constructor() {
        this.roi = null;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.callbacks = {
            onROIUpdate: null,
            onROICreate: null,
            onROIReset: null
        };
    }

    // ROI作成
    createROI(x, y, width, height) {
        this.roi = { x, y, width, height };
        if (this.callbacks.onROICreate) {
            this.callbacks.onROICreate(this.roi);
        }
        return this.roi;
    }

    // デフォルトROI作成
    createDefaultROI(canvasWidth, canvasHeight) {
        const centerX = canvasWidth / 2 - 50;
        const centerY = canvasHeight / 2 - 50;
        
        return this.createROI(
            Math.max(0, centerX),
            Math.max(0, centerY),
            100,
            100
        );
    }

    // ROIリセット
    resetROI() {
        this.roi = null;
        this.isDragging = false;
        if (this.callbacks.onROIReset) {
            this.callbacks.onROIReset();
        }
    }

    // ROI更新
    updateROI(newROI) {
        if (!this.roi) return;
        
        Object.assign(this.roi, newROI);
        if (this.callbacks.onROIUpdate) {
            this.callbacks.onROIUpdate(this.roi);
        }
    }

    // ROIサイズ設定（入力値から）
    setROISize(width, height, displayScale, canvasWidth, canvasHeight) {
        if (!this.roi || width < 10 || height < 10) return false;
        
        const scaledWidth = width * displayScale;
        const scaledHeight = height * displayScale;
        
        // 境界チェック
        const maxWidth = canvasWidth - this.roi.x;
        const maxHeight = canvasHeight - this.roi.y;
        
        this.updateROI({
            width: Math.min(scaledWidth, maxWidth),
            height: Math.min(scaledHeight, maxHeight)
        });
        
        return true;
    }

    // マウスダウン処理（移動のみ、リサイズ無効）
    handleMouseDown(e, roiOverlay) {
        if (!this.roi) return;
        
        const rect = roiOverlay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // ROIボックス内でのみドラッグ開始（リサイズハンドルは無視）
        if (e.target.classList.contains('roi-box')) {
            this.isDragging = true;
            this.dragStart = { x: x - this.roi.x, y: y - this.roi.y };
        }
    }

    // マウス移動処理
    handleMouseMove(e, roiOverlay, canvasWidth, canvasHeight) {
        if (!this.roi || !this.isDragging) return;
        
        const rect = roiOverlay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newX = Math.max(0, Math.min(x - this.dragStart.x, canvasWidth - this.roi.width));
        const newY = Math.max(0, Math.min(y - this.dragStart.y, canvasHeight - this.roi.height));
        
        this.updateROI({ x: newX, y: newY });
    }

    // マウスアップ処理
    handleMouseUp() {
        this.isDragging = false;
    }

    // コールバック設定
    setCallback(event, callback) {
        this.callbacks[event] = callback;
    }

    // ROI取得
    getROI() {
        return this.roi;
    }

    // ROI情報計算（元画像座標系）
    getROIInfo(displayScale) {
        if (!this.roi) {
            return {
                x: 0, y: 0, width: 0, height: 0,
                area: 0
            };
        }

        const originalX = Math.round(this.roi.x / displayScale);
        const originalY = Math.round(this.roi.y / displayScale);
        const originalWidth = Math.round(this.roi.width / displayScale);
        const originalHeight = Math.round(this.roi.height / displayScale);

        return {
            x: originalX,
            y: originalY,
            width: originalWidth,
            height: originalHeight,
            area: originalWidth * originalHeight
        };
    }
}