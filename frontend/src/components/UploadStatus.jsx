
const UploadStatus = ({ message, type = "info" }) => {
  if (!message) return null;

  const styles = {
    info: "bg-blue-50 text-blue-700",
    success: "bg-green-50 text-green-700",
    error: "bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-lg p-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

export default UploadStatus;
