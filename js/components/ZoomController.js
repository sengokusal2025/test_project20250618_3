// ズーム制御コンポーネント
class ZoomController {
    constructor() {
        this.displayScale = 0.5;
        this.callbacks = {
            onZoomChange: null
        };
    }

    // 表示倍率設定
    setDisplayScale(scale) {
        this.displayScale = Math.max(0.1, Math.min(2.0, scale));
        
        // UI更新
        const slider = document.getElementById('zoomSlider');
        if (slider) {
            slider.value = this.displayScale;
        }
        
        this.updateZoomInfo();
        
        if (this.callbacks.onZoomChange) {
            this.callbacks.onZoomChange(this.displayScale);
        }
    }

    // 画面フィット
    fitToScreen(imageWidth, imageHeight) {
        const containerMaxWidth = 600;
        const containerMaxHeight = 400;
        const scaleX = containerMaxWidth / imageWidth;
        const scaleY = containerMaxHeight / imageHeight;
        const scale = Math.min(scaleX, scaleY, 1.0);
        
        this.setDisplayScale(scale);
    }

    // 100%表示
    resetToOriginal() {
        this.setDisplayScale(1.0);
    }

    // ズーム情報更新
    updateZoomInfo() {
        const percent = Math.round(this.displayScale * 100) + '%';
        
        const zoomValue = document.getElementById('zoomValue');
        const displayScale = document.getElementById('displayScale');
        
        if (zoomValue) zoomValue.textContent = percent;
        if (displayScale) displayScale.textContent = percent;
    }

    // コールバック設定
    setCallback(event, callback) {
        this.callbacks[event] = callback;
    }

    // 現在の倍率取得
    getDisplayScale() {
        return this.displayScale;
    }
}