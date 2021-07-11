const Thumbnail = ({ record }) => {
  const smallCanvasRef = React.useRef(null);
  const { label, value } = record;
  const width = 28;
  const height = 28;

  React.useEffect(() => {
    const { current } = smallCanvasRef;
    const ctx = current.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = 255 - value[i / 4];
      imageData.data[i + 0] = v; // R value
      imageData.data[i + 1] = v; // G value
      imageData.data[i + 2] = v; // B value
      imageData.data[i + 3] = 255; // A value
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);
  return (
    <canvas
      className='small'
      ref={smallCanvasRef}
      width='28'
      height='28'
      title={label}
    ></canvas>
  );
};
