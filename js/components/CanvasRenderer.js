// キャンバス描画コンポーネント
class CanvasRenderer {
    constructor(mainCanvas, roiCanvas) {
        this.mainCanvas = mainCanvas;
        this.roiCanvas = roiCanvas;
        this.mainCtx = mainCanvas.getContext('2d');
        this.roiCtx = roiCanvas.getContext('2d');
        this.roiOverlay = document.getElementById('roiOverlay');
    }

    // メインキャンバス描画
    drawMainCanvas(image, displayScale) {
        const displayWidth = image.width * displayScale;
        const displayHeight = image.height * displayScale;

        this.mainCanvas.width = displayWidth;
        this.mainCanvas.height = displayHeight;
        this.roiOverlay.style.width = displayWidth + 'px';
        this.roiOverlay.style.height = displayHeight + 'px';

        this.mainCtx.clearRect(0, 0, displayWidth, displayHeight);
        this.mainCtx.drawImage(image, 0, 0, displayWidth, displayHeight);

        return { width: displayWidth, height: displayHeight };
    }

    // ROIキャンバス描画
    drawROICanvas(image, roi, displayScale) {
        if (!roi) {
            this.roiCtx.clearRect(0, 0, this.roiCanvas.width, this.roiCanvas.height);
            return;
        }

        // 元画像座標での計算
        const sourceX = roi.x / displayScale;
        const sourceY = roi.y / displayScale;
        const sourceWidth = roi.width / displayScale;
        const sourceHeight = roi.height / displayScale;

        // ROIキャンバスのサイズ設定（最大300x300で表示）
        const maxDisplaySize = 300;
        const roiAspectRatio = sourceWidth / sourceHeight;
        let canvasWidth, canvasHeight;

        if (roiAspectRatio > 1) {
            canvasWidth = Math.min(maxDisplaySize, sourceWidth);
            canvasHeight = canvasWidth / roiAspectRatio;
        } else {
            canvasHeight = Math.min(maxDisplaySize, sourceHeight);
            canvasWidth = canvasHeight * roiAspectRatio;
        }

        this.roiCanvas.width = canvasWidth;
        this.roiCanvas.height = canvasHeight;

        this.roiCtx.drawImage(
            image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvasWidth, canvasHeight
        );
    }

    // ROI要素作成（リサイズハンドルなし）
    createROIElement(roi) {
        this.roiOverlay.innerHTML = '';
        
        const roiBox = document.createElement('div');
        roiBox.className = 'roi-box';
        roiBox.style.left = roi.x + 'px';
        roiBox.style.top = roi.y + 'px';
        roiBox.style.width = roi.width + 'px';
        roiBox.style.height = roi.height + 'px';

        // リサイズハンドルは追加しない（サイズ変更無効化）
        this.roiOverlay.appendChild(roiBox);
    }

    // ROIオーバーレイクリア
    clearROIOverlay() {
        this.roiOverlay.innerHTML = '';
    }

    // ROI画像エクスポート
    exportROI() {
        if (this.roiCanvas.width === 0 || this.roiCanvas.height === 0) {
            return null;
        }
        
        return this.roiCanvas.toDataURL('image/png');
    }
}