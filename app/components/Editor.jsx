const { useEffect, useRef } = React;

const Editor = ({ label, value, onDraw, hideLabel }) => {
  const canvasRef = useRef(null);
  const smallCanvasRef = useRef(null);
  const penToolRef = useRef(undefined);
  useEffect(() => {
    penToolRef.current = new PenTool(
      canvasRef.current,
      smallCanvasRef.current,
      onDraw
    );
    return () => {
      penToolRef.current.dispose();
    };
  }, []);
  return (
    <div className='editorBox'>
      <canvas
        className='small'
        ref={smallCanvasRef}
        width='28'
        height='28'
      ></canvas>
      <canvas className='big' ref={canvasRef} width='140' height='140'></canvas>
      <div className='labelBox'>
        {!hideLabel && <span>label: {label}</span>}
        <button
          onClick={() => {
            penToolRef.current.clear();
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
