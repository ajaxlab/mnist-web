class PenTool {
  constructor(canvas, smallCanvas, onDraw) {
    const canvasStyle = window.getComputedStyle(canvas);
    this.width = parseInt(canvasStyle.width, 10);
    this.height = parseInt(canvasStyle.height, 10);
    this.scale = window.devicePixelRatio;
    this.canvas = canvas;
    this.smallCanvas = smallCanvas;
    this.onDraw = onDraw;
    this.ctx = canvas.getContext('2d');
    this.smallCtx = smallCanvas.getContext('2d');
    this.ctx.imageSmoothingQuality = 'high';
    this.isDrawing = false;
    this.points = [];
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.border = parseInt(canvasStyle.borderWidth, 10);
    this.init();
  }

  clear() {
    const { canvas, ctx, smallCanvas, smallCtx } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    smallCtx.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
    this.drawGrid();
  }

  dispose() {
    const { canvas } = this;
    canvas.removeEventListener('mousedown', this.handleMouseDown);
    canvas.removeEventListener('mousemove', this.handleMouseMove);
    canvas.removeEventListener('mouseup', this.handleMouseUp);
  }

  drawGrid() {
    const { canvas, ctx, scale } = this;
    const unit = scale * 5;
    const countX = canvas.width / unit;
    const countY = canvas.height / unit;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ddd';

    for (var i = 1; i < countX; i++) {
      const step = unit * i + 0.5;
      ctx.beginPath();
      ctx.moveTo(step, 0);
      ctx.lineTo(step, canvas.height);
      ctx.stroke();
    }

    for (var i = 1; i < countY; i++) {
      const step = unit * i + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, step);
      ctx.lineTo(canvas.width, step);
      ctx.stroke();
    }
    ctx.restore();
  }

  getPoint(e) {
    const { border, canvas, scale } = this;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - border) * scale,
      y: (e.clientY - rect.top - border) * scale,
    };
  }

  getScaledImage() {
    const { canvas, smallCtx } = this;
    smallCtx.drawImage(canvas, 0, 0, 28, 28);
    const imageData = smallCtx.getImageData(0, 0, 28, 28);
    const data = imageData.data;
    const result = [];
    for (let i = 0; i < data.length; i += 4) {
      result.push(data[i + 3]);
    }
    return result;
  }

  handleMouseDown(e) {
    const { points } = this;
    this.isDrawing = true;
    points.push(this.getPoint(e));
  }

  handleMouseMove(e) {
    if (!this.isDrawing) return;
    const { ctx, points } = this;
    points.push(this.getPoint(e));
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  handleMouseUp() {
    this.isDrawing = false;
    this.points = [];
    this.onDraw(this.getScaledImage());
  }

  init() {
    const {
      canvas,
      ctx,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
      scale,
      width,
      height,
    } = this;
    ctx.scale(scale, scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    ctx.lineWidth = 10 * scale;
    ctx.lineJoin = ctx.lineCap = 'round';
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    this.drawGrid();
  }
}
