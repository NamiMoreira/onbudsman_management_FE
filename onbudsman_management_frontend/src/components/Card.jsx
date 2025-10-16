export default function Card({ title, buttonText, onButtonClick }) {
  return (
    <div className="card shadow-sm text-center p-2" style={{ aspectRatio: '1 / 1' }}>
      <div className="card-body d-flex flex-column align-items-center justify-content-center">
        <h5 className="card-title">{title}</h5>
        {buttonText && (
          <button className="btn btn-success mt-3" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}